import Image from "next/image";
import type { ReactNode } from "react";
import { formatCurrency } from "@/lib/commerce";
import type { HydratedCartLine } from "@/lib/types";
import { cn } from "@/lib/utils";

type OrderSummaryProps = {
  heading?: string;
  items: HydratedCartLine[];
  subtotal: number;
  shippingAmount: number;
  taxAmount?: number;
  total: number;
  showItems?: boolean;
  footer?: ReactNode;
  className?: string;
};

export function OrderSummary({
  heading = "Order Summary",
  items,
  subtotal,
  shippingAmount,
  taxAmount,
  total,
  showItems = true,
  footer,
  className,
}: OrderSummaryProps) {
  return (
    <div
      className={cn(
        "rounded-[1.75rem] bg-[var(--color-surface-container-lowest)] p-8 shadow-[0_24px_80px_rgba(25,28,29,0.05)]",
        className,
      )}
    >
      <h3 className="font-label text-xs uppercase tracking-[0.2em] text-[var(--color-on-surface-variant)]">
        {heading}
      </h3>

      {showItems ? (
        <div className="mt-8 space-y-6">
          {items.map((item) => (
            <div key={item.product.slug} className="flex gap-4">
              <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-[1rem] bg-[var(--color-surface-container)]">
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
                  <h4 className="text-base font-bold tracking-[-0.03em] text-[var(--color-primary)]">
                    {item.product.name}
                  </h4>
                  <p className="mt-1 text-xs text-[var(--color-on-surface-variant)]">
                    {item.product.materials}
                  </p>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <p className="text-xs text-[var(--color-on-surface-variant)]">
                    Qty: {item.quantity}
                  </p>
                  <p className="font-semibold text-[var(--color-primary)]">
                    {formatCurrency(item.lineTotal, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      <div className={cn("space-y-4", showItems && "mt-8 border-t border-black/5 pt-8")}>
        <div className="flex justify-between text-sm text-[var(--color-on-surface-variant)]">
          <span>Subtotal</span>
          <span>
            {formatCurrency(subtotal, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>

        <div className="flex justify-between text-sm text-[var(--color-on-surface-variant)]">
          <span>Insured Shipping</span>
          <span className="font-medium uppercase tracking-[0.18em] text-[var(--color-secondary)]">
            {shippingAmount === 0
              ? "Complimentary"
              : formatCurrency(shippingAmount, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
          </span>
        </div>

        {typeof taxAmount === "number" ? (
          <div className="flex justify-between text-sm text-[var(--color-on-surface-variant)]">
            <span>Estimated Tax</span>
            <span>
              {formatCurrency(taxAmount, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
        ) : null}

        <div className="flex justify-between border-t border-black/5 pt-4 text-xl font-bold tracking-[-0.03em] text-[var(--color-primary)]">
          <span>Total</span>
          <span>
            {formatCurrency(total, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>
      </div>

      {footer ? <div className="mt-8">{footer}</div> : null}
    </div>
  );
}
