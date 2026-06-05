import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { translationRouter } from "./routers/translation";
import { articlePublishRouter } from "./routers/articles-publish";
import { getDb, getUserByOpenId } from "./db";
import { articles, categories, tags, articleTags, affiliateLinks, newsletterSubscribers, comments, testimonials, partnerships, users } from "../drizzle/schema";
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

    migrate: protectedProcedure
      .mutation(async ({ ctx }) => {
        if (ctx.user?.role !== "admin") throw new Error("Unauthorized");
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");
        
        const newCategories = [
          { name: "Tech & Gadgets", slug: "tech-gadgets", description: "Latest smartphones, laptops, and tech accessories", order: 1 },
          { name: "Smartphones", slug: "smartphones", description: "Smartphone reviews and comparisons", order: 2 },
          { name: "Laptops", slug: "laptops", description: "Laptop reviews and buying guides", order: 3 },
          { name: "Accessories", slug: "tech-accessories", description: "Tech accessories and gadgets", order: 4 },
          { name: "AI Tools & Automation", slug: "ai-tools-automation", description: "AI tools, chatbots, and automation platforms", order: 5 },
          { name: "Online Business & Side Hustles", slug: "online-business-side-hustles", description: "Dropshipping, freelancing, and passive income tools", order: 6 },
          { name: "Dropshipping", slug: "dropshipping", description: "Dropshipping platforms and tools", order: 7 },
          { name: "Freelancing Platforms", slug: "freelancing-platforms", description: "Freelancing marketplaces and tools", order: 8 },
          { name: "Passive Income Tools", slug: "passive-income-tools", description: "Tools for generating passive income", order: 9 },
          { name: "E-commerce & Marketing", slug: "ecommerce-marketing", description: "E-commerce platforms and marketing tools", order: 10 },
          { name: "Web Hosting & Domains", slug: "web-hosting-domains", description: "Web hosting providers and domain registrars", order: 11 },
          { name: "Software & SaaS Tools", slug: "software-saas-tools", description: "CRM, marketing tools, productivity apps", order: 12 },
          { name: "CRM Tools", slug: "crm-tools", description: "Customer Relationship Management solutions", order: 13 },
          { name: "Marketing Tools", slug: "marketing-tools", description: "Marketing automation and analytics tools", order: 14 },
          { name: "Productivity Apps", slug: "productivity-apps", description: "Productivity and collaboration tools", order: 15 },
          { name: "Online Courses & Education Platforms", slug: "online-courses-education", description: "Online learning platforms and courses", order: 16 },
          { name: "Digital Marketing Tools", slug: "digital-marketing-tools", description: "SEO tools, email marketing, ads platforms", order: 17 },
          { name: "SEO Tools", slug: "seo-tools", description: "Search engine optimization tools", order: 18 },
          { name: "Email Marketing", slug: "email-marketing", description: "Email marketing platforms", order: 19 },
          { name: "Ads Platforms", slug: "ads-platforms", description: "Advertising platforms and tools", order: 20 },
          { name: "Payment Solutions & Mobile Money", slug: "payment-solutions-mobile-money", description: "Payment gateways and mobile money services", order: 21 },
          { name: "Apps & Mobile Tools", slug: "apps-mobile-tools", description: "Top apps and mobile productivity tools", order: 22 },
          { name: "Gaming & Entertainment Platforms", slug: "gaming-entertainment-platforms", description: "Gaming platforms and entertainment services", order: 23 },
          { name: "Streaming Services and Big Events", slug: "streaming-services-big-events", description: "Netflix alternatives and streaming platforms", order: 24 },
          { name: "Travel & Booking Platforms", slug: "travel-booking-platforms", description: "Flight, hotel, and travel booking tools", order: 25 },
          { name: "Flight Booking", slug: "flight-booking", description: "Flight booking platforms", order: 26 },
          { name: "Hotel Booking", slug: "hotel-booking", description: "Hotel booking platforms", order: 27 },
          { name: "World Travel Tools", slug: "world-travel-tools", description: "International travel tools", order: 28 },
          { name: "African Travel Tools", slug: "african-travel-tools", description: "African travel and booking platforms", order: 29 },
          { name: "Health & Fitness Apps/Tools", slug: "health-fitness-apps-tools", description: "Wearables, diet apps, and gym tools", order: 30 },
          { name: "Wearables", slug: "wearables", description: "Wearable devices and smartwatches", order: 31 },
          { name: "Diet Apps", slug: "diet-apps", description: "Nutrition and diet tracking apps", order: 32 },
          { name: "Gym Tools", slug: "gym-tools", description: "Fitness and gym management tools", order: 33 },
          { name: "Lifestyle Products & Services", slug: "lifestyle-products-services", description: "Home tech, personal productivity, real estate", order: 34 },
          { name: "Home Tech", slug: "home-tech", description: "Smart home technology and devices", order: 35 },
          { name: "Personal Productivity", slug: "personal-productivity", description: "Personal productivity tools and services", order: 36 },
          { name: "Real Estate", slug: "real-estate", description: "Real estate platforms and tools", order: 37 },
        ];
        
        await db.delete(categories);
        
        for (const cat of newCategories) {
          const { order, name, slug, description } = cat;
          await db.insert(categories).values({
            name,
            slug,
            description,
            order,
          });
        }
        
        return { success: true, count: newCategories.length };
      }),
    list: publicProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      return await db.select().from(categories).orderBy(categories.order);
    }),
    popular: publicProcedure
      .input(z.object({ limit: z.number().default(6) }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return [];
        return await db
          .select()
          .from(categories)
          .orderBy(categories.order)
          .limit(input.limit);
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

    create: protectedProcedure
      .input(z.object({
        name: z.string().min(1),
        slug: z.string().min(1),
      }))
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) throw new Error('Database not available');
        const result = await db.insert(tags).values({
          name: input.name,
          slug: input.slug,
        });
        return result;
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().min(1).optional(),
        slug: z.string().min(1).optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) throw new Error('Database not available');
        const { id, ...updateData } = input;
        const result = await db.update(tags).set(updateData).where(eq(tags.id, id));
        return result;
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) throw new Error('Database not available');
        const result = await db.delete(tags).where(eq(tags.id, input.id));
        return result;
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

        // Get author
        const authorResult = await db
          .select({
            id: users.id,
            name: users.name,
            profilePhoto: users.profilePhoto,
            biography: users.biography,
          })
          .from(users)
          .where(eq(users.id, article.authorId))
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
          author: authorResult[0] || null,
          tags: articleTagsResult.map(r => r.tag),
          affiliateLinks: affiliates,
        };
      }),

    migrateShareCount: publicProcedure
      .mutation(async () => {
        const db = await getDb();
        if (!db) return { success: false };
        
        try {
          await db.execute(sql`ALTER TABLE articles ADD COLUMN shareCount int DEFAULT 0`);
          return { success: true, message: 'shareCount column added' };
        } catch (error: any) {
          if (error.code === 'ER_DUP_FIELDNAME') {
            return { success: true, message: 'shareCount column already exists' };
          }
          return { success: false, error: error.message };
        }
      }),

    incrementShare: publicProcedure
      .input(z.object({ articleId: z.number() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) return { success: false };
        
        await db
          .update(articles)
          .set({ shareCount: sql`${articles.shareCount} + 1` })
          .where(eq(articles.id, input.articleId));
        
        return { success: true };
      }),

    getShareCount: publicProcedure
      .input(z.object({ articleId: z.number() }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return { shareCount: 0 };
        
        const result = await db
          .select({ shareCount: articles.shareCount })
          .from(articles)
          .where(eq(articles.id, input.articleId))
          .limit(1);
        
        return result[0] || { shareCount: 0 };
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

    suggestions: publicProcedure
      .input(z.object({ query: z.string().min(1), limit: z.number().default(5) }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return [];
        
        const conditions: any[] = [eq(articles.status, "published")];
        
        conditions.push(
          sql`(${articles.title} LIKE ${`%${input.query}%`} OR ${articles.excerpt} LIKE ${`%${input.query}%`})`
        );
        
        return await db
          .select({
            id: articles.id,
            title: articles.title,
            slug: articles.slug,
            excerpt: articles.excerpt,
            featuredImage: articles.featuredImage,
          })
          .from(articles)
          .where(and(...conditions))
          .orderBy(desc(articles.publishedAt))
          .limit(input.limit);
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

    listSubscribers: protectedProcedure
      .input(z.object({}).optional())
      .query(async ({ ctx }) => {
      if (ctx.user?.role !== "admin") throw new Error("Unauthorized");
      const db = await getDb();
      if (!db) return [];

      return await db
        .select()
        .from(newsletterSubscribers)
        .orderBy(desc(newsletterSubscribers.createdAt));
    }),

    deleteSubscriber: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") throw new Error("Unauthorized");
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");

        await db
          .delete(newsletterSubscribers)
          .where(eq(newsletterSubscribers.id, input.id));

        return { success: true };
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

  // Testimonials
  testimonials: router({
    list: publicProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      return await db
        .select()
        .from(testimonials)
        .where(eq(testimonials.isActive, true))
        .orderBy(testimonials.order);
    }),

    listAll: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user?.role !== "admin") throw new Error("Unauthorized");
      const db = await getDb();
      if (!db) return [];
      return await db.select().from(testimonials).orderBy(testimonials.order);
    }),

    create: protectedProcedure
      .input(z.object({
        authorName: z.string(),
        authorTitle: z.string().optional(),
        authorImage: z.string().optional(),
        content: z.string(),
        rating: z.number().min(1).max(5).default(5),
        order: z.number().default(0),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") throw new Error("Unauthorized");
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");
        await db.insert(testimonials).values(input);
        return { success: true };
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        authorName: z.string().optional(),
        authorTitle: z.string().optional(),
        authorImage: z.string().optional(),
        content: z.string().optional(),
        rating: z.number().min(1).max(5).optional(),
        isActive: z.boolean().optional(),
        order: z.number().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") throw new Error("Unauthorized");
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");
        const { id, ...updates } = input;
        await db.update(testimonials).set(updates).where(eq(testimonials.id, id));
        return { success: true };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") throw new Error("Unauthorized");
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");
        await db.delete(testimonials).where(eq(testimonials.id, input.id));
        return { success: true };
      }),
  }),

  // Partnerships
  partnerships: router({
    list: publicProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      return await db
        .select()
        .from(partnerships)
        .where(eq(partnerships.isActive, true))
        .orderBy(partnerships.order);
    }),

    listAll: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user?.role !== "admin") throw new Error("Unauthorized");
      const db = await getDb();
      if (!db) return [];
      return await db.select().from(partnerships).orderBy(partnerships.order);
    }),

    create: protectedProcedure
      .input(z.object({
        partnerName: z.string(),
        partnerLogo: z.string(),
        partnerUrl: z.string().optional(),
        description: z.string().optional(),
        order: z.number().default(0),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") throw new Error("Unauthorized");
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");
        await db.insert(partnerships).values(input);
        return { success: true };
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        partnerName: z.string().optional(),
        partnerLogo: z.string().optional(),
        partnerUrl: z.string().optional(),
        description: z.string().optional(),
        isActive: z.boolean().optional(),
        order: z.number().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") throw new Error("Unauthorized");
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");
        const { id, ...updates } = input;
        await db.update(partnerships).set(updates).where(eq(partnerships.id, id));
        return { success: true };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") throw new Error("Unauthorized");
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");
        await db.delete(partnerships).where(eq(partnerships.id, input.id));
        return { success: true };
      }),
  }),

  // Users/Editors Management
  users: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user?.role !== "admin") throw new Error("Unauthorized");
      const db = await getDb();
      if (!db) return [];
      return await db.select().from(users).orderBy(users.createdAt);
    }),

    create: protectedProcedure
      .input(z.object({
        email: z.string().email(),
        name: z.string(),
        role: z.enum(["user", "admin", "editor"]).default("editor"),
        profilePhoto: z.string().optional(),
        biography: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") throw new Error("Unauthorized");
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");
        
        // Create a temporary openId for the new user
        const tempOpenId = `editor-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        await db.insert(users).values({
          openId: tempOpenId,
          email: input.email,
          name: input.name,
          role: input.role,
          profilePhoto: input.profilePhoto,
          biography: input.biography,
          loginMethod: "admin-created",
        });
        return { success: true };
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        role: z.enum(["user", "admin", "editor"]).optional(),
        profilePhoto: z.string().optional(),
        biography: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") throw new Error("Unauthorized");
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");
        const { id, ...updates } = input;
        await db.update(users).set(updates).where(eq(users.id, id));
        return { success: true };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") throw new Error("Unauthorized");
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");
        await db.delete(users).where(eq(users.id, input.id));
        return { success: true };
      }),
    }),
  translation: translationRouter,
  articlePublish: articlePublishRouter,
});
export type AppRouter = typeof appRouter;
