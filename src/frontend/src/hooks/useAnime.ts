/**
 * useAnime — hooks for anime/season/episode/watchlist data.
 *
 * Two layers:
 * 1. Context-backed (canister-first, localStorage fallback) — hooks with "Ctx" suffix.
 * 2. localStorage / React Query — all existing exports kept for backward compatibility.
 *    These still serve as the source of initial data while the canister is loading;
 *    staleTime: 0 ensures React Query always refetches from localStorage on mount,
 *    and AppContext's actorReady effect triggers a full canister-backed refresh.
 *
 * New hooks: useAnimeCtx, useAnimeDetailCtx, useEpisodeDataCtx, useWatchlistCtx.
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import type { AnimePublic, Comment, Episode, SeasonPublic } from "../backend";
import { useAppContext } from "../context/AppContext";
import {
  generateId,
  getAnimeList,
  removeAnime,
  saveAnimeList,
  upsertAnime,
} from "../lib/localStorageDB";
import type { Anime, AnimeFormData, RatingsInfo } from "../types";

// ── Canister-backed hooks ─────────────────────────────────────────────────────

/** Returns the full anime list from AppContext (canister-first, localStorage fallback). */
export function useAnimeCtx() {
  const { anime, loading, errors, refreshAnime } = useAppContext();
  return {
    data: anime,
    isLoading: loading["anime.list"] ?? false,
    error: errors["anime.list"] ?? null,
    refetch: refreshAnime,
  };
}

/** Returns a single anime + its seasons and episodes, loaded on mount. */
export function useAnimeDetailCtx(animeId: string | undefined) {
  const { anime, seasons, episodes, loading, loadAnimeDetail } =
    useAppContext();

  useEffect(() => {
    if (animeId) loadAnimeDetail(animeId).catch(console.error);
  }, [animeId, loadAnimeDetail]);

  const item: AnimePublic | null = animeId
    ? (anime.find((a) => a.id === animeId) ?? null)
    : null;

  return {
    anime: item,
    seasons: (animeId ? seasons[animeId] : undefined) ?? ([] as SeasonPublic[]),
    episodes: (animeId ? episodes[animeId] : undefined) ?? ([] as Episode[]),
    isLoading: loading[`detail.${animeId}`] ?? false,
  };
}

/** Loads and returns comments + ratings for one episode from AppContext. */
export function useEpisodeDataCtx(episodeId: string | undefined) {
  const { comments, ratings, loading, loadEpisodeData } = useAppContext();

  useEffect(() => {
    if (episodeId) loadEpisodeData(episodeId).catch(console.error);
  }, [episodeId, loadEpisodeData]);

  return {
    comments:
      (episodeId ? comments[episodeId] : undefined) ?? ([] as Comment[]),
    ratings:
      (episodeId ? ratings[episodeId] : undefined) ??
      ({
        average: 0,
        total: 0,
        userRating: undefined,
      } as RatingsInfo),
    isLoading: loading[`episode.${episodeId}`] ?? false,
  };
}

/** Returns watchlist anime ids and toggle action from AppContext. */
export function useWatchlistCtx() {
  const { watchlist, anime, toggleWatchlist } = useAppContext();
  const watchlistIds = new Set(watchlist);
  const watchlistAnime = anime.filter((a) => watchlistIds.has(a.id));
  return { watchlistIds, watchlistAnime, toggleWatchlist };
}

// ── Legacy cache helpers (kept for external consumers) ────────────────────────

export function saveData<T>(key: string, data: T): void {
  if (key === "anime_cache" && Array.isArray(data)) {
    saveAnimeList(data as unknown as Anime[]);
    return;
  }
  try {
    localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
  } catch {
    // ignore
  }
}

export function loadData<T>(key: string): T | null {
  if (key === "anime_cache") {
    const list = getAnimeList();
    return (list.length > 0 ? list : null) as unknown as T | null;
  }
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Record<string, unknown> | T;
    if (
      parsed &&
      typeof parsed === "object" &&
      "timestamp" in parsed &&
      "data" in parsed
    ) {
      return (parsed as { data: T }).data;
    }
    return parsed as T;
  } catch {
    return null;
  }
}

export function clearCacheKey(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    // ignore
  }
}

// ── localStorage-backed queries (backward compat) ─────────────────────────────
// These read from the localStorage cache that AppContext keeps in sync with the
// canister. staleTime: 0 ensures they always re-read on mount, and AppContext's
// canister hydration causes cache writes that trigger React Query invalidations.

export function useAllAnime() {
  const localSnapshot = getAnimeList();
  return useQuery<Anime[]>({
    queryKey: ["anime", "all"],
    queryFn: () => getAnimeList(),
    initialData: localSnapshot.length > 0 ? localSnapshot : undefined,
    staleTime: 0,
  });
}

export function useFeaturedAnime() {
  return useQuery<Anime | null>({
    queryKey: ["anime", "featured"],
    queryFn: () => {
      const list = getAnimeList();
      return list.find((a) => a.isFeatured) ?? list[0] ?? null;
    },
    staleTime: 0,
  });
}

