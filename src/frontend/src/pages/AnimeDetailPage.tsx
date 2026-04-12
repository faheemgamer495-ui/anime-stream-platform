import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  Calendar,
  Check,
  ChevronDown,
  ChevronUp,
  Eye,
  Heart,
  HeartOff,
  Play,
  Star,
  Tv,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { Episode, SeasonPublic } from "../backend.d";
import { useAllAnime, useAnimeDetail } from "../hooks/useAnime";
import { useAuth } from "../hooks/useAuth";
import { useEpisodesByAnime } from "../hooks/useEpisodes";
import { safeSeasonNumber, useSeasonsByAnime } from "../hooks/useSeasons";
import {
  useAddToWatchlist,
  useIsInWatchlist,
  useRemoveFromWatchlist,
} from "../hooks/useWatchlist";
import type { Anime } from "../types";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = rating / (5 / 5) >= star;
          const half = !filled && rating / (5 / 5) > star - 1;
          return (
            <Star
              key={star}
              className={[
                "w-4 h-4",
                filled
                  ? "text-yellow-400 fill-yellow-400"
                  : half
                    ? "text-yellow-400 fill-yellow-400/50"
                    : "text-muted-foreground",
              ].join(" ")}
            />
          );
        })}
      </div>
      <span className="text-sm font-bold text-foreground">
        {rating.toFixed(1)}
      </span>
    </div>
  );
}

function EpisodeCard({
  episode,
  animeId,
  seasonNumber,
  index,
}: {
  episode: Episode;
  animeId: string;
  seasonNumber: number | null;
  index: number;
}) {
  const watchTo =
    seasonNumber !== null
      ? ({
          to: "/watch/$animeId/$seasonNumber/$episodeId",
          params: {
            animeId,
            seasonNumber: String(seasonNumber),
            episodeId: episode.id,
          },
        } as const)
      : ({
          to: "/watch/$animeId/$episodeId",
          params: { animeId, episodeId: episode.id },
        } as const);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link
        {...watchTo}
        className="flex items-start gap-4 bg-card hover:bg-secondary border border-border rounded-xl p-3 transition-colors group"
        data-ocid={`episode-card-${episode.id}`}
      >
        {/* Thumbnail */}
        <div className="shrink-0 relative w-32 h-18 rounded-lg overflow-hidden">
          <img
            src={
              episode.thumbnailUrl ||
              "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&h=225&fit=crop"
            }
            alt={episode.title}
            className="w-32 h-[4.5rem] object-cover scale-hover"
          />
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-primary rounded-full p-2">
              <Play className="w-4 h-4 text-white fill-white" />
            </div>
          </div>
          <div className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] font-mono px-1.5 py-0.5 rounded">
            {episode.duration ?? "—"}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 py-0.5">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-primary font-mono bg-primary/10 px-2 py-0.5 rounded">
              EP {Number(episode.episodeNumber)}
            </span>
          </div>
          <h3 className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors line-clamp-1">
            {episode.title}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
            {episode.description}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}

// ── Season Selector Tabs ──────────────────────────────────────────────────

interface SeasonTabsProps {
  seasons: SeasonPublic[];
  activeSeasonId: string | null;
  onSeasonChange: (id: string) => void;
}

