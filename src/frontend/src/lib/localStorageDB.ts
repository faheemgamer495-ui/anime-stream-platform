/**
 * localStorageDB — CLIENT-SIDE CACHE ONLY.
 *
 * ⚠️  ALL WRITES MUST GO THROUGH THE CANISTER FIRST.
 *     localStorage is used exclusively for fast initial render (optimistic UI).
 *     Never write here as the primary action — always call the canister first,
 *     then update localStorage as a cache sync.
 *
 * SINGLE STORE ARCHITECTURE (v2):
 *   anime_list, seasons_list, episodes_list — shared between preview & live.
 *   Admin changes are instantly visible on the live site.
 *
 * Backward-compat migration: on first load, merges any data from
 * preview_anime / live_anime (and their season/episode equivalents)
 * into the new unified keys.
 *
 * Shared keys (not mode-specific): comments, ratings, watchlist, requests, ads
 */

import type { Anime, AnimeRequest, Comment, WatchlistEntry } from "../types";

// ── SeasonPublic (defined locally — no ICP dependency) ───────────────────────

export interface SeasonPublic {
  id: string;
  animeId: string;
  seasonNumber: bigint;
  name: string;
  createdAt: bigint;
}

// ── ID generation ─────────────────────────────────────────────────────────────

export function generateId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

// ── Storage keys — SHARED (single store) ─────────────────────────────────────

export const ANIME_KEY = "anime_list";
export const SEASONS_KEY = "seasons_list";
export const EPISODES_KEY = "episodes_list";

// ── Storage keys — Shared / non-mode-specific ─────────────────────────────────

export const COMMENTS_KEY = "anime_stream_comments";
export const RATINGS_KEY = "anime_stream_ratings";
export const REQUESTS_KEY = "anime_stream_requests";
export const WATCHLIST_KEY = "anime_stream_watchlist";
export const ADS_KEY = "anime_stream_ads";

// ── Episode type ──────────────────────────────────────────────────────────────

export interface Episode {
  id: string;
  animeId: string;
  episodeNumber: bigint;
  title: string;
  description: string;
  videoUrl: string;
  duration?: string;
  thumbnailUrl?: string;
  seasonId?: string;
  createdAt: bigint;
}

export interface RatingEntry {
  episodeId: string;
  stars: number;
  userId: string;
}

// ── Generic helpers ────────────────────────────────────────────────────────────

function readKey<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

function writeKey<T>(key: string, data: T[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    console.warn(`[localStorageDB] Failed to write key "${key}"`);
  }
}

// ── Cache eviction — call after successful canister hydration ─────────────────

/**
 * Clears the anime/seasons/episodes cache entries from localStorage.
 * Call this before writing fresh canister data to ensure stale entries
 * are evicted and fresh canister data is the single source of truth.
 */
export function clearAnimeCache(): void {
  try {
    localStorage.removeItem(ANIME_KEY);
    localStorage.removeItem(SEASONS_KEY);
    localStorage.removeItem(EPISODES_KEY);
    console.log("[localStorageDB] Cache cleared (anime, seasons, episodes)");
  } catch {
    console.warn("[localStorageDB] Failed to clear cache");
  }
}

// ── Migration: old dual-store keys → unified store ───────────────────────────

/**
 * Merges preview_* / live_* data (if any) into the unified single store.
 * Also migrates even older anime_stream_* keys.
 * Runs once, guarded by _unified_migrated flag.
 */
