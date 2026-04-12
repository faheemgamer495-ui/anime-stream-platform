import { fileURLToPath, URL } from "url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import environment from "vite-plugin-environment";

const ii_url =
  process.env.DFX_NETWORK === "local"
    ? `http://rdmx6-jaaaa-aaaaa-aaadq-cai.localhost:8081/`
    : `https://identity.internetcomputer.org/`;

process.env.II_URL = process.env.II_URL || ii_url;
process.env.STORAGE_GATEWAY_URL =
  process.env.STORAGE_GATEWAY_URL || "https://blob.caffeine.ai";

// The @caffeineai/core-infrastructure SDK reads process.env.CANISTER_ID_BACKEND
// to resolve the canister ID when env.json has "undefined" placeholders.
// The Caffeine build platform injects it as CANISTER_BACKEND_CANISTER_ID,
// so we alias it here at build time so the SDK finds the correct value.
if (process.env.CANISTER_BACKEND_CANISTER_ID && !process.env.CANISTER_ID_BACKEND) {
  process.env.CANISTER_ID_BACKEND = process.env.CANISTER_BACKEND_CANISTER_ID;
}

export default defineConfig({
  logLevel: "error",
  build: {
    emptyOutDir: true,
    sourcemap: false,
    minify: false,
  },
  css: {
    postcss: "./postcss.config.js",
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: "globalThis",
      },
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:4943",
        changeOrigin: true,
      },
    },
  },
  plugins: [
    environment("all", { prefix: "CANISTER_" }),
    environment("all", { prefix: "DFX_" }),
    environment(["II_URL"]),
    environment(["STORAGE_GATEWAY_URL"]),
    // Expose CANISTER_ID_BACKEND so the @caffeineai/core-infrastructure SDK
    // can resolve the canister ID at runtime (it reads process.env.CANISTER_ID_BACKEND).
    // Default to empty string so local builds don't fail — the real value is injected
    // by the Caffeine platform at deploy time via CANISTER_BACKEND_CANISTER_ID.
    environment({ CANISTER_ID_BACKEND: "" }),
    react(),
  ],
  resolve: {
    alias: [
      {
        find: "declarations",
        replacement: fileURLToPath(new URL("../declarations", import.meta.url)),
      },
      {
        find: "@",
        replacement: fileURLToPath(new URL("./src", import.meta.url)),
      },
    ],
    dedupe: ["@dfinity/agent"]
  },
});
