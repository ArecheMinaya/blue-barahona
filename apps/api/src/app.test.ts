import { beforeAll, describe, expect, it } from "vitest";
import { createApp } from "./app";

beforeAll(() => {
  process.env.API_BASE_URL = "http://localhost:4000";
  process.env.API_PORT = "4000";
  process.env.WEB_ORIGIN = "http://localhost:3000";
  process.env.SUPABASE_URL = "https://example.supabase.co";
  process.env.SUPABASE_ANON_KEY = "anon-key";
  process.env.SUPABASE_SERVICE_ROLE_KEY = "service-role-key";
  process.env.STRIPE_SECRET_KEY = "sk_test_example";
});

describe("api app", () => {
  it("registers the health endpoint", () => {
    const app = createApp() as unknown as {
      router: {
        stack: Array<{
          route?: {
            path: string;
          };
        }>;
      };
    };

    const routes = app.router.stack
      .map((layer) => layer.route?.path)
      .filter(Boolean);

    expect(routes).toContain("/health");
  });

  it("mounts the commerce route prefixes", () => {
    const app = createApp() as unknown as {
      router: {
        stack: Array<{
          name: string;
        }>;
      };
    };

    const routerLayers = app.router.stack.filter((layer) => layer.name === "router");

    expect(routerLayers.length).toBeGreaterThanOrEqual(5);
  });
});
