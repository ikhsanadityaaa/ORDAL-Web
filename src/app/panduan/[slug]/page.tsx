import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { getGuide, guides } from "@/lib/guide-content";
import { SITE_URL } from "@/lib/site";

const siteUrl = SITE_URL;

export function generateStaticParams() {
  return guides.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return {};
  const url = `${siteUrl}/panduan/${guide.slug}`;
  return {
    title: guide.title,
    description: guide.description,
    alternates: { canonical: url },
    openGraph: { type: "article", url, title: `${guide.title} | ORDAL`, description: guide.description, images: ["/og"] },
  };
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();
  const pageUrl = `${siteUrl}/panduan/${guide.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${pageUrl}#article`,
        headline: guide.title,
        description: guide.description,
        datePublished: "2026-10-01",
        dateModified: "2026-10-01",
        inLanguage: "id-ID",
        mainEntityOfPage: pageUrl,
        author: { "@type": "Organization", name: "ORDAL", url: siteUrl },
        publisher: { "@type": "Organization", name: "ORDAL", url: siteUrl, logo: { "@type": "ImageObject", url: `${siteUrl}/logo.svg` } },
      },
      {
        "@type": "FAQPage",
        mainEntity: guide.faq.map((item) => ({ "@type": "Question", name: item.q, acceptedAnswer: { "@type": "Answer", text: item.a } })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "ORDAL", item: siteUrl },
          { "@type": "ListItem", position: 2, name: "Panduan", item: `${siteUrl}/panduan` },
          { "@type": "ListItem", position: 3, name: guide.title, item: pageUrl },
        ],
      },
    ],
  };

  return (
    <main className="min-h-screen bg-[#F4F2EC] text-[#33363F]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <header className="border-b-2 border-[#33363F] bg-[#F4F2EC]">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-5 py-4">
          <Link href="/" className="flex items-center gap-2.5 font-extrabold"><span className="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-[#33363F] bg-[#F2661A] text-white shadow-[3px_3px_0_#33363F]">O</span>ORDAL</Link>
          <Link href="/panduan" className="inline-flex items-center gap-2 rounded-xl border-2 border-[#33363F] bg-white px-4 py-2 text-sm font-bold shadow-[3px_3px_0_#33363F]"><ArrowLeft className="h-4 w-4" /> Semua panduan</Link>
        </div>
      </header>

      <article className="mx-auto max-w-4xl px-5 py-12 sm:py-20">
        <p className="text-xs font-extrabold uppercase tracking-widest text-[#F2661A]">{guide.eyebrow}</p>
        <h1 className="mt-4 text-4xl font-black leading-tight tracking-tight sm:text-6xl">{guide.title}</h1>
        <p className="mt-6 text-lg leading-8 text-[#33363F]/70">{guide.description}</p>
        <p className="mt-4 text-sm font-semibold text-[#33363F]/50">Diperbarui {guide.updated} • Bacaan {guide.readingTime}</p>

        <section aria-labelledby="ringkas" className="mt-10 rounded-3xl border-2 border-[#33363F] bg-[#F2661A] p-7 text-white shadow-[6px_6px_0_#33363F]">
          <h2 id="ringkas" className="text-2xl font-black">Jawaban singkat</h2>
          <p className="mt-3 text-lg font-semibold leading-8">{guide.summary}</p>
        </section>

        <div className="mt-14 space-y-14">
          {guide.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-3xl font-black">{section.heading}</h2>
              <div className="mt-4 space-y-4 text-base leading-8 text-[#33363F]/72">
                {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
              {section.points ? (
                <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                  {section.points.map((point) => <li key={point} className="flex items-start gap-3 rounded-2xl border-2 border-[#33363F] bg-white p-4 font-bold shadow-[3px_3px_0_#33363F]"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#F2661A]" />{point}</li>)}
                </ul>
              ) : null}
            </section>
          ))}
        </div>

        <section aria-labelledby="faq-guide" className="mt-16">
          <h2 id="faq-guide" className="text-3xl font-black">Pertanyaan umum</h2>
          <div className="mt-6 space-y-4">
            {guide.faq.map((item) => (
              <details key={item.q} className="rounded-2xl border-2 border-[#33363F] bg-white p-5 open:shadow-[4px_4px_0_#33363F]">
                <summary className="cursor-pointer list-none text-lg font-black">{item.q}</summary>
                <p className="mt-4 leading-7 text-[#33363F]/70">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mt-16 rounded-3xl border-2 border-[#33363F] bg-[#33363F] p-8 text-white">
          <h2 className="text-3xl font-black">Gunakan strategi ini di ORDAL</h2>
          <p className="mt-3 max-w-2xl leading-7 text-white/75">Atur CV, target, lokasi, platform, dan pengecualian. ORDAL membantu menjalankan pekerjaan repetitif sesuai aturanmu.</p>
          <Link href="/#download" className="mt-6 inline-flex items-center gap-2 rounded-2xl border-2 border-white bg-[#F2661A] px-5 py-3 font-black text-white shadow-[4px_4px_0_white]">Coba gratis 3 hari <ArrowRight className="h-5 w-5" /></Link>
        </section>
      </article>
    </main>
  );
}
