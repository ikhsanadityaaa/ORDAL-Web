"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/i18n/context";
import { useAuthStore } from "@/lib/auth-store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Download, CheckCircle2, KeyRound } from "lucide-react";
import { WindowsLogo, AppleLogo } from "@/components/ordal/brand-icons";

export function DownloadModal() {
  const { t, language } = useLanguage();
  const {
    isDownloadModalOpen,
    closeDownloadModal,
    user,
    trial,
    openAuthModal,
  } = useAuthStore();

  const [detectedOS, setDetectedOS] = useState<"windows" | "macos" | "unknown">(
    () => {
      if (typeof window === "undefined") return "unknown";
      const platform = navigator.platform.toLowerCase();
      if (platform.includes("mac")) return "macos";
      if (platform.includes("win")) return "windows";
      return "unknown";
    }
  );
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async (platform: "windows" | "macos") => {
    // Track download if user is logged in
    if (user) {
      try {
        await fetch("/api/download/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ platform }),
        });
      } catch {
        // Silent fail
      }
    }

    setIsDownloading(true);

    // Simulate download
    toast.success(
      language === "id"
        ? `Download ORDAL untuk ${
            platform === "windows" ? "Windows" : "macOS"
          } dimulai!`
        : `ORDAL for ${platform === "windows" ? "Windows" : "macOS"} download started!`
    );

    setTimeout(() => {
      setIsDownloading(false);
      closeDownloadModal();
    }, 1500);
  };

  const trialActive = !!user && trial?.status === "active";

  return (
    <Dialog open={isDownloadModalOpen} onOpenChange={closeDownloadModal}>
      <DialogContent aria-describedby={undefined} className="sm:max-w-md bg-[#F4F2EC] p-0 overflow-hidden border-2 border-[#33363F] rounded-3xl shadow-[8px_8px_0_#33363F]">
        {/* Header */}
        <div className="relative bg-[#33363F] p-6 pb-8 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#F2661A] via-[#FF8A4C] to-[#F2661A]" />
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#F2661A]/20 rounded-full blur-2xl" />

          <DialogHeader className="relative">
            <DialogTitle className="h-tight text-2xl text-white">
              {t("download.title")}
            </DialogTitle>
            <p className="text-sm text-white/50">{t("download.subtitle")}</p>
          </DialogHeader>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* OS Detection */}
          {detectedOS !== "unknown" && (
            <div className="p-3 rounded-xl bg-[#173E76]/5 border border-[#173E76]/20 text-center">
              <p className="text-xs text-[#33363F]/60">
                {t("download.detectOS")}{" "}
                <span className="font-bold text-[#173E76]">
                  {detectedOS === "windows" ? "Windows" : "macOS"}
                </span>
              </p>
            </div>
          )}

          {/* Download buttons */}
          <div className="space-y-3">
            {/* Windows */}
            <button
              onClick={() => handleDownload("windows")}
              disabled={isDownloading}
              className={`w-full p-5 rounded-2xl border-2 transition-all group text-left ${
                detectedOS === "windows"
                  ? "bg-[#F2661A]/5 border-[#F2661A] shadow-lg shadow-[#F2661A]/10"
                  : "bg-white border-[#33363F]/8 hover:border-[#F2661A]/50"
              } disabled:opacity-50`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                    detectedOS === "windows"
                      ? "bg-[#F2661A]"
                      : "bg-[#33363F]/5 group-hover:bg-[#F2661A]/10"
                  }`}
                >
                  <WindowsLogo
                    className={`w-6 h-6 ${
                      detectedOS === "windows" ? "text-white" : "text-[#33363F]"
                    }`}
                  />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-[#33363F]">
                    {t("download.windows")}
                  </p>
                  <p className="text-xs text-[#33363F]/60 mt-0.5">
                    {t("download.windowsNote")}
                  </p>
                </div>
                <Download className="w-5 h-5 text-[#33363F]/30 group-hover:text-[#F2661A] transition-colors" />
              </div>
            </button>

            {/* macOS */}
            <button
              onClick={() => handleDownload("macos")}
              disabled={isDownloading}
              className={`w-full p-5 rounded-2xl border-2 transition-all group text-left ${
                detectedOS === "macos"
                  ? "bg-[#F2661A]/5 border-[#F2661A] shadow-lg shadow-[#F2661A]/10"
                  : "bg-white border-[#33363F]/8 hover:border-[#F2661A]/50"
              } disabled:opacity-50`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                    detectedOS === "macos"
                      ? "bg-[#F2661A]"
                      : "bg-[#33363F]/5 group-hover:bg-[#F2661A]/10"
                  }`}
                >
                  <AppleLogo
                    className={`w-6 h-6 ${
                      detectedOS === "macos" ? "text-white" : "text-[#33363F]"
                    }`}
                  />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-[#33363F]">
                    {t("download.mac")}
                  </p>
                  <p className="text-xs text-[#33363F]/60 mt-0.5">
                    {t("download.macNote")}
                  </p>
                </div>
                <Download className="w-5 h-5 text-[#33363F]/30 group-hover:text-[#F2661A] transition-colors" />
              </div>
            </button>
          </div>

          {/* Version info */}
          <div className="flex items-center justify-center gap-2 text-xs text-[#33363F]/60">
            <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
            {t("download.version")}: v1.0.0
          </div>

          {/* Access status notice */}
          {!user && (
            <div className="p-3 rounded-xl bg-[#F2661A]/5 border border-[#F2661A]/20">
              <p className="text-xs text-[#33363F]/70 mb-2">
                {t("download.needAccount")}
              </p>
              <Button
                onClick={() => {
                  closeDownloadModal();
                  openAuthModal("register");
                }}
                size="sm"
                className="w-full h-11 bg-[#F2661A] hover:bg-[#D65511] text-white font-extrabold rounded-xl border-2 border-[#33363F] shadow-[3px_3px_0_#33363F] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0_#33363F] active:translate-x-[1px] active:translate-y-[1px] transition-all"
              >
                {language === "id" ? "Buat Akun Gratis" : "Create Free Account"}
              </Button>
            </div>
          )}

          {user && !trialActive && (
            <div className="p-3 rounded-xl bg-[#173E76]/5 border border-[#173E76]/20">
              <div className="flex items-start gap-2.5">
                <KeyRound className="w-4 h-4 text-[#173E76] shrink-0 mt-0.5" />
                <p className="text-xs text-[#33363F]/70 leading-relaxed">
                  {t("download.trialEndedNote")}
                </p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
