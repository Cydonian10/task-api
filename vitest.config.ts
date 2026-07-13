import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    name: "node",
    globals: true,
    environment: "node",
    include: [
      "**/*.{test,spec}.{js,ts,jsx,tsx}",
      "tests/**/*.{test,spec}.{js,ts,jsx,tsx}",
    ],
    exclude: ["node_modules", "dist", "coverage"],
    testTimeout: 10000,
  },
  resolve: {
    alias: {
      "@/src": new URL("./src", import.meta.url).pathname,
    },
  },
});
