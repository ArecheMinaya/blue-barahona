import { describe, expect, it } from "vitest";
import { calculateOrderTotal, calculateSubtotal, hydrateCartLines } from "./commerce";

describe("commerce helpers", () => {
  it("hydrates bag lines with product data", () => {
    const items = hydrateCartLines([
      { slug: "azure-tide-pendant", quantity: 1 },
      { slug: "mistral-drop-earrings", quantity: 2 },
    ]);

    expect(items).toHaveLength(2);
    expect(items[0]?.product.name).toBe("Azure Tide Pendant");
    expect(items[1]?.lineTotal).toBe(1960);
  });

  it("calculates subtotal and order total", () => {
    const items = hydrateCartLines([{ slug: "sunlit-lagoon-ring", quantity: 1 }]);
    const subtotal = calculateSubtotal(items);
    const total = calculateOrderTotal(subtotal, 45, 0);

    expect(subtotal).toBe(2850);
    expect(total).toBe(2895);
  });
});
