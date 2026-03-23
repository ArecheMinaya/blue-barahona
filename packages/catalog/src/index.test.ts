import { describe, expect, it } from "vitest";
import {
  filterProducts,
  getCollectionProducts,
  getMaterialFamilies,
  priceRangeOptions,
} from "./index";

describe("catalog filters", () => {
  it("filters by category and material together", () => {
    const products = getCollectionProducts();
    const result = filterProducts(products, {
      category: "Rings",
      material: "18k Gold",
      priceRange: "all",
      sort: "Newest",
    });

    expect(result.length).toBeGreaterThan(0);
    expect(result.every((product) => product.category === "Rings")).toBe(true);
    expect(result.every((product) => product.metalFamily === "18k Gold")).toBe(true);
  });

  it("applies the configured price ranges", () => {
    const products = getCollectionProducts();
    const upperBand = priceRangeOptions.find((option) => option.id === "2000-plus");

    expect(upperBand).toBeDefined();

    const result = filterProducts(products, {
      category: "All Pieces",
      material: "Any",
      priceRange: "2000-plus",
      sort: "Price: Low to High",
    });

    expect(result.length).toBeGreaterThan(0);
    expect(result.every((product) => product.price >= (upperBand?.min ?? 0))).toBe(true);
  });

  it("keeps material families curated for the filter UI", () => {
    const families = getMaterialFamilies();

    expect(families[0]).toBe("Any");
    expect(families).toContain("Mixed Metals");
    expect(families).toContain("Sterling Silver");
  });
});
