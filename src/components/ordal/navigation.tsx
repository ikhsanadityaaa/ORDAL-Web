"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/lib/i18n/context";
import { useAuthStore } from "@/lib/auth-store";
import { Button } from "@/components/ui/button";
import { Menu, X, User, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navigation() {
  const { language, setLanguage, t } = useLanguage();
  const { isAuthenticated, user, openAuthModal, openAccountModal } = useAuthStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: t("nav.features"), href: "#features" },
    { label: t("nav.howItWorks"), href: "#how-it-works" },
    { label: t("nav.pricing"), href: "#pricing" },
    { label: t("nav.faq"), href: "#faq" },
  ];

  const handleAuthClick = () => {
    if (isAuthenticated) {
      openAccountModal();
    } else {
      openAuthModal("login");
    }
  };

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 120, damping: 18, delay: 0.1 }}
      className="fixed top-0 left-0 right-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4"
    >
      <div
        className={cn(
          "max-w-6xl mx-auto rounded-2xl border-2 transition-all duration-300",
          isScrolled
            ? "bg-[#F4F2EC]/90 backdrop-blur-xl border-[#33363F] shadow-[4px_4px_0_#33363F]"
            : "bg-[#F4F2EC]/60 backdrop-blur-md border-[#33363F]/10"
        )}
      >
        <div className="flex items-center justify-between px-4 py-2.5 sm:px-5">
          {/* Logo — springy */}
          <a href="#" className="flex items-center gap-2.5 group shrink-0">
            <motion.div
              whileHover={{ rotate: -8, scale: 1.08 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className="w-8 h-8 rounded-lg bg-[#F2661A] border-2 border-[#33363F] flex items-center justify-center shadow-[2.5px_2.5px_0_#33363F]"
            >
              <span className="text-white font-extrabold text-sm leading-none">O</span>
            </motion.div>
            <span className="text-lg font-extrabold tracking-tight text-[#33363F]">
              ORDAL
            </span>
          </a>

          {/* Desktop links — playful micro-interactions */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <motion.a
                key={item.href}
                href={item.href}
                whileHover={{ y: -2, rotate: -2 }}
                whileTap={{ y: 0, rotate: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 20 }}
                className="px-3 py-1.5 text-sm font-semibold text-[#33363F]/65 hover:text-[#F2661A] rounded-lg transition-colors"
              >
                {item.label}
              </motion.a>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2.5">
            {/* Language switch — sliding pill */}
            <div className="flex items-center rounded-full border-2 border-[#33363F] bg-white p-0.5 shadow-[2px_2px_0_#33363F]">
              {(["id", "en"] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  aria-pressed={language === lang}
                  className={cn(
                    "relative px-2.5 py-0.5 text-[11px] font-extrabold tracking-widest rounded-full transition-colors",
                    language === lang ? "text-white" : "text-[#33363F]/60 hover:text-[#33363F]"
                  )}
                >
                  {language === lang && (
                    <motion.span
                      layoutId="nav-lang-pill"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      className="absolute inset-0 rounded-full bg-[#F2661A]"
                    />
                  )}
                  <span className="relative z-10">{lang.toUpperCase()}</span>
                </button>
              ))}
            </div>

            {/* Login / account */}
            <button
              onClick={handleAuthClick}
              className="hidden sm:flex items-center gap-2 text-sm font-semibold text-[#33363F]/65 hover:text-[#33363F] link-sweep transition-colors"
            >
              {isAuthenticated ? (
                <>
                  <div className="w-7 h-7 rounded-full bg-[#F2661A] border-2 border-[#33363F] flex items-center justify-center">
                    <span className="text-white text-xs font-extrabold">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="max-w-[80px] truncate">{user?.name}</span>
                </>
              ) : (
                <>
                  <User className="w-4 h-4" />
                  {t("nav.login")}
                </>
              )}
            </button>

            {/* CTA */}
            <Button
              onClick={() => {
                if (isAuthenticated) {
                  openAccountModal();
                } else {
                  openAuthModal("register");
                }
              }}
              className="hidden sm:inline-flex items-center gap-1.5 bg-[#F2661A] hover:bg-[#D65511] text-white border-2 border-[#33363F] font-bold px-4 py-2 rounded-xl text-sm shadow-[3px_3px_0_#33363F] hover:shadow-[5px_5px_0_#33363F] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all"
            >
              {t("nav.getStarted")}
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="md:hidden p-2 rounded-xl border-2 border-[#33363F] bg-white shadow-[2.5px_2.5px_0_#33363F] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
              aria-label="Toggle menu"
            >
              {isMobileOpen ? (
                <X className="w-4 h-4 text-[#33363F]" />
              ) : (
                <Menu className="w-4 h-4 text-[#33363F]" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="md:hidden overflow-hidden border-t-2 border-[#33363F]/10"
            >
              <div className="px-4 py-4 space-y-1.5">
                {navItems.map((item, i) => (
                  <motion.a
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileOpen(false)}
                    initial={{ x: -16, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.05 * i }}
                    className="flex items-center justify-between px-3 py-2.5 text-sm font-bold text-[#33363F]/70 hover:bg-[#33363F]/5 rounded-xl transition-colors"
                  >
                    {item.label}
                    <ArrowUpRight className="w-4 h-4 text-[#F2661A]" />
                  </motion.a>
                ))}
                <button
                  onClick={() => {
                    setIsMobileOpen(false);
                    handleAuthClick();
                  }}
                  className="w-full text-left px-3 py-2.5 text-sm font-bold text-[#33363F]/70 hover:bg-[#33363F]/5 rounded-xl transition-colors"
                >
                  {isAuthenticated
                    ? `${language === "id" ? "Hai" : "Hi"}, ${user?.name}`
                    : t("nav.login")}
                </button>
                <div className="px-3 pt-2">
                  <Button
                    onClick={() => {
                      setIsMobileOpen(false);
                      if (isAuthenticated) {
                        openAccountModal();
                      } else {
                        openAuthModal("register");
                      }
                    }}
                    className="w-full bg-[#F2661A] hover:bg-[#D65511] text-white border-2 border-[#33363F] font-bold py-2.5 rounded-xl shadow-[3px_3px_0_#33363F] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
                  >
                    {t("nav.getStarted")}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
