"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRightIcon, ChevronDownIcon } from "@/components/icons";
import { CollectionGrid } from "@/components/collection-grid";
import { collectionIntro } from "@/data/site";
import type { Product } from "@/lib/types";

function CollectionStoryCard() {
  return (
    <div
      id="bespoke"
      className="relative h-full overflow-hidden rounded-[1.5rem] bg-[var(--color-primary)] p-8 text-white"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[rgba(144,231,253,0.18)] via-transparent to-[rgba(0,47,75,0.7)]" />
      <div className="relative z-10 flex h-full flex-col justify-center">
        <span className="font-label text-[10px] uppercase tracking-[0.18em] text-[var(--color-secondary-container)]">
          {collectionIntro.storyEyebrow}
        </span>
        <h2 className="mt-5 text-3xl font-bold tracking-[-0.04em]">
          {collectionIntro.storyTitle}
        </h2>
        <p className="mt-5 max-w-md leading-8 text-white/75">
          {collectionIntro.storyDescription}
        </p>
        <Link
          href={collectionIntro.storyLinkHref}
          className="mt-8 inline-flex items-center gap-3 font-medium text-[var(--color-tertiary-fixed)]"
        >
          {collectionIntro.storyLinkLabel}
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

function FilterSelect({
  id,
  label,
  value,
  options,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex items-center gap-3">
      <span className="font-label text-[10px] uppercase tracking-[0.18em] text-[var(--color-outline)]">
        {label}
      </span>
      <div className="relative">
        <select
          id={id}
          value={value}
          className="appearance-none bg-transparent pr-8 text-sm font-semibold text-[var(--color-primary)] outline-none"
          onChange={(event) => onChange(event.target.value)}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <ChevronDownIcon className="pointer-events-none absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-primary)]" />
      </div>
    </label>
  );
}

export function CollectionFilters({ products }: { products: Product[] }) {
  const categories = ["All Pieces", ...new Set(products.map((product) => product.category))];
  const materials = ["Any", ...new Set(products.map((product) => product.metalFamily))];

  const [selectedCategory, setSelectedCategory] = useState("All Pieces");
  const [selectedMaterial, setSelectedMaterial] = useState("Any");
  const [selectedSort, setSelectedSort] = useState("Newest");

  const visibleProducts = [...products]
    .filter((product) =>
      selectedCategory === "All Pieces"
        ? true
        : product.category === selectedCategory,
    )
    .filter((product) =>
      selectedMaterial === "Any"
        ? true
        : product.metalFamily === selectedMaterial,
    )
    .sort((left, right) => {
      if (selectedSort === "Price: Low to High") {
        return left.price - right.price;
      }

      if (selectedSort === "Price: High to Low") {
        return right.price - left.price;
      }

      return right.launchOrder - left.launchOrder;
    });

  return (
    <>
      <div className="sticky top-24 z-30 mb-14">
        <div className="no-scrollbar overflow-x-auto">
          <div className="glass-panel inline-flex min-w-full items-center justify-start gap-4 rounded-full px-5 py-3 md:min-w-max md:justify-center md:gap-8 md:px-8">
            <FilterSelect
              id="category"
              label="Category"
              value={selectedCategory}
              options={categories}
              onChange={setSelectedCategory}
            />
            <span className="hidden h-4 w-px bg-black/10 md:block" />
            <FilterSelect
              id="material"
              label="Material"
              value={selectedMaterial}
              options={materials}
              onChange={setSelectedMaterial}
            />
            <span className="hidden h-4 w-px bg-black/10 md:block" />
            <FilterSelect
              id="sort"
              label="Sort"
              value={selectedSort}
              options={["Newest", "Price: Low to High", "Price: High to Low"]}
              onChange={setSelectedSort}
            />
          </div>
        </div>
      </div>

      {visibleProducts.length ? (
        <CollectionGrid
          products={visibleProducts}
          align="center"
          featureCard={<CollectionStoryCard />}
          featureIndex={1}
          getMeta={(product) => product.materials}
        />
      ) : (
        <div className="rounded-[2rem] bg-white/70 px-8 py-12 text-center shadow-[0_24px_80px_rgba(25,28,29,0.04)]">
          <p className="text-lg font-semibold text-[var(--color-primary)]">
            No pieces match the current filter set.
          </p>
          <p className="mt-3 text-sm leading-7 text-[var(--color-on-surface-variant)]">
            Try resetting the category or material selection to reveal the full
            Larimar assortment.
          </p>
        </div>
      )}
    </>
  );
}
