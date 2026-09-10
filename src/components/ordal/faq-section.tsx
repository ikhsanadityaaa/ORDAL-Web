"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/lib/i18n/context";
import { translations } from "@/lib/i18n/translations";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SectionHeader, Deco } from "@/components/ordal/creative";
import { Plus } from "lucide-react";

export function FAQSection() {
  const { t, language } = useLanguage();

  // Get FAQ items from translations
  const faqItems: { q: string; a: string }[] =
    (translations[language] as any).faq.items || [];

  // Highlight one word of the title with the orange highlighter mark
  const hlWord = language === "id" ? "ditanyain" : "asks";
  const titleParts = t("faq.title").split(hlWord);
  const faqTitle =
    titleParts.length > 1 ? (
      <>
        {titleParts[0]}
        <mark className="hl">{hlWord}</mark>
        {titleParts[1]}
      </>
    ) : (
      t("faq.title")
    );

  return (
    <section id="faq" className="relative py-24 md:py-28 bg-[#F4F2EC] overflow-hidden">
      {/* Soft color wash */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-[#F2661A]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-10 -left-24 w-96 h-96 bg-[#173E76]/5 rounded-full blur-3xl" />

      {/* Floating deco symbols */}
      <Deco className="top-24 right-[10%] text-4xl text-[#F2661A]/30" delay={0.6}>✦</Deco>
      <Deco className="bottom-40 left-[6%] text-3xl text-[#173E76]/25" delay={1.5} wiggle>(</Deco>

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        {/* Header */}
        <SectionHeader
          index="11"
          badge={t("faq.badge")}
          title={faqTitle}
          subtitle={t("faq.subtitle")}
          className="mb-12"
        />

        {/* FAQ Accordion — sticker cards */}
        <Accordion type="single" collapsible className="space-y-3.5">
          {faqItems.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                delay: Math.min(i * 0.04, 0.32),
                duration: 0.45,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <AccordionItem
                value={`item-${i}`}
                className="border-2 border-[#33363F] border-b-2 last:border-b-2 rounded-2xl bg-white px-4 sm:px-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[3px_3px_0_#33363F] data-[state=open]:shadow-[4px_4px_0_#33363F]"
              >
                <AccordionTrigger className="py-0 hover:no-underline [&>svg]:hidden group/fq">
                  <span className="flex items-center gap-3.5 sm:gap-4 flex-1 text-left py-4">
                    <span className="num-display shrink-0 w-9 h-9 md:w-10 md:h-10 rounded-xl bg-[#F4F2EC] border-2 border-[#33363F] flex items-center justify-center text-xs font-extrabold text-[#F2661A] transition-colors duration-300 group-data-[state=open]/fq:bg-[#F2661A] group-data-[state=open]/fq:text-[#33363F]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="flex-1 font-extrabold text-base md:text-lg text-[#33363F] leading-snug">
                      {item.q}
                    </span>
                    <span className="shrink-0 w-8 h-8 rounded-lg border-2 border-[#33363F] bg-white flex items-center justify-center transition-transform duration-300 group-data-[state=open]/fq:rotate-45">
                      <Plus className="w-4 h-4 text-[#33363F]" />
                    </span>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-5">
                  <p className="pl-[52px] md:pl-14 text-sm md:text-base text-[#33363F]/60 leading-relaxed">
                    {item.a}
                  </p>
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
