import type { BagLine } from "@larimar/types";
import { supabaseAdmin } from "@/lib/supabase";
import { ApiError } from "@/utils/api-error";

function normalizeLines(lines: BagLine[]) {
  const accumulator = new Map<string, number>();

  for (const line of lines) {
    const quantity = Math.max(0, Math.floor(line.quantity));

    if (!line.slug || quantity <= 0) {
      continue;
    }

    accumulator.set(line.slug, (accumulator.get(line.slug) ?? 0) + quantity);
  }

  return [...accumulator.entries()].map(([slug, quantity]) => ({
    slug,
    quantity,
  }));
}

function mapLine(row: Record<string, unknown>): BagLine {
  return {
    slug: String(row.product_slug),
    quantity: Number(row.quantity),
  };
}

export async function listBag(userId: string) {
  const { data, error } = await supabaseAdmin()
    .from("bag_items")
    .select("product_slug, quantity")
    .eq("user_id", userId);

  if (error) {
    throw new ApiError(500, "bag_fetch_failed", "Unable to load the bag.", error);
  }

  return (data ?? []).map(mapLine);
}

export async function replaceBag(userId: string, lines: BagLine[]) {
  const normalized = normalizeLines(lines);
  const client = supabaseAdmin();

  const { error: deleteError } = await client.from("bag_items").delete().eq("user_id", userId);

  if (deleteError) {
    throw new ApiError(500, "bag_sync_failed", "Unable to clear the bag.", deleteError);
  }

  if (!normalized.length) {
    return [];
  }

  const { data, error } = await client
    .from("bag_items")
    .insert(
      normalized.map((line) => ({
        user_id: userId,
        product_slug: line.slug,
        quantity: line.quantity,
      })),
    )
    .select("product_slug, quantity");

  if (error) {
    throw new ApiError(500, "bag_sync_failed", "Unable to sync the bag.", error);
  }

  return (data ?? []).map(mapLine);
}

export async function mergeBag(userId: string, incomingLines: BagLine[]) {
  const current = await listBag(userId);
  const merged = normalizeLines([...current, ...incomingLines]);
  return replaceBag(userId, merged);
}

export async function clearBag(userId: string) {
  const { error } = await supabaseAdmin().from("bag_items").delete().eq("user_id", userId);

  if (error) {
    throw new ApiError(500, "bag_clear_failed", "Unable to clear the bag.", error);
  }
}
