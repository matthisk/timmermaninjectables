const locale = document.body.dataset.locale === "en" ? "en" : "nl";
const page = document.body.dataset.page || "home";

const routes = {
  nl: {
    home: "/",
    doctor: "/uw-arts.html",
    treatments: "/behandelingen.html",
    pricing: "/tarieven.html",
    contact: "/contact.html",
    privacy: "/privacy.html",
    cookies: "/cookies.html",
    disclaimer: "/medische-disclaimer.html"
  },
  en: {
    home: "/en/",
    doctor: "/en/your-doctor.html",
    treatments: "/en/treatments.html",
    pricing: "/en/pricing.html",
    contact: "/en/contact.html",
    privacy: "/en/privacy.html",
    cookies: "/en/cookies.html",
    disclaimer: "/en/medical-disclaimer.html"
  }
};

const escapeHtml = (value = "") =>
  String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#039;"
  })[character]);

const data = await fetch(`/locales/${locale}.json`).then(response => {
  if (!response.ok) throw new Error(`Could not load locale ${locale}`);
  return response.json();
});

const route = key => routes[locale][key];
const otherLocale = locale === "nl" ? "en" : "nl";
const placeholder = () => `<span class="placeholder">${escapeHtml(data.common.placeholder)}</span>`;
const button = (label, href, variant = "") =>
  `<a class="button ${variant}" href="${href}">${escapeHtml(label)}</a>`;

function brand() {
  return `
    <a class="brand" href="${route("home")}" aria-label="Timmerman Injectables">
      <img class="brand__mark" src="/assets/logo-display.png" alt="" width="43" height="48">
      <span class="brand__text">NT clinic<small>${escapeHtml(data.common.brandSuffix)}</small></span>
    </a>`;
}

