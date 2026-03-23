import type {
  CollectionFilterState,
  PriceRangeOption,
  Product,
  ProductSort,
} from "@larimar/types";
import { collectionSlugs, homeFeatureSlugs, products } from "./products";
import { shippingMethods } from "./shipping";

export const collectionSortOptions: ProductSort[] = [
  "Newest",
  "Featured",
  "Price: Low to High",
  "Price: High to Low",
];

export const priceRangeOptions: PriceRangeOption[] = [
  { id: "all", label: "Any Price", min: null, max: null },
  { id: "under-1000", label: "Under $1,000", min: null, max: 1000 },
  { id: "1000-2000", label: "$1,000 to $2,000", min: 1000, max: 2000 },
  { id: "2000-plus", label: "$2,000+", min: 2000, max: null },
];

export function getAllProducts() {
  return products;
}

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getProductsBySlugs(slugs: string[]) {
  return slugs
    .map((slug) => getProductBySlug(slug))
    .filter((product): product is Product => Boolean(product));
}

export function getHomeProducts() {
  return getProductsBySlugs(homeFeatureSlugs);
}

export function getCollectionProducts() {
  return getProductsBySlugs(collectionSlugs);
}

export function getRelatedProducts(product: Product) {
  return getProductsBySlugs(product.relatedSlugs);
}

export function getShippingMethods() {
  return shippingMethods;
}

export function getCollectionCategories() {
  return ["All Pieces", ...new Set(products.map((product) => product.category))];
}

export function getMaterialFamilies() {
  return ["Any", ...new Set(products.map((product) => product.metalFamily))];
}

export function sortProducts(items: Product[], sort: ProductSort) {
  return [...items].sort((left, right) => {
    if (sort === "Price: Low to High") {
      return left.price - right.price;
    }

    if (sort === "Price: High to Low") {
      return right.price - left.price;
    }

    return right.launchOrder - left.launchOrder;
  });
}

export function filterProducts(items: Product[], filters: CollectionFilterState) {
  const selectedPriceRange =
    priceRangeOptions.find((option) => option.id === filters.priceRange) ??
    priceRangeOptions[0];

  const filtered = items
    .filter((product) =>
      filters.category === "All Pieces" ? true : product.category === filters.category,
    )
    .filter((product) =>
      filters.material === "Any" ? true : product.metalFamily === filters.material,
    )
    .filter((product) => {
      if (
        selectedPriceRange.min === null &&
        selectedPriceRange.max === null
      ) {
        return true;
      }

      if (
        selectedPriceRange.min !== null &&
        product.price < selectedPriceRange.min
      ) {
        return false;
      }

      if (
        selectedPriceRange.max !== null &&
        product.price >= selectedPriceRange.max
      ) {
        return false;
      }

      return true;
    });

  return sortProducts(filtered, filters.sort);
}
