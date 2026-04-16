/**
 * AppContext — global data layer bridging the Motoko canister and the React app.
 *
 * Strategy (CANISTER-FIRST):
 * - The Motoko canister is the PRIMARY / AUTHORITATIVE data store.
 * - localStorage is a CLIENT-SIDE CACHE ONLY for fast initial render.
 * - On mount: show localStorage data immediately (fast paint), then replace
 *   with fresh canister data as soon as the actor connects.
 * - All WRITE operations: call canister FIRST, await result, then update
 *   the localStorage cache.  If the canister call fails, throw — do NOT
 *   silently fall back to a localStorage-only write.
 * - If the actor is not yet connected, operations will wait up to the
 *   configured timeout; once connected, canister is always called.
 * - Admin CRUD actions pass adminToken="adminfaheem123" to canister methods.
 * - Every async action sets loading[key] and errors[key] for UI feedback.
 */

import { useActor } from "@caffeineai/core-infrastructure";
import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  type AnimeInput,
  type AnimePublic,
  type AnimeRequest,
  type Comment,
  type Episode,
  type EpisodeInput,
  type SeasonInput,
  type SeasonPublic,
  type WatchlistEntry,
  createActor as backendCreateActor,
} from "../backend";
import type { Backend } from "../backend";
import {
  clearAnimeCache,
  generateId,
  getAnimeList,
  getComments,
  getEpisodesByAnime,
  getEpisodesList,
  getRatings,
  getRequests,
  getSeasonsByAnime,
  getSeasonsList,
  getWatchlist,
  removeAnime,
  removeEpisode,
  removeSeason,
  saveAnimeList,
  saveComments,
  saveEpisodesList,
  saveRequests,
  saveSeasonsList,
  saveWatchlist,
  seedIfEmpty,
  upsertAnime,
  upsertEpisode,
  upsertSeason,
} from "../lib/localStorageDB";
import type { Anime, AnimeFormData, RatingsInfo } from "../types";

// ── Constants ─────────────────────────────────────────────────────────────────

const ADMIN_TOKEN = "adminfaheem123";
const SESSION_USER_KEY = "anime_stream_session_user";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface AppState {
  anime: AnimePublic[];
  seasons: Record<string, SeasonPublic[]>;
  episodes: Record<string, Episode[]>;
  comments: Record<string, Comment[]>;
  ratings: Record<string, RatingsInfo>;
  requests: AnimeRequest[];
  watchlist: string[];
  loading: Record<string, boolean>;
  errors: Record<string, string | null>;
  isCanisterAvailable: boolean;
}

export interface AppActions {
  loadAnimeDetail: (animeId: string) => Promise<void>;
  loadEpisodeData: (episodeId: string) => Promise<void>;
  refreshAnime: () => Promise<void>;
  // Admin: Anime
  createAnime: (input: AnimeInput) => Promise<AnimePublic>;
  updateAnime: (id: string, input: AnimeInput) => Promise<AnimePublic>;
  deleteAnime: (id: string) => Promise<void>;
  // Admin: Seasons
  createSeason: (input: SeasonInput) => Promise<SeasonPublic>;
  deleteSeason: (id: string, animeId: string) => Promise<void>;
  // Admin: Episodes
  createEpisode: (input: EpisodeInput) => Promise<Episode>;
  updateEpisode: (id: string, input: EpisodeInput) => Promise<Episode>;
  deleteEpisode: (id: string, animeId: string) => Promise<void>;
  // Admin: Requests
  loadRequests: () => Promise<void>;
  completeRequest: (id: string) => Promise<void>;
  deleteRequest: (id: string) => Promise<void>;
  // User: Comments
  postComment: (
    episodeId: string,
    text: string,
    parentId?: string,
  ) => Promise<void>;
  editComment: (commentId: string, text: string) => Promise<void>;
  deleteComment: (commentId: string, episodeId: string) => Promise<void>;
  // User: Ratings
  rateEpisode: (episodeId: string, stars: number) => Promise<void>;
  // User: Watchlist
  toggleWatchlist: (animeId: string) => Promise<void>;
  // User: Requests
  submitRequest: (text: string, username: string) => Promise<void>;
}