export function migrateToPreviewStore(): void {
  if (localStorage.getItem("_unified_migrated") === "1") return;

  const mergeAnime = (): void => {
    const existing = readKey<Anime>(ANIME_KEY);
    if (existing.length > 0) return; // unified store already has data

    // Collect from all possible old keys (newest first for deduplication)
    const sources = ["preview_anime", "live_anime", "anime_stream_anime"];
    const seen = new Set<string>();
    const merged: Anime[] = [];
    for (const src of sources) {
      const items = readKey<Anime>(src);
      for (const item of items) {
        if (!seen.has(item.id)) {
          seen.add(item.id);
          merged.push(item);
        }
      }
    }
    if (merged.length > 0) {
      writeKey(ANIME_KEY, merged);
      console.log(
        `[localStorageDB] Migrated ${merged.length} anime → ${ANIME_KEY}`,
      );
    }
  };

  const mergeSeasons = (): void => {
    const existing = localStorage.getItem(SEASONS_KEY);
    if (existing) return;

    const sources = ["preview_seasons", "live_seasons", "anime_stream_seasons"];
    const seen = new Set<string>();
    const merged: Record<string, unknown>[] = [];
    for (const src of sources) {
      const items = readKey<Record<string, unknown>>(src);
      for (const item of items) {
        const id = String(item.id ?? "");
        if (id && !seen.has(id)) {
          seen.add(id);
          merged.push(item);
        }
      }
    }
    if (merged.length > 0) {
      localStorage.setItem(SEASONS_KEY, JSON.stringify(merged));
      console.log(
        `[localStorageDB] Migrated ${merged.length} seasons → ${SEASONS_KEY}`,
      );
    }
  };

  const mergeEpisodes = (): void => {
    const existing = localStorage.getItem(EPISODES_KEY);
    if (existing) return;

    const sources = [
      "preview_episodes",
      "live_episodes",
      "anime_stream_episodes",
    ];
    const seen = new Set<string>();
    const merged: Record<string, unknown>[] = [];
    for (const src of sources) {
      const items = readKey<Record<string, unknown>>(src);
      for (const item of items) {
        const id = String(item.id ?? "");
        if (id && !seen.has(id)) {
          seen.add(id);
          merged.push(item);
        }
      }
    }
    if (merged.length > 0) {
      localStorage.setItem(EPISODES_KEY, JSON.stringify(merged));
      console.log(
        `[localStorageDB] Migrated ${merged.length} episodes → ${EPISODES_KEY}`,
      );
    }
  };

  mergeAnime();
  mergeSeasons();
  mergeEpisodes();

  localStorage.setItem("_unified_migrated", "1");
}

// ── Anime ─────────────────────────────────────────────────────────────────────

export function getAnimeList(): Anime[] {
  return readKey<Anime>(ANIME_KEY);
}

export function saveAnimeList(list: Anime[]): void {
  writeKey(ANIME_KEY, list);
}

export function upsertAnime(anime: Anime): void {
  const list = getAnimeList();
  const idx = list.findIndex((a) => a.id === anime.id);
  if (idx >= 0) {
    list[idx] = anime;
  } else {
    list.push(anime);
  }
  saveAnimeList(list);
}

export function removeAnime(id: string): void {
  const list = getAnimeList().filter((a) => a.id !== id);
  saveAnimeList(list);
}

// ── Aliases kept for backward compat (point to same store) ───────────────────

export const getLiveAnimeList = getAnimeList;
export const saveLiveAnimeList = saveAnimeList;

// ── Seasons ───────────────────────────────────────────────────────────────────

function deserializeSeasons(raw: Record<string, unknown>[]): SeasonPublic[] {
  return raw.map((r) => ({
    id: String(r.id ?? ""),
    animeId: String(r.animeId ?? ""),
    name: String(r.name ?? ""),
    seasonNumber: BigInt(String(r.seasonNumber ?? 1)),
    createdAt: BigInt(String(r.createdAt ?? Date.now())),
  }));
}

function serializeSeasons(list: SeasonPublic[]): Record<string, unknown>[] {
  return list.map((s) => ({
    ...s,
    seasonNumber: s.seasonNumber.toString(),
    createdAt: s.createdAt.toString(),
  }));
}

export function getSeasonsList(): SeasonPublic[] {
  const raw = readKey<Record<string, unknown>>(SEASONS_KEY);
  return deserializeSeasons(raw);
}

export function saveSeasonsList(list: SeasonPublic[]): void {
  try {
    localStorage.setItem(SEASONS_KEY, JSON.stringify(serializeSeasons(list)));
    console.log(
      "[localStorageDB] Seasons saved:",
      list.length,
      "total entries",
    );
  } catch {
    console.warn(`[localStorageDB] Failed to write key "${SEASONS_KEY}"`);
  }
}

