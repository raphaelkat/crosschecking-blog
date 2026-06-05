import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { z } from "zod";
import {
  translateArticleToAllLanguages,
  translateCategoryToAllLanguages,
  getArticleTranslation,
  getCategoryTranslation,
} from "../translation";

export const translationRouter = router({
  /**
   * Get translated article by language
   */
  getArticleTranslation: publicProcedure
    .input(
      z.object({
        articleId: z.number(),
        language: z.string(),
      })
    )
    .query(async ({ input }) => {
      return await getArticleTranslation(input.articleId, input.language);
    }),

  /**
   * Get translated category by language
   */
  getCategoryTranslation: publicProcedure
    .input(
      z.object({
        categoryId: z.number(),
        language: z.string(),
      })
    )
    .query(async ({ input }) => {
      return await getCategoryTranslation(input.categoryId, input.language);
    }),

  /**
   * Translate article to all languages (admin only)
   */
  translateArticle: protectedProcedure
    .input(
      z.object({
        articleId: z.number(),
        title: z.string(),
        description: z.string(),
        content: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Check if user is admin
      if (ctx.user.role !== "admin") {
        throw new Error("Only admins can translate articles");
      }

      try {
        await translateArticleToAllLanguages(
          input.articleId,
          input.title,
          input.description,
          input.content
        );

        return { success: true, message: "Article translation started" };
      } catch (error) {
        console.error("Translation error:", error);
        throw new Error("Failed to translate article");
      }
    }),

  /**
   * Translate category to all languages (admin only)
   */
  translateCategory: protectedProcedure
    .input(
      z.object({
        categoryId: z.number(),
        name: z.string(),
        description: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Check if user is admin
      if (ctx.user.role !== "admin") {
        throw new Error("Only admins can translate categories");
      }

      try {
        await translateCategoryToAllLanguages(input.categoryId, input.name, input.description);

        return { success: true, message: "Category translation started" };
      } catch (error) {
        console.error("Translation error:", error);
        throw new Error("Failed to translate category");
      }
    }),
});
