import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { Check, Info, Play, Plus, Star } from "lucide-react";
import { useEpisodesByAnime } from "../hooks/useEpisodes";
import type { Anime } from "../types";

interface HeroBannerProps {
  anime: Anime;
  onWatchlistToggle?: () => void;
  isInWatchlist?: boolean;
  loading?: boolean;
}

export default function HeroBanner({
  anime,
  onWatchlistToggle,
  isInWatchlist,
  loading,
}: HeroBannerProps) {
  const { data: episodes = [] } = useEpisodesByAnime(anime?.id);
  const firstEpisode = episodes[0];

  if (loading) {
    return (
      <div className="relative w-full h-[60vh] min-h-[400px] bg-muted animate-pulse">
        <div className="absolute inset-0 flex items-end pb-12 px-8">
          <div className="space-y-4 max-w-lg">
            <div className="h-4 w-24 bg-card rounded" />
            <div className="h-10 w-80 bg-card rounded" />
            <div className="h-16 w-full bg-card rounded" />
            <div className="flex gap-3">
              <div className="h-10 w-28 bg-card rounded" />
              <div className="h-10 w-32 bg-card rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative w-full h-[65vh] min-h-[450px] overflow-hidden"
      data-ocid="hero-banner"
    >
      {/* Background image */}
      <img
        src={
          anime.coverImageUrl ||
          "/assets/generated/hero-banner.dim_1920x800.jpg"
        }
        alt={anime.title}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Gradients */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/30" />

      {/* Content */}
      <div className="relative h-full flex items-end pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto w-full">
          <div className="max-w-2xl space-y-4 animate-slide-up">
            {/* Labels */}
            <div className="flex items-center gap-3">
              {anime.isFeatured && (
                <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-sm tracking-widest uppercase">
                  Featured
                </span>
              )}
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-sm font-semibold text-foreground">
                  {anime.rating.toFixed(1)}
                </span>
              </div>
              <span className="text-sm text-muted-foreground">
                {anime.releaseYear}
              </span>
            </div>

            {/* Title */}
            <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-foreground leading-none tracking-tight">
              {anime.title}
            </h1>

            {/* Genres */}
            <div className="flex flex-wrap gap-2">
              {anime.genre.map((g) => (
                <Badge
                  key={g}
                  variant="outline"
                  className="border-border text-muted-foreground text-xs"
                >
                  {g}
                </Badge>
              ))}
            </div>

            {/* Description */}
            <p className="text-muted-foreground text-base leading-relaxed line-clamp-3 max-w-xl">
              {anime.description}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button
                asChild
                size="lg"
                className="bg-primary hover:bg-primary/90 text-white font-bold shadow-accent-glow gap-2"
                data-ocid="hero-watch-now"
              >
                {firstEpisode ? (
                  <Link
                    to="/watch/$animeId/$episodeId"
                    params={{ animeId: anime.id, episodeId: firstEpisode.id }}
                  >
                    <Play className="w-5 h-5 fill-white" />
                    Watch Now
                  </Link>
                ) : (
                  <Link to="/anime/$id" params={{ id: anime.id }}>
                    <Play className="w-5 h-5 fill-white" />
                    Watch Now
                  </Link>
                )}
              </Button>

              {onWatchlistToggle && (
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={onWatchlistToggle}
                  className="bg-white/10 hover:bg-white/20 text-foreground border-white/20 backdrop-blur-sm gap-2"
                  data-ocid="hero-watchlist-toggle"
                >
                  {isInWatchlist ? (
                    <>
                      <Check className="w-5 h-5" /> In Watchlist
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" /> Add to Watchlist
                    </>
                  )}
                </Button>
              )}

              <Button
                variant="ghost"
                size="lg"
                asChild
                className="text-muted-foreground hover:text-foreground gap-2"
              >
                <Link to="/anime/$id" params={{ id: anime.id }}>
                  <Info className="w-5 h-5" />
                  <span className="hidden sm:inline">More Info</span>
                </Link>
              </Button>
            </div>

            {/* Episode count */}
            <p className="text-xs text-muted-foreground">
              {anime.episodeCount} episodes ·{" "}
              {anime.status === "ongoing" ? "Ongoing" : "Completed"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
