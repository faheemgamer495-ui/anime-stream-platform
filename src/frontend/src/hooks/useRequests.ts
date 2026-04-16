/**
 * useRequests — canister-first via AppContext, localStorage cache fallback.
 *
 * Reads go through AppContext (which calls the canister).
 * Mutations route through AppContext — canister FIRST, cache updated on success.
 */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAppContext } from "../context/AppContext";
import { generateId, getRequests, saveRequests } from "../lib/localStorageDB";
import type { AnimeRequest } from "../types";

export function useAnimeRequests(_adminToken?: string) {
  const ctx = useAppContext();

  return useQuery<AnimeRequest[]>({
    queryKey: ["anime-requests"],
    queryFn: async () => {
      // Prefer canister data via context
      if (ctx.isCanisterAvailable) {
        await ctx.loadRequests().catch(console.error);
        return ctx.requests;
      }
      return getRequests();
    },
    staleTime: 0,
  });
}

export function useSubmitAnimeRequest() {
  const queryClient = useQueryClient();
  const ctx = useAppContext();

  return useMutation({
    mutationFn: async ({
      text,
      username,
    }: { text: string; username?: string }): Promise<AnimeRequest> => {
      const usernameStr = username ?? "Anonymous";

      // Try canister first
      if (ctx.isCanisterAvailable) {
        try {
          await ctx.submitRequest(text.trim(), usernameStr);
          queryClient.invalidateQueries({ queryKey: ["anime-requests"] });
          return {
            id: generateId(),
            requestText: text.trim(),
            username: usernameStr,
            status: "pending",
            createdAt: BigInt(Date.now()),
          };
        } catch (err) {
          console.error("[useSubmitAnimeRequest] canister failed:", err);
        }
      }

      // Fallback: write to localStorage cache
      const newRequest: AnimeRequest = {
        id: generateId(),
        requestText: text.trim(),
        username: usernameStr,
        status: "pending",
        createdAt: BigInt(Date.now()),
      };
      const all = getRequests();
      all.push(newRequest);
      saveRequests(all);
      console.log(
        "[useSubmitAnimeRequest] Request saved to cache:",
        newRequest.id,
      );
      return newRequest;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["anime-requests"] });
    },
  });
}

export function useMarkRequestComplete() {
  const queryClient = useQueryClient();
  const ctx = useAppContext();

  return useMutation({
    mutationFn: async ({
      id,
    }: { id: string; adminToken?: string }): Promise<boolean> => {
      // Try canister first
      if (ctx.isCanisterAvailable) {
        try {
          await ctx.completeRequest(id);
          return true;
        } catch (err) {
          console.error("[useMarkRequestComplete] canister failed:", err);
        }
      }

      // Fallback: update localStorage cache
      const all = getRequests();
      const idx = all.findIndex((r) => r.id === id);
      if (idx === -1) throw new Error("Request not found");
      all[idx] = { ...all[idx], status: "completed" };
      saveRequests(all);
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["anime-requests"] });
    },
  });
}

export function useDeleteRequest() {
  const queryClient = useQueryClient();
  const ctx = useAppContext();

  return useMutation({
    mutationFn: async ({
      id,
    }: { id: string; adminToken?: string }): Promise<boolean> => {
      // Try canister first
      if (ctx.isCanisterAvailable) {
        try {
          await ctx.deleteRequest(id);
          return true;
        } catch (err) {
          console.error("[useDeleteRequest] canister failed:", err);
        }
      }

      // Fallback: update localStorage cache
      const filtered = getRequests().filter((r) => r.id !== id);
      saveRequests(filtered);
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["anime-requests"] });
    },
  });
}

export function usePendingRequestsCount(_adminToken?: string) {
  const { requests } = useAppContext();
  return requests.filter((r) => r.status === "pending").length;
}
