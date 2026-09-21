import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n/context";
import { Toaster } from "@/components/ui/sonner";
import { translations } from "@/lib/i18n/translations";

// Apple-style typography: Inter is the closest free sibling of SF Pro.
// Variable font = all weights 100–900 for expressive display type.
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ordal.app";

/* ============================================================
   SEO — tuned for job seekers (Indonesia-first, EN secondary)
   ============================================================ */
const seoTitle = "ORDAL";
const seoDescription =
  "Aplikasi AI buat pencari kerja: nyari lowongan, cek kecocokan, dan apply lamaran otomatis sesuai CV & target kamu. Trial gratis 3 hari, bayar sekali. Windows & macOS.";

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
    title: "ORDAL — AI Job Search Agent. Biar ORDAL cariin buat kamu.",
    description:
      "Aplikasi AI yang nyari lowongan, cek kecocokan, dan apply lamaran otomatis sesuai CV & target kamu. Sekali bayar, gratis selamanya. Windows & macOS.",
    locale: "id_ID",
    images: [
      {
        url: "/og",
        width: 1200,
        height: 630,
        alt: "ORDAL — AI Job Search Agent untuk cari kerja otomatis",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ORDAL — AI Job Search Agent",
    description:
      "Aplikasi AI yang nyari lowongan & apply lamaran otomatis sesuai CV kamu. Sekali bayar, gratis selamanya.",
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
        "ORDAL membuat AI Job Search Agent, aplikasi desktop yang membantu pencari kerja mencari dan melamar pekerjaan secara otomatis.",
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
        price: "149000",
        priceCurrency: "IDR",
        availability: "https://schema.org/InStock",
        url: `${siteUrl}/#pricing`,
      },
      publisher: { "@id": `${siteUrl}/#organization` },
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
      <body
        className={`${inter.variable} antialiased bg-[#F4F2EC] text-[#33363F] min-h-screen`}
      >
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
