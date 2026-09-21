"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useLanguage } from "@/lib/i18n/context";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  stickerButtonPrimary,
  stickerButtonSecondary,
} from "@/components/ordal/creative";
import {
  CheckCircle2,
  Sparkles,
  Search,
  Target,
  Zap,
  Bell,
  Settings,
  Home,
  Briefcase,
  History,
  FolderOpen,
  ChevronRight,
} from "lucide-react";

const spring = { type: "spring", stiffness: 90, damping: 18 } as const;

const jobPlatforms = [
  {
    name: "JobStreet",
    logo: "/brands/jobstreet.png",
    badgePosition: "-top-5 left-[12%]",
    logoClassName: "h-8 w-auto",
    badgeLogoClassName: "h-8 w-auto max-w-none",
    width: 162,
    height: 32,
    cropBadge: true,
  },
  {
    name: "LinkedIn",
    logo: "/brands/linkedin.svg",
    badgePosition: "left-0 sm:-left-5 bottom-[18%]",
    logoClassName: "h-7 w-auto",
    badgeLogoClassName: "h-7 w-auto",
    width: 264,
    height: 66,
    cropBadge: false,
  },
  {
    name: "Glints",
    logo: "/brands/glints.png",
    badgePosition: "right-0 sm:-right-5 top-[17%]",
    logoClassName: "h-8 w-auto",
    badgeLogoClassName: "h-9 w-auto",
    width: 42,
    height: 32,
    cropBadge: false,
  },
  {
    name: "Indeed",
    logo: "/brands/indeed.svg",
    badgePosition: "-bottom-5 right-[14%]",
    logoClassName: "h-7 w-auto",
    badgeLogoClassName: "h-7 w-auto",
    width: 1486,
    height: 400,
    cropBadge: false,
  },
] as const;

