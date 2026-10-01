import { SITE_URL } from "@/lib/site";

export function appUrl() {
  const previewHost = process.env.VERCEL_ENV === "preview" && (process.env.VERCEL_BRANCH_URL?.trim() || process.env.VERCEL_URL?.trim());
  if (previewHost) return `https://${previewHost}`.replace(/\/$/, "");
  if (process.env.VERCEL_ENV === "production") return SITE_URL;
  return (process.env.APP_URL?.trim() || process.env.NEXT_PUBLIC_SITE_URL?.trim() || "").replace(/\/$/, "");
}