function header() {
  const navKeys = ["home", "doctor", "treatments", "pricing", "contact"];
  return `
    <a class="skip-link" href="#main">${escapeHtml(data.common.skip)}</a>
    <header class="site-header">
      <div class="site-header__inner container">
        ${brand()}
        <nav class="main-nav" id="main-nav" aria-label="${escapeHtml(data.common.nav.home)}">
          ${navKeys.map(key => `
            <a href="${route(key)}"${page === key ? ` aria-current="page"` : ""}>
              ${escapeHtml(data.common.nav[key])}
            </a>`).join("")}
        </nav>
        <div class="header-actions">
          <a class="language-link" href="${routes[otherLocale][page]}${location.hash}" lang="${otherLocale}" aria-label="${escapeHtml(data.common.language)}">${escapeHtml(data.common.languageCode)}</a>
          ${button(data.common.book, `${route("contact")}#consult`)}
          <button class="menu-toggle" type="button" aria-controls="main-nav" aria-expanded="false" aria-label="${escapeHtml(data.common.menuOpen)}"><span></span></button>
        </div>
      </div>
    </header>`;
}

function footer() {
  return `
    <footer class="site-footer">
      <div class="container footer-top">
        <div class="footer-brand">
          ${brand()}
          <p>${escapeHtml(data.common.footer.intro)}</p>
          ${button(data.common.book, `${route("contact")}#consult`, "button--light")}
        </div>
        <div>
          <h2 class="footer-heading">${escapeHtml(data.common.footer.navigate)}</h2>
          <ul class="footer-links">
            ${["doctor", "treatments", "pricing", "contact"].map(key => `<li><a href="${route(key)}">${escapeHtml(data.common.nav[key])}</a></li>`).join("")}
          </ul>
        </div>
        <div>
          <h2 class="footer-heading">${escapeHtml(data.common.footer.contact)}</h2>
          <ul class="footer-contact">
            <li><span>${escapeHtml(data.common.footer.addressLabel)}</span>${escapeHtml(data.common.footer.address)}</li>
            <li><span>${escapeHtml(data.common.footer.phoneLabel)}</span>${escapeHtml(data.common.footer.phone)}</li>
            <li><span>${escapeHtml(data.common.footer.emailLabel)}</span>${escapeHtml(data.common.footer.email)}</li>
          </ul>
        </div>
      </div>
      <div class="container footer-bottom">
        <span>${escapeHtml(data.common.footer.copyright)}</span>
        <div class="footer-legal">
          <a href="${route("privacy")}">${escapeHtml(data.common.footer.privacy)}</a>
          <a href="${route("cookies")}">${escapeHtml(data.common.footer.cookies)}</a>
          <a href="${route("disclaimer")}">${escapeHtml(data.common.footer.disclaimer)}</a>
        </div>
      </div>
    </footer>`;
}

function pageHero(content, showPlaceholder = false) {
  return `
    <section class="page-hero">
      <div class="container page-hero__grid">
        <div>
          <p class="eyebrow">${escapeHtml(content.eyebrow)}</p>
          <h1>${escapeHtml(content.title)}</h1>
          <p class="lead">${escapeHtml(content.lead)}</p>
        </div>
        <aside class="page-hero__aside">
          ${showPlaceholder ? placeholder() : ""}
          <p class="small">${escapeHtml(content.aside)}</p>
        </aside>
      </div>
    </section>`;
}

function ctaBanner(ivory = true) {
  return `
    <section class="section ${ivory ? "section--ivory" : ""}">
      <div class="container cta-banner reveal">
        <div>
          <h2>${escapeHtml(data.home.cta.title)}</h2>
          <p>${escapeHtml(data.home.cta.text)}</p>
        </div>
        ${button(data.common.book, `${route("contact")}#consult`, "button--light")}
      </div>
    </section>`;
}

function faqSection(items = data.home.faq.items) {
  return `
    <section class="section section--ivory">
      <div class="container">
        <div class="reveal">
          <p class="eyebrow">${escapeHtml(data.home.faq.eyebrow)}</p>
          <h2>${escapeHtml(data.home.faq.title)}</h2>
        </div>
        <div class="faq-list">
          ${items.map((item, index) => `
            <details class="faq reveal" open>
              <summary>${escapeHtml(item.q)}</summary>
              <div class="faq__answer">
                <p>${escapeHtml(item.a)}</p>
                ${item.link ? `<a class="faq__link" href="${escapeHtml(item.link.href)}" target="_blank" rel="noopener noreferrer">${escapeHtml(item.link.label)}</a>` : ""}
                ${data.home.faq.showPlaceholders === false ? "" : placeholder()}
              </div>
            </details>`).join("")}
        </div>
      </div>
    </section>`;
}

function renderHome() {
  const home = data.home;
  return `
    <main id="main">
      <section class="hero">
        <div class="container hero__grid">
          <div class="hero__copy">
            <p class="eyebrow">${escapeHtml(home.hero.eyebrow)}</p>
            <h1 class="hero__title">${escapeHtml(home.hero.titleBefore)} <span>${escapeHtml(home.hero.titleAccent)}</span> ${escapeHtml(home.hero.titleAfter)}</h1>
            <p class="lead">${escapeHtml(home.hero.lead)}</p>
            <div class="actions">
              ${button(data.common.book, `${route("contact")}#consult`)}
              ${button(data.common.viewTreatments, route("treatments"), "button--ghost")}
            </div>
          </div>
          <div class="hero__visual" aria-hidden="true">
            <div class="hero__arch"></div>
            <img class="hero__logo" src="/assets/logo-subtle.png" alt="" width="600" height="680">
          </div>
        </div>
      </section>

      <section class="section">
        <div class="container split">
          <div class="portrait-placeholder portrait-placeholder--headshot reveal">
            <span class="image-label">${escapeHtml(home.about.photo)}</span>
            <img src="/assets/headshot.png" alt="" width="650" height="740">
          </div>
          <div class="reveal">
            <p class="eyebrow">${escapeHtml(home.about.eyebrow)}</p>
            <h2>${escapeHtml(home.about.title)}</h2>
            <p class="lead">${escapeHtml(home.about.lead)}</p>
            <p>${escapeHtml(home.about.body)}</p>
            <div class="signature">${escapeHtml(home.about.signature)}</div>
            <div class="actions">
              <a class="text-link" href="${route("doctor")}">${escapeHtml(data.common.readMore)}</a>
            </div>
          </div>
        </div>
      </section>

      <section class="section section--ivory section-home-treatments">
        <div class="container">
          <div class="treatment-grid">
            ${home.treatments.items.map((item, index) => `
              <article class="treatment-card reveal">
                <span class="treatment-card__number">0${index + 1}</span>
                <h3>${escapeHtml(item.title)}</h3>
                <p>${escapeHtml(item.text)}</p>
                ${item.placeholder ? placeholder() : ""}
                <a class="text-link" href="${route("treatments")}">${escapeHtml(data.common.readMore)}</a>
              </article>`).join("")}
          </div>
        </div>
      </section>

      ${ctaBanner(true)}
    </main>`;
}

function renderDoctor() {
  const doctor = data.doctor;
  return `
    <main id="main">
      <section class="page-hero">
        <div class="container split">
          <div class="portrait-placeholder portrait-placeholder--headshot reveal">
            <span class="image-label">${escapeHtml(doctor.story.photo)}</span>
            <img src="/assets/headshot.png" alt="" width="650" height="740">
          </div>
          <div class="reveal">
            <p class="eyebrow">${escapeHtml(doctor.story.eyebrow)}</p>
            <h2>${escapeHtml(doctor.story.title)}</h2>
            <p class="lead">${escapeHtml(doctor.story.lead)}</p>
            <p>${escapeHtml(doctor.story.body)}</p>
            <p><i>${escapeHtml(doctor.story.extra)}</i></p>
          </div>
        </div>
      </section>
      ${ctaBanner(false)}
    </main>`;
}

function renderTreatments() {
  const treatments = data.treatments;
  return `
    <main id="main">
      <section class="treatment-page-hero">
        <div class="container treatment-page-hero__grid">
          <div class="treatment-page-hero__copy reveal">
            <p class="eyebrow">${escapeHtml(treatments.hero.eyebrow)}</p>
            <h1>${escapeHtml(treatments.hero.title)}</h1>
            <p class="lead">${escapeHtml(treatments.hero.lead)}</p>
            <div class="actions">
              ${button(data.common.book, `${route("contact")}#consult`)}
              <a class="text-link" href="#behandeling">${escapeHtml(treatments.hero.treatmentLink)}</a>
            </div>
          </div>
          <aside class="treatment-page-hero__aside reveal">
            <span class="treatment-page-hero__number" aria-hidden="true">01</span>
            <div>
              <p class="treatment-page-hero__label">${escapeHtml(treatments.hero.asideLabel)}</p>
              <p>${escapeHtml(treatments.hero.aside)}</p>
            </div>
          </aside>
        </div>
      </section>

      <section class="section treatment-overview">
        <div class="container treatment-overview__grid">
          <div class="treatment-overview__heading reveal">
            <p class="eyebrow">${escapeHtml(treatments.overview.eyebrow)}</p>
            <h2>${escapeHtml(treatments.overview.title)}</h2>
          </div>
          <div class="treatment-overview__content reveal">
            <div class="treatment-overview__body">
              ${treatments.overview.paragraphs.map(paragraph => `<p>${escapeHtml(paragraph)}</p>`).join("")}
            </div>
            <p class="treatment-overview__benefits-label">${escapeHtml(treatments.overview.benefitsLabel)}</p>
            <ul>
              ${treatments.overview.benefits.map((benefit, index) => `<li>${benefit}</li>`).join("")}
            </ul>
          </div>
        </div>
      </section>

      <section class="section treatment-zones">
        <div class="container">
          <div class="treatment-zones__heading reveal">
            <div>
              <p class="eyebrow">${escapeHtml(treatments.zones.eyebrow)}</p>
              <h2>${escapeHtml(treatments.zones.title)}</h2>
            </div>
            <p>${escapeHtml(treatments.zones.intro)}</p>
          </div>
          <div class="treatment-zones__grid">
            ${treatments.zones.items.map((zone, index) => `
              <article class="treatment-zone reveal">
                <span>0${index + 1}</span>
                <h3>${escapeHtml(zone)}</h3>
              </article>`).join("")}
          </div>
        </div>
      </section>

      <section class="section treatment-process" id="behandeling">
        <div class="container treatment-process__grid">
          <div class="treatment-process__time reveal">
            <p>${escapeHtml(treatments.procedure.durationLabel)}</p>
            <strong>${escapeHtml(treatments.procedure.duration)}</strong>
          </div>
          <div class="treatment-process__content reveal">
            <p class="eyebrow">${escapeHtml(treatments.procedure.eyebrow)}</p>
            <h2>${escapeHtml(treatments.procedure.title)}</h2>
            <p class="lead">${escapeHtml(treatments.procedure.body)}</p>
          </div>
        </div>
      </section>

      <section class="section treatment-aftercare">
        <div class="container treatment-aftercare__grid">
          <div class="treatment-aftercare__intro reveal">
            <p class="eyebrow">${escapeHtml(treatments.aftercare.eyebrow)}</p>
            <h2>${escapeHtml(treatments.aftercare.title)}</h2>
            <p class="lead">${escapeHtml(treatments.aftercare.intro)}</p>
          </div>
          <ol class="treatment-aftercare__list reveal">
            ${treatments.aftercare.items.map((item, index) => `
              <li>
                <span>0${index + 1}</span>
                <p>${escapeHtml(item)}</p>
              </li>`).join("")}
          </ol>
        </div>
      </section>
      ${faqSection()}
      ${ctaBanner()}
    </main>`;
}

function renderPricing() {
  const pricing = data.pricing;
  return `
    <main id="main">
      <section class="section price-section">
        <div class="container">
          <div class="reveal">
            <table class="price-table">
              <caption>${escapeHtml(pricing.table.caption)}</caption>
              <thead><tr><th>${escapeHtml(pricing.table.treatment)}</th><th>${escapeHtml(pricing.table.detail)}</th><th>${escapeHtml(pricing.table.price)}</th></tr></thead>
              <tbody>
                ${pricing.table.rows.map(item => `<tr><td>${escapeHtml(item.name)}</td><td>${escapeHtml(item.detail)}</td><td>${escapeHtml(item.price)}</td></tr>`).join("")}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      ${ctaBanner()}
    </main>`;
}

function renderContact() {
  const contact = data.contact;
  const booking = contact.booking;
  const form = contact.form;
  const calendlyUrl = `${booking.url}?embed_type=Inline&embed_domain=${encodeURIComponent(location.hostname)}&hide_gdpr_banner=1`;
  return `
    <main id="main">
      ${pageHero(contact.hero)}
      <section class="section" id="consult">
        <div class="container">
          <div class="contact-booking reveal">
            <p class="eyebrow">${escapeHtml(booking.eyebrow)}</p>
            <h2>${escapeHtml(booking.title)}</h2>
            <p class="muted">${escapeHtml(booking.intro)}</p>
            <iframe class="calendly-embed" src="${escapeHtml(calendlyUrl)}" title="${escapeHtml(booking.iframeTitle)}"></iframe>
            <p class="small muted">${escapeHtml(booking.fallback)} <a href="${escapeHtml(booking.url)}" target="_blank" rel="noopener">${escapeHtml(booking.fallbackLink)}</a></p>
          </div>
        </div>
      </section>
      <section class="section" id="contact-form">
        <div class="container contact-grid">
          <div class="reveal">
            <p class="eyebrow">${escapeHtml(contact.details.eyebrow)}</p>
            <h2>${escapeHtml(contact.details.title)}</h2>
            ${placeholder()}
            <ul class="contact-list">
              ${[
      ["addressLabel", "address"],
      ["phoneLabel", "phone"],
      ["emailLabel", "email"],
      ["hoursLabel", "hours"],
      ["aftercareLabel", "aftercare"]
    ].map(([label, value]) => `<li><span>${escapeHtml(contact.details[label])}</span>${escapeHtml(contact.details[value])}</li>`).join("")}
            </ul>
          </div>
          <form class="contact-form reveal" id="consult-form">
            <p class="eyebrow">${escapeHtml(form.eyebrow)}</p>
            <h2>${escapeHtml(form.title)}</h2>
            <p class="muted">${escapeHtml(form.intro)}</p>
            ${placeholder()}
            <div class="form-row" style="margin-top:30px">
              <div class="field"><label for="name">${escapeHtml(form.name)}</label><input id="name" name="name" autocomplete="name" required></div>
              <div class="field"><label for="email">${escapeHtml(form.email)}</label><input id="email" name="email" type="email" autocomplete="email" required></div>
            </div>
            <div class="field"><label for="phone">${escapeHtml(form.phone)}</label><input id="phone" name="phone" type="tel" autocomplete="tel"></div>
            <div class="field">
              <label for="topic">${escapeHtml(form.topic)}</label>
              <select id="topic" name="topic" required>
                <option value="">${escapeHtml(form.topicDefault)}</option>
                <option value="consult">${escapeHtml(form.topicConsult)}</option>
                <option value="skin">${escapeHtml(form.topicSkin)}</option>
                <option value="other">${escapeHtml(form.topicOther)}</option>
              </select>
            </div>
            <div class="field"><label for="message">${escapeHtml(form.message)}</label><textarea id="message" name="message"></textarea></div>
            <p class="small muted">${escapeHtml(form.privacy)} <a href="${route("privacy")}">${escapeHtml(data.common.footer.privacy)}</a></p>
            <button class="button" type="submit">${escapeHtml(form.submit)}</button>
            <p class="form-status" id="form-status" role="status" hidden>${escapeHtml(form.status)}</p>
          </form>
        </div>
      </section>
    </main>`;
}

function renderLegal(kind) {
  const content = data.legal[kind];
  return `
    <main id="main">
      <section class="page-hero">
        <div class="container legal">
          <p class="eyebrow">${escapeHtml(content.eyebrow)}</p>
          <h1>${escapeHtml(content.title)}</h1>
          <div class="legal-note">${placeholder()}<p style="margin:14px 0 0">${escapeHtml(content.intro)}</p></div>
        </div>
      </section>
      <section class="section section--ivory">
        <div class="container legal">
          ${content.sections.map(section => `
            <section class="reveal">
              <h2>${escapeHtml(section.title)}</h2>
              ${section.paragraphs.map(paragraph => `<p>${escapeHtml(paragraph)}</p>`).join("")}
            </section>`).join("")}
        </div>
      </section>
    </main>`;
}

const renderers = {
  home: renderHome,
  doctor: renderDoctor,
  treatments: renderTreatments,
  pricing: renderPricing,
  contact: renderContact,
  privacy: () => renderLegal("privacy"),
  cookies: () => renderLegal("cookies"),
  disclaimer: () => renderLegal("disclaimer")
};

function setMeta() {
  const meta = data.meta[page];
  document.documentElement.lang = locale;
  document.title = meta.title;

  const setMetaTag = (selector, attributes) => {
    let element = document.head.querySelector(selector);
    if (!element) {
      element = document.createElement("meta");
      document.head.append(element);
    }
    Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
  };

  setMetaTag('meta[name="description"]', { name: "description", content: meta.description });
  setMetaTag('meta[property="og:title"]', { property: "og:title", content: meta.title });
  setMetaTag('meta[property="og:description"]', { property: "og:description", content: meta.description });
  setMetaTag('meta[property="og:type"]', { property: "og:type", content: "website" });
  setMetaTag('meta[property="og:locale"]', { property: "og:locale", content: locale === "nl" ? "nl_NL" : "en_GB" });
  setMetaTag('meta[name="twitter:card"]', { name: "twitter:card", content: "summary_large_image" });

  const canonicalUrl = new URL(route(page), location.origin).href;
  const socialImageUrl = new URL("/assets/og.png", location.origin).href;
  setMetaTag('meta[property="og:url"]', { property: "og:url", content: canonicalUrl });
  setMetaTag('meta[property="og:image"]', { property: "og:image", content: socialImageUrl });
  setMetaTag('meta[property="og:image:width"]', { property: "og:image:width", content: "1731" });
  setMetaTag('meta[property="og:image:height"]', { property: "og:image:height", content: "909" });
  setMetaTag('meta[property="og:image:alt"]', { property: "og:image:alt", content: "Timmerman Injectables — Persoonlijke cosmetische zorg in Almere" });
  setMetaTag('meta[name="twitter:image"]', { name: "twitter:image", content: socialImageUrl });

  let canonical = document.head.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.rel = "canonical";
    document.head.append(canonical);
  }
  canonical.href = canonicalUrl;

  const favicon = document.createElement("link");
  favicon.rel = "icon";
  favicon.href = "/favicon.ico";
  document.head.append(favicon);

  ["nl", "en"].forEach(language => {
    const link = document.createElement("link");
    link.rel = "alternate";
    link.hreflang = language;
    link.href = new URL(routes[language][page], location.origin).href;
    document.head.append(link);
  });

  const schema = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    "name": "Timmerman Injectables",
    "url": new URL(route("home"), location.origin).href,
    "description": data.meta.home.description,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Almere",
      "addressCountry": "NL"
    },
    "areaServed": {
      "@type": "City",
      "name": "Almere"
    },
    "availableLanguage": ["Dutch", "English"]
  };
  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.textContent = JSON.stringify(schema);
  document.head.append(script);
}

document.querySelector("#site").innerHTML = `${header()}${renderers[page]()}${footer()}`;
setMeta();

const menuToggle = document.querySelector(".menu-toggle");
menuToggle?.addEventListener("click", () => {
  const isOpen = document.body.classList.toggle("menu-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? data.common.menuClose : data.common.menuOpen);
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

document.querySelector("#consult-form")?.addEventListener("submit", event => {
  event.preventDefault();
  const status = document.querySelector("#form-status");
  status.hidden = false;
  status.focus?.();
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
