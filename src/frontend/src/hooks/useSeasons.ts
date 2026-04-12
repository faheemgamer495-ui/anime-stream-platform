import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createActor } from "../backend";
import type { Episode, SeasonPublic } from "../backend.d";

export interface SeasonFormData {
  animeId: string;
  seasonNumber: number;
  name: string;
}

function extractError(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

// Safe bigint -> number conversion that handles Motoko-encoded bigints correctly.
// Minimum return value is 1 — never returns 0.
export function safeSeasonNumber(val: bigint | number | unknown): number {
  let n: number;
  try {
    n = Number(BigInt(String(val)));
  } catch {
    n = Number(val as number);
  }
  return Number.isFinite(n) && n >= 1 ? n : 1;
}

export function useSeasonsByAnime(animeId: string | undefined) {
  const { actor } = useActor(createActor);
  return useQuery<SeasonPublic[]>({
    queryKey: ["seasons", animeId],
    queryFn: async () => {
      if (!animeId || !actor) return [];
      const result = await actor.getSeasonsByAnime(animeId);
      const sorted = [...result].sort(
        (a, b) =>
          safeSeasonNumber(a.seasonNumber) - safeSeasonNumber(b.seasonNumber),
      );
      console.log(
        `[Seasons] API response for anime ${animeId}:`,
        sorted.map((s) => ({
          id: s.id,
          seasonNumber: safeSeasonNumber(s.seasonNumber),
          name: s.name,
        })),
      );
      return sorted;
    },
    // Keep previous data while refetching so the dropdown never flashes empty
    placeholderData: (prev) => prev,
    // Always treat as stale so switching anime triggers a fresh fetch
    staleTime: 0,
    // Enable as soon as animeId is available — even if actor isn't ready yet.
    // The queryFn returns [] immediately when actor is null so no error occurs.
    // This ensures isLoading=true (not false) during the initial fetch, which
    // prevents the false "Create a season first" message.
    enabled: !!animeId,
  });
}

export function useEpisodesBySeason(seasonId: string | undefined) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Episode[]>({
    queryKey: ["episodesBySeason", seasonId],
    queryFn: async () => {
      if (!seasonId || !actor) return [];
      const result = await actor.getEpisodesBySeason(seasonId);
      return [...result].sort((a, b) =>
        a.episodeNumber < b.episodeNumber
          ? -1
          : a.episodeNumber > b.episodeNumber
            ? 1
            : 0,
      );
    },
    enabled: !!seasonId && !!actor && !isFetching,
  });
}

export function useCreateSeason() {
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: SeasonFormData): Promise<SeasonPublic> => {
      if (!actor || isFetching)
        throw new Error("Backend is still loading — please wait and try again");

      // Validate and compute season number — never send 0
      const existingSeasons: SeasonPublic[] =
        queryClient.getQueryData<SeasonPublic[]>(["seasons", data.animeId]) ??
        [];
      let seasonNumber = data.seasonNumber;
      if (!seasonNumber || seasonNumber < 1) {
        // Auto-assign: max existing + 1, or 1 if no seasons exist
        seasonNumber =
          existingSeasons.length > 0
            ? Math.max(
                ...existingSeasons.map((s) => safeSeasonNumber(s.seasonNumber)),
              ) + 1
            : 1;
      }
      // Final safety floor
      if (seasonNumber < 1) seasonNumber = 1;

      console.log("[Seasons] Creating season with number:", seasonNumber, {
        animeId: data.animeId,
        name: data.name,
      });

      return actor.createSeason("adminfaheem123", {
        animeId: data.animeId,
        seasonNumber: BigInt(seasonNumber),
        name: data.name,
      });
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
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: { id: string; data: SeasonFormData }): Promise<SeasonPublic> => {
      if (!actor || isFetching)
        throw new Error("Backend is still loading — please wait and try again");
      // Ensure season number is at least 1
      const seasonNumber = Math.max(1, data.seasonNumber || 1);
      const result = await actor.updateSeason("adminfaheem123", id, {
        animeId: data.animeId,
        seasonNumber: BigInt(seasonNumber),
        name: data.name,
      });
      if (!result)
        throw new Error("Season update failed — season may have been deleted");
      return result;
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
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      animeId,
    }: { id: string; animeId: string }): Promise<string> => {
      if (!actor || isFetching)
        throw new Error("Backend is still loading — please wait and try again");
      const success = await actor.deleteSeason("adminfaheem123", id);
      if (!success) throw new Error("Delete failed — season may not exist");
      return animeId;
    },
    onSuccess: (animeId) => {
      queryClient.invalidateQueries({ queryKey: ["seasons", animeId] });
      // Also invalidate episodes so they reflect unlinked seasonId
      queryClient.invalidateQueries({ queryKey: ["episodes", animeId] });
    },
    onError: (error: unknown) => {
      toast.error(`Failed to delete season: ${extractError(error)}`);
    },
  });
}
