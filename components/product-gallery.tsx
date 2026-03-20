"use client";

import Image from "next/image";
import { useState } from "react";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ProductGallery({ product }: { product: Product }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = product.gallery[activeIndex] ?? product.heroImage;

  return (
    <section className="relative overflow-hidden bg-[var(--color-surface-container-low)]">
      <div className="relative h-[32rem] w-full md:h-[calc(100vh-7rem)]">
        <Image
          src={activeImage.src}
          alt={activeImage.alt}
          fill
          priority
          className="object-cover"
          sizes="(min-width: 768px) 50vw, 100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[rgba(248,250,251,0.14)]" />

        <div className="absolute bottom-8 left-8 hidden gap-3 md:flex">
          {product.gallery.map((image, index) => (
            <button
              key={image.src}
              type="button"
              className={cn(
                "relative h-14 w-14 overflow-hidden rounded-xl border-2 bg-white/10",
                index === activeIndex
                  ? "border-white/80"
                  : "border-white/10 hover:border-white/50",
              )}
              onClick={() => setActiveIndex(index)}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
                sizes="56px"
              />
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 px-6 py-6 md:hidden">
        {product.gallery.map((image, index) => (
          <button
            key={image.src}
            type="button"
            className={cn(
              "relative aspect-square overflow-hidden rounded-2xl border bg-white/80",
              index === activeIndex
                ? "border-[rgba(0,26,44,0.45)]"
                : "border-[rgba(194,199,206,0.2)]",
            )}
            onClick={() => setActiveIndex(index)}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover"
              sizes="33vw"
            />
          </button>
        ))}
      </div>
    </section>
  );
}
