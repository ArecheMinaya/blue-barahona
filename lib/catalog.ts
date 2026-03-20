import { collectionSlugs, homeFeatureSlugs, products } from "@/data/products";
import type { Product } from "@/lib/types";

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
