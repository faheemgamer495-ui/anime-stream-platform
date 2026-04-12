import { v as useActor, w as useQuery, x as useQueryClient, y as useMutation, r as reactExports, a4 as useInternetIdentity, a5 as loadConfig, a6 as HttpAgent, a7 as StorageClient, h as ue, z as createActor } from "./index-DnVaqzJ1.js";
function toEpisodeInput(data) {
  return {
    animeId: data.animeId,
    episodeNumber: BigInt(Math.max(1, Math.floor(data.episodeNumber))),
    title: data.title.trim(),
    description: data.description.trim(),
    videoUrl: data.videoUrl.trim(),
    // Pass undefined for optional fields when empty so bindgen sends candid_none()
    duration: data.duration.trim() || void 0,
    thumbnailUrl: data.thumbnailUrl.trim() || void 0,
    seasonId: data.seasonId || void 0
  };
}
function extractEpisodeError(error) {
  if (error instanceof Error) {
    const msg = error.message;
    const msgLower = msg.toLowerCase();
    if (msgLower.includes("backend is still loading")) {
      return "Backend is still connecting — please wait a moment and try again.";
    }
    if (msg.includes("IC0508") || msgLower.includes("canister is stopped") || msgLower.includes("canister stopped") || msgLower.includes("ic0_call_rejected") || msgLower.includes("canister_not_running") || msgLower.includes("stopped")) {
      return "Server is temporarily unavailable. Please try again in a few minutes.";
    }
    if (msg.includes("IC0503") || msgLower.includes("out of cycles")) {
      return "Server is out of resources. Please contact support.";
    }
    if (msgLower.includes("failed to fetch") || msgLower.includes("networkerror") || msgLower.includes("network error") || msgLower.includes("connection refused") || msgLower.includes("net::err")) {
      return "Connection failed. Please check your internet and try again.";
    }
    if (msg.includes("reject")) {
      const match = msg.match(/reject_message:\s*(.+)/);
      if (match) return match[1].trim();
    }
    if (msgLower.includes("unauthorized")) {
      return "Unauthorized — admin credentials not accepted by backend.";
    }
    return msg;
  }
  return String(error);
}
function useUploadVideo() {
  const [progress, setProgress] = reactExports.useState({
    status: "idle",
    percentage: 0
  });
  const { identity } = useInternetIdentity();
  const upload = async (file) => {
    var _a;
    setProgress({ status: "uploading", percentage: 0 });
    try {
      const config = await loadConfig();
      const agentOptions = {
        host: config.backend_host ?? "https://icp0.io"
      };
      if (identity) {
        agentOptions.identity = identity;
      }
      const agent = new HttpAgent(agentOptions);
      if ((_a = config.backend_host) == null ? void 0 : _a.includes("localhost")) {
        await agent.fetchRootKey().catch(() => {
        });
      }
      const storageClient = new StorageClient(
        config.bucket_name,
        config.storage_gateway_url,
        config.backend_canister_id,
        config.project_id,
        agent
      );
      const bytes = new Uint8Array(await file.arrayBuffer());
      const { hash } = await storageClient.putFile(bytes, (pct) => {
        setProgress({ status: "uploading", percentage: pct });
      });
      const url = await storageClient.getDirectURL(hash);
      if (!url || url.startsWith("blob:")) {
        const errMsg = url.startsWith("blob:") ? "Upload returned a temporary URL that will not persist. Please try again." : "Upload failed: could not generate permanent URL. Please try again.";
        setProgress({ status: "error", percentage: 0, error: errMsg });
        console.error(
          "useUploadVideo: invalid URL returned from storage —",
          url
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
function useEpisodesByAnime(animeId) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["episodes", animeId],
    queryFn: async () => {
      if (!animeId || !actor) return [];
      const result = await actor.getEpisodesByAnime(animeId);
      return [...result].sort(
        (a, b) => a.episodeNumber < b.episodeNumber ? -1 : a.episodeNumber > b.episodeNumber ? 1 : 0
      );
    },
    enabled: !!animeId && !!actor && !isFetching
  });
}
function useEpisode(animeId, episodeId) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["episode", animeId, episodeId],
    queryFn: async () => {
      if (!episodeId || !actor) return null;
      return actor.getEpisode(episodeId);
    },
    enabled: !!animeId && !!episodeId && !!actor && !isFetching
  });
}
function useCreateEpisode() {
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      if (!actor || isFetching)
        throw new Error(
          "Backend is still loading — please wait a moment and try again"
        );
      const input = toEpisodeInput(data);
      return actor.createEpisode("adminfaheem123", input);
    },
    onSuccess: (ep) => {
      queryClient.invalidateQueries({ queryKey: ["episodes", ep.animeId] });
      queryClient.invalidateQueries({ queryKey: ["episodes"] });
    }
    // onError intentionally omitted — caller handles display via extractEpisodeError
  });
}
function useUpdateEpisode() {
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      data
    }) => {
      if (!actor || isFetching)
        throw new Error(
          "Backend is still loading — please wait a moment and try again"
        );
      const current = await actor.getEpisode(id);
      if (!current) throw new Error("Episode not found");
      const merged = {
        animeId: data.animeId ?? current.animeId,
        episodeNumber: data.episodeNumber ?? Number(current.episodeNumber),
        title: data.title ?? current.title,
        description: data.description ?? current.description,
        videoUrl: data.videoUrl ?? current.videoUrl,
        duration: data.duration ?? current.duration ?? "",
        thumbnailUrl: data.thumbnailUrl ?? current.thumbnailUrl ?? "",
        seasonId: data.seasonId !== void 0 ? data.seasonId : current.seasonId ?? void 0
      };
      const result = await actor.updateEpisode(
        "adminfaheem123",
        id,
        toEpisodeInput(merged)
      );
      if (!result)
        throw new Error(
          "Episode update failed — episode may have been deleted"
        );
      return result;
    },
    onSuccess: (ep) => {
      queryClient.invalidateQueries({ queryKey: ["episodes", ep.animeId] });
      queryClient.invalidateQueries({
        queryKey: ["episode", ep.animeId, ep.id]
      });
    }
    // onError intentionally omitted — caller handles display via extractEpisodeError
  });
}
function useDeleteEpisode() {
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      if (!actor || isFetching)
        throw new Error(
          "Backend is still loading — please wait a moment and try again"
        );
      const ep = await actor.getEpisode(id);
      const animeId = (ep == null ? void 0 : ep.animeId) ?? "";
      const success = await actor.deleteEpisode("adminfaheem123", id);
      if (!success) throw new Error("Delete failed — episode may not exist");
      return animeId;
    },
    onSuccess: (animeId) => {
      queryClient.invalidateQueries({ queryKey: ["episodes", animeId] });
      queryClient.invalidateQueries({ queryKey: ["episodes"] });
    },
    onError: (error) => {
      const msg = extractEpisodeError(error);
      ue.error(`Failed to delete episode: ${msg}`);
    }
  });
}
export {
  useEpisode as a,
  useCreateEpisode as b,
  useUpdateEpisode as c,
  useDeleteEpisode as d,
  extractEpisodeError as e,
  useUploadVideo as f,
  useEpisodesByAnime as u
};
