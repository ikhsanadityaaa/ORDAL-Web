"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

// Language type
export type Language = "id" | "en";

// Translation structure
export interface Translations {
  [key: string]: any;
}

// Context interface
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
  tArray: (key: string) => string[];
}

// Create context
const LanguageContext = createContext<LanguageContextType>({
  language: "id",
  setLanguage: () => {},
  toggleLanguage: () => {},
  t: (key) => key,
  tArray: (key) => [],
});

// Import translations
import { translations } from "./translations";

// Provider component
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("id");

  // Resolve initial language on mount:
  // 1. Explicit user choice (language toggle) — always wins
  // 2. Geo-based default set by middleware from the visitor's country
  //    (Indonesia → "id", elsewhere → "en") via the ordal-geo-lang cookie
  // 3. Fallback: "id" (ORDAL's home market)
  useEffect(() => {
    const savedLang = localStorage.getItem("ordal-language") as Language | null;
    if (savedLang === "id" || savedLang === "en") {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time restore of the user's saved choice
      setLanguageState(savedLang);
      return;
    }

    const geoLang = document.cookie
      .split("; ")
      .find((row) => row.startsWith("ordal-geo-lang="))
      ?.split("=")[1] as Language | undefined;

    if (geoLang === "id" || geoLang === "en") {
      setLanguageState(geoLang);
    } else {
      setLanguageState("id");
    }
  }, []);

  // Set language and save to localStorage
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("ordal-language", lang);
  };

  // Toggle between ID and EN
  const toggleLanguage = () => {
    const newLang = language === "id" ? "en" : "id";
    setLanguage(newLang);
  };

  // Get translation
  const t = (key: string): string => {
    const keys = key.split(".");
    let value: any = translations[language];

    for (const k of keys) {
      if (value === undefined || value === null) {
        return key;
      }
      value = value[k];
    }

    if (typeof value === "string") {
      return value;
    }
    return key;
  };

  // Get translation array
  const tArray = (key: string): string[] => {
    const keys = key.split(".");
    let value: any = translations[language];

    for (const k of keys) {
      if (value === undefined || value === null) {
        return [];
      }
      value = value[k];
    }

    if (Array.isArray(value)) {
      return value as string[];
    }
    return [];
  };

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage, toggleLanguage, t, tArray }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

// Hook to use language context
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
