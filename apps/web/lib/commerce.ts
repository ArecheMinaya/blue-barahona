import { getProductBySlug } from "@/lib/catalog";
import type { CartLine, HydratedCartLine } from "@/lib/types";

const ESTIMATED_TAX_RATE = 0.05144404332129964;

export function formatCurrency(
  amount: number,
  options: Intl.NumberFormatOptions = {},
) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    ...options,
  }).format(amount);
}

export function hydrateCartLines(lines: CartLine[]) {
  return lines.reduce<HydratedCartLine[]>((items, line) => {
    const product = getProductBySlug(line.slug);

    if (!product) {
      return items;
    }

    items.push({
      ...line,
      product,
      lineTotal: product.price * line.quantity,
    });

    return items;
  }, []);
}

export function calculateSubtotal(items: HydratedCartLine[]) {
  return items.reduce((total, item) => total + item.lineTotal, 0);
}

export function calculateEstimatedTax(subtotal: number) {
  return Number((subtotal * ESTIMATED_TAX_RATE).toFixed(2));
}

export function calculateOrderTotal(
  subtotal: number,
  shippingAmount: number,
  taxAmount: number,
) {
  return subtotal + shippingAmount + taxAmount;
}
