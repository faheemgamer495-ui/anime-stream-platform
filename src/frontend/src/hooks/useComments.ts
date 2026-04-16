/**
 * useComments — canister-first via AppContext, localStorage cache fallback.
 *
 * Comments and ratings are attempted via the canister. On failure, the
 * localStorage cache is used as a fallback so the UI remains functional.
 */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAppContext } from "../context/AppContext";
import {
  generateId,
  getComments,
  getRatings,
  saveComments,
  saveRatings,
} from "../lib/localStorageDB";
import type { Comment, RatingsInfo } from "../types";

// ── Session user ID ───────────────────────────────────────────────────────────

const SESSION_USER_KEY = "anime_stream_session_user";

function getSessionUserId(): string {
  let uid = localStorage.getItem(SESSION_USER_KEY);
  if (!uid) {
    uid = `user_${generateId()}`;
    localStorage.setItem(SESSION_USER_KEY, uid);
  }
  return uid;
}

// ── Comments ──────────────────────────────────────────────────────────────────

export function useCommentsByEpisode(episodeId: string | undefined) {
  const { comments: ctxComments } = useAppContext();
  const contextComments = episodeId ? (ctxComments[episodeId] ?? []) : [];

  return useQuery<Comment[]>({
    queryKey: ["comments", episodeId],
    queryFn: () => {
      if (!episodeId) return [];
      // Prefer context data (from canister); fall back to localStorage cache
      if (contextComments.length > 0) {
        return contextComments.map((c) => ({
          id: typeof c === "object" && "id" in c ? String(c.id) : generateId(),
          episodeId,
          authorId:
            typeof c === "object" && "authorId" in c
              ? String(c.authorId)
              : "anonymous",
          authorUsername:
            typeof c === "object" && "authorUsername" in c
              ? String(c.authorUsername)
              : "Anonymous",
          text: typeof c === "object" && "text" in c ? String(c.text) : "",
          createdAt:
            typeof c === "object" && "createdAt" in c
              ? Number(c.createdAt) > 1e12
                ? Number(c.createdAt) / 1e6
                : Number(c.createdAt)
              : Date.now(),
          parentId:
            typeof c === "object" && "parentId" in c && c.parentId != null
              ? String(c.parentId)
              : undefined,
          isDeleted:
            typeof c === "object" && "isDeleted" in c
              ? Boolean(c.isDeleted)
              : false,
        })) as Comment[];
      }
      return getComments().filter(
        (c) => c.episodeId === episodeId && !c.isDeleted,
      );
    },
    enabled: !!episodeId,
    staleTime: 0,
  });
}

export function useAddComment() {
  const queryClient = useQueryClient();
  const ctx = useAppContext();

  return useMutation({
    mutationFn: async ({
      episodeId,
      text,
      parentId,
      username,
    }: {
      episodeId: string;
      text: string;
      parentId?: string;
      username?: string;
    }): Promise<Comment> => {
      // Try canister first
      if (ctx.isCanisterAvailable) {
        try {
          await ctx.postComment(episodeId, text, parentId);
          // After canister write, reload the episode data to get fresh comments
          await ctx.loadEpisodeData(episodeId);
          const ctxComments = ctx.comments[episodeId] ?? [];
          const last = ctxComments[ctxComments.length - 1];
          if (last) {
            return {
              id:
                typeof last === "object" && "id" in last
                  ? String(last.id)
                  : generateId(),
              episodeId,
              authorId:
                typeof last === "object" && "authorId" in last
                  ? String(last.authorId)
                  : getSessionUserId(),
              authorUsername:
                username ??
                (typeof last === "object" && "authorUsername" in last
                  ? String(last.authorUsername)
                  : "Anonymous"),
              text: text.trim(),
              createdAt: Date.now(),
              parentId,
              isDeleted: false,
            };
          }
        } catch {
          // Fall through to cache fallback
        }
      }

      // Fallback: write to localStorage cache
      const sessionId = getSessionUserId();
      const newComment: Comment = {
        id: generateId(),
        episodeId,
        authorId: sessionId,
        authorUsername: username ?? "Anonymous",
        text: text.trim(),
        createdAt: Date.now(),
        parentId,
        isDeleted: false,
      };
      const all = getComments();
      all.push(newComment);
      saveComments(all);
      return newComment;
    },
    onSuccess: (_comment, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["comments", variables.episodeId],
      });
    },
  });
}

