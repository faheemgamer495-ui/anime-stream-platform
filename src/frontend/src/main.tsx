import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ReactDOM from "react-dom/client";
import { Toaster } from "sonner";
import App from "./App";
import "./index.css";
import { migrateToPreviewStore, seedIfEmpty } from "./lib/localStorageDB";

// Ensure BigInt serializes as string in JSON (needed for storage compat)
BigInt.prototype.toJSON = function () {
  return this.toString();
};

declare global {
  interface BigInt {
    toJSON(): string;
  }
}

// Bootstrap localStorage BEFORE any React component mounts.
// Order: migrate old dual-store keys → seed cache ONLY if canister is also empty.
// The actual canister-empty check happens inside AppProvider on actor connect.
// Here we only migrate old data; seeding with samples is deferred until after
// the canister hydration in AppProvider (see the actorReady effect there).
migrateToPreviewStore();

// Seed the cache with sample data so there's something to display on first
// load BEFORE the canister responds.  AppProvider will call seedIfEmpty
// again with { canisterHasData: true } once it receives real data from the
// canister, which will prevent the sample data from ever being re-written.
seedIfEmpty();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      networkMode: "always",
      staleTime: 0,
      gcTime: 1000 * 60 * 60, // 1 hour — keeps cache as display layer
      retry: false,
    },
    mutations: {
      networkMode: "always",
      retry: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <App />
    <Toaster
      theme="dark"
      richColors
      position="bottom-right"
      toastOptions={{
        style: {
          background: "oklch(0.15 0 0)",
          border: "1px solid oklch(0.25 0.01 0)",
          color: "oklch(0.95 0 0)",
        },
      }}
    />
  </QueryClientProvider>,
);
