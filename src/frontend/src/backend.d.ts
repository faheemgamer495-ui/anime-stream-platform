import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface AdConfigPublic {
    id: AdId;
    placement: AdPlacement;
    name: string;
    targetUrl?: string;
    isEnabled: boolean;
    imageUrl?: string;
    adType: AdType;
    videoUrl?: string;
}
export type Timestamp = bigint;
export interface Comment {
    id: string;
    authorUsername: string;
    isDeleted: boolean;
    authorId: Principal;
    createdAt: Timestamp;
    text: string;
    episodeId: string;
    updatedAt?: Timestamp;
    parentId?: string;
}
export interface UserPublic {
    id: Principal;
    username: string;
    createdAt: Timestamp;
    email?: string;
    isAdmin: boolean;
}
export interface SeasonPublic {
    id: SeasonId;
    name: string;
    createdAt: Timestamp;
    animeId: AnimeId;
    seasonNumber: bigint;
}
export interface AnimePublic {
    id: AnimeId;
    coverImageUrl: string;
    title: string;
    createdAt: Timestamp;
    description: string;
    viewCount: bigint;
    isFeatured: boolean;
    genres: Array<string>;
    rating: number;
}
export interface AdConfigInput {
    placement: AdPlacement;
    name: string;
    targetUrl?: string;
    isEnabled: boolean;
    imageUrl?: string;
    adType: AdType;
    videoUrl?: string;
}
export interface Episode {
    id: EpisodeId;
    title: string;
    duration?: string;
    thumbnailUrl?: string;
    createdAt: Timestamp;
    description: string;
    seasonId?: SeasonId;
    animeId: AnimeId;
    episodeNumber: bigint;
    videoUrl: string;
}
export interface EpisodeInput {
    title: string;
    duration?: string;
    thumbnailUrl?: string;
    description: string;
    seasonId?: SeasonId;
    animeId: AnimeId;
    episodeNumber: bigint;
    videoUrl: string;
}
export interface AnimeRequest {
    id: string;
    status: string;
    username: string;
    createdAt: Timestamp;
    requestText: string;
}
export type SeasonId = string;
export interface AnimeInput {
    coverImageUrl: string;
    title: string;
    description: string;
    isFeatured: boolean;
    genres: Array<string>;
    rating: number;
}
export interface WatchlistEntry {
    userId: Principal;
    animeId: AnimeId;
    addedAt: Timestamp;
}
export type AnimeId = string;
export interface UserInput {
    username: string;
    email?: string;
}
export interface SeasonInput {
    name: string;
    animeId: AnimeId;
    seasonNumber: bigint;
}
export type EpisodeId = string;
export type AdId = string;
export enum AdPlacement {
    postRoll = "postRoll",
    preRoll = "preRoll",
    homepage = "homepage",
    midRoll = "midRoll"
}
export enum AdType {
    video = "video",
    banner = "banner"
}
export interface backendInterface {
    addComment(episodeId: string, text: string, parentId: string | null): Promise<Comment>;
    addRating(episodeId: string, stars: bigint): Promise<string | null>;
    addToWatchlist(animeId: string): Promise<void>;
    aiChat(userMessage: string, pageContext: string, errorContext: string): Promise<string>;
    createAdConfig(input: AdConfigInput): Promise<AdConfigPublic>;
    createAnime(input: AnimeInput): Promise<AnimePublic>;
    createEpisode(adminToken: string, input: EpisodeInput): Promise<Episode>;
    createSeason(adminToken: string, input: SeasonInput): Promise<SeasonPublic>;
    deleteAdConfig(id: string): Promise<boolean>;
    deleteAnime(id: string): Promise<boolean>;
    deleteAnimeRequest(id: string, adminToken: string): Promise<boolean>;
    deleteComment(commentId: string): Promise<boolean>;
    deleteEpisode(adminToken: string, id: string): Promise<boolean>;
    deleteSeason(adminToken: string, id: SeasonId): Promise<boolean>;
    editComment(commentId: string, newText: string): Promise<Comment | null>;
    filterAnimeByGenre(genre: string): Promise<Array<AnimePublic>>;
    getAdsByPlacement(placement: AdPlacement): Promise<Array<AdConfigPublic>>;
    getAllAds(): Promise<Array<AdConfigPublic>>;
    getAllAnime(): Promise<Array<AnimePublic>>;
    getAnime(id: string): Promise<AnimePublic | null>;
    getAnimeRequests(adminToken: string): Promise<Array<AnimeRequest>>;
    getCommentsByEpisode(episodeId: string): Promise<Array<Comment>>;
    getEnabledAds(): Promise<Array<AdConfigPublic>>;
    getEpisode(id: string): Promise<Episode | null>;
    getEpisodesByAnime(animeId: string): Promise<Array<Episode>>;
    getEpisodesBySeason(seasonId: SeasonId): Promise<Array<Episode>>;
    getFeaturedAnime(): Promise<Array<AnimePublic>>;
    getRatingsInfo(episodeId: string): Promise<{
        total: bigint;
        average: number;
        userRating?: bigint;
    }>;
    getSeason(id: SeasonId): Promise<SeasonPublic | null>;
    getSeasonsByAnime(animeId: AnimeId): Promise<Array<SeasonPublic>>;
    getUser(): Promise<UserPublic | null>;
    getUserWatchlist(): Promise<Array<WatchlistEntry>>;
    incrementAnimeViewCount(id: string): Promise<void>;
    isAdminUser(): Promise<boolean>;
    isInWatchlist(animeId: string): Promise<boolean>;
    listAllUsers(): Promise<Array<UserPublic>>;
    markRequestComplete(id: string, adminToken: string): Promise<boolean>;
    registerUser(input: UserInput): Promise<UserPublic>;
    removeFromWatchlist(animeId: string): Promise<boolean>;
    searchAnime(term: string): Promise<Array<AnimePublic>>;
    submitAnimeRequest(requestText: string, username: string): Promise<string>;
    updateAdConfig(id: string, input: AdConfigInput): Promise<AdConfigPublic | null>;
    updateAnime(id: string, input: AnimeInput): Promise<AnimePublic | null>;
    updateEpisode(adminToken: string, id: string, input: EpisodeInput): Promise<Episode | null>;
    updateSeason(adminToken: string, id: SeasonId, input: SeasonInput): Promise<SeasonPublic | null>;
    updateUser(input: UserInput): Promise<UserPublic | null>;
}