export function getSeasonsByAnime(animeId: string): SeasonPublic[] {
  const result = getSeasonsList()
    .filter((s) => s.animeId === animeId)
    .sort((a, b) => Number(a.seasonNumber) - Number(b.seasonNumber));
  console.log(
    `[localStorageDB] Seasons loaded for animeId ${animeId}:`,
    result.map((s) => ({
      id: s.id,
      seasonNumber: Number(s.seasonNumber),
      name: s.name,
    })),
  );
  return result;
}

export function upsertSeason(season: SeasonPublic): void {
  const list = getSeasonsList();
  const idx = list.findIndex((s) => s.id === season.id);
  if (idx >= 0) {
    list[idx] = season;
  } else {
    list.push(season);
    console.log("[localStorageDB] Season added to localStorage:", {
      id: season.id,
      seasonNumber: Number(season.seasonNumber),
      name: season.name,
    });
  }
  saveSeasonsList(list);
}

export function removeSeason(id: string): void {
  const list = getSeasonsList().filter((s) => s.id !== id);
  saveSeasonsList(list);
}

export function findDuplicateSeason(
  animeId: string,
  seasonNumber: number,
  excludeId?: string,
): SeasonPublic | null {
  const seasons = getSeasonsByAnime(animeId);
  return (
    seasons.find(
      (s) =>
        Number(s.seasonNumber) === seasonNumber &&
        (excludeId ? s.id !== excludeId : true),
    ) ?? null
  );
}

export function nextSeasonNumber(animeId: string): number {
  const seasons = getSeasonsByAnime(animeId);
  if (seasons.length === 0) return 1;
  return Math.max(...seasons.map((s) => Number(s.seasonNumber))) + 1;
}

// ── Seasons aliases (backward compat) ────────────────────────────────────────

export const getLiveSeasonsList = getSeasonsList;
export const saveLiveSeasonsList = saveSeasonsList;

// ── Episodes ──────────────────────────────────────────────────────────────────

function deserializeEpisodes(raw: Record<string, unknown>[]): Episode[] {
  return raw.map((r) => ({
    id: String(r.id ?? ""),
    animeId: String(r.animeId ?? ""),
    episodeNumber: BigInt(String(r.episodeNumber ?? 1)),
    title: String(r.title ?? ""),
    description: String(r.description ?? ""),
    videoUrl: String(r.videoUrl ?? ""),
    duration: r.duration ? String(r.duration) : undefined,
    thumbnailUrl: r.thumbnailUrl ? String(r.thumbnailUrl) : undefined,
    seasonId: r.seasonId ? String(r.seasonId) : undefined,
    createdAt: BigInt(String(r.createdAt ?? Date.now())),
  }));
}

function serializeEpisodes(list: Episode[]): Record<string, unknown>[] {
  return list.map((e) => ({
    ...e,
    episodeNumber: e.episodeNumber.toString(),
    createdAt: e.createdAt.toString(),
  }));
}

export function getEpisodesList(): Episode[] {
  const raw = readKey<Record<string, unknown>>(EPISODES_KEY);
  return deserializeEpisodes(raw);
}

export function saveEpisodesList(list: Episode[]): void {
  try {
    localStorage.setItem(EPISODES_KEY, JSON.stringify(serializeEpisodes(list)));
  } catch {
    console.warn(`[localStorageDB] Failed to write key "${EPISODES_KEY}"`);
  }
}

export function getEpisodesByAnime(animeId: string): Episode[] {
  return getEpisodesList()
    .filter((e) => e.animeId === animeId)
    .sort((a, b) => Number(a.episodeNumber) - Number(b.episodeNumber));
}

export function getEpisodesBySeason(seasonId: string): Episode[] {
  return getEpisodesList()
    .filter((e) => e.seasonId === seasonId)
    .sort((a, b) => Number(a.episodeNumber) - Number(b.episodeNumber));
}

