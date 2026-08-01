import assert from "node:assert/strict";
import { access } from "node:fs/promises";
import test from "node:test";

const templateRoot = new URL("../", import.meta.url);

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(
    new Request(`http://localhost${pathname}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the Divine Luxury Properties home page", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /Divine Luxury Properties/i);
  assert.match(html, /Remarkable homes/i);
  assert.match(html, /Explore residences/i);
  assert.doesNotMatch(html, /codex-preview|loading skeleton|Starter Project/i);
});

test("renders primary content routes and removes the disposable preview", async () => {
  for (const pathname of ["/about", "/services", "/properties", "/developers", "/careers", "/blogs", "/contact", "/admin"]) {
    const response = await render(pathname);
    assert.equal(response.status, 200, pathname);
  }
  await assert.rejects(access(new URL("app/_sites-preview", templateRoot)));
});