export function HeroSection() {
  const { t, language } = useLanguage();
  const reduceMotion = useReducedMotion();

  const { scrollY } = useScroll();
  const mockupY = useTransform(scrollY, [0, 600], [0, 50]);

  // Highlight "ORDAL" inside the second headline line
  const highlight = t("hero.headlineHighlight");
  const parts = highlight.split("ORDAL");
  const headlineSecond =
    parts.length > 1 ? (
      <>
        {parts[0]}
        <mark className="hl text-[#F2661A]">ORDAL</mark>
        {parts[1]}
      </>
    ) : (
      highlight
    );

  return (
    <section className="relative pt-24 sm:pt-28 pb-0 overflow-hidden dot-pattern">
      {/* Soft color washes */}
      <div className="absolute top-10 -left-24 w-80 h-80 bg-[#F2661A]/10 rounded-full blur-3xl" />
      <div className="absolute top-40 -right-24 w-96 h-96 bg-[#173E76]/10 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        {/* Two-column layout: pitch on the left, ORDAL app right beside it */}
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 xl:gap-12 items-center">
          {/* ---------- Text column ---------- */}
          <div className="relative lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 16, rotate: 0 }}
              animate={{ opacity: 1, y: 0, rotate: -2 }}
              transition={{ delay: 0.15, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex items-center gap-2.5 chip-sticker mb-4"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#F2661A]" />
              <span className="label-chip !text-[10px]">{t("hero.badge")}</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="h-display text-[clamp(2.05rem,4.2vw,3.25rem)] leading-[1.04] text-[#33363F]"
            >
              {t("hero.headline")} {headlineSecond}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.38, duration: 0.6 }}
              className="mt-4 max-w-xl text-base sm:text-lg text-[#33363F]/60 leading-relaxed"
            >
              {t("hero.description")}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="mt-5 flex flex-col sm:flex-row gap-3 sm:gap-4"
            >
              <Button asChild size="lg" className="h-12 px-6 text-[15px] !rounded-2xl bg-[#F2661A] text-white border-2 border-[#33363F] rounded-2xl shadow-[5px_5px_0_#33363F] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0_#33363F] transition-all font-bold">
                <Link href="/#download">{t("hero.downloadWindows")}</Link>
              </Button>
              <Button asChild size="lg" className={`h-12 px-6 text-[15px] !rounded-2xl ${stickerButtonSecondary}`}>
                <Link href="/#download">{t("nav.getStarted")}</Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.65, duration: 0.6 }}
              className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs sm:text-sm font-semibold"
            >
              <span className="inline-flex items-center gap-1.5 text-[#33363F]/65">
                <CheckCircle2 className="w-4 h-4 text-[#173E76]" />
                {t("hero.trialInfo")}
              </span>
              <span className="text-[#F2661A]">✦</span>
              <span className="inline-flex items-center gap-1.5 text-[#33363F]">
                <CheckCircle2 className="w-4 h-4 text-[#F2661A]" />
                <span className="font-extrabold">{t("hero.pricingInfo")}</span>
              </span>
              <span className="text-[#F2661A]">✦</span>
              <span className="hidden sm:inline text-xs text-[#33363F]/60 font-medium">
                {t("hero.versionInfo")}
              </span>
            </motion.div>
          </div>

          {/* ---------- App mockup column — visible right beside the pitch ---------- */}
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.95, rotate: 1.5 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
            transition={{ delay: 0.45, ...spring }}
            style={{ y: mockupY }}
            className="relative lg:col-span-7"
          >
            <div className="pointer-events-none absolute -inset-x-10 -inset-y-16 hidden sm:block" aria-hidden>
              <div className="absolute inset-[8%] rounded-[50%] border border-[#173E76]/12" />
              <div className="absolute inset-[18%] rounded-[50%] border border-[#F2661A]/15" />
              <div className="absolute inset-x-[4%] inset-y-[27%] rounded-[50%] border border-[#33363F]/8" />
            </div>


            {/* Rotated color block behind the window */}
            <div className="absolute -inset-2.5 rounded-[1.75rem] bg-[#F2661A] rotate-[1.2deg]" aria-hidden />
            <div className="absolute -inset-2.5 rounded-[1.75rem] bg-[#173E76] -rotate-[1deg] translate-x-4 translate-y-4" aria-hidden />

            {/* Floating sticker cards — compositor-driven CSS bobbing
                (card-bob keyframes) instead of per-frame JS physics */}
            <div
              className="absolute -left-8 top-20 hidden xl:block z-20 w-52 sticker-flat animate-card-bob-a p-4"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <FolderOpen className="w-4 h-4 text-[#F2661A]" />
                <span className="text-xs font-extrabold text-[#33363F]">CV Uploaded</span>
              </div>
              <p className="text-xs text-[#33363F]/60 font-medium">Procurement.pdf</p>
              <div className="mt-2.5 h-2 bg-[#F4F2EC] border border-[#33363F]/15 rounded-full overflow-hidden">
                <div className="h-full w-full bg-[#173E76] rounded-full" />
              </div>
            </div>

            <div
              className="absolute -right-8 top-36 hidden xl:block z-20 w-52 sticker-flat animate-card-bob-b p-4"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <Target className="w-4 h-4 text-[#173E76]" />
                <span className="text-xs font-extrabold text-[#33363F]">New Match Found</span>
              </div>
              <p className="text-xs text-[#33363F]/60 font-medium">Procurement Specialist</p>
              <p className="text-xs text-[#33363F]/60 font-medium">
                {language === "id" ? "Contoh Perusahaan • Jakarta" : "Example Company • Jakarta"}
              </p>
              <div className="mt-2.5 flex items-center gap-1.5">
                <span className="text-[10px] px-2 py-0.5 bg-[#173E76] text-white rounded-full font-bold border border-[#33363F]/20">
                  {language === "id" ? "Cocok" : "Match"}
                </span>
                <span className="text-[10px] font-bold text-[#F2661A]">✦</span>
              </div>
            </div>

            {/* Window */}
            <div className="relative z-10 rounded-2xl overflow-hidden border-2 border-[#33363F] shadow-[12px_12px_0_rgba(51,54,63,0.9)] bg-white">
              <div className="absolute right-3 top-12 z-20 bg-[#33363F] px-2.5 py-1 text-[10px] font-bold text-white">
                {language === "id" ? "CONTOH TAMPILAN" : "INTERFACE EXAMPLE"}
              </div>
              {/* Window chrome */}
              <div className="flex items-center gap-2 px-4 py-2.5 bg-[#ECEBE4] border-b border-[#33363F]/10">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#FF5F57] border border-black/20" />
                  <div className="w-3 h-3 rounded-full bg-[#FEBC2E] border border-black/20" />
                  <div className="w-3 h-3 rounded-full bg-[#28C840] border border-black/20" />
                </div>
                <div className="flex-1 text-center text-xs text-[#33363F]/60 font-semibold tracking-wide">
                  ORDAL · Dashboard
                </div>
                <div className="w-12" />
              </div>

              {/* App content — light mode, like the real ORDAL app */}
              <div className="flex h-[380px] sm:h-[420px] lg:h-[400px] xl:h-[440px]">
                {/* Sidebar */}
                <div className="hidden sm:flex flex-col w-44 shrink-0 bg-[#F6F5F0] border-r border-[#33363F]/8 p-3">
                  <div className="flex items-center gap-2 px-2 py-2 mb-4">
                    <div className="w-6 h-6 rounded-md bg-[#F2661A] flex items-center justify-center">
                      <span className="text-white text-[10px] font-extrabold">O</span>
                    </div>
                    <span className="text-[#33363F] font-extrabold text-sm tracking-tight">
                      ORDAL
                    </span>
                  </div>

                  {[
                    { icon: Home, label: "Dashboard", active: true },
                    { icon: Search, label: language === "id" ? "Cari Kerja" : "Job Search" },
                    { icon: History, label: language === "id" ? "Riwayat Lamaran" : "Application History" },
                    { icon: FolderOpen, label: "CV Manager" },
                    { icon: Target, label: language === "id" ? "Target Saya" : "My Targets" },
                    { icon: Settings, label: language === "id" ? "Pengaturan" : "Settings" },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs mb-1 ${
                        item.active
                          ? "bg-[#F2661A]/10 text-[#D65511] font-bold"
                          : "text-[#33363F]/60 font-semibold"
                      }`}
                    >
                      <item.icon className="w-4 h-4 shrink-0" />
                      <span className="flex-1 min-w-0 truncate">{item.label}</span>
                    </div>
                  ))}

                  <div className="mt-auto p-2.5 rounded-xl bg-[#F2661A]/8 border border-[#F2661A]/25">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Zap className="w-3 h-3 text-[#D65511]" />
                      <span className="text-[10px] font-extrabold text-[#D65511]">
                        {language === "id" ? "Trial 3 Hari" : "3-Day Trial"}
                      </span>
                    </div>
                    <p className="text-[10px] text-[#33363F]/60 font-medium">
                      {language === "id" ? "Mulai saat Cari Kerja" : "Starts on first job search"}
                    </p>
                  </div>
                </div>

                {/* Main content */}
                <div className="flex-1 p-4 sm:p-5 overflow-hidden bg-white">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mb-4">
                    {[
                      { label: t("hero.statTargets"), value: language === "id" ? "Siap" : "Ready", icon: Target, color: "#F2661A" },
                      { label: t("hero.statJobs"), value: language === "id" ? "Dipantau" : "Tracked", icon: Search, color: "#173E76" },
                      { label: t("hero.statApplied"), value: language === "id" ? "Tercatat" : "Logged", icon: Briefcase, color: "#F2661A" },
                      { label: t("hero.statResponse"), value: language === "id" ? "Masuk" : "Inbox", icon: Bell, color: "#33363F" },
                    ].map((stat, i) => (
                      <div
                        key={i}
                        className="rounded-xl bg-[#F7F6F1] border border-[#33363F]/8 p-2.5"
                      >
                        <div className="flex items-center gap-2 mb-1.5">
                          <stat.icon className="w-3.5 h-3.5 shrink-0" style={{ color: stat.color }} />
                          <span className="text-[10px] text-[#33363F]/60 font-semibold truncate">
                            {stat.label}
                          </span>
                        </div>
                        <p className="num-display text-xl font-extrabold text-[#33363F]">
                          {stat.value}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-xl bg-[#F7F6F1] border border-[#33363F]/8 p-3.5 mb-3.5">
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="min-w-0">
                        <p className="text-xs font-extrabold text-[#33363F] tracking-wide truncate">
                          PROCUREMENT & PURCHASING
                        </p>
                        <p className="text-[10px] text-[#33363F]/60 mt-0.5 font-medium">
                          {language === "id" ? "Berjalan dengan" : "Running with"}{" "}
                          Procurement.pdf
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#28C840]/12 border border-[#28C840]/30 shrink-0">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#28C840] animate-status-pulse" />
                        <span className="text-[10px] font-bold text-[#1E9E3E]">
                          {language === "id" ? "Berjalan" : "Running"}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {[
                        language === "id" ? "Semua Platform" : "All Platforms",
                        "Jakarta",
                        "Tangerang",
                        "Fulltime",
                      ].map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] px-2 py-1 rounded-md bg-white text-[#33363F]/60 font-semibold border border-[#33363F]/10"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[10px] font-extrabold text-[#33363F]/60 uppercase tracking-widest">
                      {language === "id" ? "Lowongan Terbaru" : "Latest Openings"}
                    </p>
                    {[
                      { title: "Procurement Specialist", company: "PT Maju Bersama", location: "Jakarta", match: 92 },
                      { title: "Senior Buyer", company: "Global Supply Co", location: "Tangerang", match: 88 },
                      { title: "Purchasing Manager", company: "Indo Logistik", location: "Bekasi", match: 85 },
                    ].map((job, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -24 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.9 + i * 0.15 }}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-[#F7F6F1] border border-[#33363F]/8 hover:bg-[#F0EEE6] hover:border-[#33363F]/15 transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 shrink-0 rounded-lg bg-[#F2661A]/15 border border-[#F2661A]/25 flex items-center justify-center">
                            <Briefcase className="w-4 h-4 text-[#F2661A]" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-[#33363F] truncate">{job.title}</p>
                            <p className="text-[10px] text-[#33363F]/60 font-medium">
                              {job.company} • {job.location}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[10px] px-2 py-0.5 bg-[#F2661A]/10 text-[#D65511] rounded-full font-extrabold border border-[#F2661A]/25">
                            {job.match}%
                          </span>
                          <ChevronRight className="w-3.5 h-3.5 text-[#33363F]/30" />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="mt-14 border-t border-[#33363F]/15 py-7 sm:mt-16"
        >
          <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:items-center sm:justify-center sm:gap-x-10 sm:gap-y-4 lg:gap-x-14">
            {jobPlatforms.map((platform) => (
              <div
                key={platform.name}
                className="flex min-h-12 items-center justify-center gap-2.5 rounded-xl border border-[#33363F]/10 bg-white/55 px-4 py-2 sm:min-h-0 sm:border-0 sm:bg-transparent sm:px-0"
              >
                <Image
                  src={platform.logo}
                  alt=""
                  width={platform.width}
                  height={platform.height}
                  className={`object-contain ${platform.logoClassName}`}
                />
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
