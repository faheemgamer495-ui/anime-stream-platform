import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createActor } from "../backend";
import type { AnimeRequest } from "../backend.d";
import type { AnimeRequest as FrontendAnimeRequest } from "../types";

function toFrontendRequest(r: AnimeRequest): FrontendAnimeRequest {
  return {
    id: r.id,
    requestText: r.requestText,
    username: r.username,
    status: r.status,
    createdAt: r.createdAt,
  };
}

export function useAnimeRequests(adminToken: string) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<FrontendAnimeRequest[]>({
    queryKey: ["anime-requests", adminToken],
    queryFn: async () => {
      if (!actor) return [];
      try {
        const result = await actor.getAnimeRequests(adminToken);
        return result.map(toFrontendRequest);
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
    staleTime: 15000,
  });
}

export function useMarkRequestComplete() {
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      adminToken,
    }: { id: string; adminToken: string }) => {
      if (!actor || isFetching)
        throw new Error("Backend is still loading — please wait and try again");
      const success = await actor.markRequestComplete(id, adminToken);
      if (!success) throw new Error("Failed to mark request as complete");
      return success;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["anime-requests"] });
    },
  });
}

export function useDeleteRequest() {
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      adminToken,
    }: { id: string; adminToken: string }) => {
      if (!actor || isFetching)
        throw new Error("Backend is still loading — please wait and try again");
      const success = await actor.deleteAnimeRequest(id, adminToken);
      if (!success) throw new Error("Failed to delete request");
      return success;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["anime-requests"] });
    },
  });
}

export function usePendingRequestsCount(adminToken: string) {
  const { data: requests = [] } = useAnimeRequests(adminToken);
  return requests.filter((r) => r.status === "pending").length;
}
