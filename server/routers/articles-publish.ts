import { protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { getDb } from "../db";
import { articles } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { translateArticleToAllLanguages } from "../translation";

/**
 * Phase 4: Auto-translation pipeline on article publish
 */
export const articlePublishRouter = router({
  publishWithTranslation: protectedProcedure
    .input(
      z.object({
        articleId: z.number(),
        title: z.string(),
        description: z.string(),
        content: z.string(),
        autoTranslate: z.boolean().default(true),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user?.role !== "admin") {
        throw new Error("Only admins can publish articles");
      }

      const db = await getDb();
      if (!db) throw new Error("Database unavailable");

      try {
        // Update article status to published
        await db
          .update(articles)
          .set({
            status: "published",
            publishedAt: new Date(),
          })
          .where(eq(articles.id, input.articleId));

        // Auto-translate if enabled
        if (input.autoTranslate) {
          // Run translation in background (don't wait)
          translateArticleToAllLanguages(
            input.articleId,
            input.title,
            input.description,
            input.content
          ).catch((error) => {
            console.error("Background translation error:", error);
          });
        }

        return {
          success: true,
          message: "Article published successfully",
          translationStarted: input.autoTranslate,
        };
      } catch (error) {
        console.error("Publish error:", error);
        throw new Error("Failed to publish article");
      }
    }),
});
