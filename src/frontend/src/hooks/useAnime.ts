import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createActor } from "../backend";
import type { AnimeInput, AnimePublic } from "../backend.d";
import type { Anime, AnimeFormData } from "../types";

// ── localStorage persistence helpers ─────────────────────────────────────────

export function saveData(key: string, data: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // localStorage may be full or unavailable — fail silently
  }
}

export function loadData<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

// ── Type converters ───────────────────────────────────────────────────────────

/** Convert backend AnimePublic → frontend Anime */
function toAnime(pub: AnimePublic): Anime {
  return {
    id: pub.id,
    title: pub.title,
    description: pub.description,
    genre: pub.genres ?? [],
    rating: pub.rating,
    thumbnailUrl: pub.coverImageUrl,
    coverImageUrl: pub.coverImageUrl,
    isFeatured: pub.isFeatured,
    episodeCount: 0,
    viewCount: Number(pub.viewCount ?? 0),
    releaseYear:
      new Date(Number(pub.createdAt) / 1_000_000).getFullYear() ||
      new Date().getFullYear(),
    status: "ongoing",
    createdAt: Number(pub.createdAt ?? 0),
  };
}

/** Convert frontend AnimeFormData → backend AnimeInput */
function toAnimeInput(form: AnimeFormData): AnimeInput {
  return {
    title: form.title.trim(),
    description: form.description.trim(),
    genres: form.genre,
    rating: form.rating,
    coverImageUrl: form.coverImageUrl.trim() || form.thumbnailUrl.trim(),
    isFeatured: form.isFeatured,
  };
}

// ── Sample data (fallback for cold start / seeding) ───────────────────────────

const SAMPLE_ANIME: Anime[] = [
  {
    id: "1",
    title: "Jujutsu Kaisen",
    description:
      "A boy swallows a cursed talisman — the finger of a Demon — and becomes cursed himself. He enters a shaman's school to be able to locate the missing fingers.",
    genre: ["Action", "Fantasy", "Horror"],
    rating: 4.8,
    thumbnailUrl:
      "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&h=600&fit=crop",
    coverImageUrl:
      "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200&h=600&fit=crop",
    isFeatured: true,
    episodeCount: 24,
    viewCount: 1250000,
    releaseYear: 2020,
    status: "ongoing",
    createdAt: Date.now(),
  },
  {
    id: "2",
    title: "Attack on Titan",
    description:
      "In a world where humanity lives within enormous walled cities to protect themselves from Titans, a young boy vows revenge after his hometown is devastated.",
    genre: ["Action", "Drama", "Fantasy"],
    rating: 4.9,
    thumbnailUrl:
      "https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=400&h=600&fit=crop",
    coverImageUrl:
      "https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=1200&h=600&fit=crop",
    isFeatured: false,
    episodeCount: 87,
    viewCount: 2100000,
    releaseYear: 2013,
    status: "completed",
    createdAt: Date.now(),
  },
  {
    id: "3",
    title: "Demon Slayer",
    description:
      "A family is attacked by demons and only two members survive — Tanjiro and his sister Nezuko, who is turning into a demon slowly. Tanjiro sets out to become a demon slayer.",
    genre: ["Action", "Fantasy", "Adventure"],
    rating: 4.7,
    thumbnailUrl:
      "https://images.unsplash.com/photo-1613376023733-0a73315d9b06?w=400&h=600&fit=crop",
    coverImageUrl:
      "https://images.unsplash.com/photo-1613376023733-0a73315d9b06?w=1200&h=600&fit=crop",
    isFeatured: false,
    episodeCount: 44,
    viewCount: 1800000,
    releaseYear: 2019,
    status: "ongoing",
    createdAt: Date.now(),
  },
  {
    id: "4",
    title: "My Hero Academia",
    description:
      "In a world where most of the population has superpowers (called Quirks), a boy without any abilities dreams of becoming a superhero.",
    genre: ["Action", "Comedy", "School"],
    rating: 4.6,
    thumbnailUrl:
      "https://images.unsplash.com/photo-1542736667-069246bdbc6d?w=400&h=600&fit=crop",
    coverImageUrl:
      "https://images.unsplash.com/photo-1542736667-069246bdbc6d?w=1200&h=600&fit=crop",
    isFeatured: false,
    episodeCount: 138,
    viewCount: 1500000,
    releaseYear: 2016,
    status: "ongoing",
    createdAt: Date.now(),
  },
  {
    id: "5",
    title: "Naruto",
    description:
      "A young ninja with a sealed demon fox spirit inside him dreams of becoming the strongest ninja and leader of his village.",
    genre: ["Action", "Adventure", "Comedy"],
    rating: 4.7,
    thumbnailUrl:
      "https://images.unsplash.com/photo-1604537466158-719b1972feb8?w=400&h=600&fit=crop",
    coverImageUrl:
      "https://images.unsplash.com/photo-1604537466158-719b1972feb8?w=1200&h=600&fit=crop",
    isFeatured: false,
    episodeCount: 220,
    viewCount: 3000000,
    releaseYear: 2002,
    status: "completed",
    createdAt: Date.now(),
  },
  {
    id: "6",
    title: "One Piece",
    description:
      "A boy who gained the powers of a rubber fruit seeks to become king of the pirates and find the ultimate treasure — the One Piece.",
    genre: ["Action", "Adventure", "Comedy"],
    rating: 4.8,
    thumbnailUrl:
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=600&fit=crop",
    coverImageUrl:
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&h=600&fit=crop",
    isFeatured: false,
    episodeCount: 1000,
    viewCount: 4500000,
    releaseYear: 1999,
    status: "ongoing",
    createdAt: Date.now(),
  },
  {
    id: "7",
    title: "Fullmetal Alchemist: Brotherhood",
    description:
      "Two brothers use alchemy to try to bring their dead mother back to life, but it goes wrong and they pay a terrible price. They set off on a quest for the Philosopher's Stone.",
    genre: ["Action", "Adventure", "Drama"],
    rating: 4.9,
    thumbnailUrl:
      "https://images.unsplash.com/photo-1601979031925-424e53b6caaa?w=400&h=600&fit=crop",
    coverImageUrl:
      "https://images.unsplash.com/photo-1601979031925-424e53b6caaa?w=1200&h=600&fit=crop",
    isFeatured: false,
    episodeCount: 64,
    viewCount: 2000000,
    releaseYear: 2009,
    status: "completed",
    createdAt: Date.now(),
  },
  {
    id: "8",
    title: "Tokyo Ghoul",
    description:
      "A college student is attacked by a ghoul and barely survives, only to realize he has become a half-ghoul himself — caught between two worlds.",
    genre: ["Action", "Horror", "Supernatural"],
    rating: 4.3,
    thumbnailUrl:
      "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&h=600&fit=crop",
    coverImageUrl:
      "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=1200&h=600&fit=crop",
    isFeatured: false,
    episodeCount: 48,
    viewCount: 900000,
    releaseYear: 2014,
    status: "completed",
    createdAt: Date.now(),
  },
];

