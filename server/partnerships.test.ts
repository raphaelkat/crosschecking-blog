import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { appRouter } from "./routers";
import { getDb } from "./db";
import { partnerships } from "../drizzle/schema";
import { eq } from "drizzle-orm";

describe("Partnerships", () => {
  let testId: number;

  beforeAll(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database unavailable");

    // Clean up any existing test data
    await db.delete(partnerships).where(eq(partnerships.partnerName, "Test Partner"));
  });

  afterAll(async () => {
    const db = await getDb();
    if (!db) return;

    // Clean up test data
    if (testId) {
      await db.delete(partnerships).where(eq(partnerships.id, testId));
    }
  });

  it("lists active partnerships", async () => {
    const caller = appRouter.createCaller({
      user: null,
      req: {} as any,
      res: {} as any,
    });

    const result = await caller.partnerships.list();
    expect(Array.isArray(result)).toBe(true);
  });

  it("creates a partnership (admin only)", async () => {
    const caller = appRouter.createCaller({
      user: { id: 1, role: "admin", openId: "test-admin" } as any,
      req: {} as any,
      res: {} as any,
    });

    const result = await caller.partnerships.create({
      partnerName: "Test Partner",
      partnerLogo: "https://example.com/logo.png",
      description: "A test partner",
      partnerUrl: "https://example.com",
    });

    expect(result.success).toBe(true);

    // Fetch the created partnership to get its ID
    const db = await getDb();
    if (db) {
      const created = await db
        .select()
        .from(partnerships)
        .where(eq(partnerships.partnerName, "Test Partner"));
      if (created.length > 0) {
        testId = created[0].id;
      }
    }
  });

  it("denies partnership creation for non-admin users", async () => {
    const caller = appRouter.createCaller({
      user: { id: 2, role: "user", openId: "test-user" } as any,
      req: {} as any,
      res: {} as any,
    });

    try {
      await caller.partnerships.create({
        partnerName: "Unauthorized",
        partnerLogo: "https://example.com/logo.png",
      });
      expect.fail("Should have thrown error");
    } catch (error: any) {
      expect(error.message).toContain("Unauthorized");
    }
  });

  it("updates a partnership (admin only)", async () => {
    if (!testId) {
      console.log("Skipping update test - no test ID");
      return;
    }

    const caller = appRouter.createCaller({
      user: { id: 1, role: "admin", openId: "test-admin" } as any,
      req: {} as any,
      res: {} as any,
    });

    const result = await caller.partnerships.update({
      id: testId,
      description: "Updated description",
      isActive: false,
    });

    expect(result.success).toBe(true);

    // Verify the update
    const db = await getDb();
    if (db) {
      const updated = await db
        .select()
        .from(partnerships)
        .where(eq(partnerships.id, testId));
      expect(updated[0].description).toBe("Updated description");
      expect(updated[0].isActive).toBe(false);
    }
  });

  it("deletes a partnership (admin only)", async () => {
    if (!testId) {
      console.log("Skipping delete test - no test ID");
      return;
    }

    const caller = appRouter.createCaller({
      user: { id: 1, role: "admin", openId: "test-admin" } as any,
      req: {} as any,
      res: {} as any,
    });

    const result = await caller.partnerships.delete({ id: testId });
    expect(result.success).toBe(true);

    // Verify deletion
    const db = await getDb();
    if (db) {
      const deleted = await db
        .select()
        .from(partnerships)
        .where(eq(partnerships.id, testId));
      expect(deleted.length).toBe(0);
    }
  });
});
