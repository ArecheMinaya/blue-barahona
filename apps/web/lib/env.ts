import { getWebEnv } from "@larimar/config";

let cachedEnv: ReturnType<typeof getWebEnv> | null = null;

export function env() {
  if (!cachedEnv) {
    cachedEnv = getWebEnv(process.env);
  }

  return cachedEnv;
}
