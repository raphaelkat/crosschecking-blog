import { getDb } from "./db";
import { translationMetadata } from "../drizzle/schema";
import { eq, and } from "drizzle-orm";

/**
 * Phase 7: Translation caching for performance optimization
 * Implements in-memory cache with database fallback
 */

interface CacheEntry {
  data: any;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

// In-memory cache
const translationCache = new Map<string, CacheEntry>();

// Cache TTL constants (in milliseconds)
const CACHE_TTL = {
  ARTICLE_TRANSLATION: 24 * 60 * 60 * 1000, // 24 hours
  CATEGORY_TRANSLATION: 24 * 60 * 60 * 1000, // 24 hours
  METADATA: 60 * 60 * 1000, // 1 hour
};

/**
 * Generate cache key
 */
function generateCacheKey(
  type: "article" | "category" | "metadata",
  id: number,
  language: string
): string {
  return `${type}:${id}:${language}`;
}

/**
 * Check if cache entry is still valid
 */
function isCacheValid(entry: CacheEntry): boolean {
  const now = Date.now();
  return now - entry.timestamp < entry.ttl;
}

/**
 * Get from cache
 */
export function getFromCache<T>(
  type: "article" | "category" | "metadata",
  id: number,
  language: string
): T | null {
  const key = generateCacheKey(type, id, language);
  const entry = translationCache.get(key);

  if (!entry) return null;

  if (!isCacheValid(entry)) {
    translationCache.delete(key);
    return null;
  }

  return entry.data as T;
}

/**
 * Set cache
 */
export function setCache(
  type: "article" | "category" | "metadata",
  id: number,
  language: string,
  data: any
): void {
  const key = generateCacheKey(type, id, language);
  let ttl = CACHE_TTL.METADATA;
  if (type === "article") ttl = CACHE_TTL.ARTICLE_TRANSLATION;
  if (type === "category") ttl = CACHE_TTL.CATEGORY_TRANSLATION;

  translationCache.set(key, {
    data,
    timestamp: Date.now(),
    ttl,
  });
}

/**
 * Invalidate cache for specific item
 */
export function invalidateCache(
  type: "article" | "category" | "metadata",
  id: number,
  language?: string
): void {
  if (language) {
    const key = generateCacheKey(type, id, language);
    translationCache.delete(key);
  } else {
    // Invalidate all languages for this item
    const prefix = `${type}:${id}:`;
    const keys = Array.from(translationCache.keys());
  for (const key of keys) {
      if (key.startsWith(prefix)) {
        translationCache.delete(key);
      }
    }
  }
}

/**
 * Clear all cache
 */
export function clearAllCache(): void {
  translationCache.clear();
}

/**
 * Get cache statistics
 */
export function getCacheStats() {
  return {
    size: translationCache.size,
    entries: Array.from(translationCache.entries()).map(([key, entry]) => ({
      key,
      valid: isCacheValid(entry),
      age: Date.now() - entry.timestamp,
    })),
  };
}

/**
 * Cleanup expired cache entries
 */
export function cleanupExpiredCache(): number {
  let cleaned = 0;
  const entries = Array.from(translationCache.entries());
  for (const [key, entry] of entries) {
    if (!isCacheValid(entry)) {
      translationCache.delete(key);
      cleaned++;
    }
  }
  return cleaned;
}

/**
 * Periodic cleanup (run every hour)
 */
export function startCacheCleanup(): NodeJS.Timeout {
  return setInterval(() => {
    const cleaned = cleanupExpiredCache();
    if (cleaned > 0) {
      console.log(`[Translation Cache] Cleaned up ${cleaned} expired entries`);
    }
  }, 60 * 60 * 1000); // Every hour
}

/**
 * Get translation from cache or database
 */
export async function getCachedTranslation(
  type: "article" | "category",
  id: number,
  language: string
): Promise<any | null> {
  // Try cache first
  const cached = getFromCache(type, id, language);
  if (cached) {
    console.log(`[Translation Cache] HIT: ${type}:${id}:${language}`);
    return cached;
  }

  // Fallback to database
  console.log(`[Translation Cache] MISS: ${type}:${id}:${language}`);
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db
      .select()
      .from(translationMetadata)
      .where(
        and(
      eq(translationMetadata.contentId, id),
      eq(translationMetadata.language, language),
      eq(translationMetadata.contentType, type)
        )
      )
      .limit(1);

    if (result.length > 0) {
      const translation = result[0];
      // Cache the result
      setCache(type, id, language, translation);
      return translation;
    }

    return null;
  } catch (error) {
    console.error(`[Translation Cache] Error fetching from DB:`, error);
    return null;
  }
}
