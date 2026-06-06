import { protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { getDb } from "../db";
import { articles } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

/**
 * Article publishing router
 */
export const articlePublishRouter = router({
  publish: protectedProcedure
    .input(
      z.object({
        articleId: z.number(),
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

        return {
          success: true,
          message: "Article published successfully",
        };
      } catch (error: any) {
        console.error("Publish error:", error);
        throw new Error("Failed to publish article");
      }
    }),
});
