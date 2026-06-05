import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, json, longtext } from "drizzle-orm/mysql-core";


/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin", "editor"]).default("user").notNull(),
  profilePhoto: varchar("profilePhoto", { length: 500 }),
  biography: text("biography"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Categories table
export const categories = mysqlTable("categories", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: varchar("description", { length: 500 }),
  icon: varchar("icon", { length: 255 }),
  order: int("order").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Category = typeof categories.$inferSelect;
export type InsertCategory = typeof categories.$inferInsert;

// Tags table
export const tags = mysqlTable("tags", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Tag = typeof tags.$inferSelect;
export type InsertTag = typeof tags.$inferInsert;

// Articles table
export const articles = mysqlTable("articles", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  content: text("content").notNull(),
  excerpt: varchar("excerpt", { length: 500 }),
  featuredImage: varchar("featuredImage", { length: 500 }),
  categoryId: int("categoryId").notNull(),
  authorId: int("authorId").notNull(),
  status: mysqlEnum("status", ["draft", "published", "scheduled"]).default("draft").notNull(),
  publishedAt: timestamp("publishedAt"),
  scheduledAt: timestamp("scheduledAt"),
  // SEO fields
  metaTitle: varchar("metaTitle", { length: 255 }),
  metaDescription: varchar("metaDescription", { length: 160 }),
  focusKeyword: varchar("focusKeyword", { length: 255 }),
  keywords: varchar("keywords", { length: 500 }),
  // Content structure fields
  tldr: varchar("tldr", { length: 500 }),
  tableOfContents: json("tableOfContents"),
  // Engagement tracking
  viewCount: int("viewCount").default(0),
  shareCount: int("shareCount").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Article = typeof articles.$inferSelect;
export type InsertArticle = typeof articles.$inferInsert;

// Article-Tag junction table
export const articleTags = mysqlTable("article_tags", {
  articleId: int("articleId").notNull(),
  tagId: int("tagId").notNull(),
});

export type ArticleTag = typeof articleTags.$inferSelect;

// Affiliate links table
export const affiliateLinks = mysqlTable("affiliate_links", {
  id: int("id").autoincrement().primaryKey(),
  articleId: int("articleId").notNull(),
  productName: varchar("productName", { length: 255 }).notNull(),
  url: varchar("url", { length: 500 }).notNull(),
  affiliateNetwork: varchar("affiliateNetwork", { length: 255 }),
  type: mysqlEnum("type", ["top_choice", "best_for_beginners", "comparison_table", "cta_button", "inline"]).notNull(),
  position: int("position").default(0),
  clickCount: int("clickCount").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AffiliateLink = typeof affiliateLinks.$inferSelect;
export type InsertAffiliateLink = typeof affiliateLinks.$inferInsert;

// Newsletter subscribers table
export const newsletterSubscribers = mysqlTable("newsletter_subscribers", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  isVerified: boolean("isVerified").default(false),
  verificationToken: varchar("verificationToken", { length: 255 }),
  unsubscribeToken: varchar("unsubscribeToken", { length: 255 }).unique(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type NewsletterSubscriber = typeof newsletterSubscribers.$inferSelect;
export type InsertNewsletterSubscriber = typeof newsletterSubscribers.$inferInsert;

// Comments table
export const comments = mysqlTable("comments", {
  id: int("id").autoincrement().primaryKey(),
  articleId: int("articleId").notNull(),
  authorName: varchar("authorName", { length: 255 }).notNull(),
  authorEmail: varchar("authorEmail", { length: 320 }).notNull(),
  content: varchar("content", { length: 5000 }).notNull(),
  isApproved: boolean("isApproved").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Comment = typeof comments.$inferSelect;
export type InsertComment = typeof comments.$inferInsert;


// Testimonials table
export const testimonials = mysqlTable("testimonials", {
  id: int("id").autoincrement().primaryKey(),
  authorName: varchar("authorName", { length: 255 }).notNull(),
  authorTitle: varchar("authorTitle", { length: 255 }),
  authorImage: varchar("authorImage", { length: 500 }),
  content: text("content").notNull(),
  rating: int("rating").default(5),
  isActive: boolean("isActive").default(true),
  order: int("order").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Testimonial = typeof testimonials.$inferSelect;
export type InsertTestimonial = typeof testimonials.$inferInsert;

// Partnerships table
export const partnerships = mysqlTable("partnerships", {
  id: int("id").autoincrement().primaryKey(),
  partnerName: varchar("partnerName", { length: 255 }).notNull(),
  partnerLogo: varchar("partnerLogo", { length: 500 }).notNull(),
  partnerUrl: varchar("partnerUrl", { length: 500 }),
  description: varchar("description", { length: 500 }),
  isActive: boolean("isActive").default(true),
  order: int("order").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Partnership = typeof partnerships.$inferSelect;
export type InsertPartnership = typeof partnerships.$inferInsert;


// Language preferences table
export const languagePreferences = mysqlTable("languagePreferences", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").references(() => users.id, { onDelete: "cascade" }),
  preferredLanguage: varchar("preferredLanguage", { length: 10 }).default("en").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type LanguagePreference = typeof languagePreferences.$inferSelect;
export type InsertLanguagePreference = typeof languagePreferences.$inferInsert;

// Article translations table
export const articleTranslations = mysqlTable("articleTranslations", {
  id: int("id").autoincrement().primaryKey(),
  articleId: int("articleId").notNull().references(() => articles.id, { onDelete: "cascade" }),
  language: varchar("language", { length: 10 }).notNull(),
  title: varchar("title", { length: 500 }).notNull(),
  slug: varchar("slug", { length: 500 }).notNull().unique(),
  metaDescription: varchar("metaDescription", { length: 500 }),
  content: longtext("content"),
  translatedAt: timestamp("translatedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ArticleTranslation = typeof articleTranslations.$inferSelect;
export type InsertArticleTranslation = typeof articleTranslations.$inferInsert;

// Category translations table
export const categoryTranslations = mysqlTable("categoryTranslations", {
  id: int("id").autoincrement().primaryKey(),
  categoryId: int("categoryId").notNull().references(() => categories.id, { onDelete: "cascade" }),
  language: varchar("language", { length: 10 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull(),
  description: varchar("description", { length: 500 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CategoryTranslation = typeof categoryTranslations.$inferSelect;
export type InsertCategoryTranslation = typeof categoryTranslations.$inferInsert;

// Translation metadata table
export const translationMetadata = mysqlTable("translationMetadata", {
  id: int("id").autoincrement().primaryKey(),
  contentType: varchar("contentType", { length: 50 }).notNull(), // 'article', 'category', 'tag'
  contentId: int("contentId").notNull(),
  language: varchar("language", { length: 10 }).notNull(),
  translationStatus: mysqlEnum("translationStatus", ["pending", "translated", "reviewed", "published"]).default("pending").notNull(),
  translationProvider: varchar("translationProvider", { length: 50 }).default("ai").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type TranslationMetadata = typeof translationMetadata.$inferSelect;
export type InsertTranslationMetadata = typeof translationMetadata.$inferInsert;