export function upsertEpisode(episode: Episode): void {
  const list = getEpisodesList();
  const idx = list.findIndex((e) => e.id === episode.id);
  if (idx >= 0) {
    list[idx] = episode;
  } else {
    list.push(episode);
  }
  saveEpisodesList(list);
}

export function removeEpisode(id: string): void {
  const list = getEpisodesList().filter((e) => e.id !== id);
  saveEpisodesList(list);
}

export function unlinkEpisodesFromSeason(seasonId: string): void {
  const list = getEpisodesList().map((e) =>
    e.seasonId === seasonId ? { ...e, seasonId: undefined } : e,
  );
  saveEpisodesList(list);
}

// ── Episodes aliases (backward compat) ───────────────────────────────────────

export const getLiveEpisodesList = getEpisodesList;
export const saveLiveEpisodesList = saveEpisodesList;

// ── Comments ──────────────────────────────────────────────────────────────────

export function getComments(): Comment[] {
  return readKey<Comment>(COMMENTS_KEY);
}

export function saveComments(list: Comment[]): void {
  writeKey(COMMENTS_KEY, list);
}

// ── Ratings ───────────────────────────────────────────────────────────────────

export function getRatings(): RatingEntry[] {
  return readKey<RatingEntry>(RATINGS_KEY);
}

export function saveRatings(list: RatingEntry[]): void {
  writeKey(RATINGS_KEY, list);
}

// ── Requests ─────────────────────────────────────────────────────────────────

export function getRequests(): AnimeRequest[] {
  const raw = readKey<Record<string, unknown>>(REQUESTS_KEY);
  return raw.map((r) => ({
    ...(r as unknown as AnimeRequest),
    createdAt: BigInt(
      String((r as Record<string, unknown>).createdAt ?? Date.now()),
    ),
  }));
}

export function saveRequests(list: AnimeRequest[]): void {
  const serializable = list.map((r) => ({
    ...r,
    createdAt: r.createdAt.toString(),
  }));
  try {
    localStorage.setItem(REQUESTS_KEY, JSON.stringify(serializable));
  } catch {
    console.warn(`[localStorageDB] Failed to write key "${REQUESTS_KEY}"`);
  }
}

// ── Watchlist ─────────────────────────────────────────────────────────────────

export function getWatchlist(): WatchlistEntry[] {
  return readKey<WatchlistEntry>(WATCHLIST_KEY);
}

export function saveWatchlist(list: WatchlistEntry[]): void {
  writeKey(WATCHLIST_KEY, list);
}

// ── Ads ───────────────────────────────────────────────────────────────────────

import type { AdConfig } from "../types";

export function getAds(): AdConfig[] {
  return readKey<AdConfig>(ADS_KEY);
}

export function saveAds(list: AdConfig[]): void {
  writeKey(ADS_KEY, list);
}

// ── Seed data ─────────────────────────────────────────────────────────────────

