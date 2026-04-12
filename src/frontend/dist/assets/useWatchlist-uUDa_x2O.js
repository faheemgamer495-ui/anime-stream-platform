import { w as useQuery, x as useQueryClient, y as useMutation } from "./index-DnVaqzJ1.js";
const watchlistStore = /* @__PURE__ */ new Map();
function getOrCreate(userId) {
  if (!watchlistStore.has(userId)) {
    watchlistStore.set(userId, /* @__PURE__ */ new Set());
  }
  return watchlistStore.get(userId);
}
function useWatchlist(userId) {
  return useQuery({
    queryKey: ["watchlist", userId],
    queryFn: async () => {
      if (!userId) return [];
      const ids = Array.from(getOrCreate(userId));
      return ids.map((animeId) => ({
        userId,
        animeId,
        addedAt: Date.now()
      }));
    },
    enabled: !!userId
  });
}
function useIsInWatchlist(userId, animeId) {
  return useQuery({
    queryKey: ["watchlist", "check", userId, animeId],
    queryFn: async () => {
      if (!userId || !animeId) return false;
      return getOrCreate(userId).has(animeId);
    },
    enabled: !!userId && !!animeId
  });
}
function useAddToWatchlist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      userId,
      animeId
    }) => {
      getOrCreate(userId).add(animeId);
      return { userId, animeId };
    },
    onSuccess: ({ userId, animeId }) => {
      queryClient.invalidateQueries({ queryKey: ["watchlist", userId] });
      queryClient.invalidateQueries({
        queryKey: ["watchlist", "check", userId, animeId]
      });
    }
  });
}
function useRemoveFromWatchlist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      userId,
      animeId
    }) => {
      getOrCreate(userId).delete(animeId);
      return { userId, animeId };
    },
    onSuccess: ({ userId, animeId }) => {
      queryClient.invalidateQueries({ queryKey: ["watchlist", userId] });
      queryClient.invalidateQueries({
        queryKey: ["watchlist", "check", userId, animeId]
      });
    }
  });
}
export {
  useAddToWatchlist as a,
  useRemoveFromWatchlist as b,
  useIsInWatchlist as c,
  useWatchlist as u
};
