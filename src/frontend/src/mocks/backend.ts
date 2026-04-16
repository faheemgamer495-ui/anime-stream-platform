import type { AdConfigPublic, AnimePublic, Comment, Episode, UserPublic, backendInterface } from "../backend";
import { AdPlacement, AdType } from "../backend";

const now = BigInt(Date.now()) * BigInt(1_000_000);

// ── In-memory comment store for mock ──
let commentStore: Comment[] = [];

const sampleAnime: AnimePublic[] = [
  {
    id: "1",
    title: "Attack on Titan",
    description: "In a world where humanity lives within enormous walled cities to protect themselves from Titans, gigantic humanoid creatures who devour humans, young Eren Yeager vows to exterminate them after one destroys his hometown and kills his mother.",
    genres: ["Action", "Drama", "Fantasy"],
    rating: 9.1,
    coverImageUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&h=600&fit=crop",
    isFeatured: true,
    viewCount: BigInt(1500000),
    createdAt: now,
  },
  {
    id: "2",
    title: "Demon Slayer",
    description: "A young boy becomes a demon slayer after his family is slaughtered and his sister is turned into a demon. He joins the Demon Slayer Corps to find a cure for his sister.",
    genres: ["Action", "Adventure", "Supernatural"],
    rating: 8.9,
    coverImageUrl: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400&h=600&fit=crop",
    isFeatured: true,
    viewCount: BigInt(1200000),
    createdAt: now,
  },
  {
    id: "3",
    title: "My Hero Academia",
    description: "In a world where most people have superpowers known as Quirks, a boy born without any powers dreams of becoming the greatest hero by inheriting the powers of the world's greatest hero.",
    genres: ["Action", "Superhero", "School"],
    rating: 8.4,
    coverImageUrl: "https://images.unsplash.com/photo-1612178537253-bccd437b730e?w=400&h=600&fit=crop",
    isFeatured: false,
    viewCount: BigInt(980000),
    createdAt: now,
  },
  {
    id: "4",
    title: "One Piece",
    description: "Follows the adventures of Monkey D. Luffy and his pirate crew in their search for the greatest treasure, the One Piece, to become the next King of the Pirates.",
    genres: ["Adventure", "Action", "Comedy"],
    rating: 8.9,
    coverImageUrl: "https://images.unsplash.com/photo-1614583225154-5fcdda07019e?w=400&h=600&fit=crop",
    isFeatured: false,
    viewCount: BigInt(2000000),
    createdAt: now,
  },
  {
    id: "5",
    title: "Jujutsu Kaisen",
    description: "A boy swallows a cursed talisman - the finger of a Demon - and becomes cursed himself. He enters a shaman organisation to kill the demon Ryomen Sukuna.",
    genres: ["Action", "Supernatural", "Horror"],
    rating: 8.6,
    coverImageUrl: "https://images.unsplash.com/photo-1560807707-8cc77767d783?w=400&h=600&fit=crop",
    isFeatured: true,
    viewCount: BigInt(1100000),
    createdAt: now,
  },
  {
    id: "6",
    title: "Fullmetal Alchemist: Brotherhood",
    description: "Two brothers search for a Philosopher's Stone after an attempt to revive their deceased mother goes wrong, leaving them in damaged physical forms.",
    genres: ["Action", "Adventure", "Fantasy"],
    rating: 9.1,
    coverImageUrl: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=600&fit=crop",
    isFeatured: false,
    viewCount: BigInt(890000),
    createdAt: now,
  },
];

// Mutable episode store — supports full CRUD, persists for the session
let episodeStore: Episode[] = [
  {
    id: "ep1",
    animeId: "1",
    episodeNumber: BigInt(1),
    title: "To You, in 2000 Years: The Fall of Shiganshina, Part 1",
    description: "The story of Attack on Titan begins. Young Eren Yeager witnesses the fall of Wall Maria.",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    duration: "24:05",
    thumbnailUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=320&h=180&fit=crop",
    createdAt: now,
  },
  {
    id: "ep2",
    animeId: "1",
    episodeNumber: BigInt(2),
    title: "That Day: The Fall of Shiganshina, Part 2",
    description: "Eren and the others escape and vow to take back Wall Maria.",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    duration: "23:50",
    thumbnailUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=320&h=180&fit=crop",
    createdAt: now,
  },
  {
    id: "ep5-1",
    animeId: "5",
    episodeNumber: BigInt(1),
    title: "Ryomen Sukuna",
    description: "Yuji Itadori finds a cursed object at his school and ends up swallowing it to save his friends.",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    duration: "23:42",
    thumbnailUrl: "https://images.unsplash.com/photo-1560807707-8cc77767d783?w=320&h=180&fit=crop",
    createdAt: now,
  },
];

