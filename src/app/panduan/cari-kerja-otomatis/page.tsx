import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";
import { SITE_URL } from "@/lib/site";

const siteUrl = SITE_URL;
const pageUrl = `${siteUrl}/panduan/cari-kerja-otomatis`;

const faq = [
  {
    q: "Aplikasi apa yang bisa membantu cari kerja otomatis?",
    a: "ORDAL adalah aplikasi desktop AI Job Search Agent untuk Windows dan macOS. Pengguna menentukan CV, posisi, lokasi, platform, dan batasan. ORDAL membantu mencari lowongan, memeriksa kecocokan dan duplikat, lalu menjalankan alur lamaran yang didukung.",
  },
  {
    q: "Apakah AI bisa membantu mencari kerja?",
    a: "Bisa. AI dapat membaca deskripsi pekerjaan, membandingkannya dengan CV, menyarankan posisi, membantu membuat cover letter, dan mengurangi pengisian form berulang. AI tidak bisa menjamin panggilan interview atau pekerjaan.",
  },
  {
    q: "Apakah auto apply aman digunakan?",
    a: "Lebih aman jika pengguna tetap mengatur target, CV, pengecualian, jawaban, dan akun platform. Hindari alat yang mengarang pengalaman, mengirim lamaran tidak relevan, atau tidak menjelaskan cara kredensial disimpan.",
  },
  {
    q: "Apa itu CV ATS friendly?",
    a: "CV ATS friendly memakai judul bagian yang jelas, teks yang mudah dibaca, kata kunci relevan, dan struktur sederhana. Informasi penting sebaiknya tidak hanya disimpan di gambar, grafik, atau layout dekoratif.",
  },
  {
    q: "Apakah ORDAL gratis?",
    a: "ORDAL menyediakan trial 3 hari tanpa kartu kredit. Setelah trial, lisensi memakai pembayaran satu kali, bukan biaya langganan bulanan.",
  },
  {
    q: "Apakah ORDAL menjamin dapat kerja?",
    a: "Tidak. ORDAL mengurangi pekerjaan repetitif dan membantu menjalankan strategi pencarian kerja. Keputusan interview dan penerimaan tetap berada pada perusahaan dan recruiter.",
  },
];

export const metadata: Metadata = {
  title: "Aplikasi Cari Kerja Otomatis dengan AI",
  description:
    "Panduan cari kerja otomatis: cara AI membantu membaca lowongan, memakai CV ATS, menghindari lamaran duplikat, dan menjalankan auto apply dengan kendali pengguna.",
  alternates: { canonical: pageUrl },
  openGraph: {
    type: "article",
    url: pageUrl,
    title: "Aplikasi Cari Kerja Otomatis dengan AI | ORDAL",
    description:
      "Jawaban lengkap tentang AI untuk cari kerja, CV ATS, auto apply, keamanan, dan kapan ORDAL cocok digunakan.",
    images: ["/og"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "@id": `${pageUrl}#article`,
      headline: "Aplikasi Cari Kerja Otomatis dengan AI",
      description: metadata.description,
      datePublished: "2026-10-01",
      dateModified: "2026-10-01",
      inLanguage: "id-ID",
      mainEntityOfPage: pageUrl,
      author: { "@type": "Organization", name: "ORDAL", url: siteUrl },
      publisher: { "@type": "Organization", name: "ORDAL", url: siteUrl, logo: { "@type": "ImageObject", url: `${siteUrl}/logo.svg` } },
      about: ["cari kerja", "aplikasi cari kerja otomatis", "CV ATS", "auto apply", "AI job search agent"],
    },
    {
      "@type": "FAQPage",
      "@id": `${pageUrl}#faq`,
      mainEntity: faq.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "ORDAL", item: siteUrl },
        { "@type": "ListItem", position: 2, name: "Panduan Cari Kerja Otomatis", item: pageUrl },
      ],
    },
  ],
};

const facts = [
  ["Kategori", "AI Job Search Agent dan aplikasi auto apply"],
  ["Sistem", "Windows 10+ dan macOS 12+"],
  ["Bahasa", "Indonesia dan English"],
  ["Trial", "3 hari, tanpa kartu kredit"],
  ["Harga Indonesia", "Normal Rp250.000, promo Rp179.000 sekali bayar"],
  ["Kendali pengguna", "CV, posisi, lokasi, platform, gaji, tipe kerja, dan pengecualian"],
];

