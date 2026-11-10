// Build-time renderer: turns locale data into complete HTML documents.
// Runs in Node only (see build.mjs); nothing here ships to the browser.

export const locales = ["nl", "en"];

export const routes = {
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

export const pages = Object.keys(routes.nl);

const escapeHtml = (value = "") =>
  String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#039;"
  })[character]);

export function renderPage({ data, locale, page, siteUrl }) {
  const route = key => routes[locale][key];
  const absolute = path => new URL(path, siteUrl).href;
  const otherLocale = locale === "nl" ? "en" : "nl";
  const placeholder = () => `<span class="placeholder">${escapeHtml(data.common.placeholder)}</span>`;
  const button = (label, href, variant = "") =>
    `<a class="button ${variant}" href="${href}">${escapeHtml(label)}</a>`;

  function brand() {
    return `
    <a class="brand" href="${route("home")}" aria-label="NT Clinic">
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
          <a class="language-link" href="${routes[otherLocale][page]}" lang="${otherLocale}" aria-label="${escapeHtml(data.common.language)}">${escapeHtml(data.common.languageCode)}</a>
          ${button(data.common.book, `${route("contact")}#consult`)}
          <button class="menu-toggle" type="button" aria-controls="main-nav" aria-expanded="false" aria-label="${escapeHtml(data.common.menuOpen)}" data-label-open="${escapeHtml(data.common.menuOpen)}" data-label-close="${escapeHtml(data.common.menuClose)}"><span></span></button>
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
          ${items.map(item => `
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
            </div>
          </div>
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
              ${treatments.overview.benefits.map(benefit => `<li>${benefit}</li>`).join("")}
            </ul>
            <p class="treatment-overview__benefits-label">${escapeHtml(treatments.zones.title)}</p>
            <ul>
              ${treatments.zones.items.map(zone => `<li>${zone}</li>`).join("")}
            </ul>
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

  function priceCell(price) {
    if (!Array.isArray(price)) return escapeHtml(price);
    return `<dl class="price-split">${price.map(p => `<div><dt>${escapeHtml(p.label)}</dt><dd>${escapeHtml(p.amount)}</dd></div>`).join("")}</dl>`;
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
                ${pricing.table.rows.map(item => `<tr><td>${escapeHtml(item.name)}</td><td>${escapeHtml(item.detail)}</td><td>${priceCell(item.price)}</td></tr>`).join("")}
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
    const calendlyUrl = `${booking.url}?embed_type=Inline&embed_domain=${encodeURIComponent(new URL(siteUrl).hostname)}&hide_gdpr_banner=1`;
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
            <ul class="contact-list">
              ${[
      ["addressLabel", "address"],
      ["phoneLabel", "phone"],
      ["emailLabel", "email"],
    ].map(([label, value]) => `<li><span>${escapeHtml(contact.details[label])}</span>${escapeHtml(contact.details[value])}</li>`).join("")}
            </ul>
          </div>
          <form class="contact-form reveal" id="consult-form" data-status-sending="${escapeHtml(form.statusSending)}" data-status-success="${escapeHtml(form.statusSuccess)}" data-status-error="${escapeHtml(form.statusError)}">
            <p class="eyebrow">${escapeHtml(form.eyebrow)}</p>
            <h2>${escapeHtml(form.title)}</h2>
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
            <div class="field"><label for="message">${escapeHtml(form.message)}</label><textarea id="message" name="message" maxlength="5000"></textarea></div>
            <div class="form-trap" aria-hidden="true"><input type="checkbox" name="botcheck" tabindex="-1" autocomplete="off"></div>
            <button class="button" type="submit">${escapeHtml(form.submit)}</button>
            <p class="form-status" id="form-status" role="status" tabindex="-1" hidden></p>
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

  function head() {
    const meta = data.meta[page];
    const canonicalUrl = absolute(route(page));
    const socialImageUrl = absolute("/assets/og.png");
    const metaName = (name, content) => `<meta name="${name}" content="${escapeHtml(content)}">`;
    const metaProperty = (property, content) => `<meta property="${property}" content="${escapeHtml(content)}">`;
    const schema = {
      "@context": "https://schema.org",
      "@type": "MedicalBusiness",
      "name": "NT Clinic",
      "url": absolute(route("home")),
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

    return [
      `<meta charset="utf-8">`,
      `<meta name="viewport" content="width=device-width, initial-scale=1">`,
      `<meta name="theme-color" content="#F0EAE2">`,
      `<meta name="robots" content="index,follow">`,
      `<title>${escapeHtml(meta.title)}</title>`,
      metaName("description", meta.description),
      metaProperty("og:title", meta.title),
      metaProperty("og:description", meta.description),
      metaProperty("og:type", "website"),
      metaProperty("og:locale", locale === "nl" ? "nl_NL" : "en_GB"),
      metaProperty("og:url", canonicalUrl),
      metaProperty("og:image", socialImageUrl),
      metaProperty("og:image:width", "1731"),
      metaProperty("og:image:height", "909"),
      metaProperty("og:image:alt", "NT Clinic — Persoonlijke cosmetische zorg in Almere"),
      metaName("twitter:card", "summary_large_image"),
      metaName("twitter:image", socialImageUrl),
      `<link rel="canonical" href="${canonicalUrl}">`,
      ...locales.map(language => `<link rel="alternate" hreflang="${language}" href="${absolute(routes[language][page])}">`),
      `<link rel="preconnect" href="https://fonts.googleapis.com">`,
      `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>`,
      `<link href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600&family=Playfair+Display:wght@400;500;600&display=swap" rel="stylesheet">`,
      ...(page === "contact" ? [
        `<link rel="preconnect" href="https://calendly.com">`,
        `<link rel="preconnect" href="https://assets.calendly.com" crossorigin>`
      ] : []),
      `<link rel="icon" type="image/png" href="/assets/favicon.png">`,
      `<link rel="icon" href="/favicon.ico">`,
      `<link rel="stylesheet" href="/assets/styles.css">`,
      `<script type="module" src="/assets/app.js"></script>`,
      `<script type="application/ld+json">${JSON.stringify(schema).replace(/</g, "\\u003c")}</script>`
    ].map(tag => `  ${tag}`).join("\n");
  }

  return `<!doctype html>
<html lang="${locale}">
<head>
${head()}
</head>
<body data-page="${page}" data-locale="${locale}">
  <div id="site">${header()}${renderers[page]()}${footer()}</div>
</body>
</html>
`;
}
