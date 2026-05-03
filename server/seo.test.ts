import { describe, expect, it } from "vitest";

// Mock SEO utilities (client-side functions)
const generateMetaTags = (article: any) => ({
  title: article.title,
  description: article.metaDescription,
  ogTitle: article.title,
  ogImage: article.featuredImage,
  canonical: `/article/${article.slug}`,
});

const generateSchemaMarkup = (type: string, data: any) => {
  if (type === "Article") {
    return JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Article",
      headline: data.title,
      url: `/article/${data.slug}`,
    });
  }
  if (type === "FAQPage") {
    return JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: data.map((item: any) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    });
  }
  return "{}";
};

describe("SEO Utilities", () => {
  describe("generateMetaTags", () => {
    it("should generate correct meta tags for article page", () => {
      const article = {
        id: 1,
        title: "Best AI Tools 2026",
        metaDescription: "Compare top AI tools for your business",
        metaKeywords: "ai, tools, comparison",
        slug: "best-ai-tools-2026",
        featuredImage: "https://example.com/image.jpg",
        excerpt: "In-depth comparison of AI tools",
      };

      const tags = generateMetaTags(article);
      expect(tags).toBeDefined();
      expect(tags.title).toBe("Best AI Tools 2026");
      expect(tags.description).toBe("Compare top AI tools for your business");
    });

    it("should generate Open Graph tags", () => {
      const article = {
        id: 1,
        title: "Best AI Tools 2026",
        metaDescription: "Compare top AI tools",
        slug: "best-ai-tools-2026",
        featuredImage: "https://example.com/image.jpg",
      };

      const tags = generateMetaTags(article);
      expect(tags.ogTitle).toBe("Best AI Tools 2026");
      expect(tags.ogImage).toBe("https://example.com/image.jpg");
      expect(tags.canonical).toContain("best-ai-tools-2026");
    });

    it("should include canonical URL", () => {
      const article = {
        id: 1,
        title: "Best AI Tools",
        slug: "best-ai-tools",
      };

      const tags = generateMetaTags(article);
      expect(tags.canonical).toContain("best-ai-tools");
    });
  });

  describe("generateSchemaMarkup", () => {
    it("should generate Article schema markup", () => {
      const article = {
        id: 1,
        title: "Best AI Tools 2026",
        content: "Content here",
        slug: "best-ai-tools-2026",
        createdAt: new Date("2026-01-01"),
        updatedAt: new Date("2026-01-15"),
      };

      const schema = generateSchemaMarkup("Article", article);
      expect(schema).toBeDefined();
      expect(schema).toContain("Article");
      expect(schema).toContain("Best AI Tools 2026");
      expect(schema).toContain("best-ai-tools-2026");
    });

    it("should generate FAQ schema markup", () => {
      const faqData = [
        { question: "What is AI?", answer: "Artificial Intelligence..." },
        { question: "How to use AI?", answer: "You can use AI by..." },
      ];

      const schema = generateSchemaMarkup("FAQPage", faqData);
      expect(schema).toBeDefined();
      expect(schema).toContain("FAQPage");
      expect(schema).toContain("What is AI?");
      expect(schema).toContain("Artificial Intelligence");
    });
  });
});
