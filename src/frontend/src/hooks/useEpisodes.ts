import {
  loadConfig,
  useActor,
  useInternetIdentity,
} from "@caffeineai/core-infrastructure";
import { StorageClient } from "@caffeineai/object-storage";
import { HttpAgent } from "@icp-sdk/core/agent";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { createActor } from "../backend";
import type { Episode, EpisodeInput } from "../backend.d";

// Form data uses number/string for UI convenience; we convert to backend types in mutationFn
export interface EpisodeFormData {
  animeId: string;
  episodeNumber: number;
  title: string;
  description: string;
  videoUrl: string;
  duration: string; // e.g. "24:00"
  thumbnailUrl: string;
  seasonId?: string;
}

function toEpisodeInput(data: EpisodeFormData): EpisodeInput {
  return {
    animeId: data.animeId,
    episodeNumber: BigInt(Math.max(1, Math.floor(data.episodeNumber))),
    title: data.title.trim(),
    description: data.description.trim(),
    videoUrl: data.videoUrl.trim(),
    // Pass undefined for optional fields when empty so bindgen sends candid_none()
    duration: data.duration.trim() || undefined,
    thumbnailUrl: data.thumbnailUrl.trim() || undefined,
    seasonId: data.seasonId || undefined,
  };
}

export function extractEpisodeError(error: unknown): string {
  if (error instanceof Error) {
    const msg = error.message;
    const msgLower = msg.toLowerCase();

    // "Backend is still loading" — friendly message
    if (msgLower.includes("backend is still loading")) {
      return "Backend is still connecting — please wait a moment and try again.";
    }

    // IC0508 — canister stopped / not running
    if (
      msg.includes("IC0508") ||
      msgLower.includes("canister is stopped") ||
      msgLower.includes("canister stopped") ||
      msgLower.includes("ic0_call_rejected") ||
      msgLower.includes("canister_not_running") ||
      msgLower.includes("stopped")
    ) {
      return "Server is temporarily unavailable. Please try again in a few minutes.";
    }

    // IC0503 — canister out of cycles
    if (msg.includes("IC0503") || msgLower.includes("out of cycles")) {
      return "Server is out of resources. Please contact support.";
    }

    // Network / fetch errors
    if (
      msgLower.includes("failed to fetch") ||
      msgLower.includes("networkerror") ||
      msgLower.includes("network error") ||
      msgLower.includes("connection refused") ||
      msgLower.includes("net::err")
    ) {
      return "Connection failed. Please check your internet and try again.";
    }

    // Surface Motoko/IC reject messages
    if (msg.includes("reject")) {
      const match = msg.match(/reject_message:\s*(.+)/);
      if (match) return match[1].trim();
    }

    // Unauthorized
    if (msgLower.includes("unauthorized")) {
      return "Unauthorized — admin credentials not accepted by backend.";
    }

    return msg;
  }
  return String(error);
}

// ── Video upload via object-storage ─────────────────────────────────────────

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

  // Get current identity so the HttpAgent can authenticate the canister certificate call
  const { identity } = useInternetIdentity();

  const upload = async (file: File): Promise<string> => {
    setProgress({ status: "uploading", percentage: 0 });

    try {
      const config = await loadConfig();

      // Pass identity to the agent so _immutableObjectStorageCreateCertificate
      // canister call is properly signed — anonymous agents get 403 from gateway
      const agentOptions: Record<string, unknown> = {
        host: config.backend_host ?? "https://icp0.io",
      };
      if (identity) {
        agentOptions.identity = identity;
      }

      const agent = new HttpAgent(agentOptions);

      if (config.backend_host?.includes("localhost")) {
        await agent.fetchRootKey().catch(() => {});
      }

      const storageClient = new StorageClient(
        config.bucket_name,
        config.storage_gateway_url,
        config.backend_canister_id,
        config.project_id,
        agent,
      );

      const bytes = new Uint8Array(await file.arrayBuffer());

      const { hash } = await storageClient.putFile(bytes, (pct) => {
        setProgress({ status: "uploading", percentage: pct });
      });

      const url = await storageClient.getDirectURL(hash);

      // Guard: never return a blob: URL or empty URL — they won't persist across sessions
      if (!url || url.startsWith("blob:")) {
        const errMsg = url.startsWith("blob:")
          ? "Upload returned a temporary URL that will not persist. Please try again."
          : "Upload failed: could not generate permanent URL. Please try again.";
        setProgress({ status: "error", percentage: 0, error: errMsg });
        console.error(
          "useUploadVideo: invalid URL returned from storage —",
          url,
        );
        throw new Error(errMsg);
      }

      console.log("useUploadVideo: upload complete, persistent URL:", url);
      setProgress({ status: "done", percentage: 100 });
      return url;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setProgress({ status: "error", percentage: 0, error: msg });
      throw err;
    }
  };

  const reset = () => setProgress({ status: "idle", percentage: 0 });

  return { upload, progress, reset };
}

