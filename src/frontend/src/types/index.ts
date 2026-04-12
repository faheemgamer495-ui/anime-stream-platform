export interface Anime {
  id: string;
  title: string;
  description: string;
  genre: string[];
  rating: number;
  thumbnailUrl: string;
  coverImageUrl: string;
  isFeatured: boolean;
  episodeCount: number;
  viewCount: number;
  releaseYear: number;
  status: "ongoing" | "completed" | "upcoming";
  createdAt: number;
}

export interface Episode {
  id: string;
  animeId: string;
  episodeNumber: number;
  title: string;
  description: string;
  videoUrl: string;
  duration: number;
  thumbnailUrl: string;
  createdAt: number;
  seasonId?: string;
}

export interface Season {
  id: string;
  animeId: string;
  seasonNumber: number;
  name: string;
  createdAt: number;
}

export interface SeasonFormData {
  animeId: string;
  seasonNumber: number;
  name: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: number;
  isAdmin: boolean;
}

export interface WatchlistEntry {
  userId: string;
  animeId: string;
  addedAt: number;
  anime?: Anime;
}

export interface AdConfig {
  id: string;
  placement:
    | "homepage_banner"
    | "video_pre_roll"
    | "video_mid_roll"
    | "sidebar";
  title: string;
  imageUrl: string;
  targetUrl: string;
  videoUrl?: string;
  isEnabled: boolean;
  createdAt: number;
}

export interface AnimeFormData {
  title: string;
  description: string;
  genre: string[];
  rating: number;
  thumbnailUrl: string;
  coverImageUrl: string;
  isFeatured: boolean;
  releaseYear: number;
  status: "ongoing" | "completed" | "upcoming";
}

export interface EpisodeFormData {
  animeId: string;
  episodeNumber: number;
  title: string;
  description: string;
  videoUrl: string;
  duration: number;
  thumbnailUrl: string;
  seasonId?: string;
}

export interface AdminCredentials {
  username: string;
  password: string;
}

export interface Comment {
  id: string;
  episodeId: string;
  authorId: string;
  authorUsername: string;
  text: string;
  createdAt: number;
  updatedAt?: number;
  parentId?: string;
  isDeleted: boolean;
}

export interface RatingsInfo {
  average: number;
  total: number;
  userRating?: number;
}

export interface AnimeRequest {
  id: string;
  requestText: string;
  username: string;
  status: string;
  createdAt: bigint;
}
