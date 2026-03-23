"use client";

import type { Order } from "@larimar/types";
import Link from "next/link";
import { useEffect, useState } from "react";
import { formatCurrency } from "@/lib/commerce";
import { formatFulfillmentStatus } from "@/lib/order-tracking";
import { apiRequest } from "@/lib/api";
import { useAuth } from "@/components/providers/auth-provider";

function formatPaymentStatus(status: Order["status"]) {
  if (status === "awaiting_payment") {
    return "Awaiting Payment";
  }

  if (status === "payment_failed") {
    return "Payment Failed";
  }

  if (status === "cancelled") {
    return "Cancelled";
  }

  return "Paid";
}

export function OrderHistory() {
  const { session } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadOrders() {
      if (!session?.access_token) {
        setOrders([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        const result = await apiRequest<{ orders: Order[] }>("/api/orders", {
          token: session.access_token,
        });

        if (isMounted) {
          setOrders(result.orders);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadOrders();

    return () => {
      isMounted = false;
    };
  }, [session?.access_token]);

  return (
    <section className="rounded-[2rem] bg-[var(--color-primary)] p-8 text-white shadow-[0_24px_80px_rgba(0,26,44,0.18)]">
      <span className="eyebrow !text-[var(--color-secondary-container)]">Orders</span>
      <h2 className="mt-3 text-3xl font-bold tracking-[-0.04em]">Archive of acquisitions</h2>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-white/70">
        Review every order, payment state, and delivery destination associated
        with your collection.
      </p>

      {isLoading ? (
        <div className="mt-8 h-48 animate-pulse rounded-[1.75rem] bg-white/10" />
      ) : orders.length ? (
        <div className="mt-8 space-y-4">
          {orders.map((order) => (
            <article
              key={order.id}
              className="flex flex-col gap-4 rounded-[1.75rem] bg-white/8 p-6 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <p className="font-label text-[10px] uppercase tracking-[0.18em] text-white/55">
                  Order {order.id.slice(0, 8)}
                </p>
                <p className="mt-2 text-2xl font-semibold tracking-[-0.03em]">
                  {formatCurrency(order.total, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
                <p className="mt-2 text-sm text-white/70">
                  {formatFulfillmentStatus(order.fulfillmentStatus)} •{" "}
                  {new Date(order.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
                <p className="mt-2 text-[11px] uppercase tracking-[0.18em] text-white/55">
                  Payment: {formatPaymentStatus(order.status)}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link href={`/account/orders/${order.id}`} className="button-secondary !border-white/10 !bg-white/10 !text-white">
                  Track Order
                </Link>
                <Link href={`/checkout/confirmation/${order.id}`} className="button-secondary !border-white/10 !bg-white/10 !text-white">
                  Confirmation
                </Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-[1.75rem] bg-white/8 p-8 text-center">
          <p className="text-lg font-semibold">No orders yet.</p>
          <p className="mt-3 text-sm leading-7 text-white/70">
            Once you complete checkout, your order history will appear here.
          </p>
        </div>
      )}
    </section>
  );
}
