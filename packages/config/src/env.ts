import { z } from "zod";

function formatZodErrors(error: z.ZodError) {
  return error.issues
    .map((issue) => `${issue.path.join(".") || "env"}: ${issue.message}`)
    .join("; ");
}

function parseEnv<T extends z.ZodTypeAny>(schema: T, input: unknown) {
  const parsed = schema.safeParse(input);

  if (!parsed.success) {
    throw new Error(formatZodErrors(parsed.error));
  }

  return parsed.data;
}

export const webEnvSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().min(1),
});

export const apiEnvSchema = z.object({
  API_BASE_URL: z.string().url().default("http://localhost:4000"),
  API_PORT: z.coerce.number().default(4000),
  WEB_ORIGIN: z.string().url().default("http://localhost:3000"),
  SUPABASE_URL: z.string().url(),
  SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  STRIPE_SECRET_KEY: z.string().min(1),
  STRIPE_WEBHOOK_SECRET: z.string().min(1).optional(),
});

export type WebEnv = z.infer<typeof webEnvSchema>;
export type ApiEnv = z.infer<typeof apiEnvSchema>;

export function getWebEnv(input: unknown = process.env) {
  return parseEnv(webEnvSchema, input);
}

export function getApiEnv(input: unknown = process.env) {
  return parseEnv(apiEnvSchema, input);
}
