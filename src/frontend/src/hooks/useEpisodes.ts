/**
 * useEpisodes — canister-first via AppContext, localStorage cache fallback.
 *
 * All mutations route through AppContext which calls the canister FIRST.
 * The localStorage cache is updated only after a successful canister write.
 */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import type { EpisodeInput } from "../backend";
import { useAppContext } from "../context/AppContext";
import type { Episode } from "../lib/localStorageDB";
import {
  generateId,
  getEpisodesList,
  getEpisodesByAnime as lsGetEpisodesByAnime,
  removeEpisode,
  upsertEpisode,
} from "../lib/localStorageDB";
import { clearCacheKey } from "./useAnime";

// Form data uses number/string for UI convenience
export interface EpisodeFormData {
  animeId: string;
  episodeNumber: number;
  title: string;
  description: string;
  videoUrl: string;
  duration: string;
  thumbnailUrl: string;
  seasonId?: string;
}

export function extractEpisodeError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

// ── Upload stub — no-op, just accepts a URL ────────────────────────────────

export interface UploadProgress {
  status: "idle" | "uploading" | "done" | "error";
  percentage: number;
  error?: string;
}

export function useUploadVideo() {
  const [progress, setProgress] = useState<UploadProgress>({
    status: "idle",
    percentage: 0,
  });

  // In localStorage-only mode, just return the URL as-is (no upload needed)
  const upload = async (file: File): Promise<string> => {
    setProgress({ status: "uploading", percentage: 50 });
    // Return an object URL that works in-browser for local testing
    const url = URL.createObjectURL(file);
    setProgress({ status: "done", percentage: 100 });
    return url;
  };

  const reset = () => setProgress({ status: "idle", percentage: 0 });

  return { upload, progress, reset };
}

// ── Queries ────────────────────────────────────────────────────────────────────
// Read from the localStorage cache that AppContext keeps in sync with the canister.

export function useEpisodesByAnime(animeId: string | undefined) {
  const { episodes: ctxEpisodes } = useAppContext();
  const contextEpisodes = animeId ? (ctxEpisodes[animeId] ?? []) : [];
  const localSnapshot = animeId ? lsGetEpisodesByAnime(animeId) : [];

  const effectiveInitialData =
    contextEpisodes.length > 0
      ? contextEpisodes
      : localSnapshot.length > 0
        ? localSnapshot
        : undefined;

  return useQuery<Episode[]>({
    queryKey: ["episodes", animeId],
    queryFn: () => {
      if (!animeId) return [];
      return lsGetEpisodesByAnime(animeId);
    },
    initialData: effectiveInitialData,
    enabled: !!animeId,
    staleTime: 0,
  });
}

export function useEpisode(
  animeId: string | undefined,
  episodeId: string | undefined,
) {
  return useQuery<Episode | null>({
    queryKey: ["episode", animeId, episodeId],
    queryFn: () => {
      if (!episodeId) return null;
      return getEpisodesList().find((e) => e.id === episodeId) ?? null;
    },
    enabled: !!animeId && !!episodeId,
    staleTime: 0,
  });
}

// ── Mutations ─────────────────────────────────────────────────────────────────
// All mutations route through AppContext (canister-first).

export function useCreateEpisode() {
  const queryClient = useQueryClient();
  const ctx = useAppContext();

  return useMutation({
    mutationFn: async (data: EpisodeFormData): Promise<Episode> => {
      const input: EpisodeInput = {
        animeId: data.animeId,
        episodeNumber: BigInt(Math.max(1, Math.floor(data.episodeNumber))),
        title: data.title.trim(),
        description: data.description.trim(),
        videoUrl: data.videoUrl.trim(),
        duration: data.duration.trim() || undefined,
        thumbnailUrl: data.thumbnailUrl.trim() || undefined,
        seasonId: data.seasonId || undefined,
      };

      // Route through AppContext — calls canister FIRST
      const created = await ctx.createEpisode(input);

      console.log("[useCreateEpisode] Episode created via canister:", {
        id: created.id,
        episodeNumber: Number(created.episodeNumber),
        title: created.title,
      });

      // Update React Query cache immediately
      queryClient.setQueryData<Episode[]>(["episodes", data.animeId], (old) => {
        const existing = old ?? lsGetEpisodesByAnime(data.animeId);
        return [...existing.filter((e) => e.id !== created.id), created].sort(
          (a, b) => Number(a.episodeNumber) - Number(b.episodeNumber),
        );
      });

      return created;
    },
    onSuccess: (ep) => {
      clearCacheKey("episodes_cache");
      queryClient.invalidateQueries({ queryKey: ["episodes", ep.animeId] });
      queryClient.invalidateQueries({ queryKey: ["episodes"] });
    },
    onError: (error: unknown) => {
      toast.error(`Failed to create episode: ${extractEpisodeError(error)}`);
    },
  });
}

export function useUpdateEpisode() {
  const queryClient = useQueryClient();
  const ctx = useAppContext();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: { id: string; data: Partial<EpisodeFormData> }): Promise<Episode> => {
      const current = getEpisodesList().find((e) => e.id === id);
      if (!current) throw new Error("Episode not found");

      const input: EpisodeInput = {
        animeId: data.animeId ?? current.animeId,
        episodeNumber:
          data.episodeNumber !== undefined
            ? BigInt(Math.max(1, Math.floor(data.episodeNumber)))
            : current.episodeNumber,
        title: data.title?.trim() ?? current.title,
        description: data.description?.trim() ?? current.description,
        videoUrl: data.videoUrl?.trim() ?? current.videoUrl,
        duration: data.duration?.trim() ?? current.duration ?? undefined,
        thumbnailUrl:
          data.thumbnailUrl?.trim() ?? current.thumbnailUrl ?? undefined,
        seasonId:
          data.seasonId !== undefined
            ? data.seasonId || undefined
            : (current.seasonId ?? undefined),
      };

      // Route through AppContext — calls canister FIRST
      const updated = await ctx.updateEpisode(id, input);
      console.log("[useUpdateEpisode] Episode updated via canister:", id);
      return updated;
    },
    onSuccess: (ep) => {
      clearCacheKey("episodes_cache");
      queryClient.invalidateQueries({ queryKey: ["episodes", ep.animeId] });
      queryClient.invalidateQueries({
        queryKey: ["episode", ep.animeId, ep.id],
      });
    },
    onError: (error: unknown) => {
      toast.error(`Failed to update episode: ${extractEpisodeError(error)}`);
    },
  });
}

export function useDeleteEpisode() {
  const queryClient = useQueryClient();
  const ctx = useAppContext();

  return useMutation({
    mutationFn: async (id: string): Promise<string> => {
      const localEp = getEpisodesList().find((e) => e.id === id);
      const animeId = localEp?.animeId ?? "";

      // Route through AppContext — calls canister FIRST
      await ctx.deleteEpisode(id, animeId);

      if (animeId) {
        queryClient.setQueryData<Episode[]>(["episodes", animeId], (old) =>
          (old ?? []).filter((e) => e.id !== id),
        );
      }

      console.log("[useDeleteEpisode] Episode deleted via canister:", id);
      return animeId;
    },
    onSuccess: (animeId) => {
      clearCacheKey("episodes_cache");
      queryClient.invalidateQueries({ queryKey: ["episodes", animeId] });
      queryClient.invalidateQueries({ queryKey: ["episodes"] });
    },
    onError: (error: unknown) => {
      const msg = extractEpisodeError(error);
      toast.error(`Failed to delete episode: ${msg}`);
    },
  });
}
