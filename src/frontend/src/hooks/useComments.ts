import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createActor } from "../backend";
import type { Comment as BackendComment } from "../backend.d";
import type { Comment, RatingsInfo } from "../types";

// Convert backend Comment (Principal-based authorId) to frontend Comment type
function mapComment(c: BackendComment): Comment {
  return {
    id: c.id,
    episodeId: c.episodeId,
    authorId:
      typeof c.authorId === "object" ? c.authorId.toText() : String(c.authorId),
    authorUsername: c.authorUsername,
    text: c.text,
    createdAt: Number(c.createdAt) / 1_000_000, // nanoseconds → milliseconds
    updatedAt:
      c.updatedAt !== undefined ? Number(c.updatedAt) / 1_000_000 : undefined,
    parentId: c.parentId ?? undefined,
    isDeleted: c.isDeleted,
  };
}

export function useCommentsByEpisode(episodeId: string | undefined) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Comment[]>({
    queryKey: ["comments", episodeId],
    queryFn: async () => {
      if (!episodeId || !actor) return [];
      const result = await actor.getCommentsByEpisode(episodeId);
      return result.map(mapComment);
    },
    enabled: !!episodeId && !!actor && !isFetching,
  });
}

export function useAddComment() {
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      episodeId,
      text,
      parentId,
    }: {
      episodeId: string;
      text: string;
      parentId?: string;
    }): Promise<Comment> => {
      if (!actor || isFetching)
        throw new Error("Backend is still loading — please wait a moment");
      const result = await actor.addComment(episodeId, text, parentId ?? null);
      return mapComment(result);
    },
    onSuccess: (_comment, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["comments", variables.episodeId],
      });
    },
  });
}

export function useEditComment() {
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      commentId,
      newText,
      episodeId: _episodeId,
    }: {
      commentId: string;
      newText: string;
      episodeId: string;
    }): Promise<Comment> => {
      if (!actor || isFetching)
        throw new Error("Backend is still loading — please wait a moment");
      void _episodeId;
      const result = await actor.editComment(commentId, newText);
      if (!result) throw new Error("Comment not found or unauthorized");
      return mapComment(result);
    },
    onSuccess: (_comment, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["comments", variables.episodeId],
      });
    },
  });
}

export function useDeleteComment() {
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      commentId,
      episodeId: _episodeId,
    }: {
      commentId: string;
      episodeId: string;
    }): Promise<boolean> => {
      if (!actor || isFetching)
        throw new Error("Backend is still loading — please wait a moment");
      void _episodeId;
      return actor.deleteComment(commentId);
    },
    onSuccess: (_result, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["comments", variables.episodeId],
      });
    },
  });
}

export function useRatingsInfo(episodeId: string | undefined) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<RatingsInfo>({
    queryKey: ["ratings", episodeId],
    queryFn: async (): Promise<RatingsInfo> => {
      if (!episodeId || !actor) return { average: 0, total: 0 };
      const result = await actor.getRatingsInfo(episodeId);
      return {
        average: result.average,
        total: Number(result.total),
        userRating:
          result.userRating !== undefined
            ? Number(result.userRating)
            : undefined,
      };
    },
    enabled: !!episodeId && !!actor && !isFetching,
  });
}

export function useAddRating() {
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      episodeId,
      stars,
    }: {
      episodeId: string;
      stars: number;
    }): Promise<string | null> => {
      if (!actor || isFetching)
        throw new Error("Backend is still loading — please wait a moment");
      return actor.addRating(episodeId, BigInt(stars));
    },
    onSuccess: (_result, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["ratings", variables.episodeId],
      });
    },
  });
}
