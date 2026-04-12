import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { createActor } from "../backend";
import type { AnimeInput, AnimePublic } from "../backend.d";
import type { Anime, AnimeFormData } from "../types";

// ── localStorage cache helpers ────────────────────────────────────────────────
// localStorage is a short-lived cache only — the backend canister is ALWAYS the
// source of truth. Never read from localStorage when the actor is available.

export function saveData(key: string, data: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // localStorage may be full or unavailable — fail silently
  }
}

export function loadData<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

// ── Cache version migration ────────────────────────────────────────────────────
// If the browser has stale preview-era data (pre-v2), clear it so the live site
// always fetches fresh data from the backend instead of serving cached preview data.
const CACHE_VERSION_KEY = "data_version";
const CACHE_VERSION = "v2";
const STALE_CACHE_KEYS = ["anime_cache", "episodes_cache"];

function clearStaleCacheOnce(): void {
  try {
    if (localStorage.getItem(CACHE_VERSION_KEY) !== CACHE_VERSION) {
      for (const key of STALE_CACHE_KEYS) {
        localStorage.removeItem(key);
      }
      localStorage.setItem(CACHE_VERSION_KEY, CACHE_VERSION);
    }
  } catch {
    // localStorage unavailable — ignore
  }
}

// Run once at module load time so it happens before any query reads the cache.
clearStaleCacheOnce();

// ── Retry helper ──────────────────────────────────────────────────────────────

async function withRetry<T>(
  fn: () => Promise<T>,
  retries = 1,
  delayMs = 2000,
): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    if (retries <= 0) throw err;
    await new Promise((res) => setTimeout(res, delayMs));
    return withRetry(fn, retries - 1, delayMs);
  }
}

// ── Type converters ───────────────────────────────────────────────────────────

/** Convert backend AnimePublic → frontend Anime */
function toAnime(pub: AnimePublic): Anime {
  return {
    id: pub.id,
    title: pub.title,
    description: pub.description,
    genre: pub.genres ?? [],
    rating: pub.rating,
    thumbnailUrl: pub.coverImageUrl,
    coverImageUrl: pub.coverImageUrl,
    isFeatured: pub.isFeatured,
    episodeCount: 0,
    viewCount: Number(pub.viewCount ?? 0),
    releaseYear:
      new Date(Number(pub.createdAt) / 1_000_000).getFullYear() ||
      new Date().getFullYear(),
    status: "ongoing",
    createdAt: Number(pub.createdAt ?? 0),
  };
}

/** Convert frontend AnimeFormData → backend AnimeInput */
function toAnimeInput(form: AnimeFormData): AnimeInput {
  return {
    title: form.title.trim(),
    description: form.description.trim(),
    genres: form.genre,
    rating: form.rating,
    coverImageUrl: form.coverImageUrl.trim() || form.thumbnailUrl.trim(),
    isFeatured: form.isFeatured,
  };
}

// ── Queries ───────────────────────────────────────────────────────────────────

export function useAllAnime() {
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();

  // When actor transitions from undefined → ready, invalidate so the query
  // re-runs immediately even if it previously returned [] or cached data.
  useEffect(() => {
    if (actor) {
      queryClient.invalidateQueries({ queryKey: ["anime", "all"] });
    }
  }, [actor, queryClient]);

  return useQuery<Anime[]>({
    queryKey: ["anime", "all"],
    queryFn: async () => {
      if (!actor) {
        // Actor not yet initialized — throw so React Query retries via retry config
        throw new Error("Actor not ready");
      }
      try {
        // withRetry: try once more after 2s before propagating error
        const result = await withRetry(() => actor.getAllAnime(), 1, 2000);
        const list = result.map(toAnime);
        // Backend is source of truth — update localStorage as offline backup only
        saveData("anime_cache", list);
        return list;
      } catch (err) {
        // Backend unreachable after retry — propagate so React Query retries
        console.error("[useAllAnime] Backend fetch failed (after retry):", err);
        throw new Error("Unable to load anime — please refresh the page");
      }
    },
    // No initialData — do NOT pre-populate from localStorage cache; stale preview
    // data in localStorage was masking real backend data on the live site.
    enabled: !isFetching,
    staleTime: 0, // Always fetch fresh data on mount
    retry: 3,
    retryDelay: 2000,
  });
}

