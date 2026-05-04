import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { getDb, getUserByOpenId } from "./db";
import { articles, categories, tags, articleTags, affiliateLinks, newsletterSubscribers, comments } from "../drizzle/schema";
import { eq, desc, like, and } from "drizzle-orm";
import { z } from "zod";
import { sql } from "drizzle-orm";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Categories
  categories: router({
    list: publicProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      return await db.select().from(categories).orderBy(categories.order);
    }),
    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return null;
        const result = await db
          .select()
          .from(categories)
          .where(eq(categories.slug, input.slug))
          .limit(1);
        return result[0] || null;
      }),
    create: protectedProcedure
      .input(
        z.object({
          name: z.string().min(1),
          slug: z.string().min(1),
          description: z.string().optional(),
          icon: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") throw new Error("Unauthorized");
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");
        return await db.insert(categories).values(input);
      }),
  }),

  // Tags
  tags: router({
    list: publicProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      return await db.select().from(tags);
    }),
  }),

  // Articles
  articles: router({
    list: publicProcedure
      .input(
        z.object({
          categoryId: z.number().optional(),
          search: z.string().optional(),
          limit: z.number().default(10),
          offset: z.number().default(0),
        })
      )
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return [];
        
        const conditions: any[] = [eq(articles.status, "published")];
        
        if (input.categoryId) {
          conditions.push(eq(articles.categoryId, input.categoryId));
        }

        if (input.search) {
          conditions.push(like(articles.title, `%${input.search}%`));
        }

        return await db
          .select()
          .from(articles)
          .where(and(...conditions))
          .orderBy(desc(articles.publishedAt))
          .limit(input.limit)
          .offset(input.offset);
      }),

    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return null;
        
        const result = await db
          .select()
          .from(articles)
          .where(and(
            eq(articles.slug, input.slug),
            eq(articles.status, "published")
          ))
          .limit(1);

        if (result.length === 0) return null;

        const article = result[0];

        // Get category
        const categoryResult = await db
          .select()
          .from(categories)
          .where(eq(categories.id, article.categoryId))
          .limit(1);

        // Get tags
        const articleTagsResult = await db
          .select({ tag: tags })
          .from(articleTags)
          .innerJoin(tags, eq(articleTags.tagId, tags.id))
          .where(eq(articleTags.articleId, article.id));

        // Get affiliate links
        const affiliates = await db
          .select()
          .from(affiliateLinks)
          .where(eq(affiliateLinks.articleId, article.id))
          .orderBy(affiliateLinks.position);

        // Increment view count
        await db
          .update(articles)
          .set({ viewCount: sql`${articles.viewCount} + 1` })
          .where(eq(articles.id, article.id));

        return {
          ...article,
          category: categoryResult[0] || null,
          tags: articleTagsResult.map(r => r.tag),
          affiliateLinks: affiliates,
        };
      }),

    search: publicProcedure
      .input(
        z.object({
          query: z.string().min(1),
          categoryId: z.number().optional(),
          limit: z.number().default(12),
          offset: z.number().default(0),
        })
      )
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return { articles: [], total: 0 };
        
        const conditions: any[] = [eq(articles.status, "published")];
        
        if (input.categoryId) {
          conditions.push(eq(articles.categoryId, input.categoryId));
        }

        // Search in title, excerpt, and content
        conditions.push(
          sql`(${articles.title} LIKE ${`%${input.query}%`} OR ${articles.excerpt} LIKE ${`%${input.query}%`} OR ${articles.content} LIKE ${`%${input.query}%`})`
        );

        const searchResults = await db
          .select()
          .from(articles)
          .where(and(...conditions))
          .orderBy(desc(articles.publishedAt))
          .limit(input.limit)
          .offset(input.offset);

        // Get total count
        const countResult = await db
          .select({ count: sql`COUNT(*)` })
          .from(articles)
          .where(and(...conditions));

        const total = countResult[0]?.count as number || 0;

        return {
          articles: searchResults,
          total,
        };
      }),

    trending: publicProcedure
      .input(z.object({ limit: z.number().default(5) }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return [];
        
        return await db
          .select()
          .from(articles)
          .where(eq(articles.status, "published"))
          .orderBy(desc(articles.viewCount))
          .limit(input.limit);
      }),

    related: publicProcedure
      .input(z.object({ articleId: z.number(), limit: z.number().default(3) }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return [];
        
        const article = await db
          .select()
          .from(articles)
          .where(eq(articles.id, input.articleId))
          .limit(1);

        if (article.length === 0) return [];

        return await db
          .select()
          .from(articles)
          .where(and(
            eq(articles.categoryId, article[0].categoryId),
            eq(articles.status, "published"),
            sql`${articles.id} != ${input.articleId}`
          ))
          .orderBy(desc(articles.publishedAt))
          .limit(input.limit);
      }),

    create: protectedProcedure
      .input(
        z.object({
          title: z.string().min(1),
          slug: z.string().min(1),
          content: z.string().min(1),
          excerpt: z.string().optional(),
          featuredImage: z.string().optional(),
          categoryId: z.number(),
          metaTitle: z.string().optional(),
          metaDescription: z.string().optional(),
          focusKeyword: z.string().optional(),
          keywords: z.string().optional(),
          tldr: z.string().optional(),
          status: z.enum(["draft", "published", "scheduled"]).default("draft"),
          tagIds: z.array(z.number()).optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") throw new Error("Unauthorized");
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");

        const result = await db.insert(articles).values({
          ...input,
          authorId: ctx.user.id,
          publishedAt: input.status === "published" ? new Date() : null,
        });

        const articleId = result[0].insertId;

        // Add tags
        if (input.tagIds && input.tagIds.length > 0) {
          await db.insert(articleTags).values(
            input.tagIds.map(tagId => ({
              articleId,
              tagId,
            }))
          );
        }

        return { id: articleId };
      }),

    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          title: z.string().optional(),
          slug: z.string().optional(),
          content: z.string().optional(),
          excerpt: z.string().optional(),
          featuredImage: z.string().optional(),
          categoryId: z.number().optional(),
          metaTitle: z.string().optional(),
          metaDescription: z.string().optional(),
          focusKeyword: z.string().optional(),
          keywords: z.string().optional(),
          tldr: z.string().optional(),
          status: z.enum(["draft", "published", "scheduled"]).optional(),
          tagIds: z.array(z.number()).optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") throw new Error("Unauthorized");
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");

        const { id, tagIds, ...updateData } = input;

        // Update article
        await db.update(articles).set(updateData).where(eq(articles.id, id));

        // Update tags if provided
        if (tagIds) {
          await db.delete(articleTags).where(eq(articleTags.articleId, id));
          if (tagIds.length > 0) {
            await db.insert(articleTags).values(
              tagIds.map(tagId => ({
                articleId: id,
                tagId,
              }))
            );
          }
        }

        return { success: true };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") throw new Error("Unauthorized");
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");

        await db.delete(articles).where(eq(articles.id, input.id));
        return { success: true };
      }),
  }),

  // Affiliate Links
  affiliateLinks: router({
    create: protectedProcedure
      .input(
        z.object({
          articleId: z.number(),
          productName: z.string().min(1),
          url: z.string().url(),
          affiliateNetwork: z.string().optional(),
          type: z.enum(["top_choice", "best_for_beginners", "comparison_table", "cta_button", "inline"]),
          position: z.number().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") throw new Error("Unauthorized");
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");

        return await db.insert(affiliateLinks).values(input);
      }),

    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          productName: z.string().optional(),
          url: z.string().url().optional(),
          affiliateNetwork: z.string().optional(),
          type: z.enum(["top_choice", "best_for_beginners", "comparison_table", "cta_button", "inline"]).optional(),
          position: z.number().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") throw new Error("Unauthorized");
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");

        const { id, ...updateData } = input;
        await db.update(affiliateLinks).set(updateData).where(eq(affiliateLinks.id, id));
        return { success: true };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") throw new Error("Unauthorized");
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");

        await db.delete(affiliateLinks).where(eq(affiliateLinks.id, input.id));
        return { success: true };
      }),

    trackClick: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) return { success: false };

        await db
          .update(affiliateLinks)
          .set({ clickCount: sql`${affiliateLinks.clickCount} + 1` })
          .where(eq(affiliateLinks.id, input.id));

        return { success: true };
      }),
  }),

  // Newsletter
  newsletter: router({
    subscribe: publicProcedure
      .input(
        z.object({
          email: z.string().email(),
          name: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");

        const verificationToken = Math.random().toString(36).substring(2, 15);
        const unsubscribeToken = Math.random().toString(36).substring(2, 15);

        try {
          await db.insert(newsletterSubscribers).values({
            email: input.email,
            name: input.name,
            verificationToken,
            unsubscribeToken,
            isVerified: false,
          });
          return { success: true, message: "Subscription pending verification" };
        } catch (error) {
          return { success: false, message: "Email already subscribed" };
        }
      }),

    unsubscribe: publicProcedure
      .input(z.object({ token: z.string() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");

        await db
          .delete(newsletterSubscribers)
          .where(eq(newsletterSubscribers.unsubscribeToken, input.token));

        return { success: true };
      }),

    list: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user?.role !== "admin") throw new Error("Unauthorized");
      const db = await getDb();
      if (!db) return [];

      return await db
        .select()
        .from(newsletterSubscribers)
        .where(eq(newsletterSubscribers.isVerified, true));
    }),
  }),

  // Comments
  comments: router({
    listByArticle: publicProcedure
      .input(z.object({ articleId: z.number() }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return [];

        return await db
          .select()
          .from(comments)
          .where(and(
            eq(comments.articleId, input.articleId),
            eq(comments.isApproved, true)
          ))
          .orderBy(desc(comments.createdAt));
      }),

    create: publicProcedure
      .input(
        z.object({
          articleId: z.number(),
          authorName: z.string().min(1),
          authorEmail: z.string().email(),
          content: z.string().min(1),
        })
      )
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");

        await db.insert(comments).values({
          ...input,
          isApproved: false,
        });

        return { success: true, message: "Comment submitted for moderation" };
      }),

    approve: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") throw new Error("Unauthorized");
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");

        await db
          .update(comments)
          .set({ isApproved: true })
          .where(eq(comments.id, input.id));

        return { success: true };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") throw new Error("Unauthorized");
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");

        await db.delete(comments).where(eq(comments.id, input.id));
        return { success: true };
      }),

    listPending: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user?.role !== "admin") throw new Error("Unauthorized");
      const db = await getDb();
      if (!db) return [];

      return await db
        .select()
        .from(comments)
        .where(eq(comments.isApproved, false))
        .orderBy(desc(comments.createdAt));
    }),
  }),
});

export type AppRouter = typeof appRouter;
