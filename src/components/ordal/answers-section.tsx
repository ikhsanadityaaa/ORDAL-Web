"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useLanguage } from "@/lib/i18n/context";
import { Deco, SectionHeader } from "@/components/ordal/creative";
import {
  BookmarkCheck,
  Database,
  MessageSquareText,
  Sparkles,
} from "lucide-react";

const viewport = { once: true, margin: "-80px" } as const;
const spring = { type: "spring", stiffness: 200, damping: 18 } as const;

/* The answer that "auto-fills" inside the detected-question card */
const TYPED_ANSWER = "Rp 8 - 10 juta";
const TYPE_START_DELAY = 600; // ms after the card scrolls into view
const TYPE_STEP_MS = 35; // ms per character

export function AnswersSection() {
  const { t, language } = useLanguage();
  const isID = language === "id";

  /* Highlight one key phrase of the title with the highlighter mark */
  const keyword = isID ? "udah ada" : "already there";
  const parts = t("answers.title").split(keyword);
  const title =
    parts.length > 1 ? (
      <>
        {parts[0]}
        <mark className="hl">{keyword}</mark>
        {parts[1]}
      </>
    ) : (
      t("answers.title")
    );

  /* LEFT column: 3 "how it works" mini sticker rows */
  const steps = [
    {
      icon: MessageSquareText,
      id: "Kamu jawab pertanyaan screening satu kali",
      en: "You answer a screening question once",
    },
    {
      icon: Database,
      id: "ORDAL nyimpen pertanyaan + jawabannya",
      en: "ORDAL stores the question + your answer",
    },
    {
      icon: Sparkles,
      id: "Pertanyaan sama muncul lagi? Kekirim udah keisi",
      en: "Same question again? Already filled in",
    },
  ];

  /* RIGHT column: saved answer rows inside the light app panel */
  const savedRows = [
    {
      q: isID ? "Berapa ekspektasi gaji kamu?" : "What's your salary expectation?",
      a: "Rp 8 - 10 juta",
      chip: isID ? "dipakai 12×" : "used 12×",
    },
    {
      q: isID ? "Kenapa cari kerja baru?" : "Why are you job hunting?",
      a: isID ? "Pengen tantangan baru" : "Looking for new challenges",
      chip: isID ? "dipakai 8×" : "used 8×",
    },
    {
      q: isID ? "Kapan bisa mulai kerja?" : "When can you start?",
      a: isID ? "PASCA notice 2 minggu" : "After 2-week notice",
      chip: isID ? "dipakai 5×" : "used 5×",
    },
  ];

  const detectedQuestion = isID
    ? "Berapa ekspektasi gaji kamu?"
    : "What's your salary expectation?";

  const stats = [
    { value: "12", label: isID ? "jawaban tersimpan" : "answers saved", star: false },
    { value: "25", label: isID ? "waktu dihemat (jam)" : "hours saved", star: false },
    { value: "0", label: isID ? "ngetik ulang" : "retyping", star: true },
  ];

  /* ---- Typing animation: only runs when the detected card is in view ---- */
  const detectRef = useRef<HTMLDivElement>(null);
  const detectInView = useInView(detectRef, viewport);
  const reduceMotion = useReducedMotion();
  const [typedCount, setTypedCount] = useState(0);
  const typedDone = typedCount >= TYPED_ANSWER.length;

  useEffect(() => {
    if (!detectInView || typedDone || reduceMotion) return;
    const delay = typedCount === 0 ? TYPE_START_DELAY : TYPE_STEP_MS;
    const timer = setTimeout(() => setTypedCount((c) => c + 1), delay);
    return () => clearTimeout(timer);
  }, [detectInView, typedCount, typedDone, reduceMotion]);

  const typedText = reduceMotion
    ? TYPED_ANSWER
    : TYPED_ANSWER.slice(0, typedCount);
  const isTyping = !reduceMotion && detectInView && !typedDone;
  const stampVisible = typedDone || (reduceMotion && detectInView);

  return (
    <section className="relative py-24 md:py-32 bg-[#F4F2EC] dot-pattern overflow-hidden">
      {/* Deco symbols */}
      <Deco className="top-14 right-[9%] text-4xl text-[#F2661A]/30" delay={0.5}>
        ✦
      </Deco>
      <Deco className="top-[46%] left-[3%] text-3xl text-[#173E76]/25" delay={1.3} wiggle>
        (
      </Deco>
      <Deco className="bottom-16 right-[7%] text-3xl text-[#F2661A]/25" delay={0.9}>
        →
      </Deco>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <SectionHeader
          index="08"
          badge={t("answers.badge")}
          title={title}
          subtitle={t("answers.subtitle")}
          className="mb-12 md:mb-16"
        />

        <div className="grid grid-cols-1 min-w-0 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
          {/* LEFT: description + how it works sticker rows */}
          <div className="min-w-0">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewport}
              transition={{ duration: 0.5 }}
              className="text-base md:text-lg text-[#33363F]/60 leading-relaxed mb-8 max-w-xl"
            >
              {t("answers.description")}
            </motion.p>

            <div className="space-y-3.5">
              {steps.map((step, i) => {
                const rotate = i % 2 === 0 ? -1.2 : 1.2;
                const Icon = step.icon;
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
                      <span className="w-10 h-10 rounded-lg border-2 border-[#33363F]/15 bg-[#F4F2EC] flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5 text-[#F2661A]" />
                      </span>
                      <span className="text-sm md:text-[15px] font-semibold text-[#33363F]/80 leading-snug">
                        {isID ? step.id : step.en}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* RIGHT: light-mode app panel with saved answers */}
          <motion.div
            initial={{ opacity: 0, y: 56 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewport}
            transition={{ ...spring, delay: 0.12 }}
            className="relative w-full min-w-0"
          >
            <div className="sticker rotate-[0.5deg] hover:rotate-0 overflow-hidden">
              {/* Panel header bar */}
              <div className="flex items-center gap-2 sm:gap-3 px-3.5 sm:px-4 py-3 bg-[#F0EEE7] border-b-2 border-[#33363F]/10">
                <div className="flex gap-1.5 sm:gap-2 shrink-0" aria-hidden>
                  <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#FF5F57] border border-black/10" />
                  <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#FEBC2E] border border-black/10" />
                  <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#28C840] border border-black/10" />
                </div>
                <div className="flex-1 min-w-0 text-center">
                  <span className="label-chip text-[10px] sm:text-[10px] text-[#33363F]/60">
                    {isID ? "JAWABAN TERSIMPAN" : "SAVED ANSWERS"}
                  </span>
                </div>
                <span
                  className="w-5 h-5 rounded-md bg-[#F2661A] flex items-center justify-center shrink-0"
                  aria-hidden
                >
                  <span className="text-white text-[10px] font-extrabold leading-none">O</span>
                </span>
              </div>

              {/* Saved answer rows */}
              <div className="p-3 sm:p-4 space-y-3">
                <div className="flex items-center gap-2 px-1 pt-0.5">
                  <BookmarkCheck
                    className="w-3.5 h-3.5 text-[#D65511] shrink-0"
                    aria-hidden
                  />
                  <span className="label-chip text-[10px] text-[#33363F]/60 shrink-0">
                    {t("answers.savedLabel")}
                  </span>
                  <span className="flex-1 h-px bg-[#33363F]/10" aria-hidden />
                </div>

                {savedRows.map((row, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -18 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={viewport}
                    transition={{ ...spring, delay: 0.28 + i * 0.09 }}
                    className="bg-[#F7F6F1] border border-[#33363F]/8 rounded-xl px-3.5 py-3"
                  >
                    <div className="flex items-start justify-between gap-2.5">
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm font-bold text-[#33363F] truncate">
                          {row.q}
                        </p>
                        <p className="mt-0.5 text-xs sm:text-sm font-semibold text-[#D65511] truncate">
                          {row.a}
                        </p>
                      </div>
                      <span className="shrink-0 whitespace-nowrap text-[10px] font-bold px-2 py-1 rounded-md bg-[#F2661A]/10 text-[#D65511]">
                        {row.chip}
                      </span>
                    </div>
                  </motion.div>
                ))}

                {/* New application detected: the answer auto-fills */}
                <motion.div
                  ref={detectRef}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={viewport}
                  transition={{ ...spring, delay: 0.55 }}
                  className="border-2 border-dashed border-[#F2661A]/50 bg-[#F2661A]/5 rounded-xl p-3.5"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-[#F2661A] animate-status-pulse shrink-0"
                      aria-hidden
                    />
                    <span className="label-chip text-[10px] sm:text-[10px] text-[#D65511] truncate">
                      {isID
                        ? "LAMARAN BARU · PERTANYAAN TERDETEKSI"
                        : "NEW APPLICATION · QUESTION DETECTED"}
                    </span>
                  </div>

                  <p className="mt-2.5 text-xs sm:text-sm font-bold text-[#33363F] leading-snug">
                    {detectedQuestion}
                  </p>

                  <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2">
                    <p className="text-sm sm:text-base font-bold text-[#D65511] leading-snug">
                      {typedText}
                      {isTyping && (
                        <span className="animate-blink ml-0.5" aria-hidden>
                          ▌
                        </span>
                      )}
                    </p>

                    {stampVisible && (
                      <motion.span
                        initial={reduceMotion ? false : { scale: 0, rotate: 6 }}
                        animate={{ scale: 1, rotate: -3 }}
                        whileHover={{ scale: 1.06, rotate: -1 }}
                        transition={{ type: "spring", stiffness: 380, damping: 15 }}
                        className="inline-flex items-center shrink-0 bg-[#C94708] text-white border-2 border-[#33363F] shadow-[3px_3px_0_#33363F] rounded-lg px-2.5 py-1 label-chip"
                      >
                        {t("answers.autoFillLabel")}
                      </motion.span>
                    )}
                  </div>
                </motion.div>
              </div>

              {/* Panel footer: mini stats */}
              <div className="grid grid-cols-3 border-t border-[#33363F]/10 bg-[#F0EEE7]">
                {stats.map((stat, i) => (
                  <div
                    key={i}
                    className={`px-1.5 sm:px-3 py-3 text-center ${
                      i > 0 ? "border-l border-[#33363F]/10" : ""
                    }`}
                  >
                    <p className="flex items-center justify-center gap-1 num-display text-lg sm:text-xl font-extrabold text-[#33363F]">
                      {stat.value}
                      {stat.star && (
                        <span className="text-[#F2661A] text-xs sm:text-sm" aria-hidden>
                          ✦
                        </span>
                      )}
                    </p>
                    <p className="mt-1 text-[10px] sm:text-[10px] font-bold uppercase tracking-widest text-[#33363F]/60 leading-tight">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
