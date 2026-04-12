import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { WatchlistEntry } from "../types";

// In-memory watchlist per session (userId → Set of animeIds)
const watchlistStore = new Map<string, Set<string>>();

function getOrCreate(userId: string): Set<string> {
  if (!watchlistStore.has(userId)) {
    watchlistStore.set(userId, new Set());
  }
  return watchlistStore.get(userId)!;
}

export function useWatchlist(userId: string | null) {
  return useQuery<WatchlistEntry[]>({
    queryKey: ["watchlist", userId],
    queryFn: async () => {
      if (!userId) return [];
      const ids = Array.from(getOrCreate(userId));
      return ids.map((animeId) => ({
        userId,
        animeId,
        addedAt: Date.now(),
      }));
    },
    enabled: !!userId,
  });
}

export function useIsInWatchlist(
  userId: string | null,
  animeId: string | undefined,
) {
  return useQuery<boolean>({
    queryKey: ["watchlist", "check", userId, animeId],
    queryFn: async () => {
      if (!userId || !animeId) return false;
      return getOrCreate(userId).has(animeId);
    },
    enabled: !!userId && !!animeId,
  });
}

export function useAddToWatchlist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      userId,
      animeId,
    }: { userId: string; animeId: string }) => {
      getOrCreate(userId).add(animeId);
      return { userId, animeId };
    },
    onSuccess: ({ userId, animeId }) => {
      queryClient.invalidateQueries({ queryKey: ["watchlist", userId] });
      queryClient.invalidateQueries({
        queryKey: ["watchlist", "check", userId, animeId],
      });
    },
  });
}

export function useRemoveFromWatchlist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      userId,
      animeId,
    }: { userId: string; animeId: string }) => {
      getOrCreate(userId).delete(animeId);
      return { userId, animeId };
    },
    onSuccess: ({ userId, animeId }) => {
      queryClient.invalidateQueries({ queryKey: ["watchlist", userId] });
      queryClient.invalidateQueries({
        queryKey: ["watchlist", "check", userId, animeId],
      });
    },
  });
}