export function useEditComment() {
  const queryClient = useQueryClient();
  const ctx = useAppContext();

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
      void _episodeId;
      // Try canister first
      if (ctx.isCanisterAvailable) {
        try {
          await ctx.editComment(commentId, newText);
        } catch {
          // Fall through
        }
      }

      // Update localStorage cache
      const all = getComments();
      const idx = all.findIndex((c) => c.id === commentId);
      if (idx === -1) throw new Error("Comment not found");
      const updated: Comment = {
        ...all[idx],
        text: newText.trim(),
        updatedAt: Date.now(),
      };
      all[idx] = updated;
      saveComments(all);
      return updated;
    },
    onSuccess: (_comment, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["comments", variables.episodeId],
      });
    },
  });
}

export function useDeleteComment() {
  const queryClient = useQueryClient();
  const ctx = useAppContext();

  return useMutation({
    mutationFn: async ({
      commentId,
      episodeId,
    }: {
      commentId: string;
      episodeId: string;
    }): Promise<boolean> => {
      // Try canister first
      if (ctx.isCanisterAvailable) {
        try {
          await ctx.deleteComment(commentId, episodeId);
        } catch {
          // Fall through
        }
      }

      // Update localStorage cache (soft delete)
      const all = getComments();
      const idx = all.findIndex((c) => c.id === commentId);
      if (idx === -1) return false;
      all[idx] = { ...all[idx], isDeleted: true };
      saveComments(all);
      return true;
    },
    onSuccess: (_result, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["comments", variables.episodeId],
      });
    },
  });
}

// ── Ratings ───────────────────────────────────────────────────────────────────

export function useRatingsInfo(episodeId: string | undefined) {
  const { ratings: ctxRatings } = useAppContext();
  const contextRating = episodeId ? (ctxRatings[episodeId] ?? null) : null;

  return useQuery<RatingsInfo>({
    queryKey: ["ratings", episodeId],
    queryFn: (): RatingsInfo => {
      if (!episodeId) return { average: 0, total: 0 };
      // Prefer context data (from canister)
      if (contextRating) return contextRating;
      // Fall back to localStorage cache
      const sessionId = getSessionUserId();
      const all = getRatings().filter((r) => r.episodeId === episodeId);
      const total = all.length;
      const average =
        total > 0 ? all.reduce((sum, r) => sum + r.stars, 0) / total : 0;
      const userRating = all.find((r) => r.userId === sessionId)?.stars;
      return { average, total, userRating };
    },
    enabled: !!episodeId,
    staleTime: 0,
  });
}

export function useAddRating() {
  const queryClient = useQueryClient();
  const ctx = useAppContext();

  return useMutation({
    mutationFn: async ({
      episodeId,
      stars,
    }: {
      episodeId: string;
      stars: number;
    }): Promise<string | null> => {
      // Try canister first
      if (ctx.isCanisterAvailable) {
        try {
          await ctx.rateEpisode(episodeId, stars);
          return getSessionUserId();
        } catch {
          // Fall through
        }
      }

      // Fallback: write to localStorage cache
      const sessionId = getSessionUserId();
      const all = getRatings();
      const existingIdx = all.findIndex(
        (r) => r.episodeId === episodeId && r.userId === sessionId,
      );
      if (existingIdx >= 0) {
        all[existingIdx] = { episodeId, stars, userId: sessionId };
      } else {
        all.push({ episodeId, stars, userId: sessionId });
      }
      saveRatings(all);
      return sessionId;
    },
    onSuccess: (_result, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["ratings", variables.episodeId],
      });
    },
  });
}
