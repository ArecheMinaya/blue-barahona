import { createClient } from "@supabase/supabase-js";
import { env } from "@/config/env";

let client: ReturnType<typeof createClient<any>> | null = null;

export function supabaseAdmin() {
  if (!client) {
    const values = env();
    client = createClient<any>(
      values.SUPABASE_URL,
      values.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      },
    );
  }

  return client;
}
