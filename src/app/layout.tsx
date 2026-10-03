import type { Metadata, Viewport } from "next";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n/context";
import { Toaster } from "@/components/ui/sonner";
import { translations } from "@/lib/i18n/translations";
import { SITE_URL } from "@/lib/site";

const siteUrl = SITE_URL;

/* ============================================================
   SEO — tuned for job seekers (Indonesia-first, EN secondary)
   ============================================================ */
const seoTitle = "ORDAL - Aplikasi Cari Kerja Otomatis";
const seoDescription =
  "ORDAL adalah aplikasi desktop pencarian kerja otomatis yang mengikuti CV, target, platform, dan aturan pengguna. AI tersedia sebagai fitur opsional.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: seoTitle,
    template: "%s | ORDAL",
  },
  description: seoDescription,
  applicationName: "ORDAL",
  keywords: [
    "cari kerja",
    "lowongan kerja",
    "lamar kerja",
    "aplikasi cari kerja",
    "aplikasi cari kerja otomatis",
    "alat pencari kerja otomatis",
    "software pencari kerja",
    "aplikasi bantu cari kerja",
    "aplikasi lamar kerja",
    "aplikasi auto apply lowongan kerja",
    "aplikasi melamar kerja otomatis",
    "AI cari kerja",
    "AI pencari lowongan kerja",
    "AI job search agent",
    "AI auto apply app",
    "auto apply lamaran kerja",
    "job search automation",
    "automatic job application software",
    "AI job finder",
    "job application automation",
  ],
  authors: [{ name: "ORDAL", url: siteUrl }],
  creator: "ORDAL",
  publisher: "ORDAL",
  category: "job search software",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "ORDAL",
    title: "ORDAL — Aplikasi Cari Kerja Otomatis",
    description:
      "Cari lowongan, cek kecocokan dan duplikat, lalu jalankan alur lamaran sesuai CV dan targetmu. AI bersifat opsional. Windows dan macOS.",
    locale: "id_ID",
    images: [
      {
        url: "/og",
        width: 1200,
        height: 630,
        alt: "ORDAL — aplikasi cari kerja otomatis",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ORDAL — Aplikasi Cari Kerja Otomatis",
    description:
      "Aplikasi desktop untuk mencari lowongan dan menjalankan alur lamaran sesuai CV dan aturanmu. AI bersifat opsional.",
    images: ["/og"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: {
    google: "XXzpk4vTlrlCqYeTOBa-GI7k59nuJs6P6qhfWCOKKos",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F4F2EC",
};

/* ============================================================
   Structured data (JSON-LD) — WebSite + Organization +
   SoftwareApplication + FAQPage (built from the live FAQ copy)
   ============================================================ */
const faqItems = translations.id.faq.items;

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      name: "ORDAL",
      url: siteUrl,
      description: seoDescription,
      inLanguage: "id",
      publisher: { "@id": `${siteUrl}/#organization` },
    },
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "ORDAL",
      url: siteUrl,
      logo: `${siteUrl}/logo.svg`,
      description:
        "ORDAL membuat aplikasi desktop pencarian kerja otomatis dengan fitur AI opsional.",
      knowsAbout: [
        "cari kerja",
        "lowongan kerja",
        "CV ATS",
        "aplikasi cari kerja otomatis",
        "AI job search agent",
        "auto apply lamaran kerja",
      ],
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${siteUrl}/#app`,
      name: "ORDAL",
      url: siteUrl,
      description: seoDescription,
      image: `${siteUrl}/og`,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Windows 10+, macOS 12+",
      inLanguage: "id",
      featureList: translations.id.pricing.features,
      offers: {
        "@type": "Offer",
        price: "179000",
        priceCurrency: "IDR",
        availability: "https://schema.org/InStock",
        url: `${siteUrl}/#pricing`,
      },
      publisher: { "@id": `${siteUrl}/#organization` },
      subjectOf: siteUrl,
    },
    {
      "@type": "FAQPage",
      "@id": `${siteUrl}/#faq`,
      mainEntity: faqItems.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.a,
        },
      })),
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className="antialiased bg-[#F4F2EC] text-[#33363F] min-h-screen">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <LanguageProvider>
          {children}
          <Toaster position="top-center" richColors />
        </LanguageProvider>
      </body>
    </html>
  );
}
