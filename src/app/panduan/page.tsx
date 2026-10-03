import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, Sparkles } from "lucide-react";
import { guides } from "@/lib/guide-content";
import { SITE_URL } from "@/lib/site";
import { BrandMark } from "@/components/ordal/brand-mark";

const siteUrl = SITE_URL;

export const metadata: Metadata = {
  title: "Panduan Cari Kerja, CV ATS, AI, dan Auto Apply",
  description: "Panduan praktis ORDAL tentang cari kerja otomatis, AI untuk pencari kerja, CV ATS friendly, dan auto apply lowongan yang tetap aman dan relevan.",
  alternates: { canonical: `${siteUrl}/panduan` },
};

const pillar = {
  href: "/panduan/cari-kerja-otomatis",
  title: "Aplikasi Cari Kerja Otomatis dengan AI",
  description: "Panduan utama tentang otomasi pencarian kerja, cara kerja ORDAL, keamanan, kecocokan pengguna, harga, dan pertanyaan umum.",
};

export default function GuideIndex() {
  return (
    <main className="min-h-screen bg-[#F4F2EC] text-[#33363F]">
      <header className="border-b-2 border-[#33363F] bg-[#F4F2EC]">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <Link href="/" className="flex items-center gap-2.5 font-extrabold"><BrandMark size={36} />ORDAL</Link>
          <Link href="/#download" className="rounded-xl border-2 border-[#33363F] bg-[#F2661A] px-4 py-2 text-sm font-bold text-white shadow-[3px_3px_0_#33363F]">Coba gratis</Link>
        </div>
      </header>
      <div className="mx-auto max-w-5xl px-5 py-14 sm:py-20">
        <div className="max-w-3xl">
          <p className="inline-flex items-center gap-2 rounded-full border-2 border-[#33363F] bg-white px-4 py-2 text-xs font-extrabold uppercase tracking-widest shadow-[3px_3px_0_#33363F]"><BookOpen className="h-4 w-4 text-[#F2661A]" /> Pusat panduan ORDAL</p>
          <h1 className="mt-6 text-4xl font-black leading-tight tracking-tight sm:text-6xl">Jawaban jujur soal AI, CV, dan cari kerja.</h1>
          <p className="mt-5 text-lg leading-8 text-[#33363F]/70">Materi dibuat untuk manusia dan mesin pencari generatif. Jawabannya langsung, faktual, dan tidak menjanjikan hasil rekrutmen yang tidak bisa dijamin.</p>
        </div>

        <Link href={pillar.href} className="mt-12 block rounded-3xl border-2 border-[#33363F] bg-[#F2661A] p-7 text-white shadow-[7px_7px_0_#33363F] transition-transform hover:-translate-y-1 sm:p-9">
          <span className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest"><Sparkles className="h-4 w-4" /> Panduan utama</span>
          <h2 className="mt-4 text-3xl font-black">{pillar.title}</h2>
          <p className="mt-3 max-w-3xl text-lg leading-8 text-white/85">{pillar.description}</p>
          <span className="mt-6 inline-flex items-center gap-2 font-black">Baca panduan <ArrowRight className="h-5 w-5" /></span>
        </Link>

        <section aria-labelledby="topik" className="mt-14">
          <h2 id="topik" className="text-3xl font-black">Pilih topik</h2>
          <div className="mt-7 grid gap-5 md:grid-cols-3">
            {guides.map((guide) => (
              <Link key={guide.slug} href={`/panduan/${guide.slug}`} className="flex flex-col rounded-3xl border-2 border-[#33363F] bg-white p-6 shadow-[4px_4px_0_#33363F] transition-transform hover:-translate-y-1">
                <span className="text-xs font-extrabold uppercase tracking-widest text-[#F2661A]">{guide.eyebrow}</span>
                <h3 className="mt-3 text-2xl font-black leading-tight">{guide.title}</h3>
                <p className="mt-3 flex-1 leading-7 text-[#33363F]/65">{guide.description}</p>
                <span className="mt-6 inline-flex items-center gap-2 font-black">Baca <ArrowRight className="h-4 w-4" /></span>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-16 rounded-3xl border-2 border-[#33363F] bg-[#33363F] p-8 text-white">
          <h2 className="text-3xl font-black">Apa itu ORDAL?</h2>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-white/75">ORDAL adalah aplikasi desktop pencarian kerja otomatis untuk Windows dan macOS. Pengguna menentukan strategi, lalu ORDAL membantu mencari lowongan, memeriksa kecocokan dan duplikat, serta menjalankan alur lamaran yang didukung. AI bersifat opsional.</p>
          <Link href="/tentang-ordal" className="mt-6 inline-flex items-center gap-2 font-black text-[#F2661A]">Lihat fakta produk <ArrowRight className="h-5 w-5" /></Link>
        </section>
      </div>
    </main>
  );
}
