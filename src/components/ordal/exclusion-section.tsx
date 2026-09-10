"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/lib/i18n/context";
import { Deco, SectionHeader } from "@/components/ordal/creative";

const spring = { type: "spring", stiffness: 90, damping: 18 } as const;

export function ExclusionSection() {
  const { t, tArray, language } = useLanguage();

  const targets = tArray("exclusion.targetItems");
  const donts = tArray("exclusion.dontItems");

  // Highlight the negation word with the highlighter mark
  // (EN copy carries markdown emphasis asterisks — strip them for display)
  const keyword = language === "id" ? "nggak mau" : "don't";
  const cleanedTitle = t("exclusion.title").replace(/\*/g, "");
  const parts = cleanedTitle.split(keyword);
  const title =
    parts.length > 1 ? (
      <>
        {parts[0]}
        <mark className="hl">{keyword}</mark>
        {parts[1]}
      </>
    ) : (
      cleanedTitle
    );

  return (
    <section className="relative py-24 md:py-32 bg-[#F4F2EC] dot-pattern overflow-hidden">
      {/* Tilted cream-dark band behind the comparison cards */}
      <div
        aria-hidden
        className="absolute -inset-x-6 top-[32%] h-[440px] bg-[#EAE7DC] rotate-[-1.5deg]"
      />

      <Deco className="top-14 right-[8%] text-4xl text-[#F2661A]/30" delay={0.4}>✦</Deco>
      <Deco className="bottom-24 left-[6%] text-3xl text-[#173E76]/25" delay={1.2} wiggle>(</Deco>
      <Deco className="top-[60%] right-[4%] text-3xl text-[#F2661A]/25" delay={1.9}>→</Deco>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <SectionHeader
          index="06"
          badge={t("exclusion.badge")}
          title={title}
          subtitle={t("exclusion.subtitle")}
        />

        <div className="mt-14 grid md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto items-start">
          {/* TARGET card */}
          <motion.div
            initial={{ opacity: 0, x: -48, y: 28 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ ...spring }}
          >
            <div className="sticker rotate-[-1.5deg] hover:rotate-0 p-6 md:p-7">
              <span className="label-chip inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#173E76] text-white border-2 border-[#33363F] shadow-[3px_3px_0_#33363F]">
                <span className="font-black">✓</span>
                {t("exclusion.targetLabel")}
              </span>

              <div className="mt-6 flex flex-wrap gap-2.5">
                {targets.map((item, i) => (
                  <motion.span
                    key={item}
                    initial={{ opacity: 0, scale: 0.7, y: 14 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{
                      delay: 0.2 + i * 0.08,
                      type: "spring",
                      stiffness: 300,
                      damping: 17,
                    }}
                    className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-xl border-2 border-[#173E76]/30 bg-[#173E76]/5"
                  >
                    <span className="font-black text-[#173E76]">✓</span>
                    <span className="text-sm font-bold text-[#33363F]">{item}</span>
                  </motion.span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* DON'T card */}
          <motion.div
            initial={{ opacity: 0, x: 48, y: 28 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ delay: 0.12, ...spring }}
          >
            <div className="sticker rotate-[1.5deg] hover:rotate-0 p-6 md:p-7 relative">
              {/* Big rotated ✕ stamp */}
              <span
                aria-hidden
                className="absolute -top-5 right-1 md:-top-7 md:-right-3 text-6xl sm:text-7xl md:text-8xl font-black text-outline-orange rotate-[-14deg] select-none pointer-events-none"
              >
                ✕
              </span>

              <span className="label-chip inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#F2661A] text-[#33363F] border-2 border-[#33363F] shadow-[3px_3px_0_#33363F]">
                <span className="font-black">✕</span>
                {t("exclusion.dontLabel")}
              </span>

              <div className="mt-6 flex flex-wrap gap-2.5">
                {donts.map((item, i) => (
                  <motion.span
                    key={item}
                    initial={{ opacity: 0, scale: 0.7, y: 14 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{
                      delay: 0.32 + i * 0.08,
                      type: "spring",
                      stiffness: 300,
                      damping: 17,
                    }}
                    className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-xl border-2 border-[#F2661A]/40 bg-[#F2661A]/5"
                  >
                    <span className="font-black text-lg text-[#F2661A]">✕</span>
                    <span className="text-sm font-bold text-[#33363F]/60 line-through decoration-[#F2661A]/70 decoration-2">
                      {item}
                    </span>
                  </motion.span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-12 md:mt-14 max-w-xl mx-auto text-center text-sm md:text-base text-[#33363F]/60 leading-relaxed"
        >
          {t("exclusion.description")}
        </motion.p>
      </div>
    </section>
  );
}
