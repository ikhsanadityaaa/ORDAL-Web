"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/lib/i18n/context";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowUp, ArrowUpRight } from "lucide-react";
import { stickerButtonDark } from "@/components/ordal/creative";

export function Footer() {
  const { t, language } = useLanguage();
  const footerLinks = {
    product: [
      { label: language === "id" ? "Fitur" : "Features", href: "#features" },
      { label: language === "id" ? "Cara Kerja" : "How It Works", href: "#how-it-works" },
      { label: language === "id" ? "Harga" : "Pricing", href: "#pricing" },
      { label: "FAQ", href: "#faq" },
    ],
    support: [
      { label: language === "id" ? "Bantuan" : "Help", href: "#faq" },
      { label: language === "id" ? "Syarat" : "Terms", href: "#" },
      { label: language === "id" ? "Privasi" : "Privacy", href: "#" },
    ],
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-[#33363F] text-[#F4F2EC] overflow-hidden">
      {/* CTA block */}
      <div className="relative pt-20 pb-14 border-b-2 border-[#F4F2EC]/10">
        <div className="absolute inset-0 grid-pattern-dark opacity-25" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[220px] bg-[#F2661A]/15 blur-3xl" />

        {/* deco */}
        <span aria-hidden className="absolute top-16 left-[8%] text-4xl text-[#F2661A]/30 animate-float select-none">✦</span>
        <span aria-hidden className="absolute bottom-16 right-[10%] text-3xl text-[#F4F2EC]/15 animate-wiggle select-none">✳</span>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16, rotate: 0 }}
            whileInView={{ opacity: 1, y: 0, rotate: -2 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ type: "spring", stiffness: 240, damping: 18 }}
            className="inline-flex items-center gap-2.5 chip-sticker-dark mb-7"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#F2661A]" />
            <span className="label-chip !text-[10px]">AI JOB SEARCH AGENT</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="h-display text-4xl sm:text-5xl md:text-6xl text-[#F4F2EC]"
          >
            {language === "id" ? (
              <>
                Kerjaan kamu sekarang:
                <span className="block text-[#F2661A]">
                  <mark className="hl-dark">nunggu panggilan.</mark>
                </span>
              </>
            ) : (
              <>
                Your only job now:
                <span className="block text-[#F2661A]">
                  <mark className="hl-dark">waiting for callbacks.</mark>
                </span>
              </>
            )}
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: 0.15, duration: 0.55 }}
            className="mt-9 flex justify-center"
          >
            <Button asChild size="lg" className="h-14 px-8 text-base !rounded-2xl bg-[#F2661A] text-white border-2 border-[#F4F2EC] shadow-[5px_5px_0_rgba(244,242,236,0.9)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0_rgba(244,242,236,0.9)] transition-all font-bold">
              <Link href="/download">{language === "id" ? "Download Gratis" : "Download for Free"} <ArrowUpRight className="ml-2 h-5 w-5" /></Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-7 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm font-semibold"
          >
            <span className="inline-flex items-center gap-1.5 text-[#F4F2EC]/70">
              <CheckCircle2 className="w-4 h-4 text-[#F4F2EC]" />
              {t("hero.trialInfo")}
            </span>
            <span className="text-[#F2661A]">✦</span>
            <span className="inline-flex items-center gap-1.5 text-[#F4F2EC]">
              <CheckCircle2 className="w-4 h-4 text-[#F2661A]" />
              <span className="font-extrabold">{t("hero.pricingInfo")}</span>
            </span>
          </motion.div>
        </div>
      </div>

      {/* Links + giant wordmark */}
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div className="sm:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#F2661A] border-2 border-[#F4F2EC] flex items-center justify-center">
                <span className="text-white font-extrabold text-sm leading-none">O</span>
              </div>
              <span className="text-lg font-extrabold tracking-tight text-[#F4F2EC]">
                ORDAL
              </span>
            </div>
            <p className="text-sm font-bold text-[#F2661A] mb-2">{t("footer.tagline")}</p>
            <p className="text-sm text-[#F4F2EC]/70 max-w-sm leading-relaxed">
              {t("footer.description")}
            </p>
          </div>

          {[
            { title: t("footer.product"), links: footerLinks.product },
            { title: t("footer.support"), links: footerLinks.support },
          ].map((group) => (
            <div key={group.title}>
              <p className="label-chip text-[#F4F2EC]/90 mb-4">{group.title}</p>
              <div className="space-y-2.5">
                {group.links.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="group inline-flex items-center gap-1 text-sm font-semibold text-[#F4F2EC]/70 hover:text-[#F2661A] transition-colors"
                  >
                    {link.label}
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="py-6 border-t border-[#F4F2EC]/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs font-medium text-[#F4F2EC]/55">{t("footer.copyright")}</p>
          <p className="text-xs font-semibold text-[#F4F2EC]/70">
            ✦ {t("footer.madeWith")} ✦
          </p>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-xs font-bold text-[#F4F2EC]/70 hover:text-[#F2661A] transition-colors"
          >
            <ArrowUp className="w-3.5 h-3.5" />
            {t("common.backToTop")}
          </button>
        </div>
      </div>

      {/* Giant clipped wordmark */}
      <div aria-hidden className="relative select-none pointer-events-none">
        <motion.p
          initial={{ y: 60, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="h-display text-outline-cream text-center text-[24vw] leading-[0.78] tracking-[-0.05em] translate-y-[12%]"
        >
          ORDAL
        </motion.p>
      </div>
    </footer>
  );
}
