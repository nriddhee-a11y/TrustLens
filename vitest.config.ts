import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  esbuild: { jsx: "automatic" },
  resolve: { alias: { "@": path.resolve(__dirname) } },
  test: { include: ["tests/**/*.test.{ts,tsx}"], environment: "node" },
});
