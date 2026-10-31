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
      <span class="brand__text">Timmerman Injectables<small>${escapeHtml(data.common.brandSuffix)}</small></span>
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
            <details class="faq reveal"${index === 0 ? " open" : ""}>
              <summary>${escapeHtml(item.q)}</summary>
              <div class="faq__answer">
                <p>${escapeHtml(item.a)}</p>
                ${placeholder()}
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
            <h1 class="hero__title">${escapeHtml(home.hero.titleBefore)} <em>${escapeHtml(home.hero.titleAccent)}</em> ${escapeHtml(home.hero.titleAfter)}</h1>
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

      <section class="section section--ivory">
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
      ${pageHero(treatments.hero)}
      ${treatments.items.map((item, index) => `
        <section class="section treatment-detail ${index % 2 ? "section--ivory" : ""}">
          <div class="container treatment-detail__grid">
            <div class="reveal">
              <div class="treatment-detail__index">${escapeHtml(item.number)}</div>
            </div>
            <div class="reveal">
              <p class="eyebrow">${escapeHtml(item.eyebrow)}</p>
              <h2>${escapeHtml(item.title)}</h2>
              <p class="lead">${escapeHtml(item.lead)}</p>
              <p>${escapeHtml(item.body)}</p>
              ${placeholder()}
              <h3 style="margin-top:40px">${escapeHtml(item.zonesTitle)}</h3>
              <div class="zone-grid">${item.zones.map(zone => `<div class="zone">${escapeHtml(zone)}</div>`).join("")}</div>
              <p class="small muted" style="margin-top:24px">${escapeHtml(item.note)}</p>
            </div>
          </div>
        </section>`).join("")}
      <section class="section section--ivory">
        <div class="container safety-panel reveal">
          <div>
            <p class="eyebrow">${escapeHtml(treatments.safety.eyebrow)}</p>
            <h2>${escapeHtml(treatments.safety.title)}</h2>
            ${placeholder()}
          </div>
          <div>
            <p class="lead">${escapeHtml(treatments.safety.intro)}</p>
            <ul class="safety-list">${treatments.safety.items.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
          </div>
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
      ${pageHero(pricing.hero)}
      <section class="section">
        <div class="container pricing-wrap">
          <aside class="price-note reveal">
            ${placeholder()}
            <h3 style="margin-top:22px">${escapeHtml(pricing.note.title)}</h3>
            <p>${escapeHtml(pricing.note.text)}</p>
            <p class="small">${escapeHtml(pricing.note.extra)}</p>
          </aside>
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
  const form = contact.form;
  return `
    <main id="main">
      ${pageHero(contact.hero)}
      <section class="section" id="consult">
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
