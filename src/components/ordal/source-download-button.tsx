"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Download, FileArchive } from "lucide-react";

/* ============================================================
   Dev-only helper: floating button to download the project
   source zip (public/ordal-web-source.zip).

   It NEVER renders in production builds — Next.js inlines
   process.env.NODE_ENV at build time, so on Vercel this
   component renders nothing. In the dev preview it gives the
   project owner a one-click way to grab the latest source.
   ============================================================ */

const ZIP_URL = "/ordal-web-source.zip";

export function SourceDownloadButton() {
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">(
    "idle"
  );

  // Hidden in production builds — dev preview only.
  if (process.env.NODE_ENV !== "development") return null;

  const handleClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Native navigation is a valid fallback — only intercept when JS works.
    e.preventDefault();
    if (state === "busy") return;
    setState("busy");

    try {
      // Fetch as a blob and trigger a named download — the most
      // iframe/browser-compatible way to force a real file download.
      const res = await fetch(ZIP_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const blob = await res.blob();

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "ordal-web-source.zip";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      setState("done");
      setTimeout(() => setState("idle"), 3000);
    } catch {
      // Blob path failed (e.g. sandboxed iframe) — fall back to
      // opening the static file directly, which browsers download.
      window.open(ZIP_URL, "_blank");
      setState("error");
      setTimeout(() => setState("idle"), 3000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0, y: 24 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 1.2, type: "spring", stiffness: 260, damping: 18 }}
      className="fixed bottom-5 left-5 sm:bottom-6 sm:left-6 z-[70] group"
    >
      {/* Hover tooltip — slides in from the right of the button */}
      <span className="pointer-events-none hidden sm:flex absolute left-full top-1/2 -translate-y-1/2 ml-3.5 whitespace-nowrap items-center gap-1.5 rounded-xl border-2 border-[#33363F] bg-white px-3.5 py-2 text-xs font-bold text-[#33363F] shadow-[3px_3px_0_#33363F] opacity-0 -translate-x-3 scale-95 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0 group-hover:scale-100">
        Download source code (dev only)
        <span aria-hidden className="text-[#F2661A]">
          ⬇
        </span>
        <span
          aria-hidden
          className="absolute right-full top-1/2 -translate-y-1/2 w-2 h-2 rotate-45 border-r-2 border-b-2 border-[#33363F] bg-white"
        />
      </span>

      <a
        href={ZIP_URL}
        download="ordal-web-source.zip"
        onClick={handleClick}
        aria-label="Download project source zip"
        className={`
          relative flex items-center gap-2 h-14 px-4 rounded-2xl
          bg-[#F2661A] text-white border-2 border-[#33363F]
          shadow-[4px_4px_0_#33363F]
          font-extrabold text-sm tracking-tight
          transition-all duration-200 cursor-pointer
          hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_#33363F]
          active:translate-x-0 active:translate-y-0 active:shadow-none
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#173E76] focus-visible:ring-offset-2
        `}
      >
        {state === "done" ? (
          <Check className="w-5 h-5 shrink-0" strokeWidth={2.75} />
        ) : state === "error" ? (
          <FileArchive className="w-5 h-5 shrink-0" strokeWidth={2.5} />
        ) : (
          <Download className="w-5 h-5 shrink-0" strokeWidth={2.5} />
        )}
        <span className="hidden xs:inline sm:inline">
          {state === "busy"
            ? "Downloading…"
            : state === "done"
              ? "Saved!"
              : state === "error"
                ? "Opened in tab"
                : "Source ZIP"}
        </span>
        <span className="sm:hidden">
          {state === "busy" ? "…" : state === "done" ? "✓" : "ZIP"}
        </span>
      </a>
    </motion.div>
  );
}
