"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/lib/i18n/context";
import {
  Ban,
  Briefcase,
  Building2,
  Check,
  Clock,
  DollarSign,
  FileText,
  MapPin,
  Monitor,
  SlidersHorizontal,
} from "lucide-react";
import { Deco, SectionHeader } from "@/components/ordal/creative";

const spring = { type: "spring", stiffness: 90, damping: 18 } as const;

// Icons for the eight settings rows (order matches control.options)
const rowIcons = [
  FileText,
  Briefcase,
  MapPin,
  Monitor,
  DollarSign,
  Clock,
  Ban,
  Building2,
];

// Rows rendered with a toggle pill instead of a check (0-based), and which are ON
const toggleRows = [3, 5, 7];
const togglesOn = [3, 7];

export function ControlSection() {
  const { t, tArray, language } = useLanguage();
  const options = tArray("control.options");

  // Highlight the key phrase of the title with the highlighter mark
  const keyword = language === "id" ? "setirnya" : "the wheel";
  const parts = t("control.title").split(keyword);
  const title =
    parts.length > 1 ? (
      <>
        {parts[0]}
        <mark className="hl">{keyword}</mark>
        {parts[1]}
      </>
    ) : (
      t("control.title")
    );

  return (
    <section className="relative py-24 md:py-32 bg-[#F4F2EC] dot-pattern overflow-hidden">
      <Deco className="top-16 right-[7%] text-4xl text-[#F2661A]/30" delay={0.5}>✦</Deco>
      <Deco className="bottom-20 left-[5%] text-3xl text-[#173E76]/25" delay={1.4} wiggle>(</Deco>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <SectionHeader
          index="05"
          badge={t("control.badge")}
          title={title}
          subtitle={t("control.subtitle")}
        />

        <div className="mt-14 grid grid-cols-1 min-w-0 lg:grid-cols-5 gap-10 lg:gap-12 items-start">
          {/* Target Builder settings panel */}
          <motion.div
            initial={{ opacity: 0, y: 56 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ ...spring }}
            className="lg:col-span-3 min-w-0"
          >
            <div className="sticker rotate-[0.5deg] hover:rotate-0 overflow-hidden">
              {/* Panel header bar */}
              <div className="flex items-center gap-3 px-4 md:px-5 py-3.5 bg-[#ECEBE4] border-b-2 border-[#33363F]/10">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#FF5F57] border border-black/30" />
                  <span className="w-3 h-3 rounded-full bg-[#FEBC2E] border border-black/30" />
                  <span className="w-3 h-3 rounded-full bg-[#28C840] border border-black/30" />
                </div>
                <span className="flex-1 text-center label-chip text-[#33363F]/60">
                  TARGET BUILDER
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#28C840]/12 border border-[#28C840]/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#28C840] animate-status-pulse" />
                  <span className="text-[9px] font-extrabold uppercase tracking-[0.18em] text-[#1E9E3E]">
                    {language === "id" ? "BERJALAN" : "RUNNING"}
                  </span>
                </span>
              </div>

              {/* Settings rows */}
              <div>
                {options.map((option, i) => {
                  const Icon = rowIcons[i % rowIcons.length];
                  const isToggle = toggleRows.includes(i);
                  const isOn = togglesOn.includes(i);
                  return (
                    <motion.div
                      key={option}
                      initial={{ opacity: 0, x: -24 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-80px" }}
                      transition={{ delay: 0.12 + i * 0.07, ...spring }}
                      className="flex items-center justify-between gap-4 px-4 md:px-5 py-3.5 border-b-2 border-[#33363F]/10 last:border-b-0"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <span className="w-9 h-9 shrink-0 rounded-lg border-2 border-[#33363F]/15 bg-[#F4F2EC] flex items-center justify-center">
                          <Icon className="w-4 h-4 text-[#173E76]" />
                        </span>
                        <span className="text-sm font-semibold text-[#33363F]/75 truncate">
                          {option}
                        </span>
                      </div>

                      {isToggle ? (
                        <span
                          className={`relative shrink-0 w-11 h-6 rounded-full border-2 ${
                            isOn
                              ? "bg-[#F2661A] border-[#33363F]"
                              : "bg-[#F4F2EC] border-[#33363F]/30"
                          }`}
                        >
                          <span
                            className={`absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full border-2 ${
                              isOn
                                ? "right-1 bg-white border-[#33363F]"
                                : "left-1 bg-[#33363F]/25 border-[#33363F]/40"
                            }`}
                          />
                        </span>
                      ) : (
                        <motion.span
                          initial={{ scale: 0, rotate: -30 }}
                          whileInView={{ scale: 1, rotate: 0 }}
                          viewport={{ once: true, margin: "-80px" }}
                          transition={{
                            delay: 0.3 + i * 0.08,
                            type: "spring",
                            stiffness: 340,
                            damping: 15,
                          }}
                          className={`shrink-0 w-7 h-7 rounded-md border-2 border-[#33363F] flex items-center justify-center ${
                            i % 2 === 0 ? "bg-[#173E76]" : "bg-[#F2661A]"
                          }`}
                        >
                          <Check className="w-4 h-4 text-white" strokeWidth={3.5} />
                        </motion.span>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Side copy */}
          <div className="lg:col-span-2 lg:pt-4 min-w-0">
            <motion.div
              initial={{ opacity: 0, y: 20, rotate: 3 }}
              whileInView={{ opacity: 1, y: 0, rotate: -2 }}
              whileHover={{ rotate: 0, scale: 1.04 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: 0.25, type: "spring", stiffness: 260, damping: 17 }}
              className="inline-flex chip-sticker"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#F2661A]" />
              <span className="label-chip">
                {options.length} {language === "id" ? "PENGATURAN" : "SETTINGS"}
              </span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: 0.35, duration: 0.5 }}
              className="mt-6 text-base md:text-lg text-[#33363F]/60 leading-relaxed"
            >
              {t("control.description")}
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
}
