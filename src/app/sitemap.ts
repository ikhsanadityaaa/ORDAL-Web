import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

const siteUrl = SITE_URL;

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      lastModified: new Date("2026-10-01"),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/panduan`,
      lastModified: new Date("2026-10-01"),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/panduan/cari-kerja-otomatis`,
      lastModified: new Date("2026-10-01"),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    ...["ai-untuk-cari-kerja", "cv-ats-friendly", "auto-apply-lowongan"].map((slug) => ({
      url: `${siteUrl}/panduan/${slug}`,
      lastModified: new Date("2026-10-01"),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    {
      url: `${siteUrl}/tentang-ordal`,
      lastModified: new Date("2026-10-01"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
