"use client";

import {
  createContext,
  startTransition,
  useContext,
  useEffect,
  useState,
} from "react";
import { initialCartLines } from "@/data/cart";
import { calculateSubtotal, hydrateCartLines } from "@/lib/commerce";
import type { CartLine, HydratedCartLine } from "@/lib/types";

const STORAGE_KEY = "larimar-cart";

type CartContextValue = {
  items: HydratedCartLine[];
  itemCount: number;
  subtotal: number;
  isReady: boolean;
  addItem: (slug: string, quantity?: number) => void;
  updateQuantity: (slug: string, quantity: number) => void;
  removeItem: (slug: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function persistCart(lines: CartLine[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(initialCartLines);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      persistCart(initialCartLines);
      setIsReady(true);
      return;
    }

    try {
      const parsed = JSON.parse(stored) as CartLine[];
      setLines(parsed);
    } catch {
      persistCart(initialCartLines);
      setLines(initialCartLines);
    } finally {
      setIsReady(true);
    }
  }, []);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    persistCart(lines);
  }, [isReady, lines]);

  const items = hydrateCartLines(lines);
  const itemCount = lines.reduce((count, line) => count + line.quantity, 0);
  const subtotal = calculateSubtotal(items);

  function addItem(slug: string, quantity = 1) {
    startTransition(() => {
      setLines((current) => {
        const existing = current.find((line) => line.slug === slug);

        if (!existing) {
          return [...current, { slug, quantity }];
        }

        return current.map((line) =>
          line.slug === slug
            ? { ...line, quantity: line.quantity + quantity }
            : line,
        );
      });
    });
  }

  function updateQuantity(slug: string, quantity: number) {
    startTransition(() => {
      setLines((current) => {
        if (quantity <= 0) {
          return current.filter((line) => line.slug !== slug);
        }

        return current.map((line) =>
          line.slug === slug ? { ...line, quantity } : line,
        );
      });
    });
  }

  function removeItem(slug: string) {
    startTransition(() => {
      setLines((current) => current.filter((line) => line.slug !== slug));
    });
  }

  function clearCart() {
    startTransition(() => {
      setLines([]);
    });
  }

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        isReady,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
}
