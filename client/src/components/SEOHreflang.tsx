import { useEffect } from "react";
// SEO hreflang component for multilingual articles

interface HreflangProps {
  articleSlug: string;
  currentLanguage: string;
  availableLanguages: string[];
}

/**
 * Phase 5: SEO hreflang tags for multilingual content
 * Adds hreflang link tags to document head for search engine optimization
 */
export function SEOHreflang({
  articleSlug,
  currentLanguage,
  availableLanguages,
}: HreflangProps) {
  useEffect(() => {
    // Get base URL
    const baseUrl = window.location.origin;

    // Remove existing hreflang tags
    const existingHreflang = document.querySelectorAll('link[rel="alternate"]');
    existingHreflang.forEach((tag) => tag.remove());

    // Add hreflang tags for all available languages
    availableLanguages.forEach((lang) => {
      const link = document.createElement("link");
      link.rel = "alternate";
      link.setAttribute('hreflang', lang);
      link.href = `${baseUrl}/${lang}/articles/${articleSlug}`;
      document.head.appendChild(link);
    });

    // Add x-default hreflang (English as default)
    const xDefaultLink = document.createElement("link");
    xDefaultLink.rel = "alternate";
    xDefaultLink.setAttribute('hreflang', 'x-default');
    xDefaultLink.href = `${baseUrl}/en/articles/${articleSlug}`;
    document.head.appendChild(xDefaultLink);

    // Add canonical tag
    const canonical = document.createElement("link");
    canonical.rel = "canonical";
    canonical.href = `${baseUrl}/${currentLanguage}/articles/${articleSlug}`;
    document.head.appendChild(canonical);

    return () => {
      // Cleanup hreflang tags on unmount
      document.querySelectorAll('link[rel="alternate"]').forEach((tag) => {
        if (tag.getAttribute("hrefLang")) tag.remove();
      });
      document.querySelector('link[rel="canonical"]')?.remove();
    };
  }, [articleSlug, currentLanguage, availableLanguages]);

  return null;
}

/**
 * Helper to generate localized article URL
 */
export function getLocalizedArticleUrl(
  slug: string,
  language: string,
  baseUrl?: string
): string {
  const url = baseUrl || window.location.origin;
  return `${url}/${language}/articles/${slug}`;
}

/**
 * Helper to generate hreflang metadata for SSR
 */
export function generateHreflangMetadata(
  articleSlug: string,
  availableLanguages: string[],
  baseUrl: string
) {
  const hreflangTags = availableLanguages.map((lang) => ({
    rel: "alternate",
    hrefLang: lang,
    href: `${baseUrl}/${lang}/articles/${articleSlug}`,
  }));

  // Add x-default
  hreflangTags.push({
    rel: "alternate",
    hrefLang: "x-default",
    href: `${baseUrl}/en/articles/${articleSlug}`,
  });

  return hreflangTags;
}
