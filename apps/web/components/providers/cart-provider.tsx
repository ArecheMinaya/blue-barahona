"use client";

import type { BagLine, HydratedBagLine } from "@larimar/types";
import {
  createContext,
  startTransition,
  useContext,
  useEffect,
  useState,
} from "react";
import { apiRequest } from "@/lib/api";
import { calculateSubtotal, hydrateCartLines } from "@/lib/commerce";
import { useAuth } from "@/components/providers/auth-provider";

const STORAGE_KEY = "larimar-bag";

type CartContextValue = {
  items: HydratedBagLine[];
  lines: BagLine[];
  itemCount: number;
  subtotal: number;
  isReady: boolean;
  addItem: (slug: string, quantity?: number) => void;
  updateQuantity: (slug: string, quantity: number) => void;
  removeItem: (slug: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function normalizeLines(lines: BagLine[]) {
  const counts = new Map<string, number>();

  for (const line of lines) {
    if (!line.slug || line.quantity <= 0) {
      continue;
    }

    counts.set(line.slug, (counts.get(line.slug) ?? 0) + line.quantity);
  }

  return [...counts.entries()].map(([slug, quantity]) => ({
    slug,
    quantity,
  }));
}

function readStoredLines() {
  const stored = window.localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    return [];
  }

  try {
    return normalizeLines(JSON.parse(stored) as BagLine[]);
  } catch {
    return [];
  }
}

function persistLines(lines: BagLine[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { isReady: isAuthReady, session } = useAuth();
  const [lines, setLines] = useState<BagLine[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!isAuthReady) {
      return;
    }

    let isActive = true;

    async function hydrate() {
      const storedLines = readStoredLines();

      if (!session?.access_token) {
        if (!isActive) {
          return;
        }

        setLines(storedLines);
        setIsReady(true);
        return;
      }

      try {
        const payload = storedLines.length
          ? await apiRequest<{ lines: BagLine[] }>("/api/bag/merge", {
              method: "POST",
              body: JSON.stringify({ lines: storedLines }),
              token: session.access_token,
            })
          : await apiRequest<{ lines: BagLine[] }>("/api/bag", {
              token: session.access_token,
            });

        if (!isActive) {
          return;
        }

        window.localStorage.removeItem(STORAGE_KEY);
        setLines(normalizeLines(payload.lines));
      } catch {
        if (!isActive) {
          return;
        }

        setLines(storedLines);
      } finally {
        if (isActive) {
          setIsReady(true);
        }
      }
    }

    void hydrate();

    return () => {
      isActive = false;
    };
  }, [isAuthReady, session?.access_token]);

  function syncLines(nextLines: BagLine[]) {
    if (!session?.access_token) {
      persistLines(nextLines);
      return;
    }

    void apiRequest<{ lines: BagLine[] }>("/api/bag", {
      method: "PUT",
      body: JSON.stringify({ lines: nextLines }),
      token: session.access_token,
    }).catch(() => {
      persistLines(nextLines);
    });
  }

  function updateLines(updater: (current: BagLine[]) => BagLine[]) {
    startTransition(() => {
      setLines((current) => {
        const next = normalizeLines(updater(current));
        syncLines(next);
        return next;
      });
    });
  }

  const items = hydrateCartLines(lines);
  const itemCount = lines.reduce((count, line) => count + line.quantity, 0);
  const subtotal = calculateSubtotal(items);

  function addItem(slug: string, quantity = 1) {
    updateLines((current) => [...current, { slug, quantity }]);
  }

  function updateQuantity(slug: string, quantity: number) {
    updateLines((current) =>
      current
        .map((line) => (line.slug === slug ? { ...line, quantity } : line))
        .filter((line) => line.quantity > 0),
    );
  }

  function removeItem(slug: string) {
    updateLines((current) => current.filter((line) => line.slug !== slug));
  }

  function clearCart() {
    updateLines(() => []);
  }

  return (
    <CartContext.Provider
      value={{
        items,
        lines,
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