export function useAnimeDetail(id: string | undefined) {
  return useQuery<Anime | null>({
    queryKey: ["anime", id],
    queryFn: () => {
      if (!id) return null;
      return getAnimeList().find((a) => a.id === id) ?? null;
    },
    enabled: !!id,
    staleTime: 0,
  });
}

export function useSearchAnime(query: string) {
  return useQuery<Anime[]>({
    queryKey: ["anime", "search", query],
    queryFn: () => {
      if (!query.trim()) return [];
      const q = query.toLowerCase();
      return getAnimeList().filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q) ||
          a.genre.some((g) => g.toLowerCase().includes(q)),
      );
    },
    enabled: query.length > 1,
  });
}

export function useAnimeByGenre(genre: string | null) {
  return useQuery<Anime[]>({
    queryKey: ["anime", "genre", genre],
    queryFn: () => {
      const list = getAnimeList();
      if (!genre) return list;
      return list.filter((a) => a.genre.includes(genre));
    },
    staleTime: 0,
  });
}

export function useTrendingAnime() {
  const { data: all = [] } = useAllAnime();
  return useQuery<Anime[]>({
    queryKey: ["anime", "trending"],
    queryFn: () =>
      [...all].sort((a, b) => b.viewCount - a.viewCount).slice(0, 8),
    enabled: all.length > 0,
    staleTime: 0,
  });
}

export function useLatestAnime() {
  const { data: all = [] } = useAllAnime();
  return useQuery<Anime[]>({
    queryKey: ["anime", "latest"],
    queryFn: () =>
      [...all].sort((a, b) => b.createdAt - a.createdAt).slice(0, 8),
    enabled: all.length > 0,
    staleTime: 0,
  });
}

export function usePopularAnime() {
  const { data: all = [] } = useAllAnime();
  return useQuery<Anime[]>({
    queryKey: ["anime", "popular"],
    queryFn: () => [...all].sort((a, b) => b.rating - a.rating).slice(0, 8),
    enabled: all.length > 0,
    staleTime: 0,
  });
}

// ── Live aliases (backward compat) ────────────────────────────────────────────

export const useLiveAllAnime = useAllAnime;
export const useLiveFeaturedAnime = useFeaturedAnime;
export const useLiveAnimeDetail = useAnimeDetail;
export const useLiveSearchAnime = useSearchAnime;
export const useLiveAnimeByGenre = useAnimeByGenre;
export const useLiveTrendingAnime = useTrendingAnime;
export const useLiveLatestAnime = useLatestAnime;
export const useLivePopularAnime = usePopularAnime;

// ── Mutations (localStorage cache layer — backward compat) ────────────────────
// NOTE: These mutations write to the localStorage cache only. They are kept
// for backward compatibility with any page that uses them directly.
// Pages that touch admin CRUD should use useAdminActions() instead, which
// routes writes through the canister.

export function useCreateAnime() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: AnimeFormData): Promise<Anime> => {
      const newAnime: Anime = {
        id: generateId(),
        title: data.title.trim(),
        description: data.description.trim(),
        genre: data.genre,
        rating: data.rating,
        thumbnailUrl: data.thumbnailUrl.trim() || data.coverImageUrl.trim(),
        coverImageUrl: data.coverImageUrl.trim() || data.thumbnailUrl.trim(),
        isFeatured: data.isFeatured,
        episodeCount: 0,
        viewCount: 0,
        releaseYear: data.releaseYear,
        status: data.status,
        createdAt: Date.now(),
      };
      upsertAnime(newAnime);
      return newAnime;
    },
    onSuccess: (created) => {
      queryClient.invalidateQueries({ queryKey: ["anime"] });
      queryClient.setQueryData<Anime[]>(["anime", "all"], (old) => {
        const existing = old ?? getAnimeList();
        if (existing.find((a) => a.id === created.id)) return existing;
        return [...existing, created];
      });
    },
  });
}

export function useUpdateAnime() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: { id: string; data: Partial<AnimeFormData> }): Promise<Anime> => {
      const current = getAnimeList().find((a) => a.id === id);
      if (!current) throw new Error("Anime not found");
      const updated: Anime = {
        ...current,
        title: data.title?.trim() ?? current.title,
        description: data.description?.trim() ?? current.description,
        genre: data.genre ?? current.genre,
        rating: data.rating ?? current.rating,
        thumbnailUrl: data.thumbnailUrl?.trim() ?? current.thumbnailUrl,
        coverImageUrl: data.coverImageUrl?.trim() ?? current.coverImageUrl,
        isFeatured: data.isFeatured ?? current.isFeatured,
        releaseYear: data.releaseYear ?? current.releaseYear,
        status: data.status ?? current.status,
      };
      upsertAnime(updated);
      return updated;
    },
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["anime"] });
      queryClient.invalidateQueries({ queryKey: ["anime", updated.id] });
    },
  });
}

export function useDeleteAnime() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      removeAnime(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["anime"] });
    },
  });
}