function SeasonTabs({
  seasons,
  activeSeasonId,
  onSeasonChange,
}: SeasonTabsProps) {
  if (seasons.length === 0) return null;

  return (
    <div className="mb-4" data-ocid="detail-season-selector">
      {/* Mobile: dropdown */}
      <div className="block sm:hidden">
        <select
          value={activeSeasonId ?? ""}
          onChange={(e) => onSeasonChange(e.target.value)}
          className="w-full bg-card border border-border text-foreground text-sm rounded-lg h-10 px-3 focus:outline-none focus:border-primary"
          aria-label="Select season"
        >
          {seasons.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      {/* Desktop: tab strip */}
      <div className="hidden sm:flex items-center gap-1.5 flex-wrap">
        {seasons.map((s) => {
          const isActive = s.id === activeSeasonId;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => onSeasonChange(s.id)}
              data-ocid={`detail-season-tab-${s.id}`}
              className={[
                "px-4 py-1.5 rounded-lg text-sm font-semibold transition-all",
                isActive
                  ? "bg-primary text-white shadow-sm"
                  : "bg-card border border-border text-muted-foreground hover:border-primary/50 hover:text-foreground",
              ].join(" ")}
            >
              {s.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function RelatedAnimeCard({ anime }: { anime: Anime }) {
  return (
    <Link
      to="/anime/$id"
      params={{ id: anime.id }}
      data-ocid={`related-anime-${anime.id}`}
    >
      <div className="group relative overflow-hidden rounded-xl bg-card border border-border hover:border-primary/50 transition-all scale-hover">
        <img
          src={anime.thumbnailUrl}
          alt={anime.title}
          className="w-full aspect-[2/3] object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <p className="font-semibold text-sm text-foreground line-clamp-2 leading-tight">
            {anime.title}
          </p>
          <div className="flex items-center gap-1 mt-1">
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            <span className="text-xs text-muted-foreground">
              {anime.rating.toFixed(1)}
            </span>
          </div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="bg-primary rounded-full p-3">
            <Play className="w-5 h-5 text-white fill-white" />
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function AnimeDetailPage() {
  const { id } = useParams({ from: "/anime/$id" });
  const { data: anime, isLoading } = useAnimeDetail(id);
  const { data: episodes = [], isLoading: epsLoading } = useEpisodesByAnime(id);
  const { data: seasons = [] } = useSeasonsByAnime(id);
  const { data: allAnime = [] } = useAllAnime();
  const { isLoggedIn, principalId } = useAuth();
  const { data: isInWatchlist } = useIsInWatchlist(principalId, id);
  const addToWatchlist = useAddToWatchlist();
  const removeFromWatchlist = useRemoveFromWatchlist();
  const [descExpanded, setDescExpanded] = useState(false);
  const [activeSeasonId, setActiveSeasonId] = useState<string | null>(null);

  // Initialize to first season
  useEffect(() => {
    if (activeSeasonId !== null || seasons.length === 0) return;
    setActiveSeasonId(seasons[0].id);
  }, [seasons, activeSeasonId]);

  // Filter episodes by active season; if no seasons, show all
  const displayedEpisodes =
    seasons.length > 0 && activeSeasonId
      ? episodes.filter((ep) => ep.seasonId === activeSeasonId)
      : episodes;

  // Get season number for active season (for links)
  const activeSeason = seasons.find((s) => s.id === activeSeasonId);
  const activeSeasonNumber = activeSeason
    ? safeSeasonNumber(activeSeason.seasonNumber)
    : null;

  // Increment view count on mount
  useEffect(() => {
    if (anime) {
      // In a real backend, call actor.incrementViewCount(id)
    }
  }, [anime]);

  const toggleWatchlist = () => {
    if (!isLoggedIn || !principalId) {
      toast.error("Sign in to manage your watchlist");
      return;
    }
    if (isInWatchlist) {
      removeFromWatchlist.mutate({ userId: principalId, animeId: id });
      toast.success("Removed from watchlist");
    } else {
      addToWatchlist.mutate({ userId: principalId, animeId: id });
      toast.success("Added to watchlist ❤️");
    }
  };

  const relatedAnime = allAnime
    .filter((a) => a.id !== id && a.genre.some((g) => anime?.genre.includes(g)))
    .slice(0, 6);

  const firstEpisode =
    seasons.length > 0 && activeSeasonId
      ? episodes.find((ep) => ep.seasonId === activeSeasonId)
      : episodes[0];

  const descriptionLong = (anime?.description?.length ?? 0) > 180;

  // Build watch link for first episode
  const firstEpisodeLink =
    firstEpisode && activeSeasonNumber !== null
      ? ({
          to: "/watch/$animeId/$seasonNumber/$episodeId",
          params: {
            animeId: id,
            seasonNumber: String(activeSeasonNumber),
            episodeId: firstEpisode.id,
          },
        } as const)
      : firstEpisode
        ? ({
            to: "/watch/$animeId/$episodeId",
            params: { animeId: id, episodeId: firstEpisode.id },
          } as const)
        : null;

  if (isLoading) {
    return (
      <div className="space-y-0">
        <Skeleton className="h-[55vh] w-full bg-muted" />
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-4">
          <Skeleton className="h-8 w-64 bg-muted" />
          <Skeleton className="h-4 w-full bg-muted" />
          <Skeleton className="h-4 w-3/4 bg-muted" />
        </div>
      </div>
    );
  }

  if (!anime) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="font-display text-2xl font-bold text-foreground">
            Anime not found
          </h2>
          <Button asChild variant="outline">
            <Link to="/">Go Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-16" data-ocid="anime-detail-page">
      {/* ── Hero backdrop ─────────────────────────────────────────────── */}
      <div className="relative w-full h-[60vh] min-h-[420px] overflow-hidden">
        <img
          src={anime.coverImageUrl}
          alt={anime.title}
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/70 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/30" />

        {/* Back button */}
        <div className="absolute top-5 left-4 sm:left-8">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="gap-2 bg-black/50 hover:bg-black/70 backdrop-blur-sm text-white border border-white/10"
          >
            <Link to="/">
              <ArrowLeft className="w-4 h-4" />
              Browse
            </Link>
          </Button>
        </div>

        {/* Hero info */}
        <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-8 lg:px-16 pb-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl space-y-4"
          >
            {/* Genre tags */}
            <div className="flex items-center gap-2 flex-wrap">
              {anime.genre.map((g) => (
                <Badge
                  key={g}
                  variant="outline"
                  className="border-primary/50 text-primary bg-primary/10 text-xs font-semibold"
                >
                  {g}
                </Badge>
              ))}
              <Badge
                variant={anime.status === "ongoing" ? "default" : "secondary"}
                className={
                  anime.status === "ongoing"
                    ? "bg-green-500/20 text-green-400 border-green-500/30 border"
                    : anime.status === "completed"
                      ? "bg-muted text-muted-foreground"
                      : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30 border"
                }
              >
                {anime.status.charAt(0).toUpperCase() + anime.status.slice(1)}
              </Badge>
            </div>

            {/* Title */}
            <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-foreground leading-none tracking-tight">
              {anime.title}
            </h1>

            {/* Meta row */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
              <StarRating rating={anime.rating} />
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {anime.releaseYear}
              </span>
              <span className="flex items-center gap-1.5">
                <Tv className="w-3.5 h-3.5" />
                {anime.episodeCount} eps
              </span>
              <span className="flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" />
                {(anime.viewCount / 1000).toFixed(0)}K views
              </span>
              {seasons.length > 0 && (
                <span className="flex items-center gap-1.5 text-primary">
                  <Tv className="w-3.5 h-3.5" />
                  {seasons.length} season{seasons.length !== 1 ? "s" : ""}
                </span>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 flex-wrap">
              {firstEpisodeLink ? (
                <Button
                  asChild
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-white gap-2 glow-accent font-semibold px-6"
                  data-ocid="hero-watch-btn"
                >
                  <Link {...firstEpisodeLink}>
                    <Play className="w-5 h-5 fill-white" />
                    Watch Now
                  </Link>
                </Button>
              ) : (
                <Button size="lg" disabled className="gap-2">
                  <Play className="w-5 h-5" />
                  No Episodes Yet
                </Button>
              )}

              <Button
                variant="secondary"
                size="lg"
                onClick={toggleWatchlist}
                className={[
                  "gap-2 font-semibold transition-all px-6",
                  isInWatchlist
                    ? "bg-primary/20 hover:bg-primary/30 border-primary/50 text-primary border"
                    : "bg-white/10 hover:bg-white/20 border-white/20 text-foreground border",
                ].join(" ")}
                data-ocid="watchlist-toggle-btn"
              >
                {isInWatchlist ? (
                  <>
                    <HeartOff className="w-4 h-4" />
                    Remove
                  </>
                ) : (
                  <>
                    <Heart className="w-4 h-4" />
                    Watchlist
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Main content ──────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left col: synopsis + episodes */}
          <div className="lg:col-span-2 space-y-10">
            {/* Synopsis */}
            <section>
              <h2 className="font-display font-bold text-lg text-foreground mb-3 flex items-center gap-2">
                <span className="w-1 h-5 bg-primary rounded-full inline-block" />
                Synopsis
              </h2>
              <div className="relative">
                <p
                  className={[
                    "text-muted-foreground leading-relaxed text-sm transition-all",
                    !descExpanded && descriptionLong ? "line-clamp-4" : "",
                  ].join(" ")}
                >
                  {anime.description}
                </p>
                {descriptionLong && (
                  <button
                    type="button"
                    onClick={() => setDescExpanded((p) => !p)}
                    className="mt-2 flex items-center gap-1 text-primary text-xs font-semibold hover:text-primary/80 transition-colors"
                    data-ocid="expand-description"
                  >
                    {descExpanded ? (
                      <>
                        <ChevronUp className="w-3.5 h-3.5" /> Show less
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-3.5 h-3.5" /> Read more
                      </>
                    )}
                  </button>
                )}
              </div>
            </section>

            {/* Episodes */}
            <section data-ocid="episodes-section">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-bold text-lg text-foreground flex items-center gap-2">
                  <span className="w-1 h-5 bg-primary rounded-full inline-block" />
                  Episodes
                  <span className="text-sm font-normal text-muted-foreground ml-1">
                    ({displayedEpisodes.length})
                  </span>
                </h2>
              </div>

              {/* Season selector */}
              {seasons.length > 0 && (
                <SeasonTabs
                  seasons={seasons}
                  activeSeasonId={activeSeasonId}
                  onSeasonChange={setActiveSeasonId}
                />
              )}

              {epsLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton
                      key={i}
                      className="h-[5.5rem] w-full bg-muted rounded-xl"
                    />
                  ))}
                </div>
              ) : displayedEpisodes.length === 0 ? (
                <div
                  className="bg-card border border-border rounded-xl py-14 text-center"
                  data-ocid="no-episodes-empty"
                >
                  <Tv className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground font-medium">
                    {seasons.length > 0 && activeSeasonId
                      ? "No episodes available for this season"
                      : "No episodes yet"}
                  </p>
                  <p className="text-xs text-muted-foreground/70 mt-1">
                    Check back soon for new episodes.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {displayedEpisodes.map((ep, idx) => (
                    <EpisodeCard
                      key={ep.id}
                      episode={ep}
                      animeId={anime.id}
                      seasonNumber={activeSeasonNumber}
                      index={idx}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Right col: info sidebar */}
          <div className="space-y-8">
            {/* Anime info card */}
            <div className="bg-card border border-border rounded-xl p-5 space-y-4">
              <h3 className="font-display font-bold text-sm text-foreground uppercase tracking-widest text-muted-foreground">
                Series Info
              </h3>
              <div className="space-y-3 text-sm">
                {[
                  {
                    label: "Rating",
                    value: `${anime.rating.toFixed(1)} / 5.0`,
                  },
                  { label: "Year", value: String(anime.releaseYear) },
                  {
                    label: "Status",
                    value:
                      anime.status.charAt(0).toUpperCase() +
                      anime.status.slice(1),
                  },
                  { label: "Episodes", value: String(anime.episodeCount) },
                  {
                    label: "Views",
                    value: `${(anime.viewCount / 1000).toFixed(0)}K`,
                  },
                  ...(seasons.length > 0
                    ? [
                        {
                          label: "Seasons",
                          value: String(seasons.length),
                        },
                      ]
                    : []),
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="flex justify-between items-center py-2 border-b border-border last:border-0"
                  >
                    <span className="text-muted-foreground">{label}</span>
                    <span className="text-foreground font-semibold">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Season selector for sidebar (only if seasons exist) */}
            {seasons.length > 0 && (
              <div className="bg-card border border-border rounded-xl p-5 space-y-3">
                <h3 className="font-display font-bold text-sm text-muted-foreground uppercase tracking-widest">
                  Seasons
                </h3>
                <div className="space-y-1.5">
                  {seasons.map((s) => {
                    const isActive = s.id === activeSeasonId;
                    const epCount = episodes.filter(
                      (ep) => ep.seasonId === s.id,
                    ).length;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setActiveSeasonId(s.id)}
                        data-ocid={`sidebar-season-${s.id}`}
                        className={[
                          "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-semibold transition-all text-left",
                          isActive
                            ? "bg-primary/20 text-primary border border-primary/30"
                            : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                        ].join(" ")}
                      >
                        <span>{s.name}</span>
                        <span
                          className={[
                            "text-xs font-mono",
                            isActive
                              ? "text-primary/70"
                              : "text-muted-foreground/60",
                          ].join(" ")}
                        >
                          {epCount} ep{epCount !== 1 ? "s" : ""}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Watchlist shortcut */}
            <Button
              onClick={toggleWatchlist}
              className={[
                "w-full gap-2 font-semibold",
                isInWatchlist
                  ? "bg-primary/20 hover:bg-primary/30 border-primary/40 text-primary border"
                  : "bg-primary hover:bg-primary/90 text-white glow-accent",
              ].join(" ")}
              data-ocid="sidebar-watchlist-btn"
            >
              {isInWatchlist ? (
                <>
                  <Check className="w-4 h-4" /> In Your Watchlist
                </>
              ) : (
                <>
                  <Heart className="w-4 h-4" /> Add to Watchlist
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Related anime */}
        {relatedAnime.length > 0 && (
          <section className="mt-14" data-ocid="related-anime-section">
            <h2 className="font-display font-bold text-xl text-foreground mb-6 flex items-center gap-3">
              <span className="w-1 h-6 bg-primary rounded-full inline-block" />
              You Might Also Like
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {relatedAnime.map((a, idx) => (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.07 }}
                >
                  <RelatedAnimeCard anime={a} />
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
