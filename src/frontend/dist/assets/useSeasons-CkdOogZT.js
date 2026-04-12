import { v as useActor, w as useQuery, x as useQueryClient, y as useMutation, h as ue, z as createActor } from "./index-DnVaqzJ1.js";
function extractError(error) {
  if (error instanceof Error) return error.message;
  return String(error);
}
function safeSeasonNumber(val) {
  let n;
  try {
    n = Number(BigInt(String(val)));
  } catch {
    n = Number(val);
  }
  return Number.isFinite(n) && n >= 1 ? n : 1;
}
function useSeasonsByAnime(animeId) {
  const { actor } = useActor(createActor);
  return useQuery({
    queryKey: ["seasons", animeId],
    queryFn: async () => {
      if (!animeId || !actor) return [];
      const result = await actor.getSeasonsByAnime(animeId);
      const sorted = [...result].sort(
        (a, b) => safeSeasonNumber(a.seasonNumber) - safeSeasonNumber(b.seasonNumber)
      );
      console.log(
        `[Seasons] API response for anime ${animeId}:`,
        sorted.map((s) => ({
          id: s.id,
          seasonNumber: safeSeasonNumber(s.seasonNumber),
          name: s.name
        }))
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
    enabled: !!animeId
  });
}
function useCreateSeason() {
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      if (!actor || isFetching)
        throw new Error("Backend is still loading — please wait and try again");
      const existingSeasons = queryClient.getQueryData(["seasons", data.animeId]) ?? [];
      let seasonNumber = data.seasonNumber;
      if (!seasonNumber || seasonNumber < 1) {
        seasonNumber = existingSeasons.length > 0 ? Math.max(
          ...existingSeasons.map((s) => safeSeasonNumber(s.seasonNumber))
        ) + 1 : 1;
      }
      if (seasonNumber < 1) seasonNumber = 1;
      console.log("[Seasons] Creating season with number:", seasonNumber, {
        animeId: data.animeId,
        name: data.name
      });
      return actor.createSeason("adminfaheem123", {
        animeId: data.animeId,
        seasonNumber: BigInt(seasonNumber),
        name: data.name
      });
    },
    onSuccess: (season) => {
      queryClient.invalidateQueries({ queryKey: ["seasons", season.animeId] });
    },
    onError: (error) => {
      ue.error(`Failed to create season: ${extractError(error)}`);
    }
  });
}
function useUpdateSeason() {
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      data
    }) => {
      if (!actor || isFetching)
        throw new Error("Backend is still loading — please wait and try again");
      const seasonNumber = Math.max(1, data.seasonNumber || 1);
      const result = await actor.updateSeason("adminfaheem123", id, {
        animeId: data.animeId,
        seasonNumber: BigInt(seasonNumber),
        name: data.name
      });
      if (!result)
        throw new Error("Season update failed — season may have been deleted");
      return result;
    },
    onSuccess: (season) => {
      queryClient.invalidateQueries({ queryKey: ["seasons", season.animeId] });
    },
    onError: (error) => {
      ue.error(`Failed to update season: ${extractError(error)}`);
    }
  });
}
function useDeleteSeason() {
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      animeId
    }) => {
      if (!actor || isFetching)
        throw new Error("Backend is still loading — please wait and try again");
      const success = await actor.deleteSeason("adminfaheem123", id);
      if (!success) throw new Error("Delete failed — season may not exist");
      return animeId;
    },
    onSuccess: (animeId) => {
      queryClient.invalidateQueries({ queryKey: ["seasons", animeId] });
      queryClient.invalidateQueries({ queryKey: ["episodes", animeId] });
    },
    onError: (error) => {
      ue.error(`Failed to delete season: ${extractError(error)}`);
    }
  });
}
export {
  useCreateSeason as a,
  useUpdateSeason as b,
  useDeleteSeason as c,
  safeSeasonNumber as s,
  useSeasonsByAnime as u
};
