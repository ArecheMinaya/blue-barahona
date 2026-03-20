"use client";

import Image from "next/image";
import { MinusIcon, PlusIcon } from "@/components/icons";
import { formatCurrency } from "@/lib/commerce";
import type { HydratedCartLine } from "@/lib/types";

type BagItemProps = {
  item: HydratedCartLine;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
};

export function BagItem({
  item,
  onIncrease,
  onDecrease,
  onRemove,
}: BagItemProps) {
  return (
    <article className="flex gap-5">
      <div className="relative h-32 w-24 flex-shrink-0 overflow-hidden rounded-[1rem] bg-[var(--color-surface-container)]">
        <Image
          src={item.product.heroImage.src}
          alt={item.product.heroImage.alt}
          fill
          className="object-cover"
          sizes="96px"
        />
      </div>

      <div className="flex flex-1 flex-col justify-between py-1">
        <div>
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-lg font-bold tracking-[-0.03em] text-[var(--color-primary)]">
              {item.product.name}
            </h3>
            <p className="font-label text-sm font-semibold text-[var(--color-primary)]">
              {formatCurrency(item.lineTotal)}
            </p>
          </div>
          <p className="mt-1 text-sm text-[var(--color-on-surface-variant)]">
            {item.product.metal} • {item.product.stone}
          </p>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-3 rounded-full bg-[var(--color-surface-container-low)] px-3 py-1.5">
            <button
              type="button"
              aria-label={`Decrease quantity for ${item.product.name}`}
              className="text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)]"
              onClick={onDecrease}
            >
              <MinusIcon className="h-4 w-4" />
            </button>
            <span className="font-label min-w-4 text-center text-xs font-semibold">
              {item.quantity}
            </span>
            <button
              type="button"
              aria-label={`Increase quantity for ${item.product.name}`}
              className="text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)]"
              onClick={onIncrease}
            >
              <PlusIcon className="h-4 w-4" />
            </button>
          </div>

          <button
            type="button"
            className="font-label text-[10px] uppercase tracking-[0.18em] text-[var(--color-on-surface-variant)] hover:text-red-600"
            onClick={onRemove}
          >
            Remove
          </button>
        </div>
      </div>
    </article>
  );
}
