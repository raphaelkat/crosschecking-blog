import { trpc } from "./trpc";

export interface AffiliateClickData {
  affiliateLinkId: number;
  articleId: number;
  timestamp: Date;
  userAgent: string;
  referrer: string;
}

/**
 * Track affiliate link clicks for analytics
 */
export async function trackAffiliateClick(
  affiliateLinkId: number,
  articleId: number
): Promise<void> {
  try {
    // Track with Google Analytics if available
    const gtag = (window as any).gtag;
    if (gtag) {
      gtag("event", "affiliate_click", {
        affiliate_link_id: affiliateLinkId,
        article_id: articleId,
      });
    }
  } catch (error) {
    console.error("Error tracking affiliate click:", error);
  }
}

/**
 * Get affiliate link with tracking wrapper
 */
export function getTrackedAffiliateUrl(
  url: string,
  affiliateLinkId: number,
  articleId: number
): string {
  // Add tracking parameters to URL
  const trackingUrl = new URL(url);
  trackingUrl.searchParams.append("utm_source", "crosschecking");
  trackingUrl.searchParams.append("utm_medium", "affiliate");
  trackingUrl.searchParams.append("utm_campaign", `article-${articleId}`);

  return trackingUrl.toString();
}

/**
 * Create click handler for affiliate links
 */
export function createAffiliateClickHandler(
  affiliateLinkId: number,
  articleId: number
) {
  return async () => {
    await trackAffiliateClick(affiliateLinkId, articleId);
  };
}
