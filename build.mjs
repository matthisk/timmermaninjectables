import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { locales, pages, renderPage, routes } from "./src/render.js";

const root = dirname(fileURLToPath(import.meta.url));
const dist = join(root, "dist");
const client = join(dist, "client");
const server = join(dist, "server");
// Used for canonical/og/hreflang URLs and the Calendly embed domain.
// Source of truth is [vars] SITE_URL in wrangler.toml; an env var overrides it.
const wranglerToml = await readFile(join(root, "wrangler.toml"), "utf8");
const siteUrl = process.env.SITE_URL || wranglerToml.match(/^SITE_URL\s*=\s*"([^"]+)"/m)?.[1];
if (!siteUrl) throw new Error("SITE_URL missing: set it under [vars] in wrangler.toml");
new URL(siteUrl); // fail the build early on a malformed URL

const publicFiles = [
  "assets",
  "logo.png",
  "favicon.ico",
  "robots.txt"
];

await rm(dist, { recursive: true, force: true });
await mkdir(client, { recursive: true });
await mkdir(server, { recursive: true });

for (const entry of publicFiles) {
  await cp(join(root, entry), join(client, entry), { recursive: true });
}

for (const locale of locales) {
  const data = JSON.parse(await readFile(join(root, "locales", `${locale}.json`), "utf8"));
  for (const page of pages) {
    const path = routes[locale][page];
    const file = join(client, path.endsWith("/") ? `${path}index.html` : path);
    await mkdir(dirname(file), { recursive: true });
    await writeFile(file, renderPage({ data, locale, page, siteUrl }));
  }
}

const worker = `
const securityHeaders = {
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "SAMEORIGIN",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()"
};

async function withSecurityHeaders(response) {
  const headers = new Headers(response.headers);
  for (const [name, value] of Object.entries(securityHeaders)) {
    headers.set(name, value);
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}

const worker = {
  async fetch(request, env) {
    const url = new URL(request.url);
    let response = await env.ASSETS.fetch(request);

    if (response.status === 404 && url.pathname.endsWith("/")) {
      const indexUrl = new URL(url);
      indexUrl.pathname += "index.html";
      response = await env.ASSETS.fetch(new Request(indexUrl, request));
    }

    return withSecurityHeaders(response);
  }
};

export default worker;
`;

await writeFile(join(server, "index.js"), worker.trimStart());
