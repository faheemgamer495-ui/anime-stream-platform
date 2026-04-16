/**
 * useSeasons — canister-first via AppContext, localStorage cache fallback.
 *
 * SINGLE STORE: Both preview (admin) and live (public) read from the same
 * shared seasons_list / episodes_list keys. Admin changes are instant.
 *
 * All mutations go through AppContext which calls the canister FIRST. The
 * localStorage cache is updated only after a successful canister write.
 *
 * useLive* hooks are aliases to the shared hooks for backward compat.
 */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { SeasonInput } from "../backend";
import { useAppContext } from "../context/AppContext";
import type { SeasonPublic } from "../lib/localStorageDB";
import {
  findDuplicateSeason,
  generateId,
  getEpisodesBySeason,
  getSeasonsByAnime as lsGetSeasonsByAnime,
  nextSeasonNumber,
  removeEpisode,
  removeSeason,
  unlinkEpisodesFromSeason,
  upsertSeason,
} from "../lib/localStorageDB";
import type { Episode } from "../lib/localStorageDB";
import { clearCacheKey } from "./useAnime";

export interface SeasonFormData {
  animeId: string;
  seasonNumber: number;
  name: string;
}

function extractError(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

// Safe bigint -> number. Minimum return value is 1.
export function safeSeasonNumber(val: bigint | number | unknown): number {
  let n: number;
  try {
    n = Number(BigInt(String(val)));
  } catch {
    n = Number(val as number);
  }
  return Number.isFinite(n) && n >= 1 ? n : 1;
}

// ── Queries ────────────────────────────────────────────────────────────────────
// Read from the localStorage cache. AppContext keeps the cache hydrated from
// the canister, so these will reflect canister data after the actor connects.

export function useSeasonsByAnime(animeId: string | undefined) {
  const { seasons } = useAppContext();
  const contextSeasons = animeId ? (seasons[animeId] ?? []) : [];
  const localSnapshot = animeId ? lsGetSeasonsByAnime(animeId) : [];

  // Use context data if available (most up-to-date), otherwise localStorage
  const effectiveInitialData =
    contextSeasons.length > 0
      ? contextSeasons
      : localSnapshot.length > 0
        ? localSnapshot
        : undefined;

  return useQuery<SeasonPublic[]>({
    queryKey: ["seasons", animeId],
    queryFn: () => {
      if (!animeId) return [];
      // Always re-read from localStorage cache (AppContext keeps this fresh)
      return lsGetSeasonsByAnime(animeId);
    },
    initialData: effectiveInitialData,
    placeholderData: (prev) => prev,
    staleTime: 0,
    enabled: !!animeId,
  });
}

export function useEpisodesBySeason(seasonId: string | undefined) {
  return useQuery({
    queryKey: ["episodesBySeason", seasonId],
    queryFn: () => {
      if (!seasonId) return [];
      return getEpisodesBySeason(seasonId);
    },
    enabled: !!seasonId,
    staleTime: 0,
  });
}

// ── Live aliases (backward compat — point to shared store) ───────────────────

export const useLiveSeasonsByAnime = useSeasonsByAnime;

export function useLiveEpisodesBySeason(seasonId: string | undefined) {
  return useQuery<Episode[]>({
    queryKey: ["episodesBySeason", seasonId],
    queryFn: () => {
      if (!seasonId) return [];
      return getEpisodesBySeason(seasonId);
    },
    enabled: !!seasonId,
    staleTime: 0,
  });
}

// ── Mutations ─────────────────────────────────────────────────────────────────
// All mutations route through AppContext (canister-first). The hooks below are
// kept for components that import them directly. They delegate to AppContext.

export function useCreateSeason() {
  const queryClient = useQueryClient();
  const ctx = useAppContext();

  return useMutation({
    mutationFn: async (data: SeasonFormData): Promise<SeasonPublic> => {
      // Validate and assign season number
      let seasonNumber = data.seasonNumber;
      if (!seasonNumber || seasonNumber < 1) {
        seasonNumber = nextSeasonNumber(data.animeId);
      }
      seasonNumber = Math.max(1, seasonNumber);

      // Duplicate check against cache
      const duplicate = findDuplicateSeason(data.animeId, seasonNumber);
      if (duplicate) {
        throw new Error(
          `Season ${seasonNumber} already exists for this anime. Choose a different number.`,
        );
      }

      const input: SeasonInput = {
        animeId: data.animeId,
        seasonNumber: BigInt(seasonNumber),
        name: data.name.trim(),
      };

      // Route through AppContext — calls canister FIRST
      const created = await ctx.createSeason(input);

      // Update React Query cache immediately
      queryClient.setQueryData<SeasonPublic[]>(
        ["seasons", data.animeId],
        (old) => {
          const existing = old ?? lsGetSeasonsByAnime(data.animeId);
          return [...existing.filter((s) => s.id !== created.id), created].sort(
            (a, b) =>
              safeSeasonNumber(a.seasonNumber) -
              safeSeasonNumber(b.seasonNumber),
          );
        },
      );

      return created;
    },
    onSuccess: (season) => {
      queryClient.invalidateQueries({ queryKey: ["seasons", season.animeId] });
    },
    onError: (error: unknown) => {
      toast.error(`Failed to create season: ${extractError(error)}`);
    },
  });
}

export function useUpdateSeason() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: { id: string; data: SeasonFormData }): Promise<SeasonPublic> => {
      const seasonNumber = Math.max(1, data.seasonNumber || 1);

      const duplicate = findDuplicateSeason(data.animeId, seasonNumber, id);
      if (duplicate) {
        throw new Error(
          `Season ${seasonNumber} already exists. Choose a different number.`,
        );
      }

      const currentSeasons = lsGetSeasonsByAnime(data.animeId);
      const existing = currentSeasons.find((s) => s.id === id);

      // NOTE: updateSeason is not in the canister interface, so we update
      // the localStorage cache directly as a fallback.
      const updated: SeasonPublic = {
        ...(existing ?? {
          createdAt: BigInt(Date.now()) * BigInt(1_000_000),
        }),
        id,
        animeId: data.animeId,
        seasonNumber: BigInt(seasonNumber),
        name: data.name.trim(),
      };

      upsertSeason(updated);
      console.log("[useUpdateSeason] Season updated in cache:", {
        id,
        seasonNumber,
        name: updated.name,
      });

      return updated;
    },
    onSuccess: (season) => {
      queryClient.invalidateQueries({ queryKey: ["seasons", season.animeId] });
    },
    onError: (error: unknown) => {
      toast.error(`Failed to update season: ${extractError(error)}`);
    },
  });
}

export function useDeleteSeason() {
  const queryClient = useQueryClient();
  const ctx = useAppContext();

  return useMutation({
    mutationFn: async ({
      id,
      animeId,
    }: { id: string; animeId: string }): Promise<string> => {
      // Route through AppContext — calls canister FIRST
      await ctx.deleteSeason(id, animeId);

      // Also unlink episodes from the season in the cache
      unlinkEpisodesFromSeason(id);

      queryClient.setQueryData<SeasonPublic[]>(["seasons", animeId], (old) =>
        (old ?? []).filter((s) => s.id !== id),
      );

      console.log("[useDeleteSeason] Season removed via canister:", id);
      return animeId;
    },
    onSuccess: (animeId) => {
      clearCacheKey("episodes_cache");
      queryClient.invalidateQueries({ queryKey: ["seasons", animeId] });
      queryClient.invalidateQueries({ queryKey: ["episodes", animeId] });
    },
    onError: (error: unknown) => {
      toast.error(`Failed to delete season: ${extractError(error)}`);
    },
  });
}

// Re-export removeEpisode for other hooks that may need it
export { removeEpisode };
