/// <reference types="vitest" />

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    port: 3000,
    host: "0.0.0.0"
  },
  preview: {
    port: 3001,
    host: "0.0.0.0",
  },
  test: {
    include: ["tests/**/*.{test,spec}.?(c|m)[jt]s?(x)"],
  },
});
