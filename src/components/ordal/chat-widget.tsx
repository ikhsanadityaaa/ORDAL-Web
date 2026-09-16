"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLanguage } from "@/lib/i18n/context";
import { Button } from "@/components/ui/button";
import { AgentAvatar } from "@/components/ordal/agent-avatar";
import {
  AlertTriangle,
  MessageCircle,
  Send,
  ShieldCheck,
  X,
} from "lucide-react";

type ChatMsg = {
  role: "user" | "assistant";
  content: string;
  error?: boolean;
};

/** Profile photo of the agent — friendly bespectacled man, sticker style */
function BotAvatar() {
  return <AgentAvatar className="w-6 h-6 shrink-0 mt-0.5" ring="charcoal" />;
}

export function ChatWidget() {
  const { t, language, tArray } = useLanguage();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestions = tArray("chat.suggestions");
  const hasUserMessage = messages.some((m) => m.role === "user");

  // Keep the latest message in view
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, loading, open]);

  // Focus the input when the panel opens
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => inputRef.current?.focus(), 350);
      return () => clearTimeout(timer);
    }
  }, [open]);

  const send = async (raw: string) => {
    const text = raw.trim();
    if (!text || loading) return;

    const history: ChatMsg[] = [...messages, { role: "user", content: text }];
    setMessages(history);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language,
          messages: history.map(({ role, content }) => ({ role, content })),
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.reply) throw new Error("chat_failed");
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: String(data.reply) },
      ]);
    } catch {
      // AI unavailable (token/quota exhausted or timeout) — friendly fallback
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: t("chat.unavailable"), error: true },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ---------- Floating chat button ---------- */}
      <motion.div
        initial={{ opacity: 0, scale: 0, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 1.4, type: "spring", stiffness: 260, damping: 18 }}
        className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-[70] group"
      >
        {/* Hover tooltip — slides in from the button on hover */}
        {!open && (
          <span className="pointer-events-none hidden sm:flex absolute right-full top-1/2 -translate-y-1/2 mr-3.5 whitespace-nowrap items-center gap-1.5 rounded-xl border-2 border-[#33363F] bg-white px-3.5 py-2 text-xs font-bold text-[#33363F] shadow-[3px_3px_0_#33363F] opacity-0 translate-x-3 scale-95 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0 group-hover:scale-100">
            {t("chat.tooltip")}
            <span aria-hidden className="text-[#F2661A]">✦</span>
            {/* little arrow pointing at the button */}
            <span
              aria-hidden
              className="absolute left-full top-1/2 -translate-y-1/2 w-2 h-2 rotate-45 border-r-2 border-t-2 border-[#33363F] bg-white"
            />
          </span>
        )}

        <button
          onClick={() => setOpen((v) => !v)}
          aria-label={
            open
              ? language === "id"
                ? "Tutup chat ORDAL Assist"
                : "Close ORDAL Assist chat"
              : t("chat.tooltip")
          }
          aria-expanded={open}
          className={`
            relative flex items-center justify-center w-14 h-14 rounded-2xl
            bg-[#C94708] text-white border-2 border-[#33363F]
            shadow-[4px_4px_0_#33363F]
            transition-all duration-200
            hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_#33363F]
            hover:rotate-[-3deg]
            active:translate-x-0 active:translate-y-0 active:shadow-none
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#173E76] focus-visible:ring-offset-2
          `}
        >
          {/* Online dot */}
          {!open && (
            <span
              className="absolute -top-1.5 -right-1.5 flex w-4 h-4"
              aria-hidden
            >
              <span className="absolute inline-flex w-full h-full rounded-full bg-[#28C840] opacity-60 animate-ping" />
              <span className="relative inline-flex w-4 h-4 rounded-full bg-[#28C840] border-2 border-[#F4F2EC]" />
            </span>
          )}
          <AnimatePresence mode="wait" initial={false}>
            {open ? (
              <motion.span
                key="x"
                initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.18 }}
              >
                <X className="w-6 h-6" strokeWidth={2.75} />
              </motion.span>
            ) : (
              <motion.span
                key="chat"
                initial={{ rotate: 90, opacity: 0, scale: 0.6 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: -90, opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.18 }}
              >
                <MessageCircle className="w-6 h-6" strokeWidth={2.5} />
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </motion.div>

      {/* ---------- Chat panel ---------- */}
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label={t("chat.title")}
            initial={{ opacity: 0, y: 32, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.92 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            className={`
              fixed z-[65] flex flex-col overflow-hidden bg-white
              border-2 border-[#33363F] rounded-2xl
              shadow-[8px_8px_0_rgba(51,54,63,0.9)]
              left-4 right-4 bottom-[5.75rem]
              sm:left-auto sm:right-6 sm:bottom-24 sm:w-[380px]
              max-h-[min(560px,calc(100dvh-8rem))]
            `}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 bg-[#33363F] border-b-2 border-[#33363F] shrink-0">
              <AgentAvatar className="w-9 h-9 shrink-0" ring="cream" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-extrabold text-[#F4F2EC] leading-tight flex items-center gap-2">
                  {t("chat.title")}
                  <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wide text-[#28C840]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#28C840] animate-status-pulse" />
                    Online
                  </span>
                </p>
                <p className="text-[11px] text-[#F4F2EC]/60 font-medium truncate">
                  {t("chat.subtitle")}
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#F4F2EC]/70 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              role="log"
              aria-live="polite"
              className="flex-1 overflow-y-auto min-h-[200px] bg-[#F7F6F1] px-4 py-4 space-y-3 custom-scrollbar"
            >
              {/* Welcome bubble */}
              <div className="flex items-start gap-2">
                <BotAvatar />
                <div className="max-w-[85%] rounded-xl rounded-tl-md bg-white border-2 border-[#33363F]/10 px-3.5 py-2.5 text-sm text-[#33363F] leading-relaxed">
                  {t("chat.welcome")}
                </div>
              </div>

              {/* Suggestion chips — until the first user message */}
              {!hasUserMessage && (
                <div className="flex flex-wrap gap-2 pl-8">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      disabled={loading}
                      className="text-xs font-bold px-3 py-1.5 rounded-full bg-white text-[#33363F]/80 border-2 border-[#33363F]/15 hover:border-[#F2661A] hover:text-[#D65511] hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:translate-y-0"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              {/* Conversation */}
              {messages.map((m, i) =>
                m.role === "user" ? (
                  <div key={i} className="flex justify-end">
                    <div className="max-w-[85%] rounded-xl rounded-tr-md bg-[#C94708] text-white border-2 border-[#33363F] px-3.5 py-2.5 text-sm leading-relaxed font-medium">
                      {m.content}
                    </div>
                  </div>
                ) : (
                  <div key={i} className="flex items-start gap-2">
                    <BotAvatar />
                    <div
                      className={`max-w-[85%] rounded-xl rounded-tl-md px-3.5 py-2.5 text-sm leading-relaxed ${
                        m.error
                          ? "bg-[#FFF6EF] border-2 border-[#F2661A]/40 text-[#D65511] font-semibold"
                          : "bg-white border-2 border-[#33363F]/10 text-[#33363F]"
                      }`}
                    >
                      {m.error && (
                        <span className="inline-flex items-center gap-1.5 mb-1 text-[11px] font-extrabold uppercase tracking-wide">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          {language === "id" ? "Duh!" : "Oops!"}
                        </span>
                      )}
                      {m.content}
                    </div>
                  </div>
                )
              )}

              {/* Typing indicator */}
              {loading && (
                <div className="flex items-start gap-2">
                  <BotAvatar />
                  <div
                    className="rounded-xl rounded-tl-md bg-white border-2 border-[#33363F]/10 px-4 py-3.5 flex items-center gap-1.5"
                    aria-label={t("chat.thinking")}
                  >
                    {[0, 1, 2].map((d) => (
                      <span
                        key={d}
                        className="w-2 h-2 rounded-full bg-[#33363F]/40 animate-bounce"
                        style={{ animationDelay: `${d * 0.15}s` }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Guard note */}
            <div className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white border-t border-[#33363F]/10 shrink-0">
              <ShieldCheck className="w-3 h-3 text-[#173E76] shrink-0" />
              <p className="text-[10px] font-semibold text-[#33363F]/50 text-center leading-tight">
                {t("chat.offlineNote")}
              </p>
            </div>

            {/* Input row */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex gap-2 p-3 bg-white border-t-2 border-[#33363F]/10 shrink-0"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t("chat.placeholder")}
                disabled={loading}
                maxLength={500}
                aria-label={t("chat.placeholder")}
                className="flex-1 h-11 min-w-0 rounded-xl border-2 border-[#33363F]/15 bg-[#F7F6F1] px-3.5 text-sm text-[#33363F] placeholder:text-[#33363F]/40 focus:outline-none focus:border-[#F2661A] focus:bg-white transition-colors disabled:opacity-60"
              />
              <Button
                type="submit"
                size="icon"
                disabled={loading || !input.trim()}
                aria-label={t("chat.send")}
                className="w-11 h-11 shrink-0 rounded-xl bg-[#C94708] hover:bg-[#B83E06] text-white border-2 border-[#33363F] shadow-[2.5px_2.5px_0_#33363F] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0_#33363F] active:translate-x-0 active:translate-y-0 active:shadow-none transition-all disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[2.5px_2.5px_0_#33363F] disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
