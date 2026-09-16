"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/lib/i18n/context";
import { SectionHeader, Deco } from "@/components/ordal/creative";
import {
  LayoutDashboard,
  FolderOpen,
  Target,
  Activity,
  History,
  Settings,
  FileText,
  MapPin,
  Monitor,
  DollarSign,
  Briefcase,
  Building2,
  Clock,
  Send,
  Search,
  ScanSearch,
  CopyX,
} from "lucide-react";

type TabId =
  | "dashboard"
  | "cvManager"
  | "targetBuilder"
  | "processMonitor"
  | "history"
  | "settings";

const spring = { type: "spring", stiffness: 220, damping: 22 } as const;

export function ShowcaseSection() {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<TabId>("dashboard");

  const tabs: { id: TabId; label: string; icon: any }[] = [
    { id: "dashboard", label: t("showcase.tabs.dashboard"), icon: LayoutDashboard },
    { id: "cvManager", label: t("showcase.tabs.cvManager"), icon: FolderOpen },
    { id: "targetBuilder", label: t("showcase.tabs.targetBuilder"), icon: Target },
    { id: "processMonitor", label: t("showcase.tabs.processMonitor"), icon: Activity },
    { id: "history", label: t("showcase.tabs.history"), icon: History },
    { id: "settings", label: t("showcase.tabs.settings"), icon: Settings },
  ];

  // Highlight one word of the title with the orange highlighter mark
  const hlWord = language === "id" ? "dalam" : "inside";
  const titleParts = t("showcase.title").split(hlWord);
  const showcaseTitle =
    titleParts.length > 1 ? (
      <>
        {titleParts[0]}
        <mark className="hl">{hlWord}</mark>
        {titleParts[1]}
      </>
    ) : (
      t("showcase.title")
    );

  return (
    <section className="relative py-24 md:py-28 bg-[#F4F2EC] overflow-hidden dot-pattern">
      {/* Soft color wash */}
      <div className="absolute top-0 -right-24 w-96 h-96 bg-[#173E76]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 -left-24 w-96 h-96 bg-[#F2661A]/5 rounded-full blur-3xl" />

      {/* Floating deco symbols */}
      <Deco className="top-24 right-[9%] text-4xl text-[#F2661A]/30" delay={0.5}>✦</Deco>
      <Deco className="bottom-32 left-[5%] text-3xl text-[#173E76]/25" delay={1.4} wiggle>(</Deco>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        {/* Header */}
        <SectionHeader
          index="09"
          badge={t("showcase.badge")}
          title={showcaseTitle}
          subtitle={t("showcase.subtitle")}
          className="mb-12 md:mb-14"
        />

        {/* Tab bar — chip-sticker buttons with a sliding active pill */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={spring}
          className="mb-8 md:mb-10 max-w-5xl mx-auto"
        >
          <div
            role="tablist"
            aria-label={t("showcase.badge")}
            className="flex gap-2.5 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <motion.button
                  key={tab.id}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveTab(tab.id)}
                  whileHover={isActive ? undefined : { y: -2, rotate: -1.5 }}
                  whileTap={{ scale: 0.94 }}
                  className={`relative shrink-0 snap-start rounded-xl px-4 py-2.5 text-sm font-bold whitespace-nowrap border-2 transition-colors duration-200 ${
                    isActive
                      ? "border-transparent text-[#33363F]"
                      : "border-[#33363F]/15 bg-white/70 text-[#33363F]/60 hover:border-[#33363F]/40 hover:text-[#33363F]"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="showcase-tab-pill"
                      transition={{ type: "spring", stiffness: 420, damping: 32 }}
                      style={{ rotate: -2 }}
                      className="absolute inset-0 rounded-xl bg-[#F2661A] border-2 border-[#33363F] shadow-[4px_4px_0_#33363F]"
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* App window — sticker frame with rotated color blocks behind */}
        <motion.div
          initial={{ opacity: 0, y: 64, scale: 0.96, rotate: 1.2 }}
          whileInView={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={spring}
          className="max-w-5xl mx-auto relative"
        >
          {/* Rotated color blocks behind the window */}
          <div className="absolute -inset-3 rounded-[2rem] bg-[#F2661A] rotate-[1.2deg]" aria-hidden />
          <div className="absolute -inset-3 rounded-[2rem] bg-[#173E76] -rotate-[1deg] translate-x-4 translate-y-4" aria-hidden />

          {/* Window */}
          <div className="relative rounded-2xl overflow-hidden border-2 border-[#33363F] shadow-[10px_10px_0_#33363F] bg-white">
            {/* Window chrome */}
            <div className="flex items-center gap-2 px-4 py-3 bg-[#ECEBE4] border-b border-[#33363F]/10">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-[#FF5F57] border border-black/20" />
                <div className="w-3 h-3 rounded-full bg-[#FEBC2E] border border-black/20" />
                <div className="w-3 h-3 rounded-full bg-[#28C840] border border-black/20" />
              </div>
              <div className="flex-1 text-center text-xs text-[#33363F]/60 font-semibold tracking-wide">
                ORDAL · {tabs.find((tab) => tab.id === activeTab)?.label}
              </div>
              <div className="w-12" />
            </div>

            {/* Tab content */}
            <div className="h-[420px] sm:h-[460px] overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 36, scale: 0.96, rotate: 0.8 }}
                  animate={{ opacity: 1, x: 0, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, x: -28, scale: 0.96 }}
                  transition={{ type: "spring", stiffness: 300, damping: 26 }}
                  className="h-full"
                >
                  {activeTab === "dashboard" && <DashboardScreen language={language} />}
                  {activeTab === "cvManager" && <CVManagerScreen language={language} />}
                  {activeTab === "targetBuilder" && <TargetBuilderScreen language={language} />}
                  {activeTab === "processMonitor" && <ProcessMonitorScreen language={language} />}
                  {activeTab === "history" && <HistoryScreen language={language} />}
                  {activeTab === "settings" && <SettingsScreen language={language} />}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ============ SCREEN COMPONENTS ============ */

function ScreenShell({
  children,
  language,
}: {
  children: React.ReactNode;
  language: string;
}) {
  return (
    <div className="flex h-full">
      {/* Mini sidebar */}
      <div className="hidden md:flex flex-col w-40 bg-[#F6F5F0] border-r border-[#33363F]/8 p-2 shrink-0">
        {[
          { icon: LayoutDashboard, label: "Dashboard", active: true },
          { icon: Search, label: language === "id" ? "Cari Kerja" : "Job Search" },
          { icon: History, label: language === "id" ? "Riwayat Lamaran" : "Application History" },
          { icon: FolderOpen, label: "CV Manager" },
          { icon: Target, label: language === "id" ? "Target Saya" : "My Targets" },
          { icon: Settings, label: language === "id" ? "Pengaturan" : "Settings" },
        ].map((item, i) => (
          <div
            key={i}
            className={`flex items-center gap-2 px-2.5 py-2 rounded-lg text-[11px] mb-0.5 ${
              item.active
                ? "bg-[#F2661A]/10 text-[#D65511] font-bold"
                : "text-[#33363F]/60 font-semibold"
            }`}
          >
            <item.icon className="w-3.5 h-3.5 shrink-0" />
            <span className="flex-1 min-w-0 truncate">{item.label}</span>
          </div>
        ))}
      </div>
      {/* Content */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto bg-white">{children}</div>
    </div>
  );
}

function DashboardScreen({ language }: { language: string }) {
  const stats = [
    { label: language === "id" ? "Target Aktif" : "Active Targets", value: "8", icon: Target, color: "#F2661A" },
    { label: language === "id" ? "Lowongan Ditemukan" : "Jobs Found", value: "24", icon: Search, color: "#173E76" },
    { label: language === "id" ? "Lamaran Diproses" : "Applications Processed", value: "312", icon: Briefcase, color: "#F2661A" },
    { label: language === "id" ? "Response" : "Responses", value: "18", icon: Clock, color: "#33363F" },
  ];

  const activity = language === "id"
    ? [
        { text: "Lamaran terkirim: Procurement Specialist di PT Maju", time: "2 mnt lalu", type: "sent" },
        { text: "Lowongan baru ditemukan: Senior Buyer di Global Supply", time: "15 mnt lalu", type: "found" },
        { text: "Duplikat di-skip: Purchasing Staff di Indo Logistik", time: "1 jam lalu", type: "skip" },
        { text: "Response diterima: Interview invitation dari PT Sinar", time: "3 jam lalu", type: "response" },
      ]
    : [
        { text: "Application sent: Procurement Specialist at PT Maju", time: "2 min ago", type: "sent" },
        { text: "New opening found: Senior Buyer at Global Supply", time: "15 min ago", type: "found" },
        { text: "Duplicate skipped: Purchasing Staff at Indo Logistik", time: "1 hour ago", type: "skip" },
        { text: "Response received: Interview invitation from PT Sinar", time: "3 hours ago", type: "response" },
      ];

  return (
    <ScreenShell language={language}>
      <div className="space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {stats.map((stat, i) => (
            <div key={i} className="rounded-xl bg-[#F7F6F1] border border-[#33363F]/8 p-3">
              <div className="flex items-center gap-2 mb-1 min-w-0">
                <stat.icon className="w-3.5 h-3.5 shrink-0" style={{ color: stat.color }} />
                <span className="text-[10px] text-[#33363F]/60 font-medium truncate">{stat.label}</span>
              </div>
              <p className="text-xl font-bold text-[#33363F]">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Active target */}
        <div className="rounded-xl bg-[#F7F6F1] border border-[#33363F]/8 p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-[#33363F]">PROCUREMENT & PURCHASING</p>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#28C840]/12 border border-[#28C840]/30">
              <div className="w-1 h-1 rounded-full bg-[#28C840] animate-status-pulse" />
              <span className="text-[10px] font-medium text-[#1E9E3E]">
                {language === "id" ? "Berjalan" : "Running"}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              language === "id" ? "Semua Platform" : "All Platforms",
              "Jakarta",
              "Tangerang",
              "Full Time",
            ].map((tag) => (
              <span key={tag} className="text-[10px] px-2 py-0.5 rounded-md bg-white text-[#33363F]/60 font-medium border border-[#33363F]/10">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Activity feed */}
        <div>
          <p className="text-[10px] font-semibold text-[#33363F]/60 uppercase tracking-wide mb-2">
            {language === "id" ? "Aktivitas Terbaru" : "Recent Activity"}
          </p>
          <div className="space-y-2">
            {activity.map((act, i) => (
              <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg bg-[#F7F6F1] border border-[#33363F]/8">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                    act.type === "sent"
                      ? "bg-green-500/10"
                      : act.type === "skip"
                      ? "bg-yellow-500/10"
                      : act.type === "response"
                      ? "bg-blue-500/10"
                      : "bg-[#F2661A]/10"
                  }`}
                >
                  {act.type === "sent" && <Send className="w-3.5 h-3.5 text-green-600" />}
                  {act.type === "skip" && <CopyX className="w-3.5 h-3.5 text-yellow-600" />}
                  {act.type === "response" && <Clock className="w-3.5 h-3.5 text-blue-600" />}
                  {act.type === "found" && <Search className="w-3.5 h-3.5 text-[#F2661A]" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-[#33363F]/80 truncate">{act.text}</p>
                  <p className="text-[10px] text-[#33363F]/60">{act.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ScreenShell>
  );
}

function CVManagerScreen({ language }: { language: string }) {
  const cvs = [
    { name: "Procurement CV.pdf", size: "284 KB", date: language === "id" ? "2 hari lalu" : "2 days ago", targets: 4, color: "#F2661A" },
    { name: "Marketing CV.pdf", size: "312 KB", date: language === "id" ? "5 hari lalu" : "5 days ago", targets: 3, color: "#173E76" },
    { name: "General CV.pdf", size: "298 KB", date: language === "id" ? "1 minggu lalu" : "1 week ago", targets: 1, color: "#28C840" },
  ];

  return (
    <ScreenShell language={language}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold text-[#33363F]">
            {language === "id" ? "CV Manager" : "CV Manager"}
          </p>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#C94708] text-white text-[10px] font-semibold">
            <FileText className="w-3 h-3" />
            {language === "id" ? "Upload CV" : "Upload CV"}
          </button>
        </div>

        {/* CV cards */}
        <div className="grid sm:grid-cols-3 gap-3">
          {cvs.map((cv, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-4 rounded-xl bg-[#F7F6F1] border border-[#33363F]/8 hover:bg-[#F0EEE6] hover:border-[#33363F]/15 transition-colors"
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                style={{ background: `${cv.color}20` }}
              >
                <FileText className="w-5 h-5" style={{ color: cv.color }} />
              </div>
              <p className="text-xs font-medium text-[#33363F] truncate">{cv.name}</p>
              <p className="text-[10px] text-[#33363F]/60 mt-1">{cv.size} • {cv.date}</p>
              <div className="mt-3 pt-3 border-t border-[#33363F]/8">
                <p className="text-[10px] text-[#33363F]/60">
                  {cv.targets} {language === "id" ? "target terhubung" : "linked targets"}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Upload zone */}
        <div className="p-8 rounded-xl border-2 border-dashed border-[#33363F]/15 flex flex-col items-center justify-center text-center">
          <FileText className="w-8 h-8 text-[#33363F]/25 mb-2" />
          <p className="text-xs text-[#33363F]/60">
            {language === "id" ? "Drag & drop CV ke sini" : "Drag & drop your CV here"}
          </p>
          <p className="text-[10px] text-[#33363F]/60 mt-1">PDF, DOC, DOCX • Max 5MB</p>
        </div>
      </div>
    </ScreenShell>
  );
}

function TargetBuilderScreen({ language }: { language: string }) {
  return (
    <ScreenShell language={language}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold text-[#33363F]">Target Builder</p>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#C94708] text-white text-[10px] font-semibold">
            <Target className="w-3 h-3" />
            {language === "id" ? "Target Baru" : "New Target"}
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Left: target list */}
          <div className="space-y-2">
            {[
              { name: "Procurement & Purchasing", active: true },
              { name: "Supply Chain Management", active: true },
              { name: "Digital Marketing", active: false },
            ].map((target, i) => (
              <div
                key={i}
                className={`p-3 rounded-xl border transition-colors ${
                  target.active
                    ? "bg-[#F2661A]/10 border-[#F2661A]/25"
                    : "bg-[#F7F6F1] border-[#33363F]/8"
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-[#33363F]">{target.name}</p>
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${
                      target.active ? "bg-[#28C840] animate-status-pulse" : "bg-[#33363F]/20"
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Right: target detail */}
          <div className="p-4 rounded-xl bg-[#F7F6F1] border border-[#33363F]/8 space-y-3">
            <div>
              <p className="text-[10px] text-[#33363F]/60 uppercase font-bold mb-1">
                {language === "id" ? "CV TERPILIH" : "SELECTED CV"}
              </p>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-white border border-[#33363F]/8">
                <FileText className="w-3.5 h-3.5 text-[#F2661A]" />
                <span className="text-[10px] text-[#33363F]/70">Procurement CV.pdf</span>
              </div>
            </div>

            <div>
              <p className="text-[10px] text-[#33363F]/60 uppercase font-bold mb-1">
                {language === "id" ? "POSISI" : "POSITIONS"}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {["Procurement", "Purchasing", "Buyer", "Sourcing"].map((pos) => (
                  <span key={pos} className="text-[10px] px-2 py-0.5 rounded-md bg-[#F2661A]/10 text-[#D65511] font-medium">
                    {pos}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-[10px] text-[#33363F]/60 uppercase font-bold mb-1 flex items-center gap-1">
                  <MapPin className="w-2.5 h-2.5" /> {language === "id" ? "LOKASI" : "LOCATION"}
                </p>
                <span className="text-[10px] text-[#33363F]/70">Jakarta, Tangerang</span>
              </div>
              <div>
                <p className="text-[10px] text-[#33363F]/60 uppercase font-bold mb-1 flex items-center gap-1">
                  <Monitor className="w-2.5 h-2.5" /> {language === "id" ? "PLATFORM" : "PLATFORM"}
                </p>
                <span className="text-[10px] text-[#33363F]/70">
                  {language === "id" ? "Semua Platform" : "All Platforms"}
                </span>
              </div>
              <div>
                <p className="text-[10px] text-[#33363F]/60 uppercase font-bold mb-1 flex items-center gap-1">
                  <DollarSign className="w-2.5 h-2.5" /> {language === "id" ? "GAJI" : "SALARY"}
                </p>
                <span className="text-[10px] text-[#33363F]/70">Rp 8jt - 15jt</span>
              </div>
              <div>
                <p className="text-[10px] text-[#33363F]/60 uppercase font-bold mb-1 flex items-center gap-1">
                  <Briefcase className="w-2.5 h-2.5" /> {language === "id" ? "JENIS" : "TYPE"}
                </p>
                <span className="text-[10px] text-[#33363F]/70">Full Time</span>
              </div>
            </div>

            <div>
              <p className="text-[10px] text-red-500/70 uppercase font-bold mb-1">
                ✕ {language === "id" ? "JANGAN LAMAR" : "DON'T APPLY"}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {["Sales", "Internship", "PT Example"].map((ex) => (
                  <span key={ex} className="text-[10px] px-2 py-0.5 rounded-md bg-red-500/10 text-red-500 font-medium">
                    {ex}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ScreenShell>
  );
}

function ProcessMonitorScreen({ language }: { language: string }) {
  const processes = language === "id"
    ? [
        { job: "Procurement Specialist · PT Maju Bersama", step: "Analisis", progress: 100, status: "done" },
        { job: "Senior Buyer · Global Supply Co", step: "Cek Kesesuaian", progress: 75, status: "processing" },
        { job: "Purchasing Staff · Indo Logistik", step: "Cek Duplikat", progress: 50, status: "processing" },
        { job: "Sourcing Specialist · PT Sinar Jaya", step: "Menunggu Apply", progress: 25, status: "pending" },
      ]
    : [
        { job: "Procurement Specialist · PT Maju Bersama", step: "Analysis", progress: 100, status: "done" },
        { job: "Senior Buyer · Global Supply Co", step: "Match Check", progress: 75, status: "processing" },
        { job: "Purchasing Staff · Indo Logistik", step: "Duplicate Check", progress: 50, status: "processing" },
        { job: "Sourcing Specialist · PT Sinar Jaya", step: "Waiting to Apply", progress: 25, status: "pending" },
      ];

  const stepIcons = [ScanSearch, Target, CopyX, Send];

  return (
    <ScreenShell language={language}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold text-[#33363F]">
            {language === "id" ? "Process Monitor" : "Process Monitor"}
          </p>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#28C840]/12 border border-[#28C840]/30">
            <div className="w-1.5 h-1.5 rounded-full bg-[#28C840] animate-status-pulse" />
            <span className="text-[10px] font-medium text-[#1E9E3E]">
              {language === "id" ? "4 proses aktif" : "4 active processes"}
            </span>
          </div>
        </div>

        {/* Pipeline steps indicator */}
        <div className="flex items-center justify-center gap-2 py-3">
          {stepIcons.map((Icon, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                i < 2 ? "bg-[#F2661A]/10" : "bg-[#F7F6F1]"
              }`}>
                <Icon className={`w-4 h-4 ${i < 2 ? "text-[#F2661A]" : "text-[#33363F]/30"}`} />
              </div>
              {i < stepIcons.length - 1 && (
                <div className={`w-8 h-px ${i < 1 ? "bg-[#F2661A]/50" : "bg-[#33363F]/10"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Process list */}
        <div className="space-y-2">
          {processes.map((proc, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-3 rounded-xl bg-[#F7F6F1] border border-[#33363F]/8"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-[11px] text-[#33363F]/80 font-medium truncate">{proc.job}</p>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-semibold shrink-0 ml-2 ${
                    proc.status === "done"
                      ? "bg-green-500/10 text-green-600"
                      : "bg-[#F2661A]/10 text-[#D65511]"
                  }`}
                >
                  {proc.step}
                </span>
              </div>
              {/* Progress bar — scaleX (compositor) instead of width:
                  animating width triggers layout on every frame */}
              <div className="h-1.5 bg-[#33363F]/8 rounded-full overflow-hidden">
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: proc.progress / 100 }}
                  style={{ transformOrigin: "left" }}
                  transition={{ delay: 0.5 + i * 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className={`h-full rounded-full ${
                    proc.status === "done" ? "bg-[#28C840]" : "bg-[#F2661A]"
                  }`}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </ScreenShell>
  );
}

function HistoryScreen({ language }: { language: string }) {
  const history = [
    { job: "Procurement Specialist", company: "PT Maju Bersama", status: "applied", date: "Hari ini", color: "text-green-600", bg: "bg-green-500/10" },
    { job: "Senior Buyer", company: "Global Supply Co", status: "processed", date: "Hari ini", color: "text-[#D65511]", bg: "bg-[#F2661A]/10" },
    { job: "Purchasing Manager", company: "Indo Logistik", status: "response", date: "Kemarin", color: "text-blue-600", bg: "bg-blue-500/10" },
    { job: "Sourcing Specialist", company: "PT Sinar Jaya", status: "rejected", date: "Kemarin", color: "text-red-500", bg: "bg-red-500/10" },
    { job: "Procurement Staff", company: "CV Berkah", status: "skipped", date: language === "id" ? "2 hari lalu" : "2 days ago", color: "text-yellow-600", bg: "bg-yellow-500/10" },
  ];

  const statusLabels = language === "id"
    ? { applied: "Dilamar", processed: "Diproses", response: "Response", rejected: "Ditolak", skipped: "Di-skip" }
    : { applied: "Applied", processed: "Processed", response: "Response", rejected: "Rejected", skipped: "Skipped" };

  return (
    <ScreenShell language={language}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold text-[#33363F]">
            {language === "id" ? "Riwayat Lamaran" : "Application History"}
          </p>
          <div className="flex gap-2">
            {["Semua", "Applied", "Response", "Rejected"].map((filter, i) => (
              <button
                key={filter}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-medium ${
                  i === 0
                    ? "bg-[#C94708] text-white"
                    : "bg-[#F7F6F1] text-[#33363F]/60 border border-[#33363F]/8"
                }`}
              >
                {language === "id" && filter === "Semua" ? "Semua" : filter}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          {history.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="flex items-center gap-3 p-3 rounded-xl bg-white border border-[#33363F]/8"
            >
              <div className="w-9 h-9 rounded-lg bg-[#F7F6F1] flex items-center justify-center shrink-0">
                <Building2 className="w-4 h-4 text-[#33363F]/60" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-[#33363F] truncate">{item.job}</p>
                <p className="text-[10px] text-[#33363F]/60">{item.company} • {item.date}</p>
              </div>
              <span className={`text-[10px] px-2.5 py-1 rounded-full font-semibold shrink-0 ${item.bg} ${item.color}`}>
                {(statusLabels as any)[item.status]}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </ScreenShell>
  );
}

function SettingsScreen({ language }: { language: string }) {
  const settings = [
    {
      section: language === "id" ? "Preferensi Pekerjaan" : "Job Preferences",
      items: language === "id"
        ? [
            { label: "Notifikasi lowongan baru", on: true },
            { label: "Otomatis apply jika match > 90%", on: true },
            { label: "Batasi lamaran per hari", on: true },
          ]
        : [
            { label: "New opening notifications", on: true },
            { label: "Auto apply if match > 90%", on: true },
            { label: "Limit applications per day", on: true },
          ],
    },
    {
      section: language === "id" ? "Preferensi Otomasi" : "Automation Preferences",
      items: language === "id"
        ? [
            { label: "Jalankan pencarian setiap 30 menit", on: true },
            { label: "Skip lowongan tanpa gaji", on: false },
            { label: "Prioritaskan remote work", on: false },
          ]
        : [
            { label: "Run search every 30 minutes", on: true },
            { label: "Skip listings without salary", on: false },
            { label: "Prioritize remote work", on: false },
          ],
    },
  ];

  return (
    <ScreenShell language={language}>
      <div className="space-y-5">
        <p className="text-sm font-bold text-[#33363F]">
          {language === "id" ? "Pengaturan" : "Settings"}
        </p>

        {settings.map((section, i) => (
          <div key={i}>
            <p className="text-[10px] font-bold text-[#33363F]/60 uppercase tracking-wide mb-2">
              {section.section}
            </p>
            <div className="space-y-2">
              {section.items.map((item, j) => (
                <div
                  key={j}
                  className="flex items-center justify-between p-3 rounded-xl bg-[#F7F6F1] border border-[#33363F]/8"
                >
                  <span className="text-xs text-[#33363F]/75">{item.label}</span>
                  {/* Toggle */}
                  <div
                    className={`w-9 h-5 rounded-full relative transition-colors shrink-0 ${
                      item.on ? "bg-[#F2661A]" : "bg-[#33363F]/10"
                    }`}
                  >
                    <div
                      className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all"
                      style={{ left: item.on ? "18px" : "2px" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Account */}
        <div className="p-4 rounded-xl bg-[#F7F6F1] border border-[#33363F]/8">
          <p className="text-[10px] font-bold text-[#33363F]/60 uppercase tracking-wide mb-3">
            {language === "id" ? "Akun" : "Account"}
          </p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#F2661A] flex items-center justify-center shrink-0">
              <span className="text-white text-sm font-bold">A</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-[#33363F]">adit@email.com</p>
              <p className="text-[10px] text-[#33363F]/60">ORD-USER-8F2K91</p>
            </div>
            <span className="inline-flex items-center gap-1 text-[10px] px-2.5 py-1 rounded-full bg-[#28C840]/12 border border-[#28C840]/30 text-[#1E9E3E] font-semibold shrink-0">
              {language === "id" ? "Aktif" : "Active"}
            </span>
          </div>
        </div>
      </div>
    </ScreenShell>
  );
}
