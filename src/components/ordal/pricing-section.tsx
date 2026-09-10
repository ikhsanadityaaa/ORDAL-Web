"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/lib/i18n/context";
import { useAuthStore } from "@/lib/auth-store";
import { Button } from "@/components/ui/button";
import {
  SectionHeader,
  Deco,
  SpinBadge,
  WordReveal,
  stickerButtonPrimary,
} from "@/components/ordal/creative";
import { ArrowRight, Download, KeyRound, Zap } from "lucide-react";
import { WindowsLogo, AppleLogo } from "@/components/ordal/brand-icons";

const spring = { type: "spring", stiffness: 200, damping: 20 } as const;

export function PricingSection() {
  const { t, tArray, language } = useLanguage();
  const { isAuthenticated, openAuthModal, openDownloadModal } = useAuthStore();

  // Payment happens INSIDE the app. On the web: get the app
  // (register first so trial + activation code have somewhere to live).
  const handleGetApp = () => {
    if (isAuthenticated) {
      openDownloadModal();
    } else {
      openAuthModal("register");
    }
  };

  const features = tArray("pricing.features");

  return (
    <section id="pricing" className="relative py-24 md:py-28 bg-[#33363F] overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 grid-pattern-dark opacity-40" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#F2661A]/10 blur-3xl rounded-full" />

      {/* Floating deco symbols */}
      <Deco className="top-28 left-[7%] text-4xl text-[#F2661A]/25" delay={0.5}>✦</Deco>
      <Deco className="bottom-36 right-[8%] text-3xl text-[#F4F2EC]/15" delay={1.3} wiggle>(</Deco>
      <Deco className="top-[52%] left-[4%] text-2xl text-[#F4F2EC]/10 hidden md:block" delay={2}>→</Deco>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        {/* Header */}
        <SectionHeader
          index="10"
          badge={t("pricing.badge")}
          dark
          title={
            <>
              {t("pricing.title")}{" "}
              <mark className="hl-dark">{t("pricing.titleHighlight")}</mark>
            </>
          }
          subtitle={t("pricing.subtitle")}
          className="mb-14 md:mb-16"
        />

        {/* Price card + spinning badge */}
        <div className="relative max-w-xl mx-auto">
          {/* Spin badge — floats left of the card, desktop only */}
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ delay: 0.35, type: "spring", stiffness: 200, damping: 14 }}
            className="hidden lg:block absolute -left-24 -top-12 text-[#F4F2EC]"
          >
            <SpinBadge text={t("hero.spinningText")} />
          </motion.div>

          {/* The one hero price card — sticker on dark */}
          <motion.div
            initial={{ opacity: 0, y: 60, rotate: -4 }}
            whileInView={{ opacity: 1, y: 0, rotate: -1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={spring}
            className="relative"
          >
            <div className="relative bg-[#F4F2EC] text-[#33363F] border-2 border-[#33363F] rounded-3xl shadow-[10px_10px_0_#F2661A] p-6 sm:p-9 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[14px_14px_0_#F2661A]">
              {/* Sticker stamps */}
              <div className="absolute -top-4 -right-3 sm:-right-5 rotate-[6deg] label-chip bg-[#F2661A] text-[#33363F] border-2 border-[#33363F] rounded-full px-3.5 py-1.5 shadow-[3px_3px_0_#33363F] whitespace-nowrap pointer-events-none z-10">
                {t("pricing.noSubSticker")}
              </div>
              <div className="absolute -bottom-4 -left-3 sm:-left-5 rotate-[-4deg] label-chip bg-[#33363F] text-[#F4F2EC] border-2 border-[#33363F] rounded-full px-3.5 py-1.5 shadow-[3px_3px_0_#F2661A] whitespace-nowrap pointer-events-none z-10">
                {t("pricing.oneTimeSticker")}
              </div>

              {/* Trial strip */}
              <div className="flex items-start gap-3 pb-5 border-b-2 border-dashed border-[#33363F]/20">
                <span className="shrink-0 w-8 h-8 rounded-lg bg-[#F2661A] border-2 border-[#33363F] flex items-center justify-center shadow-[2px_2px_0_#33363F]">
                  <Zap className="w-4 h-4 text-white" />
                </span>
                <div>
                  <p className="text-sm font-extrabold text-[#33363F]">
                    {t("pricing.trialTitle")}
                  </p>
                  <p className="mt-0.5 text-xs text-[#33363F]/60 leading-relaxed">
                    {t("pricing.trialDesc")}
                  </p>
                </div>
              </div>

              {/* Price block — IDR & USD side by side (compact) */}
              <div className="py-6 sm:py-7">
                <div className="grid grid-cols-[1fr_auto_1fr] items-stretch">
                  {/* IDR price */}
                  <div className="flex min-w-0 flex-col items-center justify-center px-1 text-center">
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#33363F]/55">
                      {t("pricing.priceIDNote")}
                    </p>
                    <p className="num-display mt-1.5 font-black text-[26px] leading-none tracking-tight text-[#33363F] sm:text-4xl md:text-[2.5rem]">
                      {t("pricing.priceID")}
                    </p>
                    <p className="mt-2 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#F2661A]">
                      {language === "id" ? "sekali bayar" : "one-time"}
                    </p>
                    <p className="mt-1.5 text-[10px] font-semibold leading-snug text-[#33363F]/55">
                      GoPay • QRIS • Transfer • Card
                    </p>
                  </div>
                  {/* Divider — vertical dashed with "atau" chip */}
                  <div className="mx-1.5 flex flex-col items-center sm:mx-4">
                    <div className="w-0 flex-1 border-l-2 border-dashed border-[#33363F]/20" />
                    <span className="my-1.5 text-[9px] font-extrabold uppercase tracking-[0.12em] text-[#33363F]/50">
                      {language === "id" ? "atau" : "or"}
                    </span>
                    <div className="w-0 flex-1 border-l-2 border-dashed border-[#33363F]/20" />
                  </div>

                  {/* USD price */}
                  <div className="flex min-w-0 flex-col items-center justify-center px-1 text-center">
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#33363F]/55">
                      {t("pricing.priceIntlNote")}
                    </p>
                    <p className="num-display mt-1.5 font-black text-[26px] leading-none tracking-tight text-[#33363F] sm:text-4xl md:text-[2.5rem]">
                      {t("pricing.priceIntl")}
                    </p>
                    <p className="mt-2 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#F2661A]">
                      {language === "id" ? "sekali bayar" : "one-time"}
                    </p>
                    <p className="mt-1.5 text-[10px] font-semibold leading-snug text-[#33363F]/55">
                      PayPal
                    </p>
                  </div>
                </div>
              </div>

              {/* Activation code strip — payment happens inside the app */}
              <div className="flex items-start gap-3 -mt-1 mb-1 p-3.5 rounded-2xl bg-[#173E76]/[0.04] border border-[#173E76]/15">
                <span className="shrink-0 w-8 h-8 rounded-lg bg-[#173E76] flex items-center justify-center">
                  <KeyRound className="w-4 h-4 text-white" />
                </span>
                <div>
                  <p className="text-[13px] font-extrabold text-[#33363F]">
                    {t("pricing.activationTitle")}
                  </p>
                  <p className="mt-0.5 text-xs text-[#33363F]/60 leading-relaxed">
                    {t("pricing.activationDesc")}
                  </p>
                </div>
              </div>

              {/* Features */}
              <div className="grid sm:grid-cols-2 gap-x-6 gap-y-3 pt-6 border-t-2 border-dashed border-[#33363F]/20">
                {features.map((feature, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ delay: 0.3 + i * 0.06, duration: 0.4 }}
                    className="flex items-start gap-2.5"
                  >
                    <span className="shrink-0 text-[#F2661A] font-black text-sm leading-5">
                      ✓
                    </span>
                    <span className="text-sm font-semibold text-[#33363F]/70 leading-5">
                      {feature}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* CTA row */}
              <div className="mt-7 space-y-4">
                <Button
                  onClick={handleGetApp}
                  size="lg"
                  className={`group w-full h-14 px-6 text-base ${stickerButtonPrimary}`}
                >
                  <Download className="h-5 w-5 transition-transform duration-200 group-hover:translate-y-0.5" />
                  {t("pricing.ctaDownload")}
                  <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
                </Button>
                <div className="text-center">
                  <button
                    onClick={handleGetApp}
                    className="link-sweep text-sm font-bold text-[#33363F]/70 hover:text-[#F2661A] transition-colors"
                  >
                    {t("pricing.ctaTrial")} →
                  </button>
                </div>
                <div className="flex items-center justify-center gap-4 text-[10px] font-bold uppercase tracking-wider text-[#33363F]/45">
                  <span className="inline-flex items-center gap-1.5">
                    <WindowsLogo className="w-3 h-3" />
                    Windows
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <AppleLogo className="w-3 h-3" />
                    macOS
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Guarantee — the big scroll-linked statement */}
        <div className="mt-16 md:mt-20 max-w-3xl mx-auto text-center">
          <WordReveal
            dark
            text={t("pricing.guarantee")}
            className="text-2xl md:text-3xl font-extrabold tracking-tight leading-snug"
          />
        </div>
      </div>
    </section>
  );
}
