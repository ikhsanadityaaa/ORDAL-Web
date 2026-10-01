import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const read = (path: string) => readFileSync(join(root, path), "utf8");

const site = read("src/lib/site.ts");
const robots = read("public/robots.txt");
const llms = read("public/llms.txt");
const llmsFull = read("public/llms-full.txt");
const sitemap = read("src/app/sitemap.ts");
const nextConfig = read("next.config.ts");
const translations = read("src/lib/i18n/translations.ts");
const checked = [site, robots, llms, llmsFull, sitemap, nextConfig, translations].join("\n");

assert.match(site, /https:\/\/www\.applywithordal\.com/);
assert.doesNotMatch(checked, /https:\/\/ordal-web\.vercel\.app|https:\/\/ordal\.app/);
assert.doesNotMatch(translations, /US\$10/);
assert.doesNotMatch(checked, /US\$12|210\.000|210,000|210000/);
assert.match(translations, /Rp250\.000/);
assert.match(translations, /US\$15/);

for (const crawler of ["OAI-SearchBot", "ChatGPT-User", "GPTBot", "ClaudeBot", "PerplexityBot", "Google-Extended"]) {
  assert.match(robots, new RegExp(`User-agent: ${crawler}`));
}

for (const path of [
  "/panduan",
  "/panduan/cari-kerja-otomatis",
  "/panduan/ai-untuk-cari-kerja",
  "/panduan/cv-ats-friendly",
  "/panduan/auto-apply-lowongan",
  "/tentang-ordal",
]) {
  assert.ok(llms.includes(path) || llmsFull.includes(path), `Missing AI reference: ${path}`);
}

assert.match(sitemap, /ai-untuk-cari-kerja/);
assert.match(sitemap, /cv-ats-friendly/);
assert.match(sitemap, /auto-apply-lowongan/);
assert.match(nextConfig, /source: "\/api\/:path\*"/);
assert.match(nextConfig, /noindex, nofollow, noarchive/);

console.log("GEO self-check passed");
