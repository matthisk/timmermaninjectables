// Progressive enhancement only: pages are prerendered by build.mjs from src/render.js.
const locale = document.documentElement.lang === "en" ? "en" : "nl";

// Carry the current section anchor over when switching language.
document.querySelector(".language-link")?.addEventListener("click", event => {
  if (location.hash) event.currentTarget.hash = location.hash;
});

const menuToggle = document.querySelector(".menu-toggle");
menuToggle?.addEventListener("click", () => {
  const isOpen = document.body.classList.toggle("menu-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? menuToggle.dataset.labelClose : menuToggle.dataset.labelOpen);
});

document.querySelectorAll(".main-nav a").forEach(link => link.addEventListener("click", () => {
  document.body.classList.remove("menu-open");
  menuToggle?.setAttribute("aria-expanded", "false");
}));

document.addEventListener("keydown", event => {
  if (event.key === "Escape" && document.body.classList.contains("menu-open")) {
    document.body.classList.remove("menu-open");
    menuToggle?.setAttribute("aria-expanded", "false");
    menuToggle?.focus();
  }
});

document.querySelector("#consult-form")?.addEventListener("submit", async event => {
  event.preventDefault();
  const form = event.currentTarget;
  const status = form.querySelector("#form-status");
  const button = form.querySelector("button[type=submit]");
  const showStatus = (text, state) => {
    status.textContent = text;
    status.dataset.state = state;
    status.hidden = false;
  };

  const fields = Object.fromEntries(new FormData(form));
  const topic = form.elements.topic.selectedOptions[0]?.text || fields.topic;
  const payload = {
    ...fields,
    topic,
    // Public by design: a Web3Forms key can only deliver to the inbox configured for it.
    access_key: "99576164-2490-4fef-a4cb-5baf75566ef0",
    subject: `Contactformulier: ${topic} – ${fields.name}`,
    from_name: "Website NT clinic",
    language: locale
  };

  button.disabled = true;
  showStatus(form.dataset.statusSending, "pending");
  try {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload)
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || !result.success) throw new Error(result.message || `HTTP ${response.status}`);
    form.reset();
    showStatus(form.dataset.statusSuccess, "success");
  } catch {
    showStatus(form.dataset.statusError, "error");
  } finally {
    button.disabled = false;
    status.focus();
  }
});

const calendlyEmbed = document.querySelector(".calendly-embed");
if (calendlyEmbed) {
  window.addEventListener("message", event => {
    if (event.origin !== "https://calendly.com" || event.source !== calendlyEmbed.contentWindow) return;
    const { event: name, payload } = event.data || {};
    if (name === "calendly.page_height") {
      const height = parseFloat(payload?.height);
      if (height > 0) calendlyEmbed.style.height = `${Math.ceil(height)}px`;
    } else if (name === "calendly.date_and_time_selected" || name === "calendly.event_scheduled") {
      if (calendlyEmbed.getBoundingClientRect().top < 0) {
        const smooth = !matchMedia("(prefers-reduced-motion: reduce)").matches;
        calendlyEmbed.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });
      }
    }
  });
}

if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach(element => observer.observe(element));
} else {
  document.querySelectorAll(".reveal").forEach(element => element.classList.add("is-visible"));
}