export function useEpisodesByAnime(animeId: string | undefined) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Episode[]>({
    queryKey: ["episodes", animeId],
    queryFn: async () => {
      if (!animeId || !actor) return [];
      const result = await actor.getEpisodesByAnime(animeId);
      return [...result].sort((a, b) =>
        a.episodeNumber < b.episodeNumber
          ? -1
          : a.episodeNumber > b.episodeNumber
            ? 1
            : 0,
      );
    },
    enabled: !!animeId && !!actor && !isFetching,
  });
}

export function useEpisode(
  animeId: string | undefined,
  episodeId: string | undefined,
) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Episode | null>({
    queryKey: ["episode", animeId, episodeId],
    queryFn: async () => {
      if (!episodeId || !actor) return null;
      return actor.getEpisode(episodeId);
    },
    enabled: !!animeId && !!episodeId && !!actor && !isFetching,
  });
}

export function useCreateEpisode() {
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: EpisodeFormData): Promise<Episode> => {
      if (!actor || isFetching)
        throw new Error(
          "Backend is still loading — please wait a moment and try again",
        );
      const input = toEpisodeInput(data);
      return actor.createEpisode("adminfaheem123", input);
    },
    onSuccess: (ep) => {
      queryClient.invalidateQueries({ queryKey: ["episodes", ep.animeId] });
      queryClient.invalidateQueries({ queryKey: ["episodes"] });
    },
    // onError intentionally omitted — caller handles display via extractEpisodeError
  });
}

export function useUpdateEpisode() {
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: { id: string; data: Partial<EpisodeFormData> }): Promise<Episode> => {
      if (!actor || isFetching)
        throw new Error(
          "Backend is still loading — please wait a moment and try again",
        );
      // Fetch current episode to merge partial updates
      const current = await actor.getEpisode(id);
      if (!current) throw new Error("Episode not found");
      const merged: EpisodeFormData = {
        animeId: data.animeId ?? current.animeId,
        episodeNumber: data.episodeNumber ?? Number(current.episodeNumber),
        title: data.title ?? current.title,
        description: data.description ?? current.description,
        videoUrl: data.videoUrl ?? current.videoUrl,
        duration: data.duration ?? current.duration ?? "",
        thumbnailUrl: data.thumbnailUrl ?? current.thumbnailUrl ?? "",
        seasonId:
          data.seasonId !== undefined
            ? data.seasonId
            : (current.seasonId ?? undefined),
      };
      const result = await actor.updateEpisode(
        "adminfaheem123",
        id,
        toEpisodeInput(merged),
      );
      if (!result)
        throw new Error(
          "Episode update failed — episode may have been deleted",
        );
      return result;
    },
    onSuccess: (ep) => {
      queryClient.invalidateQueries({ queryKey: ["episodes", ep.animeId] });
      queryClient.invalidateQueries({
        queryKey: ["episode", ep.animeId, ep.id],
      });
    },
    // onError intentionally omitted — caller handles display via extractEpisodeError
  });
}

export function useDeleteEpisode() {
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string): Promise<string> => {
      if (!actor || isFetching)
        throw new Error(
          "Backend is still loading — please wait a moment and try again",
        );
      // Fetch episode first to get animeId for invalidation
      const ep = await actor.getEpisode(id);
      const animeId = ep?.animeId ?? "";
      const success = await actor.deleteEpisode("adminfaheem123", id);
      if (!success) throw new Error("Delete failed — episode may not exist");
      return animeId;
    },
    onSuccess: (animeId) => {
      queryClient.invalidateQueries({ queryKey: ["episodes", animeId] });
      queryClient.invalidateQueries({ queryKey: ["episodes"] });
    },
    onError: (error: unknown) => {
      const msg = extractEpisodeError(error);
      toast.error(`Failed to delete episode: ${msg}`);
    },
  });
}