const sampleUser: UserPublic = {
  id: { toString: () => "user-principal-1", toText: () => "user-principal-1", isAnonymous: () => false, compareTo: () => 0 } as unknown as UserPublic["id"],
  username: "AnimeUser",
  email: "user@example.com",
  isAdmin: false,
  createdAt: now,
};

const sampleAds: AdConfigPublic[] = [
  {
    id: "ad1",
    name: "Homepage Banner",
    placement: AdPlacement.homepage,
    adType: AdType.banner,
    imageUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200&h=200&fit=crop",
    targetUrl: "https://example.com",
    isEnabled: true,
  },
];

export const mockBackend: backendInterface = {
  getAllAnime: async () => sampleAnime,
  getFeaturedAnime: async () => sampleAnime.filter(a => a.isFeatured),
  getAnime: async (id) => sampleAnime.find(a => a.id === id) ?? null,
  createAnime: async (_adminToken, input) => ({
    id: "new-" + Date.now(),
    coverImageUrl: input.coverImageUrl,
    title: input.title,
    description: input.description,
    isFeatured: input.isFeatured,
    genres: input.genres,
    rating: input.rating,
    viewCount: BigInt(0),
    createdAt: now,
  }),
  updateAnime: async (_adminToken, id, input) => {
    const existing = sampleAnime.find(a => a.id === id);
    if (!existing) return null;
    return {
      id: existing.id,
      createdAt: existing.createdAt,
      viewCount: existing.viewCount,
      coverImageUrl: input.coverImageUrl,
      title: input.title,
      description: input.description,
      isFeatured: input.isFeatured,
      genres: input.genres,
      rating: input.rating,
    };
  },
  deleteAnime: async () => true,
  searchAnime: async (term) => sampleAnime.filter(a => a.title.toLowerCase().includes(term.toLowerCase())),
  filterAnimeByGenre: async (genre) => sampleAnime.filter(a => a.genres.includes(genre)),
  incrementAnimeViewCount: async () => undefined,

  // Episode CRUD — fully mutable store
  getEpisodesByAnime: async (animeId) =>
    episodeStore.filter(e => e.animeId === animeId),

  getEpisode: async (id) =>
    episodeStore.find(e => e.id === id) ?? null,

  createEpisode: async (_adminToken, input) => {
    const newEp: Episode = {
      id: "ep-" + Date.now(),
      animeId: input.animeId,
      episodeNumber: input.episodeNumber,
      title: input.title,
      description: input.description,
      videoUrl: input.videoUrl,
      duration: input.duration,
      thumbnailUrl: input.thumbnailUrl,
      createdAt: BigInt(Date.now()) * BigInt(1_000_000),
    };
    episodeStore = [...episodeStore, newEp];
    return newEp;
  },

  updateEpisode: async (_adminToken, id, input) => {
    const idx = episodeStore.findIndex(e => e.id === id);
    if (idx === -1) return null;
    episodeStore = episodeStore.map((e, i) =>
      i === idx
        ? {
            ...e,
            animeId: input.animeId,
            episodeNumber: input.episodeNumber,
            title: input.title,
            description: input.description,
            videoUrl: input.videoUrl,
            duration: input.duration,
            thumbnailUrl: input.thumbnailUrl,
          }
        : e,
    );
    return episodeStore.find(e => e.id === id) ?? null;
  },

  deleteEpisode: async (_adminToken, id) => {
    const before = episodeStore.length;
    episodeStore = episodeStore.filter(e => e.id !== id);
    return episodeStore.length < before;
  },

  getUser: async () => null,
  registerUser: async (input) => ({ ...sampleUser, ...input }),
  updateUser: async (input) => ({ ...sampleUser, ...input }),
  listAllUsers: async () => [sampleUser],
  isAdminUser: async () => false,

  getUserWatchlist: async () => [],
  addToWatchlist: async () => undefined,
  removeFromWatchlist: async () => true,
  isInWatchlist: async () => false,

  getAllAds: async () => sampleAds,
  getAdsByPlacement: async (placement) => sampleAds.filter(a => a.placement === placement),
  getEnabledAds: async () => sampleAds.filter(a => a.isEnabled),
  createAdConfig: async (input) => ({ id: "ad-" + Date.now(), ...input }),
  updateAdConfig: async (id, input) => {
    const existing = sampleAds.find(a => a.id === id);
    if (!existing) return null;
    return { ...existing, ...input };
  },
  deleteAdConfig: async () => true,

  aiChat: async (userMessage, _pageContext, _errorContext) => {
    const msg = userMessage.toLowerCase();
    if (msg.includes("video")) return "Try refreshing the page or checking your internet connection. If the video still won't play, try a different browser.";
    if (msg.includes("login")) return "Make sure you're using Internet Identity to log in. Clear your browser cache and try again if issues persist.";
    if (msg.includes("episode")) return "If an episode isn't loading, try refreshing the page. If it's missing, it may not be available yet in our catalog.";
    if (msg.includes("page")) return "Try refreshing the page. If the issue continues, clear your browser cache or try in incognito mode.";
    return "I'm here to help! Try refreshing the page first. If the issue continues, check your internet connection or try again in a few minutes.";
  },

  // ── Comments ──────────────────────────────────────────────────────────────
  getCommentsByEpisode: async (episodeId) =>
    commentStore.filter(c => c.episodeId === episodeId),

  addComment: async (episodeId, text, parentId) => {
    const comment: Comment = {
      id: "cmt-" + Date.now(),
      episodeId,
      authorId: { toText: () => "mock-user", _isPrincipal: true } as unknown as import("@icp-sdk/core/principal").Principal,
      authorUsername: "MockUser",
      text,
      isDeleted: false,
      createdAt: BigInt(Date.now()) * BigInt(1_000_000),
      parentId: parentId ?? undefined,
    };
    commentStore = [...commentStore, comment];
    return comment;
  },

  editComment: async (commentId, newText) => {
    const idx = commentStore.findIndex(c => c.id === commentId);
    if (idx === -1) return null;
    commentStore = commentStore.map((c, i) =>
      i === idx ? { ...c, text: newText, updatedAt: BigInt(Date.now()) * BigInt(1_000_000) } : c
    );
    return commentStore.find(c => c.id === commentId) ?? null;
  },

  deleteComment: async (commentId) => {
    const idx = commentStore.findIndex(c => c.id === commentId);
    if (idx === -1) return false;
    commentStore = commentStore.map((c, i) =>
      i === idx ? { ...c, isDeleted: true } : c
    );
    return true;
  },

  // ── Ratings ───────────────────────────────────────────────────────────────
  addRating: async (_episodeId, _stars) => "ok",

  getRatingsInfo: async () => ({
    average: 0,
    total: BigInt(0),
    userRating: undefined,
  }),

  // ── Anime Requests ────────────────────────────────────────────────────────
  getAnimeRequests: async () => [],
  submitAnimeRequest: async (_requestText, _username) => "req-" + Date.now(),
  markRequestComplete: async () => true,
  deleteAnimeRequest: async () => true,

  // ── Seasons ───────────────────────────────────────────────────────────────
  getSeasonsByAnime: async () => [],
  getSeason: async () => null,
  createSeason: async (_adminToken, input) => ({
    id: "season-" + Date.now(),
    animeId: input.animeId,
    seasonNumber: input.seasonNumber,
    name: input.name,
    createdAt: BigInt(Date.now()) * BigInt(1_000_000),
  }),
  updateSeason: async () => null,
  deleteSeason: async () => true,
  getEpisodesBySeason: async () => [],

  // ── Guest Watchlist ───────────────────────────────────────────────────────
  addToWatchlistGuest: async () => undefined,
  getGuestWatchlist: async () => [],
  isInWatchlistGuest: async () => false,
  removeFromWatchlistGuest: async () => true,

  // ── All Episodes ──────────────────────────────────────────────────────────
  getAllEpisodes: async () => episodeStore,
};
