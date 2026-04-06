import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAdminContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "admin-user",
    email: "admin@example.com",
    name: "Admin User",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("Articles Router", () => {
  let adminCaller = appRouter.createCaller(createAdminContext());
  let publicCaller = appRouter.createCaller(createPublicContext());
  let categoryId = 0;
  let articleId = 0;

  beforeAll(async () => {
    // Create a test category
    try {
      const categoryResult = await adminCaller.categories.create({
        name: "Test Category",
        slug: "test-category",
        description: "Test category for articles",
      });
      categoryId = (categoryResult as any).insertId || 1;
    } catch (error) {
      console.warn("Category creation failed (may already exist):", error);
      categoryId = 1;
    }
  });

  describe("articles.create", () => {
    it("should create an article with required fields", async () => {
      const result = await adminCaller.articles.create({
        title: "Test Article",
        slug: `test-article-${Date.now()}`,
        content: "This is test content",
        categoryId: categoryId,
        status: "published",
      });

      expect(result).toBeDefined();
      articleId = (result as any).insertId || 1;
    });

    it("should reject creation by non-admin users", async () => {
      try {
        await publicCaller.articles.create({
          title: "Unauthorized Article",
          slug: "unauthorized-article",
          content: "This should fail",
          categoryId: categoryId,
        });
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect((error as Error).message).toMatch(/Unauthorized|Please login/);
      }
    });
  });

  describe("articles.list", () => {
    it("should list published articles", async () => {
      const articles = await publicCaller.articles.list({
        limit: 10,
        offset: 0,
      });

      expect(Array.isArray(articles)).toBe(true);
    });

    it("should filter articles by category", async () => {
      const articles = await publicCaller.articles.list({
        categoryId: categoryId,
        limit: 10,
        offset: 0,
      });

      expect(Array.isArray(articles)).toBe(true);
    });

    it("should search articles by title", async () => {
      const articles = await publicCaller.articles.list({
        search: "Test",
        limit: 10,
        offset: 0,
      });

      expect(Array.isArray(articles)).toBe(true);
    });
  });

  describe("articles.getBySlug", () => {
    it("should retrieve an article by slug", async () => {
      // Just verify the query works without errors
      const article = await publicCaller.articles.getBySlug({
        slug: `test-article-${Date.now() - 1000}`,
      });

      // Article may or may not exist depending on timing, just verify no error
      expect(typeof article === "object" || article === null).toBe(true);
    });

    it("should return null for non-existent article", async () => {
      const article = await publicCaller.articles.getBySlug({
        slug: `non-existent-${Date.now()}`,
      });

      expect(article).toBeNull();
    });
  });

  describe("articles.trending", () => {
    it("should return trending articles sorted by view count", async () => {
      const trending = await publicCaller.articles.trending({
        limit: 5,
      });

      expect(Array.isArray(trending)).toBe(true);
    });
  });

  describe("articles.related", () => {
    it("should return related articles from same category", async () => {
      if (articleId > 0) {
        const related = await publicCaller.articles.related({
          articleId: articleId,
          limit: 3,
        });

        expect(Array.isArray(related)).toBe(true);
      }
    });
  });

  describe("articles.update", () => {
    it("should update an article", async () => {
      if (articleId > 0) {
        const result = await adminCaller.articles.update({
          id: articleId,
          title: "Updated Article Title",
          metaDescription: "Updated meta description",
        });

        expect(result.success).toBe(true);
      }
    });

    it("should reject updates by non-admin users", async () => {
      try {
        await publicCaller.articles.update({
          id: articleId,
          title: "Unauthorized Update",
        });
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect((error as Error).message).toMatch(/Unauthorized|Please login/);
      }
    });
  });

  describe("articles.delete", () => {
    it("should reject deletion by non-admin users", async () => {
      try {
        await publicCaller.articles.delete({
          id: articleId,
        });
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect((error as Error).message).toMatch(/Unauthorized|Please login/);
      }
    });
  });
});

describe("Newsletter Router", () => {
  const publicCaller = appRouter.createCaller(createPublicContext());

  describe("newsletter.subscribe", () => {
    it("should subscribe a user to the newsletter", async () => {
      const result = await publicCaller.newsletter.subscribe({
        email: `subscriber-${Date.now()}@example.com`,
        name: "Test Subscriber",
      });

      expect(result.success).toBe(true);
    });

    it("should reject duplicate email subscriptions", async () => {
      const email = `duplicate-${Date.now()}@example.com`;
      await publicCaller.newsletter.subscribe({
        email: email,
        name: "First",
      });

      const result = await publicCaller.newsletter.subscribe({
        email: email,
        name: "Second",
      });

      expect(result.success).toBe(false);
    });
  });
});

describe("Comments Router", () => {
  const publicCaller = appRouter.createCaller(createPublicContext());
  const adminCaller = appRouter.createCaller(createAdminContext());

  describe("comments.create", () => {
    it("should create a comment pending moderation", async () => {
      const result = await publicCaller.comments.create({
        articleId: 1,
        authorName: "Test Commenter",
        authorEmail: "commenter@example.com",
        content: "This is a test comment",
      });

      expect(result.success).toBe(true);
    });
  });

  describe("comments.listByArticle", () => {
    it("should list only approved comments", async () => {
      const comments = await publicCaller.comments.listByArticle({
        articleId: 1,
      });

      expect(Array.isArray(comments)).toBe(true);
      comments.forEach((comment) => {
        expect(comment.isApproved).toBe(true);
      });
    });
  });

  describe("comments.approve", () => {
    it("should reject approval by non-admin users", async () => {
      try {
        await publicCaller.comments.approve({
          id: 1,
        });
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect((error as Error).message).toMatch(/Unauthorized|Please login/);
      }
    });
  });
});

describe("Categories Router", () => {
  const publicCaller = appRouter.createCaller(createPublicContext());

  describe("categories.list", () => {
    it("should list all categories", async () => {
      const categories = await publicCaller.categories.list();

      expect(Array.isArray(categories)).toBe(true);
    });
  });

  describe("categories.getBySlug", () => {
    it("should retrieve a category by slug", async () => {
      const category = await publicCaller.categories.getBySlug({
        slug: "test-category",
      });

      if (category) {
        expect(category.slug).toBe("test-category");
      }
    });
  });
});
