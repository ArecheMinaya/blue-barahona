import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product-card";
import { ProductGallery } from "@/components/product-gallery";
import { ProductInfo } from "@/components/product-info";
import { getAllProducts, getProductBySlug, getRelatedProducts } from "@/lib/catalog";

export const dynamicParams = false;

export async function generateStaticParams() {
  return getAllProducts().map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  return {
    title: product.name,
    description: product.description,
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = getRelatedProducts(product);

  return (
    <>
      <div className="grid min-h-[calc(100vh-7rem)] md:grid-cols-2">
        <ProductGallery product={product} />
        <ProductInfo product={product} />
      </div>

      <section className="section-pad bg-[var(--color-surface)]">
        <div className="page-shell">
          <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-[-0.04em] text-[var(--color-primary)]">
                You May Also Admire
              </h2>
              <p className="mt-3 text-sm leading-7 text-[var(--color-on-surface-variant)]">
                A concise edit of related pieces drawn from the same marine palette.
              </p>
            </div>
            <Link
              href="/collection"
              className="font-label text-xs uppercase tracking-[0.18em] text-[var(--color-primary)]"
            >
              Return to Collection
            </Link>
          </div>

          <div className="flex gap-8 overflow-x-auto pb-4 no-scrollbar">
            {relatedProducts.map((relatedProduct) => (
              <div key={relatedProduct.slug} className="min-w-[18rem] md:min-w-[24rem]">
                <ProductCard
                  product={relatedProduct}
                  align="center"
                  meta={relatedProduct.collection}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