// Keep as a module-level fallback (not mutated for persistence — backend is source of truth)
const animeStore: Anime[] = [...SAMPLE_ANIME];

// ── Queries ───────────────────────────────────────────────────────────────────

export function useAllAnime() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Anime[]>({
    queryKey: ["anime", "all"],
    queryFn: async () => {
      if (!actor) {
        // No actor yet — return localStorage cache or sample data
        return loadData<Anime[]>("anime_cache") ?? [...animeStore];
      }
      try {
        const result = await actor.getAllAnime();
        const list = result.map(toAnime);
        // Merge: if backend returned nothing, prefer cached/sample data so UI isn't empty
        const final =
          list.length > 0
            ? list
            : (loadData<Anime[]>("anime_cache") ?? [...animeStore]);
        saveData("anime_cache", final);
        return final;
      } catch {
        // Backend unreachable — fall back to localStorage cache
        return loadData<Anime[]>("anime_cache") ?? [...animeStore];
      }
    },
    initialData: () => loadData<Anime[]>("anime_cache") ?? undefined,
    enabled: !isFetching,
    staleTime: 30000,
  });
}

export function useFeaturedAnime() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Anime | null>({
    queryKey: ["anime", "featured"],
    queryFn: async () => {
      if (!actor) {
        const cached = loadData<Anime[]>("anime_cache") ?? animeStore;
        return cached.find((a) => a.isFeatured) ?? cached[0] ?? null;
      }
      try {
        const result = await actor.getFeaturedAnime();
        if (result.length > 0) return toAnime(result[0]);
        const cached = loadData<Anime[]>("anime_cache") ?? animeStore;
        return cached.find((a) => a.isFeatured) ?? cached[0] ?? null;
      } catch {
        const cached = loadData<Anime[]>("anime_cache") ?? animeStore;
        return cached.find((a) => a.isFeatured) ?? cached[0] ?? null;
      }
    },
    enabled: !isFetching,
    staleTime: 30000,
  });
}

export function useAnimeDetail(id: string | undefined) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Anime | null>({
    queryKey: ["anime", id],
    queryFn: async () => {
      if (!id) return null;
      if (!actor) {
        const cached = loadData<Anime[]>("anime_cache") ?? animeStore;
        return cached.find((a) => a.id === id) ?? null;
      }
      try {
        const result = await actor.getAnime(id);
        if (result) return toAnime(result);
        const cached = loadData<Anime[]>("anime_cache") ?? animeStore;
        return cached.find((a) => a.id === id) ?? null;
      } catch {
        const cached = loadData<Anime[]>("anime_cache") ?? animeStore;
        return cached.find((a) => a.id === id) ?? null;
      }
    },
    enabled: !!id && !isFetching,
  });
}

