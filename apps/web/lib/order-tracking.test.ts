import { describe, expect, it } from "vitest";
import {
  formatOrderReference,
  getFulfillmentProgressWidth,
  getFulfillmentState,
} from "@/lib/order-tracking";

describe("order tracking helpers", () => {
  it("marks prior steps as complete and later steps as upcoming", () => {
    expect(getFulfillmentState("shipped", "processing")).toBe("complete");
    expect(getFulfillmentState("shipped", "shipped")).toBe("active");
    expect(getFulfillmentState("shipped", "delivered")).toBe("upcoming");
  });

  it("computes zero-width progress for the first step", () => {
    expect(getFulfillmentProgressWidth("confirmed")).toBe("0px");
  });

  it("formats a branded order reference", () => {
    expect(
      formatOrderReference({
        id: "8d8f7c4a-1f9f-4e4d-a2cc-90fd11112222",
        createdAt: "2026-03-23T15:30:00.000Z",
      }),
    ).toBe("LR-2026-8D8F");
  });
});