export function useFeaturedAnime() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Anime | null>({
    queryKey: ["anime", "featured"],
    queryFn: async () => {
      if (!actor) {
        const cached = loadData<Anime[]>("anime_cache") ?? [];
        return cached.find((a) => a.isFeatured) ?? cached[0] ?? null;
      }
      try {
        const result = await withRetry(() => actor.getFeaturedAnime(), 1, 2000);
        if (result.length > 0) return toAnime(result[0]);
        // Backend returned empty — check cache
        const cached = loadData<Anime[]>("anime_cache") ?? [];
        return cached.find((a) => a.isFeatured) ?? cached[0] ?? null;
      } catch (err) {
        console.error("[useFeaturedAnime] Backend fetch failed:", err);
        const cached = loadData<Anime[]>("anime_cache") ?? [];
        return cached.find((a) => a.isFeatured) ?? cached[0] ?? null;
      }
    },
    enabled: !isFetching,
    staleTime: 0, // Always fetch fresh data on load
  });
}

export function useAnimeDetail(id: string | undefined) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Anime | null>({
    queryKey: ["anime", id],
    queryFn: async () => {
      if (!id) return null;
      if (!actor) {
        // No initialData fallback — throw so retry mechanism kicks in
        throw new Error("Actor not ready");
      }
      try {
        const result = await actor.getAnime(id);
        if (result) return toAnime(result);
        return null;
      } catch (err) {
        console.error("[useAnimeDetail] Backend fetch failed:", err);
        throw err;
      }
    },
    enabled: !!id && !isFetching,
    retry: 3,
    retryDelay: 2000,
  });
}

export function useSearchAnime(query: string) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Anime[]>({
    queryKey: ["anime", "search", query],
    queryFn: async () => {
      if (!query.trim()) return [];
      if (!actor) {
        const cached = loadData<Anime[]>("anime_cache") ?? [];
        const q = query.toLowerCase();
        return cached.filter(
          (a) =>
            a.title.toLowerCase().includes(q) ||
            a.description.toLowerCase().includes(q) ||
            a.genre.some((g) => g.toLowerCase().includes(q)),
        );
      }
      try {
        const result = await actor.searchAnime(query);
        return result.map(toAnime);
      } catch (err) {
        console.error("[useSearchAnime] Backend fetch failed:", err);
        const cached = loadData<Anime[]>("anime_cache") ?? [];
        const q = query.toLowerCase();
        return cached.filter(
          (a) =>
            a.title.toLowerCase().includes(q) ||
            a.description.toLowerCase().includes(q) ||
            a.genre.some((g) => g.toLowerCase().includes(q)),
        );
      }
    },
    enabled: query.length > 1 && !isFetching,
  });
}

export function useAnimeByGenre(genre: string | null) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Anime[]>({
    queryKey: ["anime", "genre", genre],
    queryFn: async () => {
      if (!genre) {
        if (!actor) return loadData<Anime[]>("anime_cache") ?? [];
        try {
          const result = await actor.getAllAnime();
          return result.map(toAnime);
        } catch {
          return loadData<Anime[]>("anime_cache") ?? [];
        }
      }
      if (!actor) {
        const cached = loadData<Anime[]>("anime_cache") ?? [];
        return cached.filter((a) => a.genre.includes(genre));
      }
      try {
        const result = await actor.filterAnimeByGenre(genre);
        return result.map(toAnime);
      } catch (err) {
        console.error("[useAnimeByGenre] Backend fetch failed:", err);
        const cached = loadData<Anime[]>("anime_cache") ?? [];
        return cached.filter((a) => a.genre.includes(genre));
      }
    },
    enabled: !isFetching,
  });
}

