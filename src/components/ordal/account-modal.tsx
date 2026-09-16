"use client";

import { useEffect, useState } from "react";
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
import {
  KeyRound,
  Clock,
  Calendar,
  Download,
  LogOut,
  CheckCircle2,
  Zap,
  Copy,
} from "lucide-react";

export function AccountModal() {
  const { t, language } = useLanguage();
  const {
    isAccountModalOpen,
    closeAccountModal,
    user,
    trial,
    logout,
    openDownloadModal,
  } = useAuthStore();

  const [timeRemaining, setTimeRemaining] = useState<string>("");
  const [copied, setCopied] = useState(false);

  // Calculate trial time remaining
  useEffect(() => {
    if (trial?.status === "active") {
      const interval = setInterval(() => {
        const remaining = Math.max(
          0,
          new Date(trial.expiresAt).getTime() - Date.now()
        );
        const hours = Math.floor(remaining / (1000 * 60 * 60));
        const minutes = Math.floor(
          (remaining % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
        setTimeRemaining(
          `${hours}h ${minutes.toString().padStart(2, "0")}m ${seconds
            .toString()
            .padStart(2, "0")}s`
        );
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [trial]);

  const hasActivationCode = !!user?.activationCode;

  const handleCopy = async () => {
    if (!user?.activationCode) return;
    try {
      await navigator.clipboard.writeText(user.activationCode);
      setCopied(true);
      toast.success(
        language === "id"
          ? "Activation code dikopi!"
          : "Activation code copied!"
      );
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error(language === "id" ? "Gagal ngopi kode" : "Failed to copy");
    }
  };

  return (
    <Dialog open={isAccountModalOpen} onOpenChange={closeAccountModal}>
      <DialogContent aria-describedby={undefined} className="sm:max-w-md bg-[#F4F2EC] p-0 overflow-hidden max-h-[90vh] border-2 border-[#33363F] rounded-3xl shadow-[8px_8px_0_#33363F]">
        {/* Header */}
        <div className="relative bg-[#33363F] p-6 pb-8 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#F2661A] via-[#FF8A4C] to-[#F2661A]" />
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#F2661A]/20 rounded-full blur-2xl" />

          <DialogHeader className="relative">
            <DialogTitle className="h-tight text-2xl text-white flex items-center gap-2">
              {language === "id" ? "Akun Saya" : "My Account"}
            </DialogTitle>
          </DialogHeader>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          {/* User info */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-[#33363F]/8">
            <div className="w-12 h-12 rounded-full bg-[#F2661A] flex items-center justify-center shrink-0">
              <span className="text-white text-lg font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-[#33363F] truncate">
                {language === "id" ? "Hai" : "Hi"}, {user?.name} 👋
              </p>
              <p className="text-xs text-[#33363F]/60 truncate">{user?.email}</p>
              <p className="text-[10px] text-[#33363F]/30 font-mono mt-0.5">
                {user?.uniqueUserCode}
              </p>
            </div>
          </div>

          {/* Activation code (issued when the user pays inside the app) */}
          {hasActivationCode ? (
            <div className="p-4 rounded-2xl bg-green-50 border border-green-200">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <p className="font-bold text-green-800">
                  {language === "id"
                    ? "ORDAL Aktif Selamanya"
                    : "ORDAL Active Forever"}
                </p>
              </div>

              <div className="flex items-center justify-between gap-2 p-3 rounded-xl bg-white border-2 border-dashed border-green-300">
                <div className="min-w-0">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-green-700/70">
                    {t("account.activationCodeLabel")}
                  </p>
                  <p className="font-mono text-sm font-bold text-[#33363F] truncate">
                    {user?.activationCode}
                  </p>
                </div>
                <button
                  onClick={handleCopy}
                  aria-label={t("account.copyCode")}
                  className="shrink-0 w-9 h-9 rounded-lg bg-green-600 hover:bg-green-700 text-white flex items-center justify-center transition-colors"
                >
                  {copied ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>

              <p className="mt-2.5 text-[11px] text-green-800/70 leading-relaxed">
                {t("account.activationCodeNote")}
              </p>
            </div>
          ) : (
            <>
              {/* Trial status */}
              {trial && (
                <div
                  className={`p-4 rounded-2xl border ${
                    trial.status === "active"
                      ? "bg-[#F2661A]/5 border-[#F2661A]/20"
                      : "bg-gray-100 border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-3">
                    {trial.status === "active" ? (
                      <Zap className="w-5 h-5 text-[#F2661A]" />
                    ) : (
                      <Clock className="w-5 h-5 text-gray-500" />
                    )}
                    <p className="font-bold text-[#33363F]">
                      {trial.status === "active"
                        ? language === "id"
                          ? "Free Trial Aktif"
                          : "Free Trial Active"
                        : language === "id"
                        ? "Trial Berakhir"
                        : "Trial Expired"}
                    </p>
                  </div>

                  {trial.status === "active" ? (
                    <>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-[#33363F]/60">
                          {language === "id" ? "Sisa Waktu" : "Time Remaining"}
                        </span>
                        <span className="font-mono font-bold text-[#F2661A] text-lg">
                          {timeRemaining}
                        </span>
                      </div>
                      {/* Progress bar */}
                      <div className="h-2 bg-[#33363F]/5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#F2661A] to-[#FF8A4C] rounded-full transition-all"
                          style={{
                            width: `${Math.max(
                              0,
                              Math.min(
                                100,
                                ((new Date(trial.expiresAt).getTime() - Date.now()) /
                                  (3 * 24 * 60 * 60 * 1000)) *
                                  100
                              )
                            )}%`,
                          }}
                        />
                      </div>
                    </>
                  ) : (
                    <p className="text-sm text-[#33363F]/60">
                      {language === "id"
                        ? "Trial 3 hari kamu sudah berakhir."
                        : "Your 3-day trial has ended."}
                    </p>
                  )}
                </div>
              )}

              {/* No activation code yet — explain the in-app payment flow */}
              <div className="p-4 rounded-2xl bg-[#173E76]/5 border border-[#173E76]/20">
                <div className="flex items-center gap-2 mb-2.5">
                  <KeyRound className="w-5 h-5 text-[#173E76]" />
                  <p className="font-bold text-[#33363F]">
                    {t("account.noCodeTitle")}
                  </p>
                </div>
                <p className="text-xs text-[#33363F]/70 leading-relaxed">
                  {t("account.noCodeNote")}
                </p>
              </div>
            </>
          )}

          {/* Actions */}
          <div className="space-y-2">
            <Button
              onClick={() => {
                closeAccountModal();
                openDownloadModal();
              }}
              className="w-full h-12 bg-[#F2661A] hover:bg-[#D65511] text-white font-semibold rounded-xl"
            >
              <Download className="w-4 h-4 mr-2" />
              {language === "id" ? "Download Gratis" : "Download Free"}
            </Button>

            <button
              onClick={() => {
                logout();
                closeAccountModal();
              }}
              className="w-full flex items-center justify-center gap-2 h-10 text-sm text-[#33363F]/60 hover:text-red-600 transition-colors rounded-xl hover:bg-red-50"
            >
              <LogOut className="w-4 h-4" />
              {language === "id" ? "Keluar" : "Sign Out"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
