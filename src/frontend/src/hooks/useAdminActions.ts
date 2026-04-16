/**
 * useAdminActions — admin authentication + CRUD actions.
 *
 * Authentication:
 * - isAdminAuthenticated() — reads from localStorage "previewAuth" key.
 * - adminLogin(email, password) — validates against hardcoded credentials, stores previewAuth.
 * - adminLogout() — clears previewAuth from localStorage.
 * - useAdminAuth() — React hook wrapping the above with state.
 *
 * Admin CRUD:
 * - useAdminActions() — returns all admin CRUD actions from AppContext.
 *   All mutations call the canister FIRST (via AppContext). If the canister
 *   is not connected the action throws a clear error — there is no
 *   localStorage-only fallback for admin writes.
 *
 * Admin credentials (hardcoded):
 *   Email:    admin@anime.com  Password: admin123
 *   Legacy:   Faheem01         Password: adminfaheem123
 */

import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useAppContext } from "../context/AppContext";
import { isPreviewMode } from "../lib/modeContext";

// ── Credentials ───────────────────────────────────────────────────────────────

const VALID_CREDENTIALS = [
  { username: "admin@anime.com", password: "admin123" },
  { username: "Faheem01", password: "adminfaheem123" },
];

// ── Zustand store for persistent admin session ────────────────────────────────

interface AdminAuthState {
  isLoggedIn: boolean;
  adminUsername: string | null;
  setAdmin: (username: string) => void;
  clearAdmin: () => void;
}

const useAdminAuthStore = create<AdminAuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      adminUsername: null,
      setAdmin: (username: string) =>
        set({ isLoggedIn: true, adminUsername: username }),
      clearAdmin: () => set({ isLoggedIn: false, adminUsername: null }),
    }),
    {
      name: "previewAuth",
      partialize: (s) => ({
        isLoggedIn: s.isLoggedIn,
        adminUsername: s.adminUsername,
      }),
    },
  ),
);

// ── Pure helpers (non-hook, safe to call anywhere) ────────────────────────────

/**
 * Returns true if there is an active admin session in localStorage.
 * Does NOT check preview mode — use isAdminLoggedIn for that.
 */
export function isAdminAuthenticated(): boolean {
  try {
    const raw = localStorage.getItem("previewAuth");
    if (!raw) return false;
    const parsed = JSON.parse(raw) as { state?: { isLoggedIn?: boolean } };
    return parsed?.state?.isLoggedIn === true;
  } catch {
    return false;
  }
}

/**
 * Validates credentials and stores previewAuth session in localStorage.
 * Returns true on success, false on invalid credentials.
 */
export async function adminLogin(
  email: string,
  password: string,
): Promise<boolean> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return VALID_CREDENTIALS.some(
    (c) => c.username === email && c.password === password,
  );
}

/** Clears the admin session from localStorage. */
export function adminLogout(): void {
  localStorage.removeItem("previewAuth");
}

// ── useAdminAuth hook ─────────────────────────────────────────────────────────

/**
 * React hook for admin authentication.
 * - isAdminLoggedIn: true only when in preview mode AND session is stored.
 * - loginWithCredentials: validates and stores session.
 * - logout: clears session and React Query cache.
 */
export function useAdminAuth() {
  const {
    isLoggedIn: storedLoggedIn,
    adminUsername,
    setAdmin,
    clearAdmin,
  } = useAdminAuthStore();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Admin controls only active when in preview mode
  const isAdminLoggedIn = storedLoggedIn && isPreviewMode();

  const loginWithCredentials = useCallback(
    async (username: string, password: string): Promise<boolean> => {
      setError(null);
      setIsLoggingIn(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 400));
        const valid = VALID_CREDENTIALS.some(
          (c) => c.username === username && c.password === password,
        );
        if (valid) {
          setAdmin(username);
          return true;
        }
        setError("Invalid username or password. Please try again.");
        return false;
      } finally {
        setIsLoggingIn(false);
      }
    },
    [setAdmin],
  );

  const logout = useCallback(() => {
    clearAdmin();
    localStorage.removeItem("previewAuth");
    queryClient.clear();
  }, [clearAdmin, queryClient]);

  return {
    isAdminLoggedIn,
    adminUsername,
    loginWithCredentials,
    logout,
    isLoggingIn,
    error,
    clearError: () => setError(null),
  };
}

// ── useAdminActions hook ──────────────────────────────────────────────────────

/**
 * Returns all admin CRUD actions from AppContext.
 * All mutations call the canister FIRST. If the canister is not connected,
 * they throw a clear error — there is no silent localStorage-only fallback.
 *
 * After each successful canister write, the React Query cache is invalidated
 * to force a fresh re-fetch from the canister on next mount.
 */
export function useAdminActions() {
  const ctx = useAppContext();
  const queryClient = useQueryClient();

  /**
   * Wraps any admin mutation to also invalidate React Query caches after
   * a successful canister write.
   */
  const withCacheInvalidation = useCallback(
    <TArgs extends unknown[], TReturn>(
      fn: (...args: TArgs) => Promise<TReturn>,
      keys: string[][],
    ) =>
      async (...args: TArgs): Promise<TReturn> => {
        const result = await fn(...args);
        for (const key of keys) {
          queryClient.invalidateQueries({ queryKey: key });
        }
        return result;
      },
    [queryClient],
  );

  return {
    // Anime — invalidate all anime queries after write
    createAnime: withCacheInvalidation(ctx.createAnime, [["anime"]]),
    updateAnime: withCacheInvalidation(
      (id: string, input: Parameters<typeof ctx.updateAnime>[1]) =>
        ctx.updateAnime(id, input),
      [["anime"]],
    ),
    deleteAnime: withCacheInvalidation(
      (id: string) => ctx.deleteAnime(id),
      [["anime"]],
    ),

    // Seasons — invalidate seasons + episodes
    createSeason: withCacheInvalidation(ctx.createSeason, [
      ["seasons"],
      ["episodes"],
    ]),
    deleteSeason: withCacheInvalidation(
      (id: string, animeId: string) => ctx.deleteSeason(id, animeId),
      [["seasons"], ["episodes"]],
    ),

    // Episodes
    createEpisode: withCacheInvalidation(ctx.createEpisode, [["episodes"]]),
    updateEpisode: withCacheInvalidation(
      (id: string, input: Parameters<typeof ctx.updateEpisode>[1]) =>
        ctx.updateEpisode(id, input),
      [["episodes"]],
    ),
    deleteEpisode: withCacheInvalidation(
      (id: string, animeId: string) => ctx.deleteEpisode(id, animeId),
      [["episodes"]],
    ),

    // Requests
    loadRequests: ctx.loadRequests,
    completeRequest: ctx.completeRequest,
    deleteRequest: ctx.deleteRequest,

    // Data
    anime: ctx.anime,
    seasons: ctx.seasons,
    episodes: ctx.episodes,
    requests: ctx.requests,

    // Loading / error
    loading: ctx.loading,
    errors: ctx.errors,
    isCanisterAvailable: ctx.isCanisterAvailable,
  };
}
