"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/lib/i18n/context";
import { FileText } from "lucide-react";
import { Deco, SectionHeader, WordReveal } from "@/components/ordal/creative";

const spring = { type: "spring", stiffness: 90, damping: 18 } as const;

export function PathsSection() {
  const { t, tArray, language } = useLanguage();

  const careers = [
    {
      title: t("paths.career1Title"),
      cv: t("paths.career1CV"),
      targets: tArray("paths.career1Targets"),
      titleChip:
        "bg-[#F2661A] text-[#33363F] border-[#F4F2EC] shadow-[3px_3px_0_rgba(244,242,236,0.85)]",
    },
    {
      title: t("paths.career2Title"),
      cv: t("paths.career2CV"),
      targets: tArray("paths.career2Targets"),
      titleChip:
        "bg-[#F4F2EC] text-[#33363F] border-[#F2661A] shadow-[3px_3px_0_rgba(242,102,26,0.9)]",
    },
  ];

  // Highlight the key phrase of the title with the dark highlighter mark
  const keyword = language === "id" ? "Banyak jalur karier" : "Many career paths";
  const parts = t("paths.title").split(keyword);
  const title =
    parts.length > 1 ? (
      <>
        {parts[0]}
        <mark className="hl-dark">{keyword}</mark>
        {parts[1]}
      </>
    ) : (
      t("paths.title")
    );

  return (
    <section
      id="features"
      className="relative py-24 md:py-32 bg-[#33363F] overflow-hidden"
    >
      <div className="absolute inset-0 grid-pattern-dark opacity-60" aria-hidden />

      <Deco className="top-14 right-[9%] text-4xl text-[#F2661A]/35" delay={0.3}>✦</Deco>
      <Deco className="bottom-28 left-[4%] text-3xl text-[#F4F2EC]/20" delay={1.1} wiggle>(</Deco>
      <Deco className="top-1/3 left-[46%] text-3xl text-[#F2661A]/25" delay={1.8}>→</Deco>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <SectionHeader
          index="04"
          badge={t("paths.badge")}
          title={title}
          subtitle={t("paths.subtitle")}
          dark
        />

        {/* Two career strategy cards — one account, both running */}
        <div className="relative mt-14 md:mt-16 grid gap-8 lg:grid-cols-2 lg:gap-14">
          {/* Center sticker badge between the two cards */}
          <motion.div
            initial={{ opacity: 0, scale: 0.6, rotate: 10 }}
            whileInView={{ opacity: 1, scale: 1, rotate: -5 }}
            whileHover={{ rotate: 2, scale: 1.06 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ delay: 0.4, type: "spring", stiffness: 240, damping: 16 }}
            className="hidden lg:flex absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2"
          >
            <span className="chip-sticker px-4 py-2">
              <span className="w-2 h-2 rounded-full bg-[#F2661A]" />
              <span className="label-chip">
                {language === "id" ? "1 AKUN" : "1 ACCOUNT"}
              </span>
            </span>
          </motion.div>

          {careers.map((career, i) => (
            <motion.div
              key={career.title}
              initial={{ opacity: 0, y: 56 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: 0.1 + i * 0.12, ...spring }}
            >
              <div
                className={`sticker-dark h-full p-6 md:p-8 ${
                  i === 0 ? "rotate-[-1.5deg] hover:rotate-0" : "rotate-[1.5deg] hover:rotate-0"
                }`}
              >
                {/* Career title chip */}
                <span
                  className={`label-chip inline-flex px-3.5 py-2 rounded-full border-2 ${career.titleChip}`}
                >
                  {career.title}
                </span>

                {/* CV file chip */}
                <div className="mt-5">
                  <span className="chip-sticker text-xs">
                    <FileText className="w-4 h-4 text-[#F2661A]" />
                    {career.cv}
                  </span>
                </div>

                {/* Target positions */}
                <p className="mt-6 mb-3 label-chip text-[#F4F2EC]/80">
                  {language === "id" ? "Posisi Target" : "Target Positions"}
                </p>
                <div className="flex flex-wrap gap-2.5">
                  {career.targets.map((target, j) => (
                    <motion.span
                      key={target}
                      initial={{ opacity: 0, scale: 0.7 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true, margin: "-80px" }}
                      transition={{
                        delay: 0.3 + j * 0.08,
                        type: "spring",
                        stiffness: 320,
                        damping: 17,
                      }}
                      className="text-xs font-bold px-3 py-1.5 rounded-full border-2 border-[#F2661A]/70 bg-[#F2661A]/10 text-[#F4F2EC]"
                    >
                      {target}
                    </motion.span>
                  ))}
                </div>

                {/* Source platforms (generic: list keeps growing) */}
                <div className="mt-6 pt-5 border-t-2 border-[#F4F2EC]/10 flex flex-wrap items-center gap-2.5">
                  {(language === "id"
                    ? ["Job Platform", "+ nambahin terus"]
                    : ["Job Platforms", "+ more coming"]
                  ).map((platform) => (
                    <span
                      key={platform}
                      className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full border border-[#F4F2EC]/25 text-[#F4F2EC]/70"
                    >
                      <span className="text-[#F2661A]">✦</span>
                      {platform}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Closing statement */}
        <div className="mt-16 md:mt-20 max-w-3xl mx-auto text-center">
          <WordReveal
            dark
            text={t("paths.description")}
            className="h-display text-2xl md:text-3xl font-extrabold text-[#F4F2EC]"
          />
        </div>
      </div>
    </section>
  );
}
