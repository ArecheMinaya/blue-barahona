import type { Profile } from "@larimar/types";
import type { User } from "@supabase/supabase-js";
import { supabaseAdmin } from "@/lib/supabase";
import { ApiError } from "@/utils/api-error";

function mapProfile(row: Record<string, unknown>): Profile {
  return {
    id: String(row.id),
    email: String(row.email),
    fullName: row.full_name ? String(row.full_name) : null,
    avatarUrl: row.avatar_url ? String(row.avatar_url) : null,
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  };
}

export async function ensureProfile(user: User) {
  const { data, error } = await supabaseAdmin()
    .from("profiles")
    .upsert(
      {
        id: user.id,
        email: user.email,
        full_name:
          user.user_metadata.full_name ?? user.user_metadata.name ?? null,
        avatar_url: user.user_metadata.avatar_url ?? null,
      },
      {
        onConflict: "id",
      },
    )
    .select("*")
    .single();

  if (error || !data) {
    throw new ApiError(500, "profile_sync_failed", "Unable to sync the profile.", error);
  }

  return mapProfile(data);
}
