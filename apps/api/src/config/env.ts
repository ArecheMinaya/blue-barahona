import type { ApiEnv } from "@larimar/config";
import { getApiEnv } from "@larimar/config";

let cachedEnv: ApiEnv | null = null;

export function env() {
  if (!cachedEnv) {
    cachedEnv = getApiEnv(process.env);
  }

  return cachedEnv;
}
