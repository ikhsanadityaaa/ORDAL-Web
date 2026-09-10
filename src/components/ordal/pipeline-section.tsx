"use client";

import { Fragment } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/i18n/context";
import { translations } from "@/lib/i18n/translations";
import { Deco, SectionHeader } from "@/components/ordal/creative";

const spring = { type: "spring", stiffness: 90, damping: 18 } as const;

// Conveyor belt: matched jobs drifting through the pipeline
const conveyorJobs = [
  "Procurement Specialist · 92%",
  "Senior Buyer · 88%",
  "Purchasing Manager · 85%",
  "Digital Marketing · 90%",
  "Social Media Specialist · 91%",
  "Content Marketing · 87%",
];

export function PipelineSection() {
  const { t, language } = useLanguage();

  // pipeline.steps is an array of { title, desc } objects in translations.ts
  const steps = translations[language].pipeline.steps;

  // Highlight the key phrase of the title with the dark highlighter mark
  const keyword = "auto apply";
  const parts = t("pipeline.title").split(keyword);
  const title =
    parts.length > 1 ? (
      <>
        {parts[0]}
        <mark className="hl-dark">{keyword}</mark>
        {parts[1]}
      </>
    ) : (
      t("pipeline.title")
    );

  // Duplicate the chip row enough times for a seamless loop
  const conveyorRow = [
    ...conveyorJobs,
    ...conveyorJobs,
    ...conveyorJobs,
    ...conveyorJobs,
  ];

  return (
    <section className="relative pt-24 md:pt-32 pb-16 md:pb-20 bg-[#173E76] overflow-hidden">
      <div className="absolute inset-0 grid-pattern-dark opacity-60" aria-hidden />

      <Deco className="top-14 right-[7%] text-4xl text-[#F2661A]/40" delay={0.3}>✦</Deco>
      <Deco className="top-[45%] left-[4%] text-3xl text-[#F4F2EC]/25" delay={1.2} wiggle>(</Deco>
      <Deco className="bottom-44 right-[5%] text-3xl text-[#F4F2EC]/20" delay={1.8}>→</Deco>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <SectionHeader
          index="07"
          badge={t("pipeline.badge")}
          title={title}
          subtitle={t("pipeline.subtitle")}
          dark
        />

        {/* Stage gates */}
        <div className="mt-14 md:mt-16 flex flex-col md:flex-row md:items-stretch gap-5 md:gap-2">
          {steps.map((step, i) => (
            <Fragment key={step.title}>
              <motion.div
                initial={{ opacity: 0, y: 48 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ delay: i * 0.09, ...spring }}
                className="flex-1"
              >
                <div
                  className={`sticker-dark h-full p-5 md:p-6 ${
                    i % 2 === 0 ? "rotate-[-1deg] hover:rotate-0" : "rotate-[1deg] hover:rotate-0"
                  }`}
                >
                  <span
                    className={`num-display block text-6xl font-black leading-[0.9] ${
                      i === steps.length - 1 ? "text-outline-orange" : "text-outline-cream"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <h3
                    className={`mt-4 text-lg font-extrabold tracking-tight ${
                      i === steps.length - 1 ? "text-[#F2661A]" : "text-[#F4F2EC]"
                    }`}
                  >
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm text-[#F4F2EC]/70 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </motion.div>

              {/* Arrow connector between gates */}
              {i < steps.length - 1 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.3 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{
                    delay: i * 0.09 + 0.28,
                    type: "spring",
                    stiffness: 300,
                    damping: 15,
                  }}
                  className="hidden md:flex items-center justify-center px-1"
                  aria-hidden
                >
                  <span className="text-3xl font-black text-[#F2661A] animate-float">→</span>
                </motion.div>
              )}
            </Fragment>
          ))}
        </div>

        {/* Conveyor band — matched jobs drifting left to right */}
        <div aria-hidden className="relative mt-12 md:mt-16 rotate-[-0.6deg] scale-[1.01]">
          <div className="marquee bg-[#0F2B55] border-y-2 border-[#F4F2EC]/15 py-3.5">
            <div className="marquee-track-reverse">
              {conveyorRow.map((job, i) => (
                <span
                  key={i}
                  className="flex items-center whitespace-nowrap"
                  style={{ gap: "1.25rem", paddingRight: "1.25rem" }}
                >
                  <span className="rounded-full bg-white/10 border border-[#F4F2EC]/20 px-3.5 py-1.5 text-xs md:text-sm font-bold text-[#F4F2EC]/80">
                    {job}
                  </span>
                  <span className="text-[#F2661A]">✦</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
