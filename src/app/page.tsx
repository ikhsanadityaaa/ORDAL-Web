"use client";

import { useEffect } from "react";
import { MotionConfig } from "framer-motion";
import { useAuthStore } from "@/lib/auth-store";
import { Navigation } from "@/components/ordal/navigation";
import { HeroSection } from "@/components/ordal/hero-section";
import { ProblemSection } from "@/components/ordal/problem-section";
import { MeetSection } from "@/components/ordal/meet-section";
import { HowItWorksSection } from "@/components/ordal/how-it-works-section";
import { PathsSection } from "@/components/ordal/paths-section";
import { ControlSection } from "@/components/ordal/control-section";
import { ExclusionSection } from "@/components/ordal/exclusion-section";
import { PipelineSection } from "@/components/ordal/pipeline-section";
import { AnswersSection } from "@/components/ordal/answers-section";
import { ShowcaseSection } from "@/components/ordal/showcase-section";
import { PricingSection } from "@/components/ordal/pricing-section";
import { FAQSection } from "@/components/ordal/faq-section";
import { Footer } from "@/components/ordal/footer";
import { AuthModal } from "@/components/ordal/auth-modal";
import { AccountModal } from "@/components/ordal/account-modal";
import { DownloadModal } from "@/components/ordal/download-modal";
import { ChatWidget } from "@/components/ordal/chat-widget";
import { SourceDownloadButton } from "@/components/ordal/source-download-button";

export default function Home() {
  const { refreshUser } = useAuthStore();

  // Check auth status on mount
  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  // Handle URL query params for auth redirect
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const authParam = params.get("auth");

    if (authParam === "login" || authParam === "register") {
      // Small delay to ensure modals are mounted
      setTimeout(() => {
        useAuthStore.getState().openAuthModal(authParam);
        // Clean URL
        window.history.replaceState({}, "", "/");
      }, 300);
    }
  }, []);

  return (
    /* reducedMotion="user": visitors who set OS-level "reduce motion"
       get animations toned down automatically (entrances become fades) */
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen flex flex-col bg-[#F4F2EC]">
      {/* Navigation */}
      <Navigation />

      {/* Main content */}
      <main className="flex-1">
        <HeroSection />
        <ProblemSection />
        <MeetSection />
        <HowItWorksSection />
        <PathsSection />
        <ControlSection />
        <ExclusionSection />
        <PipelineSection />
        <AnswersSection />
        <ShowcaseSection />
        <PricingSection />
        <FAQSection />
      </main>

      {/* Footer (sticky at bottom via mt-auto in flex layout) */}
      <div className="mt-auto">
        <Footer />
      </div>

      {/* Modals */}
      <AuthModal />
      <AccountModal />
      <DownloadModal />

        {/* Live chat bot */}
        <ChatWidget />

        {/* Dev-preview only: one-click source zip download */}
        <SourceDownloadButton />
      </div>
    </MotionConfig>
  );
}
