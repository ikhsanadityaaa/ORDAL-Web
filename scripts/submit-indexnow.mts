const host = "www.applywithordal.com";
const key = "96c5bbde87aafe6f0ed6b80d7f5faff3";
const paths = [
  "/",
  "/panduan",
  "/panduan/cari-kerja-otomatis",
  "/panduan/ai-untuk-cari-kerja",
  "/panduan/cv-ats-friendly",
  "/panduan/auto-apply-lowongan",
  "/tentang-ordal",
  "/llms.txt",
  "/llms-full.txt",
  "/sitemap.xml",
];

const response = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({
    host,
    key,
    keyLocation: `https://${host}/${key}.txt`,
    urlList: paths.map((path) => `https://${host}${path}`),
  }),
});

if (![200, 202].includes(response.status)) {
  throw new Error(`IndexNow rejected submission: HTTP ${response.status} ${await response.text()}`);
}

console.log(`IndexNow accepted ${paths.length} URLs with HTTP ${response.status}`);
