import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: "catalog",
          root: "./packages/catalog",
          environment: "node",
          include: ["src/**/*.test.ts"],
        },
      },
      {
        resolve: {
          alias: {
            "@": fileURLToPath(new URL("./apps/api/src", import.meta.url)),
          },
        },
        test: {
          name: "api",
          root: "./apps/api",
          environment: "node",
          include: ["src/**/*.test.ts"],
        },
      },
      {
        resolve: {
          alias: {
            "@": fileURLToPath(new URL("./apps/web", import.meta.url)),
          },
        },
        test: {
          name: "web",
          root: "./apps/web",
          environment: "node",
          include: ["lib/**/*.test.ts"],
        },
      },
    ],
  },
});
