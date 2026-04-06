/**
 * SEO Utilities for meta tags, Open Graph, and JSON-LD schema markup
 */

export interface SEOConfig {
  title: string;
  description: string;
  keyword?: string;
  image?: string;
  url: string;
  type?: "article" | "website" | "product";
  author?: string;
  publishedDate?: Date;
  modifiedDate?: Date;
}

export function setMetaTags(config: SEOConfig) {
  // Update document title
  document.title = config.title;

  // Update or create meta description
  updateMetaTag("description", config.description);

  // Update or create keywords
  if (config.keyword) {
    updateMetaTag("keywords", config.keyword);
  }

  // Open Graph tags
  updateMetaTag("og:title", config.title, "property");
  updateMetaTag("og:description", config.description, "property");
  updateMetaTag("og:type", config.type || "website", "property");
  updateMetaTag("og:url", config.url, "property");

  if (config.image) {
    updateMetaTag("og:image", config.image, "property");
  }

  // Twitter Card tags
  updateMetaTag("twitter:title", config.title);
  updateMetaTag("twitter:description", config.description);
  updateMetaTag("twitter:card", "summary_large_image");

  if (config.image) {
    updateMetaTag("twitter:image", config.image);
  }

  // Canonical URL
  updateCanonicalTag(config.url);
}

function updateMetaTag(name: string, content: string, attribute: "name" | "property" = "name") {
  let tag = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;

  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attribute, name);
    document.head.appendChild(tag);
  }

  tag.content = content;
}

function updateCanonicalTag(url: string) {
  let tag = document.querySelector("link[rel='canonical']") as HTMLLinkElement;

  if (!tag) {
    tag = document.createElement("link");
    tag.rel = "canonical";
    document.head.appendChild(tag);
  }

  tag.href = url;
}

export interface ArticleSchema {
  title: string;
  description: string;
  image?: string;
  author: string;
  datePublished: Date;
  dateModified?: Date;
  url: string;
}

export interface ComparisonSchema {
  headline: string;
  description: string;
  image?: string;
  author: string;
  datePublished: Date;
  items: Array<{
    name: string;
    description: string;
    url?: string;
  }>;
}

export function setArticleSchema(article: ArticleSchema) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    image: article.image || null,
    author: {
      "@type": "Person",
      name: article.author,
    },
    datePublished: article.datePublished.toISOString(),
    dateModified: (article.dateModified || article.datePublished).toISOString(),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": article.url,
    },
  };

  setJsonLdSchema(schema);
}

export function setComparisonSchema(comparison: ComparisonSchema) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ComparisonChart",
    headline: comparison.headline,
    description: comparison.description,
    image: comparison.image || null,
    author: {
      "@type": "Person",
      name: comparison.author,
    },
    datePublished: comparison.datePublished.toISOString(),
    itemListElement: comparison.items.map((item, index) => ({
      "@type": "Thing",
      position: index + 1,
      name: item.name,
      description: item.description,
      url: item.url,
    })),
  };

  setJsonLdSchema(schema);
}

export function setProductSchema(product: {
  name: string;
  description: string;
  image?: string;
  price?: number;
  currency?: string;
  rating?: number;
  reviewCount?: number;
  url: string;
  affiliate?: boolean;
}) {
  const schema: any = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.image || null,
    url: product.url,
  };

  if (product.price && product.currency) {
    schema.offers = {
      "@type": "Offer",
      price: product.price,
      priceCurrency: product.currency,
      availability: "https://schema.org/InStock",
    };
  }

  if (product.rating && product.reviewCount) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    };
  }

  setJsonLdSchema(schema);
}

function setJsonLdSchema(schema: any) {
  let tag = document.querySelector('script[type="application/ld+json"]') as HTMLScriptElement;

  if (!tag) {
    tag = document.createElement("script");
    tag.type = "application/ld+json";
    document.head.appendChild(tag);
  }

  tag.textContent = JSON.stringify(schema);
}

export function generateSitemap(articles: Array<{ slug: string; updatedAt: Date }>) {
  const baseUrl = window.location.origin;
  const urls = [
    { loc: baseUrl, lastmod: new Date().toISOString() },
    ...articles.map((article) => ({
      loc: `${baseUrl}/article/${article.slug}`,
      lastmod: article.updatedAt.toISOString(),
    })),
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
  </url>`).join("\n")}
</urlset>`;
}

export function generateRobotsTxt() {
  return `User-agent: *
Allow: /
Disallow: /admin
Disallow: /admin/*

Sitemap: ${window.location.origin}/sitemap.xml`;
}