export function useSearchAnime(query: string) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Anime[]>({
    queryKey: ["anime", "search", query],
    queryFn: async () => {
      if (!query.trim()) return [];
      if (!actor) {
        const cached = loadData<Anime[]>("anime_cache") ?? animeStore;
        const q = query.toLowerCase();
        return cached.filter(
          (a) =>
            a.title.toLowerCase().includes(q) ||
            a.description.toLowerCase().includes(q) ||
            a.genre.some((g) => g.toLowerCase().includes(q)),
        );
      }
      try {
        const result = await actor.searchAnime(query);
        return result.map(toAnime);
      } catch {
        const cached = loadData<Anime[]>("anime_cache") ?? animeStore;
        const q = query.toLowerCase();
        return cached.filter(
          (a) =>
            a.title.toLowerCase().includes(q) ||
            a.description.toLowerCase().includes(q) ||
            a.genre.some((g) => g.toLowerCase().includes(q)),
        );
      }
    },
    enabled: query.length > 1 && !isFetching,
  });
}

export function useAnimeByGenre(genre: string | null) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Anime[]>({
    queryKey: ["anime", "genre", genre],
    queryFn: async () => {
      if (!genre) {
        const cached = loadData<Anime[]>("anime_cache") ?? animeStore;
        return cached;
      }
      if (!actor) {
        const cached = loadData<Anime[]>("anime_cache") ?? animeStore;
        return cached.filter((a) => a.genre.includes(genre));
      }
      try {
        const result = await actor.filterAnimeByGenre(genre);
        return result.map(toAnime);
      } catch {
        const cached = loadData<Anime[]>("anime_cache") ?? animeStore;
        return cached.filter((a) => a.genre.includes(genre));
      }
    },
    enabled: !isFetching,
  });
}

// Derived queries (client-side sort from all-anime cache)
export function useTrendingAnime() {
  const { data: all = [] } = useAllAnime();
  return useQuery<Anime[]>({
    queryKey: ["anime", "trending"],
    queryFn: async () =>
      [...all].sort((a, b) => b.viewCount - a.viewCount).slice(0, 8),
    enabled: all.length > 0,
    staleTime: 60000,
  });
}

export function useLatestAnime() {
  const { data: all = [] } = useAllAnime();
  return useQuery<Anime[]>({
    queryKey: ["anime", "latest"],
    queryFn: async () =>
      [...all].sort((a, b) => b.createdAt - a.createdAt).slice(0, 8),
    enabled: all.length > 0,
    staleTime: 60000,
  });
}

export function usePopularAnime() {
  const { data: all = [] } = useAllAnime();
  return useQuery<Anime[]>({
    queryKey: ["anime", "popular"],
    queryFn: async () =>
      [...all].sort((a, b) => b.rating - a.rating).slice(0, 8),
    enabled: all.length > 0,
    staleTime: 60000,
  });
}

// ── Mutations ─────────────────────────────────────────────────────────────────

export function useCreateAnime() {
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: AnimeFormData): Promise<Anime> => {
      if (!actor || isFetching)
        throw new Error("Backend is still loading — please wait and try again");
      const input = toAnimeInput(data);
      const result = await actor.createAnime(input);
      const created = toAnime(result);
      // Update localStorage cache immediately
      const current = loadData<Anime[]>("anime_cache") ?? [];
      saveData("anime_cache", [created, ...current]);
      return created;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["anime"] });
    },
  });
}

export function useUpdateAnime() {
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: { id: string; data: Partial<AnimeFormData> }): Promise<Anime> => {
      if (!actor || isFetching)
        throw new Error("Backend is still loading — please wait and try again");
      // Fetch current to merge partial updates
      const current = await actor.getAnime(id);
      if (!current) throw new Error("Anime not found");
      const merged: AnimeFormData = {
        title: data.title ?? current.title,
        description: data.description ?? current.description,
        genre: data.genre ?? current.genres ?? [],
        rating: data.rating ?? current.rating,
        thumbnailUrl: data.thumbnailUrl ?? current.coverImageUrl,
        coverImageUrl: data.coverImageUrl ?? current.coverImageUrl,
        isFeatured: data.isFeatured ?? current.isFeatured,
        releaseYear: data.releaseYear ?? new Date().getFullYear(),
        status: data.status ?? "ongoing",
      };
      const result = await actor.updateAnime(id, toAnimeInput(merged));
      if (!result) throw new Error("Update failed — anime may not exist");
      const updated = toAnime(result);
      // Update localStorage cache immediately
      const cached = loadData<Anime[]>("anime_cache") ?? [];
      const newCache = cached.map((a) => (a.id === id ? updated : a));
      saveData("anime_cache", newCache);
      return updated;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["anime"] });
    },
  });
}

export function useDeleteAnime() {
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      if (!actor || isFetching)
        throw new Error("Backend is still loading — please wait and try again");
      const success = await actor.deleteAnime(id);
      if (!success) throw new Error("Delete failed — anime may not exist");
      // Update localStorage cache immediately
      const cached = loadData<Anime[]>("anime_cache") ?? [];
      saveData(
        "anime_cache",
        cached.filter((a) => a.id !== id),
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["anime"] });
    },
  });
}