const SAMPLE_ANIME: Anime[] = [
  {
    id: "naruto-001",
    title: "Naruto",
    description:
      "A young ninja named Naruto Uzumaki seeks recognition from his peers and dreams of becoming the Hokage, the leader of his village.",
    genre: ["Action", "Adventure", "Fantasy"],
    rating: 4.5,
    thumbnailUrl: "https://picsum.photos/seed/naruto/300/450",
    coverImageUrl: "https://picsum.photos/seed/naruto-cover/1280/720",
    isFeatured: true,
    episodeCount: 220,
    viewCount: 120000,
    releaseYear: 2002,
    status: "ongoing",
    createdAt: Date.now() - 86400000 * 7,
  },
  {
    id: "aot-002",
    title: "Attack on Titan",
    description:
      "Humanity lives inside cities surrounded by enormous walls protecting them from gigantic man-eating humanoids called Titans.",
    genre: ["Action", "Dark Fantasy", "Drama"],
    rating: 4.8,
    thumbnailUrl: "https://picsum.photos/seed/aot/300/450",
    coverImageUrl: "https://picsum.photos/seed/aot-cover/1280/720",
    isFeatured: false,
    episodeCount: 94,
    viewCount: 200000,
    releaseYear: 2013,
    status: "completed",
    createdAt: Date.now() - 86400000 * 6,
  },
  {
    id: "onepiece-003",
    title: "One Piece",
    description:
      "Monkey D. Luffy sets off on a grand adventure to find the legendary treasure known as the One Piece and become King of the Pirates.",
    genre: ["Adventure", "Comedy", "Action"],
    rating: 4.7,
    thumbnailUrl: "https://picsum.photos/seed/onepiece/300/450",
    coverImageUrl: "https://picsum.photos/seed/onepiece-cover/1280/720",
    isFeatured: true,
    episodeCount: 1000,
    viewCount: 300000,
    releaseYear: 1999,
    status: "ongoing",
    createdAt: Date.now() - 86400000 * 5,
  },
  {
    id: "demonslayer-004",
    title: "Demon Slayer",
    description:
      "Tanjiro Kamado becomes a demon slayer to avenge his family and cure his sister Nezuko who has been transformed into a demon.",
    genre: ["Action", "Supernatural"],
    rating: 4.6,
    thumbnailUrl: "https://picsum.photos/seed/demonslayer/300/450",
    coverImageUrl: "https://picsum.photos/seed/demonslayer-cover/1280/720",
    isFeatured: false,
    episodeCount: 44,
    viewCount: 180000,
    releaseYear: 2019,
    status: "ongoing",
    createdAt: Date.now() - 86400000 * 4,
  },
  {
    id: "dbz-005",
    title: "Dragon Ball Z",
    description:
      "Goku and his friends defend the Earth against an assortment of villains ranging from intergalactic space fighters to magical creatures.",
    genre: ["Action", "Adventure", "Sci-Fi"],
    rating: 4.4,
    thumbnailUrl: "https://picsum.photos/seed/dbz/300/450",
    coverImageUrl: "https://picsum.photos/seed/dbz-cover/1280/720",
    isFeatured: false,
    episodeCount: 291,
    viewCount: 250000,
    releaseYear: 1989,
    status: "completed",
    createdAt: Date.now() - 86400000 * 3,
  },
];

/**
 * seedIfEmpty — seeds the shared store with sample anime ONLY if:
 *   1. localStorage anime_list is empty, AND
 *   2. The caller confirms canister is also empty (pass true for `canisterIsEmpty`).
 *
 * This prevents sample data from overwriting real canister data.
 * When called without argument (legacy / before canister connects), it only
 * seeds if localStorage is empty — canister check happens in AppContext.
 */
export function seedIfEmpty(canisterIsEmpty?: boolean): void {
  const existing = getAnimeList();
  // If canisterIsEmpty is explicitly false, do NOT seed — real data exists in canister
  if (canisterIsEmpty === false) return;
  if (existing.length === 0) {
    saveAnimeList(SAMPLE_ANIME);
    console.log(
      "[localStorageDB] Seeded",
      SAMPLE_ANIME.length,
      "sample anime into shared store",
    );
  }
}

/** Kept for backward compat — same as seedIfEmpty now */
export const seedLiveIfEmpty = seedIfEmpty;

// ── Legacy merge helpers (kept to avoid breaking imports) ────────────────────

export function mergeAnimeFromBackend(backendAnime: Anime[]): Anime[] {
  saveAnimeList(backendAnime);
  return backendAnime;
}

export function mergeEpisodesFromBackend(
  animeId: string,
  backendEpisodes: Episode[],
): Episode[] {
  const all = getEpisodesList();
  const otherAnime = all.filter((e) => e.animeId !== animeId);
  const merged = [...otherAnime, ...backendEpisodes];
  saveEpisodesList(merged);
  return backendEpisodes;
}

export function mergeSeasonsFromBackend(
  animeId: string,
  _backendSeasons: SeasonPublic[],
): SeasonPublic[] {
  // In localStorage-only mode, backend is always empty — just return locals
  return getSeasonsByAnime(animeId);
}