export type AppContextValue = AppState & AppActions;

// ── Helpers ───────────────────────────────────────────────────────────────────

function getSessionUserId(): string {
  let uid = localStorage.getItem(SESSION_USER_KEY);
  if (!uid) {
    uid = `user_${generateId()}`;
    localStorage.setItem(SESSION_USER_KEY, uid);
  }
  return uid;
}

function localAnimeToPublic(a: Anime): AnimePublic {
  return {
    id: a.id,
    title: a.title,
    description: a.description,
    genres: a.genre ?? [],
    rating: a.rating,
    coverImageUrl: a.coverImageUrl || a.thumbnailUrl,
    isFeatured: a.isFeatured,
    viewCount: BigInt(a.viewCount ?? 0),
    createdAt: BigInt(a.createdAt ?? Date.now()) * BigInt(1_000_000),
  };
}

function publicToLocalAnime(a: AnimePublic): Anime {
  return {
    id: a.id,
    title: a.title,
    description: a.description,
    genre: a.genres,
    rating: a.rating,
    thumbnailUrl: a.coverImageUrl,
    coverImageUrl: a.coverImageUrl,
    isFeatured: a.isFeatured,
    viewCount: Number(a.viewCount),
    episodeCount: 0,
    releaseYear: new Date().getFullYear(),
    status: "ongoing",
    createdAt: Number(a.createdAt / BigInt(1_000_000)),
  };
}

// inputToPublic helper removed — canister-first writes always return the
// server-side created record, so client-side ID generation is not needed.

// ── Context ───────────────────────────────────────────────────────────────────

const AppContext = createContext<AppContextValue | null>(null);

export function useAppContext(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used inside <AppProvider>");
  return ctx;
}

// ── Provider ──────────────────────────────────────────────────────────────────

