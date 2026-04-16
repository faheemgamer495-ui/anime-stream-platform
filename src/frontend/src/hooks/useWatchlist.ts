/**
 * useWatchlist — canister-first via AppContext, localStorage cache fallback.
 *
 * Watchlist reads from the localStorage cache (kept in sync by AppContext).
 * Writes attempt the canister first; on failure they update the cache only.
 */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAppContext } from "../context/AppContext";
import { getWatchlist, saveWatchlist } from "../lib/localStorageDB";
import type { WatchlistEntry } from "../types";

export function useWatchlist(userId: string | null) {
  const { watchlist: ctxWatchlist } = useAppContext();

  return useQuery<WatchlistEntry[]>({
    queryKey: ["watchlist", userId],
    queryFn: () => {
      if (!userId) return [];
      // Context watchlist is canister-backed; map to WatchlistEntry format
      if (ctxWatchlist.length > 0) {
        return ctxWatchlist.map((animeId) => ({
          userId: userId,
          animeId,
          addedAt: Date.now(),
        }));
      }
      return getWatchlist().filter((e) => e.userId === userId);
    },
    enabled: !!userId,
    staleTime: 0,
  });
}

export function useIsInWatchlist(
  userId: string | null,
  animeId: string | undefined,
) {
  const { watchlist: ctxWatchlist } = useAppContext();

  return useQuery<boolean>({
    queryKey: ["watchlist", "check", userId, animeId],
    queryFn: () => {
      if (!userId || !animeId) return false;
      // Prefer context data (canister-backed)
      if (ctxWatchlist.length >= 0) {
        return ctxWatchlist.includes(animeId);
      }
      return getWatchlist().some(
        (e) => e.userId === userId && e.animeId === animeId,
      );
    },
    enabled: !!userId && !!animeId,
    staleTime: 0,
  });
}

export function useAddToWatchlist() {
  const queryClient = useQueryClient();
  const ctx = useAppContext();

  return useMutation({
    mutationFn: async ({
      userId,
      animeId,
    }: { userId: string; animeId: string }) => {
      // Route through AppContext (canister-first)
      await ctx.toggleWatchlist(animeId);
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
  const ctx = useAppContext();

  return useMutation({
    mutationFn: async ({
      userId,
      animeId,
    }: { userId: string; animeId: string }) => {
      // Route through AppContext (canister-first)
      await ctx.toggleWatchlist(animeId);
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
