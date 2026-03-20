import type { ReactNode } from "react";
import type { Product } from "@/lib/types";
import { ProductCard } from "@/components/product-card";

type CollectionGridProps = {
  products: Product[];
  align?: "left" | "center";
  staggered?: boolean;
  featureCard?: ReactNode;
  featureIndex?: number;
  getMeta?: (product: Product) => string;
};

export function CollectionGrid({
  products,
  align = "left",
  staggered = false,
  featureCard,
  featureIndex = 1,
  getMeta,
}: CollectionGridProps) {
  const content: ReactNode[] = [];

  products.forEach((product, index) => {
    content.push(
      <ProductCard
        key={product.slug}
        product={product}
        align={align}
        offset={staggered && index % 2 === 1}
        meta={getMeta?.(product)}
      />,
    );

    if (featureCard && index === featureIndex) {
      content.push(
        <div key="feature-card" className="lg:self-stretch">
          {featureCard}
        </div>,
      );
    }
  });

  return (
    <div className="grid grid-cols-1 gap-x-10 gap-y-16 md:grid-cols-2 lg:grid-cols-4">
      {content}
    </div>
  );
}
