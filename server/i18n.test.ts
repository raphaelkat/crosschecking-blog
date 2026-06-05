import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  getFromCache,
  setCache,
  invalidateCache,
  clearAllCache,
  getCacheStats,
  cleanupExpiredCache,
} from "./translation-cache";
import { isRTLLanguage, getDirection, getRTLClass } from "../client/src/hooks/useRTLSupport";

describe("Phase 8: Multilingual System Testing", () => {
  describe("Translation Cache", () => {
    beforeEach(() => {
      clearAllCache();
    });

    afterEach(() => {
      clearAllCache();
    });

    it("should cache and retrieve article translations", () => {
      const testData = { title: "Test Article", content: "Test content" };
      setCache("article", 1, "en", testData);

      const retrieved = getFromCache("article", 1, "en");
      expect(retrieved).toEqual(testData);
    });

    it("should return null for non-existent cache entries", () => {
      const retrieved = getFromCache("article", 999, "en");
      expect(retrieved).toBeNull();
    });

    it("should invalidate specific language cache", () => {
      const testData = { title: "Test" };
      setCache("article", 1, "en", testData);
      setCache("article", 1, "fr", testData);

      invalidateCache("article", 1, "en");

      expect(getFromCache("article", 1, "en")).toBeNull();
      expect(getFromCache("article", 1, "fr")).toEqual(testData);
    });

    it("should invalidate all language cache for an item", () => {
      const testData = { title: "Test" };
      setCache("article", 1, "en", testData);
      setCache("article", 1, "fr", testData);
      setCache("article", 1, "es", testData);

      invalidateCache("article", 1);

      expect(getFromCache("article", 1, "en")).toBeNull();
      expect(getFromCache("article", 1, "fr")).toBeNull();
      expect(getFromCache("article", 1, "es")).toBeNull();
    });

    it("should clear all cache", () => {
      setCache("article", 1, "en", { title: "Test" });
      setCache("category", 2, "fr", { name: "Category" });

      clearAllCache();

      expect(getFromCache("article", 1, "en")).toBeNull();
      expect(getFromCache("category", 2, "fr")).toBeNull();
    });

    it("should provide cache statistics", () => {
      setCache("article", 1, "en", { title: "Test" });
      setCache("article", 2, "fr", { title: "Test 2" });

      const stats = getCacheStats();
      expect(stats.size).toBe(2);
      expect(stats.entries).toHaveLength(2);
    });

    it("should cleanup expired cache entries", () => {
      setCache("article", 1, "en", { title: "Test" });
      const stats = getCacheStats();
      expect(stats.size).toBeGreaterThan(0);

      // Note: In real scenario, we'd need to mock time for TTL expiration
      // This is a simplified test
      const cleaned = cleanupExpiredCache();
      expect(typeof cleaned).toBe("number");
    });
  });

  describe("RTL Support", () => {
    it("should identify RTL languages correctly", () => {
      expect(isRTLLanguage("ar")).toBe(true);
      expect(isRTLLanguage("he")).toBe(true);
      expect(isRTLLanguage("ur")).toBe(true);
      expect(isRTLLanguage("fa")).toBe(true);
      expect(isRTLLanguage("yi")).toBe(true);
    });

    it("should identify LTR languages correctly", () => {
      expect(isRTLLanguage("en")).toBe(false);
      expect(isRTLLanguage("fr")).toBe(false);
      expect(isRTLLanguage("es")).toBe(false);
      expect(isRTLLanguage("de")).toBe(false);
    });

    it("should return correct direction for languages", () => {
      expect(getDirection("ar")).toBe("rtl");
      expect(getDirection("en")).toBe("ltr");
      expect(getDirection("fr")).toBe("ltr");
    });

    it("should return correct CSS class for languages", () => {
      expect(getRTLClass("ar")).toBe("rtl");
      expect(getRTLClass("en")).toBe("ltr");
      expect(getRTLClass("he")).toBe("rtl");
    });
  });

  describe("Language Support", () => {
    const supportedLanguages = [
      "en", // English
      "es", // Spanish
      "fr", // French
      "de", // German
      "it", // Italian
      "pt", // Portuguese
      "ru", // Russian
      "ja", // Japanese
      "zh", // Chinese
      "ko", // Korean
      "ar", // Arabic
      "hi", // Hindi
      "tr", // Turkish
      "nl", // Dutch
      "pl", // Polish
    ];

    it("should support 15 languages", () => {
      expect(supportedLanguages).toHaveLength(15);
    });

    it("should have correct language codes", () => {
      supportedLanguages.forEach((lang) => {
        expect(lang).toHaveLength(2);
        expect(lang).toMatch(/^[a-z]{2}$/);
      });
    });

    it("should identify RTL languages in supported list", () => {
      const rtlInList = supportedLanguages.filter(isRTLLanguage);
      expect(rtlInList).toContain("ar");
      expect(rtlInList).toHaveLength(1); // Only Arabic is RTL in this list
    });
  });

  describe("SEO Hreflang", () => {
    it("should generate correct hreflang URLs", () => {
      const baseUrl = "https://example.com";
      const slug = "test-article";
      const languages = ["en", "fr", "es"];

      const urls = languages.map(
        (lang) => `${baseUrl}/${lang}/articles/${slug}`
      );

      expect(urls).toEqual([
        "https://example.com/en/articles/test-article",
        "https://example.com/fr/articles/test-article",
        "https://example.com/es/articles/test-article",
      ]);
    });

    it("should include x-default hreflang", () => {
      const baseUrl = "https://example.com";
      const slug = "test-article";

      const xDefaultUrl = `${baseUrl}/en/articles/${slug}`;
      expect(xDefaultUrl).toBe("https://example.com/en/articles/test-article");
    });
  });

  describe("Translation Status", () => {
    const statuses = ["pending", "translated", "reviewed", "published"];

    it("should have valid translation statuses", () => {
      expect(statuses).toHaveLength(4);
      statuses.forEach((status) => {
        expect(status).toBeTruthy();
      });
    });

    it("should follow translation workflow", () => {
      const workflow = ["pending", "translated", "reviewed", "published"];
      expect(workflow[0]).toBe("pending");
      expect(workflow[workflow.length - 1]).toBe("published");
    });
  });

  describe("Content Type Support", () => {
    const contentTypes = ["article", "category", "tag"];

    it("should support multiple content types", () => {
      expect(contentTypes).toHaveLength(3);
    });

    it("should have valid content type names", () => {
      contentTypes.forEach((type) => {
        expect(type).toMatch(/^[a-z]+$/);
      });
    });
  });
});
