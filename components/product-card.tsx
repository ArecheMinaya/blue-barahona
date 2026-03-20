import Image from "next/image";
import Link from "next/link";
import { formatCurrency } from "@/lib/commerce";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";

type ProductCardProps = {
  product: Product;
  meta?: string;
  align?: "left" | "center";
  offset?: boolean;
  className?: string;
};

export function ProductCard({
  product,
  meta,
  align = "left",
  offset = false,
  className,
}: ProductCardProps) {
  return (
    <Link
      href={`/product/${product.slug}`}
      className={cn(
        "group block",
        offset && "md:translate-y-8",
        className,
      )}
    >
      <div className="relative mb-6 aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-[var(--color-surface-container-lowest)] shadow-[0_20px_60px_rgba(25,28,29,0.03)]">
        <Image
          src={product.heroImage.src}
          alt={product.heroImage.alt}
          fill
          className="object-cover transition duration-700 group-hover:scale-[1.03]"
          sizes="(min-width: 1280px) 22vw, (min-width: 768px) 40vw, 100vw"
        />
      </div>

      <div
        className={cn(
          "space-y-1",
          align === "center" ? "text-center" : "text-left",
        )}
      >
        <h3 className="text-xl font-bold tracking-[-0.03em] text-[var(--color-primary)]">
          {product.name}
        </h3>
        <p className="font-label text-[11px] uppercase tracking-[0.18em] text-[var(--color-on-surface-variant)]">
          {(meta ?? product.collection) + " • " + formatCurrency(product.price)}
        </p>
      </div>
    </Link>
  );
}
