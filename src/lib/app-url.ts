export function appUrl() {
  const previewHost = process.env.VERCEL_ENV === "preview" && (process.env.VERCEL_BRANCH_URL?.trim() || process.env.VERCEL_URL?.trim());
  return (previewHost ? `https://${previewHost}` : process.env.APP_URL?.trim() || process.env.NEXT_PUBLIC_SITE_URL?.trim() || "").replace(/\/$/, "");
}
