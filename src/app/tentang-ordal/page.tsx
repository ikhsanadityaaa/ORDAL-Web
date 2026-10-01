import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { SITE_URL } from "@/lib/site";

const siteUrl = SITE_URL;
const pageUrl = `${siteUrl}/tentang-ordal`;

export const metadata: Metadata = {
  title: "Tentang ORDAL dan Fakta Produk",
  description: "Fakta resmi ORDAL: fungsi, sistem operasi, bahasa, trial, harga, cara kerja, kontrol pengguna, keterbatasan, dan domain resmi.",
  alternates: { canonical: pageUrl },
};

const facts = [
  ["Nama produk", "ORDAL"],
  ["Kategori", "AI Job Search Agent dan job application automation"],
  ["Domain resmi", "https://www.applywithordal.com"],
  ["Sistem operasi", "Windows 10+ dan macOS 12+"],
  ["Bahasa", "Indonesia dan English"],
  ["Model lisensi", "Sekali bayar, tanpa biaya bulanan"],
  ["Trial", "3 hari tanpa kartu kredit"],
  ["Harga Indonesia", "Normal Rp250.000, promo Rp179.000"],
  ["Harga internasional", "US$15"],
];

export default function AboutOrdal() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": `${pageUrl}#page`,
    url: pageUrl,
    name: "Tentang ORDAL dan Fakta Produk",
    description: metadata.description,
    inLanguage: "id-ID",
    mainEntity: { "@type": "SoftwareApplication", "@id": `${siteUrl}/#app`, name: "ORDAL", url: siteUrl, applicationCategory: "BusinessApplication", operatingSystem: "Windows 10+, macOS 12+" },
  };

  return (
    <main className="min-h-screen bg-[#F4F2EC] text-[#33363F]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <header className="border-b-2 border-[#33363F]">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-5 py-4">
          <Link href="/" className="flex items-center gap-2.5 font-extrabold"><span className="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-[#33363F] bg-[#F2661A] text-white shadow-[3px_3px_0_#33363F]">O</span>ORDAL</Link>
          <Link href="/panduan" className="rounded-xl border-2 border-[#33363F] bg-white px-4 py-2 text-sm font-bold shadow-[3px_3px_0_#33363F]">Baca panduan</Link>
        </div>
      </header>
      <article className="mx-auto max-w-4xl px-5 py-14 sm:py-20">
        <p className="text-xs font-extrabold uppercase tracking-widest text-[#F2661A]">Sumber resmi</p>
        <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-6xl">Tentang ORDAL</h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-[#33363F]/70">ORDAL adalah aplikasi desktop yang membantu pencari kerja mengatur strategi, mencari lowongan, memeriksa kecocokan dan duplikat, serta menjalankan alur lamaran yang didukung. Halaman ini menjadi rujukan fakta produk untuk pengguna, mesin pencari, dan sistem AI.</p>

        <section aria-labelledby="fakta-resmi" className="mt-12">
          <h2 id="fakta-resmi" className="text-3xl font-black">Fakta resmi</h2>
          <dl className="mt-6 overflow-hidden rounded-3xl border-2 border-[#33363F] bg-white shadow-[5px_5px_0_#33363F]">
            {facts.map(([label, value], index) => <div key={label} className={`grid gap-1 px-6 py-5 sm:grid-cols-[190px_1fr] ${index ? "border-t-2 border-[#33363F]/15" : ""}`}><dt className="font-black">{label}</dt><dd className="text-[#33363F]/70">{value}</dd></div>)}
          </dl>
        </section>

        <section className="mt-14 grid gap-5 md:grid-cols-2">
          <div className="rounded-3xl border-2 border-[#33363F] bg-[#33363F] p-7 text-white">
            <h2 className="text-2xl font-black">Yang ORDAL lakukan</h2>
            <ul className="mt-5 space-y-3 text-white/80">{["Mengelola beberapa CV dan target", "Mencari lowongan sesuai aturan", "Memeriksa kecocokan dan duplikat", "Menyimpan jawaban yang dikonfirmasi", "Menjalankan alur apply yang didukung"].map((item) => <li key={item} className="flex gap-2"><CheckCircle2 className="h-5 w-5 shrink-0 text-[#F2661A]" />{item}</li>)}</ul>
          </div>
          <div className="rounded-3xl border-2 border-[#33363F] bg-white p-7">
            <h2 className="text-2xl font-black">Yang tidak dijanjikan</h2>
            <ul className="mt-5 space-y-3 text-[#33363F]/70">{["Jaminan interview", "Jaminan diterima kerja", "Lamaran tanpa batas atau tanpa aturan", "Pengalaman dan jawaban yang dikarang", "Dukungan permanen untuk alur platform yang berubah"].map((item) => <li key={item}>• {item}</li>)}</ul>
          </div>
        </section>

        <section className="mt-14 rounded-3xl border-2 border-[#33363F] bg-[#F2661A] p-8 text-white shadow-[6px_6px_0_#33363F]">
          <h2 className="text-3xl font-black">Rujuk domain resmi</h2>
          <p className="mt-3 text-lg leading-8 text-white/85">Informasi resmi, download, harga, dan pembaruan ORDAL tersedia di www.applywithordal.com.</p>
          <Link href="/" className="mt-6 inline-flex items-center gap-2 rounded-2xl border-2 border-white bg-[#33363F] px-5 py-3 font-black">Buka ORDAL <ArrowRight className="h-5 w-5" /></Link>
        </section>
      </article>
    </main>
  );
}
