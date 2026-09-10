"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/lib/i18n/context";
import { Deco, SectionHeader } from "@/components/ordal/creative";
import { Filter, Search, Send, Settings2, Target, Upload } from "lucide-react";

const viewport = { once: true, margin: "-80px" } as const;
const spring = { type: "spring", stiffness: 210, damping: 18 } as const;

export function HowItWorksSection() {
  const { t, tArray, language } = useLanguage();

  const steps = [
    { icon: Upload, title: t("how.steps.uploadTitle"), desc: t("how.steps.uploadDesc") },
    { icon: Target, title: t("how.steps.targetTitle"), desc: t("how.steps.targetDesc") },
    {
      icon: Settings2,
      title: t("how.steps.preferencesTitle"),
      desc: t("how.steps.preferencesDesc"),
    },
    { icon: Search, title: t("how.steps.searchTitle"), desc: t("how.steps.searchDesc") },
    { icon: Filter, title: t("how.steps.analyzeTitle"), desc: t("how.steps.analyzeDesc") },
    { icon: Send, title: t("how.steps.applyTitle"), desc: t("how.steps.applyDesc") },
  ];

  // Mini sticker chips reuse the marquee copy
  const chips = tArray("marquee.items").slice(0, 3);

  // Highlight the payoff phrase in the title
  const keyPhrase = language === "id" ? "lamaran kekirim" : "application sent";
  const [titleBefore, titleAfter] = t("how.title").split(keyPhrase);
  const title =
    titleAfter !== undefined ? (
      <>
        {titleBefore}
        <mark className="hl">{keyPhrase}</mark>
        {titleAfter}
      </>
    ) : (
      t("how.title")
    );

  return (
    <section
      id="how-it-works"
      className="relative py-24 md:py-28 bg-[#F4F2EC] overflow-hidden"
    >
      {/* Dot texture */}
      <div className="absolute inset-0 dot-pattern pointer-events-none" aria-hidden />

      {/* Deco symbols */}
      <Deco className="top-24 right-[9%] text-4xl text-[#F2661A]/30" delay={0.5}>
        ✦
      </Deco>
      <Deco className="top-[55%] right-[5%] text-3xl text-[#F2661A]/25" delay={0.9} wiggle>
        (
      </Deco>
      <Deco className="bottom-32 left-[6%] text-3xl text-[#173E76]/25" delay={1.3} wiggle>
        ✳
      </Deco>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <SectionHeader
          index="03"
          badge={t("how.badge")}
          title={title}
          subtitle={t("how.subtitle")}
          className="mb-14 md:mb-16"
        />

        {/* Steps — wide sticker cards alternating left/right, dashed arrows between */}
        <div className="max-w-3xl mx-auto">
          {steps.map((step, i) => {
            const rotate = i % 2 === 0 ? -1.2 : 1.2;
            const isLast = i === steps.length - 1;
            const iconOrange = i % 2 === 0;
            return (
              <div key={i}>
                <motion.div
                  initial={{ opacity: 0, y: 36, rotate: rotate * 2 }}
                  whileInView={{ opacity: 1, y: 0, rotate }}
                  whileHover={{ rotate: 0 }}
                  viewport={viewport}
                  transition={{ ...spring }}
                  className={`relative ${i % 2 === 0 ? "lg:mr-[9%]" : "lg:ml-[9%]"}`}
                >
                  <div className="sticker relative p-5 sm:p-6">
                    {/* Ghost step number — huge, outlined, corner */}
                    <span
                      aria-hidden
                      className="absolute -top-3 right-3 text-6xl sm:text-7xl font-black num-display text-outline leading-none select-none pointer-events-none"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    <div className="flex items-start gap-4 sm:gap-5 pr-16 sm:pr-20">
                      <div
                        className={`shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl border-2 border-[#33363F] shadow-[3px_3px_0_#33363F] flex items-center justify-center ${
                          iconOrange ? "bg-[#F2661A]" : "bg-[#173E76]"
                        }`}
                      >
                        <step.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="min-w-0 pt-0.5">
                        <h3 className="text-lg md:text-xl font-extrabold tracking-tight text-[#33363F] leading-snug">
                          {step.title}
                        </h3>
                        <p className="mt-1.5 text-sm md:text-[15px] text-[#33363F]/60 leading-relaxed">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Dashed arrow connector (desktop only) */}
                {!isLast && (
                  <div className="hidden md:flex flex-col items-center py-2.5" aria-hidden>
                    <div className="h-4 border-l-2 border-dashed border-[#33363F]/20" />
                    <motion.span
                      initial={{ opacity: 0, scale: 0.3 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={viewport}
                      transition={{ ...spring, delay: 0.18 }}
                      className="text-2xl leading-none text-[#F2661A]/70 rotate-90 my-1"
                    >
                      →
                    </motion.span>
                    <div className="h-4 border-l-2 border-dashed border-[#33363F]/20" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom — mini sticker chips + CTA to pricing */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ ...spring }}
          className="mt-14 md:mt-16 flex flex-col items-center gap-7"
        >
          <div className="flex flex-wrap justify-center gap-3">
            {chips.map((chip, i) => (
              <motion.span
                key={chip}
                initial={{ opacity: 0, scale: 0.75, rotate: i % 2 === 0 ? -5 : 5 }}
                whileInView={{ opacity: 1, scale: 1, rotate: i % 2 === 0 ? -1.5 : 1.5 }}
                whileHover={{ rotate: 0, scale: 1.05 }}
                viewport={viewport}
                transition={{ ...spring, delay: i * 0.09 }}
                className="chip-sticker label-chip"
              >
                {chip}
              </motion.span>
            ))}
          </div>

          <a
            href="#pricing"
            className="group inline-flex items-center gap-2.5 text-base md:text-lg font-extrabold tracking-tight text-[#33363F] link-sweep"
          >
            {t("common.seePricing")}
            <span className="text-xl leading-none text-[#F2661A] transition-transform duration-200 group-hover:translate-x-1.5">
              →
            </span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
