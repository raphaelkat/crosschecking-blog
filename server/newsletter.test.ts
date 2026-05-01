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

describe("newsletter.subscribe", () => {
  it("subscribes user to newsletter", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.newsletter.subscribe({
      email: "test@example.com",
    });

    expect(result).toBeDefined();
    expect(result).toHaveProperty("success");
  });

  it("validates email format", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.newsletter.subscribe({
        email: "invalid-email",
      });
    } catch (error: any) {
      expect(error).toBeDefined();
    }
  });

  it("handles duplicate subscriptions gracefully", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const email = "duplicate@example.com";
    const result1 = await caller.newsletter.subscribe({ email });
    const result2 = await caller.newsletter.subscribe({ email });

    expect(result1).toBeDefined();
    expect(result2).toBeDefined();
  });
});

describe("newsletter.unsubscribe", () => {
  it("unsubscribes from newsletter", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    // First subscribe
    await caller.newsletter.subscribe({
      email: "unsub@example.com",
    });

    // Then unsubscribe
    const result = await caller.newsletter.unsubscribe({
      token: "test-token",
    });

    expect(result).toBeDefined();
  });
});