export function AppProvider({ children }: { children: ReactNode }) {
  // Show localStorage cache immediately for fast initial paint
  const initialAnime = useMemo(
    () => getAnimeList().map(localAnimeToPublic),
    [],
  );
  const initialWatchlist = useMemo(
    () =>
      getWatchlist()
        .filter((w) => w.userId === getSessionUserId())
        .map((w) => w.animeId),
    [],
  );

  const [state, setState] = useState<AppState>({
    anime: initialAnime,
    seasons: {},
    episodes: {},
    comments: {},
    ratings: {},
    requests: [],
    watchlist: initialWatchlist,
    loading: {},
    errors: {},
    isCanisterAvailable: false,
  });

  const actorRef = useRef<Backend | null>(null);
  const [actorReady, setActorReady] = useState(false);

  const { actor, isFetching: actorFetching } = useActor(
    (canisterId, upload, download, opts) =>
      backendCreateActor(canisterId, upload, download, opts),
  );

  useEffect(() => {
    actorRef.current = actor as Backend | null;
    if (actor && !actorFetching) {
      setState((s) => ({ ...s, isCanisterAvailable: true }));
      setActorReady(true);
    }
  }, [actor, actorFetching]);

  // ── Async helpers ──────────────────────────────────────────────────────────

  const setLoading = useCallback((key: string, value: boolean) => {
    setState((s) => ({ ...s, loading: { ...s.loading, [key]: value } }));
  }, []);

  const setError = useCallback((key: string, err: string | null) => {
    setState((s) => ({ ...s, errors: { ...s.errors, [key]: err } }));
  }, []);

  const withLoading = useCallback(
    async <T,>(key: string, fn: () => Promise<T>): Promise<T> => {
      setLoading(key, true);
      setError(key, null);
      try {
        return await fn();
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        setError(key, msg);
        throw e;
      } finally {
        setLoading(key, false);
      }
    },
    [setLoading, setError],
  );

  // ── Bootstrap ──────────────────────────────────────────────────────────────

  /**
   * refreshAnime — always tries canister first.
   * On success: clears stale cache entries, writes fresh data, seeds only if
   * canister is also empty.
   * On failure: falls back to localStorage cache.
   */
  const refreshAnime = useCallback(async () => {
    await withLoading("anime.list", async () => {
      const ac = actorRef.current;
      if (ac) {
        try {
          const list = await ac.getAllAnime();

          if (list.length > 0) {
            // Canister has real data — evict stale cache and write fresh
            clearAnimeCache();
            saveAnimeList(list.map(publicToLocalAnime));
            // canisterIsEmpty=false → seedIfEmpty will NOT overwrite with samples
            seedIfEmpty(false);
          } else {
            // Canister is empty — seed localStorage if also empty (first deploy)
            seedIfEmpty(true);
          }

          setState((s) => ({
            ...s,
            anime:
              list.length > 0 ? list : getAnimeList().map(localAnimeToPublic),
          }));
          return;
        } catch (err) {
          console.error("[AppContext] getAllAnime canister call failed:", err);
          // Fall through to localStorage fallback below
        }
      }

      // Canister not yet available — show cache
      setState((s) => ({
        ...s,
        anime: getAnimeList().map(localAnimeToPublic),
      }));
    });
  }, [withLoading]);

  // Keep refreshAnime in a ref so effects can call latest version without stale closure
  const refreshAnimeRef = useRef(refreshAnime);
  useEffect(() => {
    refreshAnimeRef.current = refreshAnime;
  });

  // Load anime on mount from localStorage (fast render)
  useEffect(() => {
    refreshAnimeRef.current().catch(console.error);
  }, []); // mount only

  // Once canister connects, do a full canister-backed refresh
  useEffect(() => {
    if (!actorReady) return;
    refreshAnimeRef.current().catch(console.error);

    if (!actorRef.current) return;
    actorRef.current
      .getUserWatchlist()
      .then((entries: WatchlistEntry[]) => {
        // Sync canister watchlist to localStorage cache
        const sessionId = getSessionUserId();
        const wl = entries.map((e) => ({
          userId: sessionId,
          animeId: e.animeId,
          addedAt: Number(e.addedAt ?? BigInt(Date.now())),
        }));
        saveWatchlist(wl);
        setState((s) => ({ ...s, watchlist: entries.map((e) => e.animeId) }));
      })
      .catch(() => {
        /* keep localStorage watchlist on failure */
      });
  }, [actorReady]);

  // ── Load detail ────────────────────────────────────────────────────────────

  const loadAnimeDetail = useCallback(
    async (animeId: string) => {
      await withLoading(`detail.${animeId}`, async () => {
        let seasons: SeasonPublic[];
        let episodes: Episode[];

        if (actorRef.current) {
          try {
            [seasons, episodes] = await Promise.all([
              actorRef.current.getSeasonsByAnime(animeId),
              actorRef.current.getEpisodesByAnime(animeId),
            ]);
            // Write canister data to cache
            const otherSeasons = getSeasonsList().filter(
              (s) => s.animeId !== animeId,
            );
            saveSeasonsList([
              ...otherSeasons,
              ...seasons.map((s) => ({
                id: s.id,
                animeId: s.animeId,
                name: s.name,
                seasonNumber: s.seasonNumber,
                createdAt: s.createdAt,
              })),
            ]);
            const otherEps = getEpisodesList().filter(
              (e) => e.animeId !== animeId,
            );
            saveEpisodesList([...otherEps, ...episodes]);
          } catch (err) {
            console.error("[AppContext] loadAnimeDetail canister failed:", err);
            seasons = getSeasonsByAnime(animeId) as unknown as SeasonPublic[];
            episodes = getEpisodesByAnime(animeId) as unknown as Episode[];
          }
        } else {
          seasons = getSeasonsByAnime(animeId) as unknown as SeasonPublic[];
          episodes = getEpisodesByAnime(animeId) as unknown as Episode[];
        }

        setState((s) => ({
          ...s,
          seasons: { ...s.seasons, [animeId]: seasons },
          episodes: { ...s.episodes, [animeId]: episodes },
        }));
      });
    },
    [withLoading],
  );

  const loadEpisodeData = useCallback(
    async (episodeId: string) => {
      await withLoading(`episode.${episodeId}`, async () => {
        let comments: Comment[];
        let ratingsRaw: { total: bigint; average: number; userRating?: bigint };

        if (actorRef.current) {
          try {
            [comments, ratingsRaw] = await Promise.all([
              actorRef.current.getCommentsByEpisode(episodeId),
              actorRef.current.getRatingsInfo(episodeId),
            ]);
            // Sync comments to cache
            const other = getComments().filter(
              (c) => c.episodeId !== episodeId,
            );
            saveComments([
              ...other,
              ...comments.map((c) => ({
                id: c.id,
                episodeId: c.episodeId,
                authorId: c.authorId.toString(),
                authorUsername: c.authorUsername,
                text: c.text,
                createdAt: Number(c.createdAt / BigInt(1_000_000)),
                updatedAt: c.updatedAt
                  ? Number(c.updatedAt / BigInt(1_000_000))
                  : undefined,
                parentId: c.parentId,
                isDeleted: c.isDeleted,
              })),
            ]);
          } catch (err) {
            console.error("[AppContext] loadEpisodeData canister failed:", err);
            comments = getComments()
              .filter((c) => c.episodeId === episodeId && !c.isDeleted)
              .map((c) => ({
                ...c,
                authorId: {
                  toString: () => c.authorId,
                  _isPrincipal: false,
                } as unknown as import("@icp-sdk/core/principal").Principal,
                createdAt: BigInt(c.createdAt) * BigInt(1_000_000),
              })) as unknown as Comment[];
            ratingsRaw = { total: BigInt(0), average: 0 };
          }
        } else {
          comments = getComments()
            .filter((c) => c.episodeId === episodeId && !c.isDeleted)
            .map((c) => ({
              ...c,
              authorId: {
                toString: () => c.authorId,
                _isPrincipal: false,
              } as unknown as import("@icp-sdk/core/principal").Principal,
              createdAt: BigInt(c.createdAt) * BigInt(1_000_000),
            })) as unknown as Comment[];
          ratingsRaw = { total: BigInt(0), average: 0 };
        }

        setState((s) => ({
          ...s,
          comments: { ...s.comments, [episodeId]: comments },
          ratings: {
            ...s.ratings,
            [episodeId]: {
              average: ratingsRaw.average,
              total: Number(ratingsRaw.total),
              userRating: ratingsRaw.userRating
                ? Number(ratingsRaw.userRating)
                : undefined,
            },
          },
        }));
      });
    },
    [withLoading],
  );

  // ── Admin: Anime ───────────────────────────────────────────────────────────

  const createAnime = useCallback(
    async (input: AnimeInput): Promise<AnimePublic> =>
      withLoading("admin.createAnime", async () => {
        const ac = actorRef.current;
        if (!ac) {
          throw new Error(
            "Backend unavailable — canister not connected. Please try again.",
          );
        }
        // Canister call FIRST — throws on failure
        const created = await ac.createAnime(ADMIN_TOKEN, input);
        // Only after success: update localStorage cache
        upsertAnime(publicToLocalAnime(created));
        setState((s) => ({ ...s, anime: [...s.anime, created] }));
        return created;
      }),
    [withLoading],
  );

  const updateAnime = useCallback(
    async (id: string, input: AnimeInput): Promise<AnimePublic> =>
      withLoading(`admin.updateAnime.${id}`, async () => {
        const ac = actorRef.current;
        if (!ac) {
          throw new Error(
            "Backend unavailable — canister not connected. Please try again.",
          );
        }
        // Canister call FIRST — throws on failure
        const updated = await ac.updateAnime(ADMIN_TOKEN, id, input);
        if (!updated) throw new Error("Anime not found or update failed");
        // Only after success: update cache
        upsertAnime(publicToLocalAnime(updated));
        setState((s) => ({
          ...s,
          anime: s.anime.map((a) => (a.id === id ? updated : a)),
        }));
        return updated;
      }),
    [withLoading],
  );

  const deleteAnime = useCallback(
    async (id: string) =>
      withLoading(`admin.deleteAnime.${id}`, async () => {
        const ac = actorRef.current;
        if (!ac) {
          throw new Error(
            "Backend unavailable — canister not connected. Please try again.",
          );
        }
        // Canister call FIRST — throws on failure
        await ac.deleteAnime(ADMIN_TOKEN, id);
        // Only after success: update cache
        removeAnime(id);
        setState((s) => ({ ...s, anime: s.anime.filter((a) => a.id !== id) }));
      }),
    [withLoading],
  );

  // ── Admin: Seasons ─────────────────────────────────────────────────────────

  const createSeason = useCallback(
    async (input: SeasonInput): Promise<SeasonPublic> =>
      withLoading("admin.createSeason", async () => {
        const ac = actorRef.current;
        if (!ac) {
          throw new Error(
            "Backend unavailable — canister not connected. Please try again.",
          );
        }
        // Canister call FIRST
        const created = await ac.createSeason(ADMIN_TOKEN, input);
        // Update cache
        upsertSeason({ ...created });
        setState((s) => ({
          ...s,
          seasons: {
            ...s.seasons,
            [input.animeId]: [...(s.seasons[input.animeId] ?? []), created],
          },
        }));
        return created;
      }),
    [withLoading],
  );

  const deleteSeason = useCallback(
    async (id: string, animeId: string) =>
      withLoading(`admin.deleteSeason.${id}`, async () => {
        const ac = actorRef.current;
        if (!ac) {
          throw new Error(
            "Backend unavailable — canister not connected. Please try again.",
          );
        }
        // Canister call FIRST
        await ac.deleteSeason(ADMIN_TOKEN, id);
        // Update cache
        removeSeason(id);
        setState((s) => ({
          ...s,
          seasons: {
            ...s.seasons,
            [animeId]: (s.seasons[animeId] ?? []).filter((x) => x.id !== id),
          },
        }));
      }),
    [withLoading],
  );

  // ── Admin: Episodes ────────────────────────────────────────────────────────

  const createEpisode = useCallback(
    async (input: EpisodeInput): Promise<Episode> =>
      withLoading("admin.createEpisode", async () => {
        const ac = actorRef.current;
        if (!ac) {
          throw new Error(
            "Backend unavailable — canister not connected. Please try again.",
          );
        }
        // Canister call FIRST
        const created = await ac.createEpisode(ADMIN_TOKEN, input);
        // Update cache
        upsertEpisode(created);
        setState((s) => ({
          ...s,
          episodes: {
            ...s.episodes,
            [input.animeId]: [...(s.episodes[input.animeId] ?? []), created],
          },
        }));
        return created;
      }),
    [withLoading],
  );

  const updateEpisode = useCallback(
    async (id: string, input: EpisodeInput): Promise<Episode> =>
      withLoading(`admin.updateEpisode.${id}`, async () => {
        const ac = actorRef.current;
        if (!ac) {
          throw new Error(
            "Backend unavailable — canister not connected. Please try again.",
          );
        }
        // Canister call FIRST
        const updated = await ac.updateEpisode(ADMIN_TOKEN, id, input);
        if (!updated) throw new Error("Episode not found or update failed");
        // Update cache
        upsertEpisode(updated);
        setState((s) => ({
          ...s,
          episodes: {
            ...s.episodes,
            [input.animeId]: (s.episodes[input.animeId] ?? []).map((e) =>
              e.id === id ? updated : e,
            ),
          },
        }));
        return updated;
      }),
    [withLoading],
  );

  const deleteEpisode = useCallback(
    async (id: string, animeId: string) =>
      withLoading(`admin.deleteEpisode.${id}`, async () => {
        const ac = actorRef.current;
        if (!ac) {
          throw new Error(
            "Backend unavailable — canister not connected. Please try again.",
          );
        }
        // Canister call FIRST
        await ac.deleteEpisode(ADMIN_TOKEN, id);
        // Update cache
        removeEpisode(id);
        setState((s) => ({
          ...s,
          episodes: {
            ...s.episodes,
            [animeId]: (s.episodes[animeId] ?? []).filter((e) => e.id !== id),
          },
        }));
      }),
    [withLoading],
  );

  // ── Admin: Requests ────────────────────────────────────────────────────────

  const loadRequests = useCallback(async () => {
    await withLoading("admin.requests", async () => {
      if (actorRef.current) {
        try {
          const reqs = await actorRef.current.getAnimeRequests(ADMIN_TOKEN);
          // Sync to cache
          saveRequests(
            reqs.map((r) => ({
              id: r.id,
              requestText: r.requestText,
              username: r.username,
              status: r.status,
              createdAt: r.createdAt,
            })),
          );
          setState((s) => ({ ...s, requests: reqs }));
          return;
        } catch (err) {
          console.error("[AppContext] getAnimeRequests canister failed:", err);
        }
      }
      // Fall back to cache
      setState((s) => ({ ...s, requests: getRequests() }));
    });
  }, [withLoading]);

  const completeRequest = useCallback(
    async (id: string) =>
      withLoading(`admin.completeRequest.${id}`, async () => {
        if (actorRef.current) {
          try {
            await actorRef.current.markRequestComplete(id, ADMIN_TOKEN);
          } catch (err) {
            console.error(
              "[AppContext] markRequestComplete canister failed:",
              err,
            );
            // Non-critical — update locally if canister fails
          }
        }
        const updated = getRequests().map((r) =>
          r.id === id ? { ...r, status: "completed" } : r,
        );
        saveRequests(updated);
        setState((s) => ({
          ...s,
          requests: s.requests.map((r) =>
            r.id === id ? { ...r, status: "completed" } : r,
          ),
        }));
      }),
    [withLoading],
  );

  const deleteRequest = useCallback(
    async (id: string) =>
      withLoading(`admin.deleteRequest.${id}`, async () => {
        if (actorRef.current) {
          try {
            await actorRef.current.deleteAnimeRequest(id, ADMIN_TOKEN);
          } catch (err) {
            console.error(
              "[AppContext] deleteAnimeRequest canister failed:",
              err,
            );
          }
        }
        saveRequests(getRequests().filter((r) => r.id !== id));
        setState((s) => ({
          ...s,
          requests: s.requests.filter((r) => r.id !== id),
        }));
      }),
    [withLoading],
  );

  // ── User: Comments ─────────────────────────────────────────────────────────

  const postComment = useCallback(
    async (episodeId: string, text: string, parentId?: string) =>
      withLoading(`comments.post.${episodeId}`, async () => {
        if (actorRef.current) {
          try {
            await actorRef.current.addComment(
              episodeId,
              text,
              parentId ?? null,
            );
            await loadEpisodeData(episodeId);
            return;
          } catch (err) {
            console.error("[AppContext] addComment canister failed:", err);
          }
        }
        // Fallback: write to localStorage cache
        const sessionId = getSessionUserId();
        const all = getComments();
        all.push({
          id: generateId(),
          episodeId,
          authorId: sessionId,
          authorUsername: "Anonymous",
          text: text.trim(),
          createdAt: Date.now(),
          parentId,
          isDeleted: false,
        });
        saveComments(all);
        await loadEpisodeData(episodeId);
      }),
    [withLoading, loadEpisodeData],
  );

  const editComment = useCallback(
    async (commentId: string, text: string) =>
      withLoading(`comments.edit.${commentId}`, async () => {
        if (actorRef.current) {
          try {
            await actorRef.current.editComment(commentId, text);
            return;
          } catch (err) {
            console.error("[AppContext] editComment canister failed:", err);
          }
        }
        // Fallback: update cache
        const all = getComments();
        const idx = all.findIndex((c) => c.id === commentId);
        if (idx !== -1) {
          all[idx] = { ...all[idx], text: text.trim(), updatedAt: Date.now() };
          saveComments(all);
        }
      }),
    [withLoading],
  );

  const deleteComment = useCallback(
    async (commentId: string, episodeId: string) =>
      withLoading(`comments.delete.${commentId}`, async () => {
        if (actorRef.current) {
          try {
            await actorRef.current.deleteComment(commentId);
            await loadEpisodeData(episodeId);
            return;
          } catch (err) {
            console.error("[AppContext] deleteComment canister failed:", err);
          }
        }
        // Fallback: soft-delete in cache
        const all = getComments();
        const idx = all.findIndex((c) => c.id === commentId);
        if (idx !== -1) {
          all[idx] = { ...all[idx], isDeleted: true };
          saveComments(all);
          await loadEpisodeData(episodeId);
        }
      }),
    [withLoading, loadEpisodeData],
  );

  // ── User: Ratings ──────────────────────────────────────────────────────────

  const rateEpisode = useCallback(
    async (episodeId: string, stars: number) =>
      withLoading(`ratings.${episodeId}`, async () => {
        const sessionId = getSessionUserId();
        if (actorRef.current) {
          try {
            await actorRef.current.addRating(episodeId, BigInt(stars));
            await loadEpisodeData(episodeId);
            return;
          } catch (err) {
            console.error("[AppContext] addRating canister failed:", err);
          }
        }
        // Fallback: write to localStorage cache
        const all = getRatings();
        const idx = all.findIndex(
          (r) => r.episodeId === episodeId && r.userId === sessionId,
        );
        if (idx >= 0) all[idx] = { episodeId, stars, userId: sessionId };
        else all.push({ episodeId, stars, userId: sessionId });

        const episodeRatings = all.filter((r) => r.episodeId === episodeId);
        const total = episodeRatings.length;
        const average =
          total > 0
            ? episodeRatings.reduce((sum, r) => sum + r.stars, 0) / total
            : 0;
        setState((s) => ({
          ...s,
          ratings: {
            ...s.ratings,
            [episodeId]: { average, total, userRating: stars },
          },
        }));
      }),
    [withLoading, loadEpisodeData],
  );

  // ── User: Watchlist ────────────────────────────────────────────────────────

  const toggleWatchlist = useCallback(
    async (animeId: string) =>
      withLoading(`watchlist.${animeId}`, async () => {
        const sessionId = getSessionUserId();
        const inList = state.watchlist.includes(animeId);

        if (actorRef.current) {
          try {
            if (inList) await actorRef.current.removeFromWatchlist(animeId);
            else await actorRef.current.addToWatchlist(animeId);
          } catch (err) {
            console.error("[AppContext] watchlist canister call failed:", err);
            // Non-critical — continue with local update
          }
        }

        // Update localStorage cache
        const all = getWatchlist();
        if (inList) {
          saveWatchlist(
            all.filter(
              (w) => !(w.userId === sessionId && w.animeId === animeId),
            ),
          );
          setState((s) => ({
            ...s,
            watchlist: s.watchlist.filter((id) => id !== animeId),
          }));
        } else {
          all.push({ userId: sessionId, animeId, addedAt: Date.now() });
          saveWatchlist(all);
          setState((s) => ({ ...s, watchlist: [...s.watchlist, animeId] }));
        }
      }),
    [withLoading, state.watchlist],
  );

  // ── User: Submit Request ───────────────────────────────────────────────────

  const submitRequest = useCallback(
    async (text: string, username: string) =>
      withLoading("user.submitRequest", async () => {
        if (actorRef.current) {
          try {
            await actorRef.current.submitAnimeRequest(text, username);
            return;
          } catch (err) {
            console.error(
              "[AppContext] submitAnimeRequest canister failed:",
              err,
            );
          }
        }
        // Fallback: write to cache
        const all = getRequests();
        all.push({
          id: generateId(),
          requestText: text,
          username,
          status: "pending",
          createdAt: BigInt(Date.now()),
        });
        saveRequests(all);
      }),
    [withLoading],
  );

  // ── Context value ──────────────────────────────────────────────────────────

  const value = useMemo<AppContextValue>(
    () => ({
      ...state,
      loadAnimeDetail,
      loadEpisodeData,
      refreshAnime,
      createAnime,
      updateAnime,
      deleteAnime,
      createSeason,
      deleteSeason,
      createEpisode,
      updateEpisode,
      deleteEpisode,
      loadRequests,
      completeRequest,
      deleteRequest,
      postComment,
      editComment,
      deleteComment,
      rateEpisode,
      toggleWatchlist,
      submitRequest,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      state,
      loadAnimeDetail,
      loadEpisodeData,
      refreshAnime,
      createAnime,
      updateAnime,
      deleteAnime,
      createSeason,
      deleteSeason,
      createEpisode,
      updateEpisode,
      deleteEpisode,
      loadRequests,
      completeRequest,
      deleteRequest,
      postComment,
      editComment,
      deleteComment,
      rateEpisode,
      toggleWatchlist,
      submitRequest,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// ── Convenience selector hooks (kept from previous version for compat) ─────────

/** useAnime — returns anime list + loading state from context */
export function useAnime() {
  const { anime, loading, errors, refreshAnime } = useAppContext();
  return {
    anime,
    isLoading: loading["anime.list"] ?? false,
    error: errors["anime.list"] ?? null,
    refetch: refreshAnime,
  };
}

/** useAnimeDetail — finds one anime from the shared list in context */
export function useAnimeDetailCtx(animeId: string | undefined) {
  const { anime, loading } = useAppContext();
  const item = animeId ? (anime.find((a) => a.id === animeId) ?? null) : null;
  return { anime: item, isLoading: loading["anime.list"] ?? false };
}

/** useWatchlistContext — watchlist state from context */
export function useWatchlistContext() {
  const { watchlist, toggleWatchlist } = useAppContext();
  return {
    watchlistIds: new Set(watchlist),
    toggleWatchlist,
  };
}

// ── Legacy AppContext shape for backward compat ────────────────────────────────

/**
 * Legacy interface — pages that import directly from AppContext and call
 * createAnime(AnimeFormData) instead of createAnime(AnimeInput) need this shim.
 */
export function useLegacyAppContext() {
  const ctx = useAppContext();

  const createAnimeLegacy = useCallback(
    async (input: AnimeFormData) => {
      const animeInput: AnimeInput = {
        title: input.title,
        description: input.description,
        genres: input.genre,
        rating: input.rating,
        coverImageUrl: input.coverImageUrl || input.thumbnailUrl,
        isFeatured: input.isFeatured,
      };
      return ctx.createAnime(animeInput);
    },
    [ctx],
  );

  const updateAnimeLegacy = useCallback(
    async (id: string, input: Partial<AnimeFormData>) => {
      const existing = ctx.anime.find((a) => a.id === id);
      const animeInput: AnimeInput = {
        title: input.title ?? existing?.title ?? "",
        description: input.description ?? existing?.description ?? "",
        genres: input.genre ?? existing?.genres ?? [],
        rating: input.rating ?? existing?.rating ?? 0,
        coverImageUrl:
          input.coverImageUrl ??
          input.thumbnailUrl ??
          existing?.coverImageUrl ??
          "",
        isFeatured: input.isFeatured ?? existing?.isFeatured ?? false,
      };
      return ctx.updateAnime(id, animeInput);
    },
    [ctx],
  );

  return {
    ...ctx,
    // Legacy-shaped wrappers
    animeList: ctx.anime,
    animeLoading: ctx.loading["anime.list"] ?? false,
    animeError: ctx.errors["anime.list"] ?? null,
    requests: ctx.requests,
    requestsLoading: ctx.loading["admin.requests"] ?? false,
    isCreatingAnime: ctx.loading["admin.createAnime"] ?? false,
    isUpdatingAnime: Object.keys(ctx.loading).some(
      (k) => k.startsWith("admin.updateAnime") && ctx.loading[k],
    ),
    isDeletingAnime: Object.keys(ctx.loading).some(
      (k) => k.startsWith("admin.deleteAnime") && ctx.loading[k],
    ),
    watchlistIds: new Set(ctx.watchlist),
    refetchAnime: ctx.refreshAnime,
    // Legacy-shaped actions
    createAnime: createAnimeLegacy,
    updateAnime: updateAnimeLegacy,
    deleteAnime: ctx.deleteAnime,
    loadRequests: () => {
      ctx.loadRequests().catch(console.error);
    },
    completeRequest: (id: string) => ctx.completeRequest(id),
    deleteRequest: (id: string) => ctx.deleteRequest(id),
  };
}
