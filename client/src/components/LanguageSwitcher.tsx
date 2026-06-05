import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  dir: "ltr" | "rtl";
}

const SUPPORTED_LANGUAGES: Language[] = [
  { code: "en", name: "English", nativeName: "English", flag: "🇺🇸", dir: "ltr" },
  { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸", dir: "ltr" },
  { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷", dir: "ltr" },
  { code: "de", name: "German", nativeName: "Deutsch", flag: "🇩🇪", dir: "ltr" },
  { code: "pt", name: "Portuguese", nativeName: "Português", flag: "🇵🇹", dir: "ltr" },
  { code: "it", name: "Italian", nativeName: "Italiano", flag: "🇮🇹", dir: "ltr" },
  { code: "zh", name: "Chinese", nativeName: "中文", flag: "🇨🇳", dir: "ltr" },
  { code: "ja", name: "Japanese", nativeName: "日本語", flag: "🇯🇵", dir: "ltr" },
  { code: "ko", name: "Korean", nativeName: "한국어", flag: "🇰🇷", dir: "ltr" },
  { code: "nl", name: "Dutch", nativeName: "Nederlands", flag: "🇳🇱", dir: "ltr" },
  { code: "tr", name: "Turkish", nativeName: "Türkçe", flag: "🇹🇷", dir: "ltr" },
  { code: "th", name: "Thai", nativeName: "ไทย", flag: "🇹🇭", dir: "ltr" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳", dir: "ltr" },
  { code: "ar", name: "Arabic", nativeName: "العربية", flag: "🇸🇦", dir: "rtl" },
  { code: "ru", name: "Russian", nativeName: "Русский", flag: "🇷🇺", dir: "ltr" },
];

export function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<Language>(SUPPORTED_LANGUAGES[0]);

  // Detect browser language on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem("preferredLanguage");
    if (savedLanguage) {
      const lang = SUPPORTED_LANGUAGES.find((l) => l.code === savedLanguage);
      if (lang) {
        setCurrentLanguage(lang);
        applyLanguage(lang);
      }
    } else {
      // Detect from browser
      const browserLang = navigator.language.split("-")[0];
      const lang = SUPPORTED_LANGUAGES.find((l) => l.code === browserLang) || SUPPORTED_LANGUAGES[0];
      setCurrentLanguage(lang);
      applyLanguage(lang);
    }
  }, []);

  const applyLanguage = (language: Language) => {
    // Save preference
    localStorage.setItem("preferredLanguage", language.code);
    
    // Apply RTL/LTR
    const html = document.documentElement;
    html.lang = language.code;
    html.dir = language.dir;
    
    // Apply text direction class
    if (language.dir === "rtl") {
      html.classList.add("rtl");
    } else {
      html.classList.remove("rtl");
    }

    // Emit custom event for app to handle language change
    window.dispatchEvent(
      new CustomEvent("languageChange", { detail: { language: language.code } })
    );
  };

  const handleLanguageChange = (language: Language) => {
    setCurrentLanguage(language);
    applyLanguage(language);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-background hover:bg-muted transition-colors duration-200"
        aria-label="Language selector"
        aria-expanded={isOpen}
      >
        <span className="text-lg">{currentLanguage.flag}</span>
        <span className="hidden sm:inline text-sm font-medium">{currentLanguage.nativeName}</span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-56 bg-popover border border-border rounded-lg shadow-lg z-50 overflow-hidden">
          <div className="max-h-96 overflow-y-auto">
            {SUPPORTED_LANGUAGES.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language)}
                className={`w-full px-4 py-3 text-left flex items-center gap-3 transition-colors duration-150 ${
                  currentLanguage.code === language.code
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-muted text-foreground"
                }`}
                aria-label={`Switch to ${language.name}`}
              >
                <span className="text-lg">{language.flag}</span>
                <div className="flex-1">
                  <div className="font-medium">{language.nativeName}</div>
                  <div className="text-xs opacity-70">{language.name}</div>
                </div>
                {currentLanguage.code === language.code && (
                  <div className="w-2 h-2 rounded-full bg-accent-foreground" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export { SUPPORTED_LANGUAGES };
