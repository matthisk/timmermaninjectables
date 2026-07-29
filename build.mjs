import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = dirname(fileURLToPath(import.meta.url));
const dist = join(root, "dist");
const client = join(dist, "client");
const server = join(dist, "server");

const publicFiles = [
  "assets",
  "en",
  "locales",
  "index.html",
  "uw-arts.html",
  "behandelingen.html",
  "tarieven.html",
  "contact.html",
  "privacy.html",
  "cookies.html",
  "medische-disclaimer.html",
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
