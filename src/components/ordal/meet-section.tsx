"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/lib/i18n/context";
import { Deco, SectionHeader } from "@/components/ordal/creative";
import { Bot } from "lucide-react";

const viewport = { once: true, margin: "-80px" } as const;
const spring = { type: "spring", stiffness: 200, damping: 18 } as const;

export function MeetSection() {
  const { t, tArray, language } = useLanguage();

  const features = tArray("meet.features");

  // Agent activity log lines (bilingual)
  const terminalLines =
    language === "id"
      ? [
          "> ordal start",
          "✦ memindai job platform…",
          "✦ ditemukan: Procurement Specialist · 92% match",
          "✦ cek duplikat… lolos",
          "✦ pertanyaan sama? jawaban kepake lagi ✓",
          "✦ mengirim lamaran… ✓ terkirim",
          "> ordal: standby, nunggu lowongan baru…",
        ]
      : [
          "> ordal start",
          "✦ scanning job platforms…",
          "✦ found: Procurement Specialist · 92% match",
          "✦ checking duplicates… clear",
          "✦ same question? answer reused ✓",
          "✦ sending application… ✓ sent",
          "> ordal: standing by for new openings…",
        ];

  const stats = [
    { label: language === "id" ? "Ditemukan" : "Found", value: "24" },
    { label: language === "id" ? "Dilamar" : "Applied", value: "312" },
    { label: language === "id" ? "Di-skip" : "Skipped", value: "56" },
  ];

  // Highlight "ORDAL" inside the title
  const [titleBefore, titleAfter] = t("meet.title").split("ORDAL");
  const title =
    titleAfter !== undefined ? (
      <>
        {titleBefore}
        <mark className="hl text-[#F2661A]">ORDAL</mark>
        {titleAfter}
      </>
    ) : (
      t("meet.title")
    );

  return (
    <section className="relative py-24 md:py-28 bg-[#F4F2EC] overflow-hidden">
      {/* Grid texture */}
      <div className="absolute inset-0 grid-pattern pointer-events-none" aria-hidden />

      {/* Giant ghost word behind the content */}
      <div
        aria-hidden
        className="pointer-events-none select-none absolute left-1/2 top-14 -translate-x-1/2 -rotate-2 text-[17vw] lg:text-[19vw] font-black uppercase tracking-tight leading-none text-outline opacity-60 whitespace-nowrap z-0"
      >
        AGENT
      </div>

      {/* Deco symbols */}
      <Deco className="top-20 right-[7%] text-4xl text-[#F2661A]/30" delay={0.5} wiggle>
        ✳
      </Deco>
      <Deco className="bottom-24 left-[5%] text-3xl text-[#173E76]/25" delay={1.2}>
        (
      </Deco>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <SectionHeader
          index="02"
          badge={t("meet.badge")}
          title={title}
          subtitle={t("meet.subtitle")}
          className="mb-12 md:mb-16"
        />

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-start">
          {/* LEFT — description + feature sticker rows */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewport}
              transition={{ duration: 0.5 }}
              className="text-base md:text-lg text-[#33363F]/60 leading-relaxed mb-8 max-w-xl"
            >
              {t("meet.description")}
            </motion.p>

            <div className="space-y-3.5">
              {features.map((feature, i) => {
                const rotate = i % 2 === 0 ? -1.2 : 1.2;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -26, rotate: rotate * 2.5 }}
                    whileInView={{ opacity: 1, x: 0, rotate }}
                    whileHover={{ rotate: 0, scale: 1.02 }}
                    viewport={viewport}
                    transition={{ ...spring, delay: 0.1 + i * 0.08 }}
                  >
                    <div className="sticker flex items-center gap-3.5 px-4 py-3.5">
                      <span
                        className="text-lg leading-none text-[#F2661A] shrink-0"
                        aria-hidden
                      >
                        ✦
                      </span>
                      <span className="text-sm md:text-[15px] font-semibold text-[#33363F]/80 leading-snug">
                        {feature}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* RIGHT — agent activity log */}
          <motion.div
            initial={{ opacity: 0, y: 44, rotate: 2.5 }}
            whileInView={{ opacity: 1, y: 0, rotate: 0.5 }}
            viewport={viewport}
            transition={{ ...spring, delay: 0.15 }}
            className="relative w-full"
          >
            <div className="sticker w-full p-3 sm:p-4">
              <div className="rounded-xl border-2 border-[#33363F]/10 bg-white overflow-hidden">
                {/* Activity log header */}
                <div className="flex items-center gap-2 px-3.5 py-2.5 bg-[#F0EEE7] border-b-2 border-[#33363F]/10">
                  <div className="flex gap-1.5" aria-hidden>
                    <span className="w-2.5 h-2.5 rounded-full bg-[#F2661A]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#33363F]/20" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#33363F]/10" />
                  </div>
                  <div className="flex items-center gap-1.5 ml-2 min-w-0">
                    <span className="w-5 h-5 rounded-md bg-[#F2661A] flex items-center justify-center shrink-0">
                      <Bot className="w-3 h-3 text-white" />
                    </span>
                    <span className="font-mono text-[11px] text-[#33363F]/60 truncate">
                      ordal · agent
                    </span>
                  </div>
                  <span className="ml-auto inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-[#F2661A]/40 bg-[#F2661A]/10 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F2661A] animate-status-pulse" />
                    <span className="text-[10px] font-extrabold tracking-widest text-[#D65511]">
                      {language === "id" ? "AKTIF" : "ACTIVE"}
                    </span>
                  </span>
                </div>

                {/* Typed activity lines */}
                <div className="px-4 sm:px-5 py-5 space-y-3">
                  {terminalLines.map((line, i) => {
                    const isCmd = line.startsWith(">");
                    const isDone = line.includes("✓");
                    const isLast = i === terminalLines.length - 1;
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -12 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={viewport}
                        transition={{ delay: 0.4 + i * 0.32, duration: 0.25 }}
                        className={`font-mono text-xs leading-relaxed break-words ${
                          isCmd || isDone
                            ? "text-[#D65511] font-bold"
                            : "text-[#33363F]/60"
                        }`}
                      >
                        {line}
                        {isLast && <span className="animate-blink text-[#D65511]">▌</span>}
                      </motion.div>
                    );
                  })}
                </div>

                {/* Activity log mini stats */}
                <div className="grid grid-cols-3 border-t border-[#33363F]/10">
                  {stats.map((stat, i) => (
                    <div
                      key={i}
                      className={`px-3 py-3 text-center ${
                        i > 0 ? "border-l border-[#33363F]/10" : ""
                      }`}
                    >
                      <p className="num-display text-lg font-extrabold text-[#33363F]">
                        {stat.value}
                      </p>
                      <p className="mt-0.5 text-[10px] font-bold uppercase tracking-widest text-[#33363F]/60">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating sticker note — compositor-driven CSS bobbing
                (was a per-frame JS animation loop) */}
            <div
              className="animate-card-bob-note absolute -bottom-7 -left-3 sm:-left-7 hidden sm:block z-20"
            >
              <div className="sticker-flat -rotate-3 flex items-center gap-2.5 px-4 py-3">
                <span className="w-2 h-2 rounded-full bg-[#F2661A] shrink-0" aria-hidden />
                <div>
                  <p className="text-xs font-extrabold text-[#33363F] leading-tight">
                    {language === "id" ? "Semua berjalan" : "All running"}
                  </p>
                  <p className="text-[10px] font-medium text-[#33363F]/60 leading-tight">
                    {language === "id" ? "8 target aktif" : "8 active targets"}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
