import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

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

describe("articles.search", () => {
  it("searches articles by keyword", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.articles.search({
      query: "a",
      categoryId: undefined,
      page: 1,
      limit: 10,
    });

    expect(result).toBeDefined();
    expect(result).toHaveProperty("articles");
    expect(result).toHaveProperty("total");
    expect(Array.isArray(result.articles)).toBe(true);
  });

  it("searches articles with category filter", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.articles.search({
      query: "a",
      categoryId: 1,
      page: 1,
      limit: 10,
    });

    expect(result).toBeDefined();
    expect(result.articles).toBeDefined();
  });

  it("handles pagination correctly", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const page1 = await caller.articles.search({
      query: "a",
      categoryId: undefined,
      page: 1,
      limit: 5,
    });

    const page2 = await caller.articles.search({
      query: "a",
      categoryId: undefined,
      page: 2,
      limit: 5,
    });

    expect(page1.articles).toBeDefined();
    expect(page2.articles).toBeDefined();
  });

  it("returns empty results for non-matching query", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.articles.search({
      query: "xyz",
      categoryId: undefined,
      page: 1,
      limit: 10,
    });

    expect(result.articles).toBeDefined();
    expect(Array.isArray(result.articles)).toBe(true);
  });
});

describe("articles.trending", () => {
  it("returns trending articles", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.articles.trending({
      limit: 5,
    });

    expect(Array.isArray(result)).toBe(true);
  });

  it("respects limit parameter", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.articles.trending({
      limit: 3,
    });

    expect(result.length).toBeLessThanOrEqual(3);
  });
});

describe("articles.related", () => {
  it("returns related articles", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.articles.related({
      articleId: 1,
      limit: 5,
    });

    expect(Array.isArray(result)).toBe(true);
  });

  it("respects limit parameter for related articles", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.articles.related({
      articleId: 1,
      limit: 3,
    });

    expect(result.length).toBeLessThanOrEqual(3);
  });
});
