"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRightIcon } from "@/components/icons";
import { useCart } from "@/components/providers/cart-provider";

export function AddToBagButton({
  slug,
  quantity = 1,
}: {
  slug: string;
  quantity?: number;
}) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleAddToBag() {
    addItem(slug, quantity);
    setAdded(true);
  }

  return (
    <div className="space-y-3">
      <button type="button" className="button-primary w-full" onClick={handleAddToBag}>
        Add to Bag
      </button>

      {added ? (
        <p className="flex items-center gap-2 text-sm text-[var(--color-on-surface-variant)]">
          Piece reserved in your bag.
          <Link
            href="/bag"
            className="inline-flex items-center gap-2 font-medium text-[var(--color-primary)]"
          >
            View bag
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </p>
      ) : null}
    </div>
  );
}
