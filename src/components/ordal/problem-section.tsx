"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/lib/i18n/context";
import { Deco, SectionHeader, WordReveal } from "@/components/ordal/creative";
import { Clock, Eye, Repeat2 } from "lucide-react";

const viewport = { once: true, margin: "-80px" } as const;
const spring = { type: "spring", stiffness: 210, damping: 18 } as const;

export function ProblemSection() {
  const { t, tArray, language } = useLanguage();

  const steps = tArray("problem.steps");
  const pains = [
    { value: t("problem.pain1"), desc: t("problem.pain1Desc"), icon: Clock },
    { value: t("problem.pain2"), desc: t("problem.pain2Desc"), icon: Repeat2 },
    { value: t("problem.pain3"), desc: t("problem.pain3Desc"), icon: Eye },
  ];

  // Highlight the key phrase of the title with the dark-section highlighter
  const keyPhrase = language === "id" ? "fulltime" : "full-time job";
  const [titleBefore, titleAfter] = t("problem.title").split(keyPhrase);
  const title =
    titleAfter !== undefined ? (
      <>
        {titleBefore}
        <mark className="hl-dark">{keyPhrase}</mark>
        {titleAfter}
      </>
    ) : (
      t("problem.title")
    );

  return (
    <section id="problem" className="relative py-24 md:py-28 bg-[#33363F] overflow-hidden">
      {/* Grid texture */}
      <div className="absolute inset-0 grid-pattern-dark pointer-events-none" aria-hidden />

      {/* Floating deco symbols */}
      <Deco className="top-24 right-[8%] text-4xl text-[#F2661A]/30" delay={0.4}>
        ✦
      </Deco>
      <Deco className="top-[46%] left-[4%] text-3xl text-[#F4F2EC]/20" delay={1.1} wiggle>
        ✳
      </Deco>
      <Deco className="bottom-28 right-[5%] text-3xl text-[#F2661A]/25" delay={0.8}>
        →
      </Deco>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <SectionHeader
          index="01"
          badge={t("problem.badge")}
          title={title}
          subtitle={t("problem.subtitle")}
          dark
          className="mb-20 md:mb-28"
        />

        {/* The soul-crushing 8-step loop — sticker chip grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 md:gap-4 max-w-4xl mx-auto">
          {steps.map((step, i) => {
            const isLast = i === steps.length - 1;
            const rotate = isLast ? 2 : i % 2 === 0 ? -1.5 : 1.5;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 26, rotate: rotate * 2, scale: 0.92 }}
                whileInView={{ opacity: 1, y: 0, rotate, scale: 1 }}
                whileHover={{ rotate: 0, scale: 1.04 }}
                viewport={viewport}
                transition={{ ...spring, delay: i * 0.07 }}
                className="relative"
              >
                <div
                  className={`sticker-dark relative h-full ${
                    isLast ? "overflow-hidden p-5" : "p-4"
                  }`}
                  style={isLast ? { borderColor: "#F2661A" } : undefined}
                >
                  {isLast && (
                    <span className="absolute inset-0 bg-[#F2661A]/10" aria-hidden />
                  )}
                  <div className="relative">
                    <span className="num-display text-[11px] font-extrabold tracking-[0.18em] text-[#F2661A]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p
                      className={`mt-2 leading-snug ${
                        isLast
                          ? "text-base md:text-lg font-extrabold text-[#F2661A]"
                          : "text-sm font-bold text-[#F4F2EC]/85"
                      }`}
                    >
                      {step}
                    </p>
                  </div>
                </div>

              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        {/* Pain stats — the numbers hurt */}
        <div className="grid md:grid-cols-3 gap-5 md:gap-6 max-w-5xl mx-auto">
          {pains.map((pain, i) => {
            const rotate = i % 2 === 0 ? -1.5 : 1.5;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 32, rotate: rotate * 2 }}
                whileInView={{ opacity: 1, y: 0, rotate }}
                whileHover={{ rotate: 0, y: -4 }}
                viewport={viewport}
                transition={{ ...spring, delay: i * 0.1 }}
              >
                <div className="sticker-dark p-6 md:p-7 text-center">
                  <pain.icon className="w-6 h-6 mx-auto mb-3 text-[#F2661A]" />
                  <p className="num-display text-4xl md:text-5xl font-black text-[#F2661A] leading-[1.05]">
                    {pain.value}
                  </p>
                  <p className="mt-3 text-sm font-medium text-[#F4F2EC]/70 leading-relaxed">
                    {pain.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* The big quote — scroll-linked word reveal */}
        <div className="relative max-w-3xl mx-auto mt-16 md:mt-20">
          <Deco className="-top-9 left-[1%] text-5xl text-[#F2661A]/45">“</Deco>
          <Deco className="-bottom-10 right-[1%] text-5xl text-[#F2661A]/45" delay={0.7}>
            ”
          </Deco>
          <WordReveal
            text={t("problem.message")}
            dark
            className="h-tight text-2xl sm:text-3xl md:text-4xl max-w-3xl mx-auto text-center"
          />
        </div>
      </div>
    </section>
  );
}
