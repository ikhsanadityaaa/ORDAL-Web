"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/lib/i18n/context";
import { useAuthStore } from "@/lib/auth-store";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Mail, Chrome, Loader2, Eye, EyeOff, Zap } from "lucide-react";

export function AuthModal() {
  const { t, language } = useLanguage();
  const {
    isAuthModalOpen,
    authModalMode,
    closeAuthModal,
    openAuthModal,
    setUser,
    setLoading,
    isLoading,
  } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const isLogin = authModalMode === "login";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
      const body = isLogin
        ? { email, password }
        : { email, password, name: name || email.split("@")[0] };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user, data.trial, data.access);
        closeAuthModal();
        toast.success(
          isLogin
            ? language === "id"
              ? "Berhasil masuk!"
              : "Signed in successfully!"
            : language === "id"
            ? "Akun dibuat! Trial 1 hari dimulai."
            : "Account created! 1-day trial started."
        );
        // Reset form
        setEmail("");
        setPassword("");
        setName("");
      } else {
        toast.error(data.error || "Authentication failed");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Simulate Google OAuth - in production, this would redirect
    toast.info(
      language === "id"
        ? "Google Login akan tersedia di versi final."
        : "Google Login will be available in the final version."
    );
  };

  return (
    <Dialog open={isAuthModalOpen} onOpenChange={closeAuthModal}>
      <DialogContent
        aria-describedby={undefined}
        className="sm:max-w-md bg-[#F4F2EC] p-0 overflow-hidden border-2 border-[#33363F] rounded-3xl shadow-[8px_8px_0_#33363F]"
      >
        {/* Header with gradient */}
        <div className="relative bg-[#33363F] p-6 pb-8 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#F2661A]" />
          <span aria-hidden className="absolute top-5 right-6 text-2xl text-[#F2661A]/50 animate-float select-none">✦</span>
          <span aria-hidden className="absolute bottom-3 right-16 text-lg text-[#F4F2EC]/20 animate-wiggle select-none">✳</span>

          <DialogHeader className="relative">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-9 h-9 rounded-lg bg-[#F2661A] border-2 border-[#F4F2EC]/30 flex items-center justify-center">
                <span className="text-white font-extrabold text-sm leading-none">O</span>
              </div>
              <span className="text-lg font-extrabold tracking-tight text-white">ORDAL</span>
            </div>
            <DialogTitle className="h-tight text-2xl text-white">
              {isLogin ? t("auth.loginTitle") : t("auth.registerTitle")}
            </DialogTitle>
            <p className="text-sm text-white/50">
              {isLogin ? t("auth.loginSubtitle") : t("auth.registerSubtitle")}
            </p>
          </DialogHeader>
        </div>

        {/* Form content */}
        <div className="p-6">
          {/* Google button */}
          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleLogin}
            className="w-full h-12 border-2 border-[#33363F] bg-white rounded-xl shadow-[3px_3px_0_#33363F] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0_#33363F] active:translate-x-[1px] active:translate-y-[1px] transition-all font-bold mb-4"
          >
            <Chrome className="w-5 h-5 mr-2 text-[#33363F]" />
            {t("auth.google")}
          </Button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-[#33363F]/10" />
            <span className="text-xs text-[#33363F]/60 font-medium">
              {t("auth.or")}
            </span>
            <div className="flex-1 h-px bg-[#33363F]/10" />
          </div>

          {/* Email form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  key="name"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <Label htmlFor="name" className="text-sm font-medium text-[#33363F]">
                    {t("auth.name")}
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Aditya Pratama"
                    className="h-11 rounded-xl border-[#33363F]/10 bg-white focus:border-[#F2661A]"
                    required={!isLogin}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-[#33363F]">
                {t("auth.emailLabel")}
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="h-11 rounded-xl border-[#33363F]/10 bg-white focus:border-[#F2661A]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-[#33363F]">
                {t("auth.password")}
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-11 rounded-xl border-[#33363F]/10 bg-white focus:border-[#F2661A] pr-10"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#33363F]/60 hover:text-[#33363F]/60"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-[#F2661A] hover:bg-[#D65511] text-white font-extrabold rounded-xl border-2 border-[#33363F] shadow-[3px_3px_0_#33363F] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0_#33363F] active:translate-x-[1px] active:translate-y-[1px] transition-all"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t("common.loading")}
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4 mr-2" />
                  {isLogin ? t("auth.login") : t("auth.register")}
                </>
              )}
            </Button>
          </form>

          {/* Trial note for register */}
          {!isLogin && (
            <div className="mt-4 p-3 rounded-xl bg-[#F2661A]/5 border border-[#F2661A]/20 flex items-start gap-2">
              <Zap className="w-4 h-4 text-[#F2661A] shrink-0 mt-0.5" />
              <p className="text-xs text-[#33363F]/70">{t("auth.trialNote")}</p>
            </div>
          )}

          {/* Switch mode */}
          <div className="mt-6 text-center">
            <span className="text-sm text-[#33363F]/60">
              {isLogin ? t("auth.noAccount") : t("auth.haveAccount")}
            </span>
            <button
              type="button"
              onClick={() => openAuthModal(isLogin ? "register" : "login")}
              className="ml-1 text-sm font-semibold text-[#F2661A] hover:text-[#D65511]"
            >
              {isLogin ? t("auth.register") : t("auth.login")}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
