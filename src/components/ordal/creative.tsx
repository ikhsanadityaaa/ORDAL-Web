"use client";

import { useId, useRef, type ReactNode } from "react";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/context";

/* ============================================================
   MARQUEE BAND — full-bleed tilted ticker between sections
   ============================================================ */
export function MarqueeBand({
  items,
  reverse = false,
  variant = "orange",
  className,
}: {
  items: string[];
  reverse?: boolean;
  variant?: "orange" | "charcoal" | "cream";
  className?: string;
}) {
  const row = [...items, ...items, ...items, ...items];
  const palette =
    variant === "orange"
      ? "bg-[#F2661A] text-[#33363F] border-[#33363F]"
      : variant === "charcoal"
        ? "bg-[#33363F] text-[#F4F2EC] border-[#F4F2EC]"
        : "bg-[#F4F2EC] text-[#33363F] border-[#33363F]";

  return (
    <div
      aria-hidden
      className={cn("relative -rotate-[1.2deg] scale-[1.02] select-none", className)}
    >
      <div className={cn("marquee border-y-2 py-3.5", palette)}>
        <div className={reverse ? "marquee-track-reverse" : "marquee-track"}>
          {row.map((item, i) => (
            <span
              key={i}
              className="flex items-center text-xl font-extrabold uppercase tracking-tight whitespace-nowrap md:text-2xl"
              style={{ gap: "1.75rem", paddingRight: "1.75rem" }}
            >
              {item}
              <span
                className={
                  variant === "orange"
                    ? "text-[#F4F2EC]"
                    : variant === "charcoal"
                      ? "text-[#F2661A]"
                      : "text-[#F2661A]"
                }
              >
                ✦
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   SPIN BADGE — rotating circular text with center arrow
   ============================================================ */
export function SpinBadge({
  text,
  className,
  icon,
}: {
  text: string;
  className?: string;
  icon?: ReactNode;
}) {
  const id = useId();
  const pathId = `spin-circle-${id.replace(/[^a-zA-Z0-9]/g, "")}`;

  return (
    <div
      aria-hidden
      className={cn(
        "relative flex items-center justify-center w-28 h-28 md:w-36 md:h-36",
        className
      )}
    >
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 w-full h-full animate-spin-slow"
      >
        <defs>
          <path
            id={pathId}
            d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0"
            fill="none"
          />
        </defs>
        <text
          className="fill-current text-[8.5px] font-bold uppercase"
          style={{ letterSpacing: "2.6px" }}
        >
          <textPath href={`#${pathId}`}>{text}</textPath>
        </text>
      </svg>
      <div className="relative z-10 flex items-center justify-center w-11 h-11 rounded-full bg-[#F2661A] border-2 border-[#33363F] shadow-[3px_3px_0_#33363F]">
        {icon ?? <ArrowDown className="w-5 h-5 text-white" />}
      </div>
    </div>
  );
}

/* ============================================================
   WORD REVEAL — scroll-linked word-by-word highlight
   (the signature creative-agency scroll effect)
   ============================================================ */
export function WordReveal({
  text,
  dark = false,
  className,
}: {
  text: string;
  dark?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.45"],
  });
  const words = text.split(" ");

  return (
    <p ref={ref} className={className}>
      {words.map((word, i) => (
        <Word
          key={`${word}-${i}`}
          progress={scrollYProgress}
          range={[i / words.length, (i + 1) / words.length]}
          dark={dark}
          isLast={i === words.length - 1}
        >
          {word}
        </Word>
      ))}
    </p>
  );
}

function Word({
  progress,
  range,
  children,
  dark,
  isLast,
}: {
  progress: MotionValue<number>;
  range: [number, number];
  children: string;
  dark?: boolean;
  isLast?: boolean;
}) {
  const opacity = useTransform(progress, range, [0.2, 1]);
  const y = useTransform(progress, range, [8, 0]);

  return (
    <motion.span
      style={{ opacity, y }}
      className={cn(
        "inline-block",
        dark ? "text-[#F4F2EC]" : "text-[#33363F]",
        !isLast && "mr-[0.26em]"
      )}
    >
      {children}
    </motion.span>
  );
}

/* ============================================================
   SECTION HEADER — numbered chip + display title
   ============================================================ */
export function SectionHeader({
  index,
  badge,
  title,
  subtitle,
  dark = false,
  className,
}: {
  index: string;
  badge: string;
  title: ReactNode;
  subtitle?: string;
  dark?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("max-w-3xl", className)}>
      <motion.div
        initial={{ opacity: 0, y: 16, rotate: 0 }}
        whileInView={{ opacity: 1, y: 0, rotate: -2 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="flex flex-wrap items-center gap-4 mb-6"
      >
        <span
          className={cn(
            "num-display text-sm font-extrabold tracking-widest",
            dark ? "text-[#F2661A]" : "text-[#F2661A]"
          )}
        >
          [{index}]
        </span>
        <span
          className={cn(
            "label-chip",
            dark ? "chip-sticker-dark" : "chip-sticker"
          )}
        >
          <span className={cn("w-1.5 h-1.5 rounded-full", dark ? "bg-[#F2661A]" : "bg-[#F2661A]")} />
          {badge}
        </span>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "h-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl",
          dark ? "text-[#F4F2EC]" : "text-[#33363F]"
        )}
      >
        {title}
      </motion.h2>

      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ delay: 0.12, duration: 0.5 }}
          className={cn(
            "mt-5 text-base md:text-lg leading-relaxed max-w-xl",
            dark ? "text-[#F4F2EC]/70" : "text-[#33363F]/60"
          )}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}

/* ============================================================
   DECO — floating decorative symbol
   ============================================================ */
export function Deco({
  children,
  className,
  delay = 0,
  wiggle = false,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  wiggle?: boolean;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "pointer-events-none select-none absolute font-bold",
        wiggle ? "animate-wiggle" : "animate-float",
        className
      )}
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </span>
  );
}

/* ============================================================
   STICKER BUTTON CLASSES — exported so sections stay in sync
   ============================================================ */
export const stickerButtonPrimary =
  "bg-[#C94708] text-white border-2 border-[#33363F] rounded-2xl shadow-[5px_5px_0_#33363F] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0_#33363F] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[3px_3px_0_#33363F] transition-all duration-200 font-bold";

export const stickerButtonSecondary =
  "bg-white text-[#33363F] border-2 border-[#33363F] rounded-2xl shadow-[5px_5px_0_#33363F] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0_#33363F] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[3px_3px_0_#33363F] transition-all duration-200 font-bold";

export const stickerButtonDark =
  "bg-[#F4F2EC] text-[#33363F] border-2 border-[#F4F2EC] rounded-2xl shadow-[5px_5px_0_rgba(242,102,26,0.9)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0_rgba(242,102,26,0.9)] active:translate-x-[1px] active:translate-y-[1px] transition-all duration-200 font-bold";

/* ============================================================
   CTAs marquee — convenience wrapper using i18n
   ============================================================ */
export function BrandMarquee({
  reverse = false,
  variant = "orange",
  className,
}: {
  reverse?: boolean;
  variant?: "orange" | "charcoal" | "cream";
  className?: string;
}) {
  const { tArray } = useLanguage();
  return (
    <MarqueeBand
      items={tArray("marquee.items")}
      reverse={reverse}
      variant={variant}
      className={className}
    />
  );
}