// Derived queries (client-side sort from all-anime cache)
export function useTrendingAnime() {
  const { data: all = [] } = useAllAnime();
  return useQuery<Anime[]>({
    queryKey: ["anime", "trending"],
    queryFn: async () =>
      [...all].sort((a, b) => b.viewCount - a.viewCount).slice(0, 8),
    enabled: all.length > 0,
    staleTime: 0, // Always reflect latest all-anime data
  });
}

export function useLatestAnime() {
  const { data: all = [] } = useAllAnime();
  return useQuery<Anime[]>({
    queryKey: ["anime", "latest"],
    queryFn: async () =>
      [...all].sort((a, b) => b.createdAt - a.createdAt).slice(0, 8),
    enabled: all.length > 0,
    staleTime: 0, // Always reflect latest all-anime data
  });
}

export function usePopularAnime() {
  const { data: all = [] } = useAllAnime();
  return useQuery<Anime[]>({
    queryKey: ["anime", "popular"],
    queryFn: async () =>
      [...all].sort((a, b) => b.rating - a.rating).slice(0, 8),
    enabled: all.length > 0,
    staleTime: 0, // Always reflect latest all-anime data
  });
}

// ── Mutations ─────────────────────────────────────────────────────────────────

export function useCreateAnime() {
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: AnimeFormData): Promise<Anime> => {
      if (!actor || isFetching)
        throw new Error("Backend is still loading — please wait and try again");
      const input = toAnimeInput(data);
      const result = await actor.createAnime(input);
      const created = toAnime(result);
      // Update localStorage cache immediately
      const current = loadData<Anime[]>("anime_cache") ?? [];
      saveData("anime_cache", [created, ...current]);
      return created;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["anime"] });
      // Force immediate re-fetch so live page reflects new anime without waiting
      queryClient.refetchQueries({ queryKey: ["anime"] });
    },
  });
}

export function useUpdateAnime() {
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: { id: string; data: Partial<AnimeFormData> }): Promise<Anime> => {
      if (!actor || isFetching)
        throw new Error("Backend is still loading — please wait and try again");
      // Fetch current to merge partial updates
      const current = await actor.getAnime(id);
      if (!current) throw new Error("Anime not found");
      const merged: AnimeFormData = {
        title: data.title ?? current.title,
        description: data.description ?? current.description,
        genre: data.genre ?? current.genres ?? [],
        rating: data.rating ?? current.rating,
        thumbnailUrl: data.thumbnailUrl ?? current.coverImageUrl,
        coverImageUrl: data.coverImageUrl ?? current.coverImageUrl,
        isFeatured: data.isFeatured ?? current.isFeatured,
        releaseYear: data.releaseYear ?? new Date().getFullYear(),
        status: data.status ?? "ongoing",
      };
      const result = await actor.updateAnime(id, toAnimeInput(merged));
      if (!result) throw new Error("Update failed — anime may not exist");
      const updated = toAnime(result);
      // Update localStorage cache immediately
      const cached = loadData<Anime[]>("anime_cache") ?? [];
      const newCache = cached.map((a) => (a.id === id ? updated : a));
      saveData("anime_cache", newCache);
      return updated;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["anime"] });
      // Force immediate re-fetch so live page reflects updated anime
      queryClient.refetchQueries({ queryKey: ["anime"] });
    },
  });
}

export function useDeleteAnime() {
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      if (!actor || isFetching)
        throw new Error("Backend is still loading — please wait and try again");
      const success = await actor.deleteAnime(id);
      if (!success) throw new Error("Delete failed — anime may not exist");
      // Update localStorage cache immediately
      const cached = loadData<Anime[]>("anime_cache") ?? [];
      saveData(
        "anime_cache",
        cached.filter((a) => a.id !== id),
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["anime"] });
      // Force immediate re-fetch so live page reflects deletion
      queryClient.refetchQueries({ queryKey: ["anime"] });
    },
  });
}