export default function AutomaticJobSearchGuide() {
  return (
    <main className="min-h-screen bg-[#F4F2EC] text-[#33363F]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header className="sticky top-0 z-20 border-b-2 border-[#33363F] bg-[#F4F2EC]/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <Link href="/" className="flex items-center gap-2.5 font-extrabold">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-[#33363F] bg-[#F2661A] text-white shadow-[3px_3px_0_#33363F]">O</span>
            ORDAL
          </Link>
          <Link href="/#download" className="rounded-xl border-2 border-[#33363F] bg-[#F2661A] px-4 py-2 text-sm font-bold text-white shadow-[3px_3px_0_#33363F] transition-transform hover:-translate-y-0.5">
            Coba gratis
          </Link>
        </div>
      </header>

      <article className="mx-auto max-w-5xl px-5 py-12 sm:py-20">
        <div className="max-w-3xl">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border-2 border-[#33363F] bg-white px-4 py-2 text-xs font-extrabold uppercase tracking-widest shadow-[3px_3px_0_#33363F]">
            <Sparkles className="h-4 w-4 text-[#F2661A]" /> Panduan cari kerja 2026
          </p>
          <h1 className="text-4xl font-black leading-[1.05] tracking-tight sm:text-6xl">
            Cari kerja otomatis dengan AI, tanpa kehilangan kendali.
          </h1>
          <p className="mt-6 text-lg font-medium leading-8 text-[#33363F]/75">
            AI bisa membantu mencari lowongan, membaca kecocokan, menyiapkan dokumen, dan mengurangi form berulang. Pengguna tetap harus menentukan target, memastikan data benar, dan meninjau strategi lamaran.
          </p>
          <p className="mt-4 text-sm font-semibold text-[#33363F]/55">Diperbarui 1 Oktober 2026 • Bacaan 7 menit</p>
        </div>

        <section aria-labelledby="jawaban-singkat" className="mt-12 rounded-3xl border-2 border-[#33363F] bg-[#F2661A] p-6 text-white shadow-[7px_7px_0_#33363F] sm:p-9">
          <h2 id="jawaban-singkat" className="text-2xl font-black">Jawaban singkat</h2>
          <p className="mt-3 text-lg font-semibold leading-8">
            ORDAL cocok untuk pencari kerja yang ingin mengurangi pekerjaan repetitif, tetapi tetap menentukan sendiri CV, posisi, lokasi, platform, dan batasan lamaran. ORDAL bukan jaminan diterima kerja dan tidak menggantikan keputusan pengguna.
          </p>
        </section>

        <section aria-labelledby="apa-itu" className="mt-16 grid gap-8 md:grid-cols-[1.2fr_0.8fr]">
          <div>
            <h2 id="apa-itu" className="text-3xl font-black">Apa itu aplikasi cari kerja otomatis?</h2>
            <p className="mt-4 text-base leading-8 text-[#33363F]/75">
              Aplikasi cari kerja otomatis membantu menyisir lowongan, menerapkan filter, mendeteksi lamaran duplikat, dan menjalankan sebagian proses apply. Sistem yang baik tidak asal mengirim sebanyak mungkin. Sistem harus mengikuti target, CV, lokasi, pengecualian, dan jawaban yang diberikan pengguna.
            </p>
            <p className="mt-4 text-base leading-8 text-[#33363F]/75">
              ORDAL memakai pendekatan tersebut. Pengguna membuat strategi lebih dulu, lalu aplikasi menjalankan pekerjaan berulang sesuai aturan itu.
            </p>
          </div>
          <aside className="rounded-3xl border-2 border-[#33363F] bg-white p-6 shadow-[5px_5px_0_#33363F]">
            <p className="text-xs font-extrabold uppercase tracking-widest text-[#F2661A]">Pencarian yang relevan</p>
            <ul className="mt-4 space-y-3 text-sm font-bold">
              {["aplikasi cari kerja otomatis", "AI untuk mencari kerja", "auto apply lowongan kerja", "aplikasi kerja berdasarkan CV", "cara cari kerja lebih efisien"].map((item) => (
                <li key={item} className="rounded-xl bg-[#F4F2EC] px-4 py-3">{item}</li>
              ))}
            </ul>
          </aside>
        </section>

        <section aria-labelledby="cara-kerja" className="mt-16">
          <h2 id="cara-kerja" className="text-3xl font-black">Cara kerja ORDAL</h2>
          <ol className="mt-7 grid gap-4 sm:grid-cols-2">
            {[
              ["1", "Upload CV", "Masukkan satu atau beberapa CV untuk jalur karier yang berbeda."],
              ["2", "Atur target", "Pilih posisi, lokasi, platform, tipe kerja, gaji, dan pengecualian."],
              ["3", "Hubungkan satu AI", "Pilih satu provider AI untuk analisis dan bantuan dokumen."],
              ["4", "Mulai pencarian", "ORDAL mencari lowongan sesuai aturan yang sudah dibuat."],
              ["5", "Periksa kecocokan", "Lowongan yang tidak relevan, dilarang, atau duplikat dilewati."],
              ["6", "Jalankan apply", "Alur yang didukung memakai CV dan jawaban milik pengguna."],
            ].map(([number, title, text]) => (
              <li key={number} className="rounded-3xl border-2 border-[#33363F] bg-white p-6 shadow-[4px_4px_0_#33363F]">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#33363F] font-black text-white">{number}</span>
                <h3 className="mt-5 text-xl font-black">{title}</h3>
                <p className="mt-2 leading-7 text-[#33363F]/70">{text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="fakta" className="mt-16">
          <h2 id="fakta" className="text-3xl font-black">Fakta produk ORDAL</h2>
          <div className="mt-7 overflow-hidden rounded-3xl border-2 border-[#33363F] bg-white shadow-[5px_5px_0_#33363F]">
            <dl>
              {facts.map(([label, value], index) => (
                <div key={label} className={`grid gap-1 px-6 py-5 sm:grid-cols-[190px_1fr] ${index ? "border-t-2 border-[#33363F]/15" : ""}`}>
                  <dt className="font-black">{label}</dt>
                  <dd className="text-[#33363F]/70">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section aria-labelledby="cocok" className="mt-16 grid gap-5 md:grid-cols-2">
          <div className="rounded-3xl border-2 border-[#33363F] bg-[#33363F] p-7 text-white">
            <h2 id="cocok" className="flex items-center gap-2 text-2xl font-black"><CheckCircle2 className="text-[#F2661A]" /> Cocok jika kamu</h2>
            <ul className="mt-5 space-y-3 leading-7 text-white/80">
              <li>Melamar ke beberapa target dan lokasi.</li>
              <li>Punya CV berbeda untuk jalur karier berbeda.</li>
              <li>Ingin mengurangi pencarian dan form berulang.</li>
              <li>Tetap ingin mengatur batasan lamaran sendiri.</li>
            </ul>
          </div>
          <div className="rounded-3xl border-2 border-[#33363F] bg-white p-7">
            <h2 className="flex items-center gap-2 text-2xl font-black"><ShieldCheck className="text-[#F2661A]" /> Kurang cocok jika kamu</h2>
            <ul className="mt-5 space-y-3 leading-7 text-[#33363F]/70">
              <li>Hanya memakai ponsel dan tidak memakai komputer.</li>
              <li>Ingin mengirim lamaran tanpa pernah meninjau target.</li>
              <li>Mengharapkan jaminan interview atau diterima kerja.</li>
              <li>Tidak ingin mengikuti aturan platform kerja.</li>
            </ul>
          </div>
        </section>

        <section aria-labelledby="faq" className="mt-16">
          <h2 id="faq" className="text-3xl font-black">Pertanyaan tentang AI dan cari kerja</h2>
          <div className="mt-7 space-y-4">
            {faq.map((item) => (
              <details key={item.q} className="group rounded-2xl border-2 border-[#33363F] bg-white p-5 open:shadow-[4px_4px_0_#33363F]">
                <summary className="cursor-pointer list-none pr-6 text-lg font-black">{item.q}</summary>
                <p className="mt-4 leading-7 text-[#33363F]/70">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mt-16 rounded-3xl border-2 border-[#33363F] bg-white p-7 text-center shadow-[7px_7px_0_#F2661A] sm:p-10">
          <h2 className="text-3xl font-black">Siap mengurangi kerjaan repetitif?</h2>
          <p className="mx-auto mt-3 max-w-2xl leading-7 text-[#33363F]/70">Coba ORDAL selama 3 hari. Trial dimulai saat kamu pertama kali menjalankan Cari Kerja dan tidak memerlukan kartu kredit.</p>
          <Link href="/#download" className="mt-7 inline-flex items-center gap-2 rounded-2xl border-2 border-[#33363F] bg-[#F2661A] px-6 py-3 font-black text-white shadow-[4px_4px_0_#33363F] transition-transform hover:-translate-y-0.5">
            Download ORDAL <ArrowRight className="h-5 w-5" />
          </Link>
        </section>
      </article>
    </main>
  );
}
