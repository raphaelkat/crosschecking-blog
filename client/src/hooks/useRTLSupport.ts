import { useEffect } from "react";

// RTL languages
const RTL_LANGUAGES = ["ar", "he", "ur", "fa", "yi"];

/**
 * Phase 6: RTL support for Arabic and other RTL languages
 * Automatically sets document direction and applies RTL CSS classes
 */
export function useRTLSupport(language: string) {
  useEffect(() => {
    const isRTL = RTL_LANGUAGES.includes(language);
    const htmlElement = document.documentElement;

    // Set HTML direction
    htmlElement.dir = isRTL ? "rtl" : "ltr";
    htmlElement.lang = language;

    // Set lang attribute for accessibility
    htmlElement.setAttribute("lang", language);

    // Add/remove RTL class for CSS targeting
    if (isRTL) {
      htmlElement.classList.add("rtl");
      document.body.classList.add("rtl");
    } else {
      htmlElement.classList.remove("rtl");
      document.body.classList.remove("rtl");
    }

    // Apply RTL-specific CSS variables if needed
    if (isRTL) {
      document.documentElement.style.setProperty("--direction", "rtl");
      document.documentElement.style.setProperty("--margin-start", "auto");
      document.documentElement.style.setProperty("--margin-end", "0");
    } else {
      document.documentElement.style.setProperty("--direction", "ltr");
      document.documentElement.style.setProperty("--margin-start", "0");
      document.documentElement.style.setProperty("--margin-end", "auto");
    }

    return () => {
      htmlElement.dir = "ltr";
      htmlElement.classList.remove("rtl");
      document.body.classList.remove("rtl");
    };
  }, [language]);
}

/**
 * Check if a language is RTL
 */
export function isRTLLanguage(language: string): boolean {
  return RTL_LANGUAGES.includes(language);
}

/**
 * Get direction for a language
 */
export function getDirection(language: string): "rtl" | "ltr" {
  return isRTLLanguage(language) ? "rtl" : "ltr";
}

/**
 * CSS class helper for RTL
 */
export function getRTLClass(language: string): string {
  return isRTLLanguage(language) ? "rtl" : "ltr";
}
