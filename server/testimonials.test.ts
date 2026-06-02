import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { appRouter } from "./routers";
import { getDb } from "./db";
import { testimonials } from "../drizzle/schema";
import { eq } from "drizzle-orm";

describe("Testimonials", () => {
  let testId: number;

  beforeAll(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database unavailable");

    // Clean up any existing test data
    await db.delete(testimonials).where(eq(testimonials.authorName, "Test Author"));
  });

  afterAll(async () => {
    const db = await getDb();
    if (!db) return;

    // Clean up test data
    if (testId) {
      await db.delete(testimonials).where(eq(testimonials.id, testId));
    }
  });

  it("lists active testimonials", async () => {
    const caller = appRouter.createCaller({
      user: null,
      req: {} as any,
      res: {} as any,
    });

    const result = await caller.testimonials.list();
    expect(Array.isArray(result)).toBe(true);
  });

  it("creates a testimonial (admin only)", async () => {
    const caller = appRouter.createCaller({
      user: { id: 1, role: "admin", openId: "test-admin" } as any,
      req: {} as any,
      res: {} as any,
    });

    const result = await caller.testimonials.create({
      authorName: "Test Author",
      authorTitle: "CEO",
      content: "This is a great platform!",
      rating: 5,
    });

    expect(result.success).toBe(true);

    // Fetch the created testimonial to get its ID
    const db = await getDb();
    if (db) {
      const created = await db
        .select()
        .from(testimonials)
        .where(eq(testimonials.authorName, "Test Author"));
      if (created.length > 0) {
        testId = created[0].id;
      }
    }
  });

  it("denies testimonial creation for non-admin users", async () => {
    const caller = appRouter.createCaller({
      user: { id: 2, role: "user", openId: "test-user" } as any,
      req: {} as any,
      res: {} as any,
    });

    try {
      await caller.testimonials.create({
        authorName: "Unauthorized",
        content: "Should fail",
      });
      expect.fail("Should have thrown error");
    } catch (error: any) {
      expect(error.message).toContain("Unauthorized");
    }
  });

  it("updates a testimonial (admin only)", async () => {
    if (!testId) {
      console.log("Skipping update test - no test ID");
      return;
    }

    const caller = appRouter.createCaller({
      user: { id: 1, role: "admin", openId: "test-admin" } as any,
      req: {} as any,
      res: {} as any,
    });

    const result = await caller.testimonials.update({
      id: testId,
      rating: 4,
      isActive: false,
    });

    expect(result.success).toBe(true);

    // Verify the update
    const db = await getDb();
    if (db) {
      const updated = await db
        .select()
        .from(testimonials)
        .where(eq(testimonials.id, testId));
      expect(updated[0].rating).toBe(4);
      expect(updated[0].isActive).toBe(false);
    }
  });
});
