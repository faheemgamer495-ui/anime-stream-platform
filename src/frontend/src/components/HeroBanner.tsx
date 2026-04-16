import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Info,
  Play,
  Plus,
  Star,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useEpisodesByAnime } from "../hooks/useEpisodes";
import { safeSeasonNumber, useSeasonsByAnime } from "../hooks/useSeasons";
import type { Anime } from "../types";

interface HeroBannerSlideProps {
  anime: Anime;
  onWatchlistToggle?: () => void;
  isInWatchlist?: boolean;
  isActive: boolean;
}

function HeroSlide({
  anime,
  onWatchlistToggle,
  isInWatchlist,
  isActive,
}: HeroBannerSlideProps) {
  const { data: episodes = [] } = useEpisodesByAnime(anime?.id);
  const { data: seasons = [] } = useSeasonsByAnime(anime?.id);

  const firstSeason = seasons.length > 0 ? seasons[0] : null;
  const firstEpisode = firstSeason
    ? (episodes
        .filter((ep) => ep.seasonId === firstSeason.id)
        .sort((a, b) => (a.episodeNumber < b.episodeNumber ? -1 : 1))[0] ??
      episodes[0])
    : episodes[0];

  const watchLinkProps = firstEpisode
    ? firstSeason
      ? ({
          to: "/watch/$animeId/$seasonNumber/$episodeId",
          params: {
            animeId: anime.id,
            seasonNumber: String(safeSeasonNumber(firstSeason.seasonNumber)),
            episodeId: firstEpisode.id,
          },
        } as const)
      : ({
          to: "/watch/$animeId/$episodeId",
          params: { animeId: anime.id, episodeId: firstEpisode.id },
        } as const)
    : null;

  return (
    <div
      className="absolute inset-0 transition-opacity duration-1000"
      style={{
        opacity: isActive ? 1 : 0,
        pointerEvents: isActive ? "auto" : "none",
      }}
      aria-hidden={!isActive}
    >
      {/* Background image */}
      <img
        src={
          anime.coverImageUrl ||
          "/assets/generated/hero-banner.dim_1920x800.jpg"
        }
        alt={anime.title}
        className="absolute inset-0 w-full h-full object-cover object-center"
      />

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/20" />

      {/* Accent stripe */}
      <div
        className="absolute top-0 left-0 h-full w-1"
        style={{ background: "oklch(0.52 0.23 23)" }}
      />

      {/* Content */}
      <div className="relative h-full flex items-end pb-20 md:pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto w-full">
          <div
            className="max-w-2xl space-y-4"
            style={{
              transform: isActive ? "translateY(0)" : "translateY(16px)",
              opacity: isActive ? 1 : 0,
              transition:
                "transform 0.8s cubic-bezier(0.4,0,0.2,1), opacity 0.8s",
            }}
          >
            {/* Labels row */}
            <div className="flex items-center gap-3 flex-wrap">
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
              {seasons.length > 0 && (
                <span className="text-sm text-muted-foreground">
                  · {seasons.length} Season{seasons.length !== 1 ? "s" : ""}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-foreground leading-none tracking-tight">
              {anime.title}
            </h1>

            {/* Genres */}
            <div className="flex flex-wrap gap-2">
              {anime.genre.slice(0, 4).map((g) => (
                <Badge
                  key={g}
                  variant="outline"
                  className="border-border/60 text-muted-foreground text-xs"
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
                className="bg-primary hover:bg-primary/90 text-white font-bold gap-2 shadow-lg"
                data-ocid="hero-watch-now"
              >
                {watchLinkProps ? (
                  <Link {...watchLinkProps}>
                    <Play className="w-5 h-5 fill-white" />
                    {firstSeason
                      ? `Play S${safeSeasonNumber(firstSeason.seasonNumber)} E1`
                      : "Watch Now"}
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

interface HeroBannerProps {
  animeList: Anime[];
  onWatchlistToggle?: (animeId: string) => void;
  watchlistIds?: Set<string>;
  loading?: boolean;
}

export default function HeroBanner({
  animeList,
  onWatchlistToggle,
  watchlistIds,
  loading,
}: HeroBannerProps) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const count = animeList.length;

  const go = useCallback(
    (idx: number) => setCurrent(((idx % count) + count) % count),
    [count],
  );
  const prev = useCallback(() => go(current - 1), [current, go]);
  const next = useCallback(() => go(current + 1), [current, go]);

  useEffect(() => {
    if (paused || count <= 1) return;
    timerRef.current = setInterval(
      () => setCurrent((c) => (c + 1) % count),
      5000,
    );
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused, count]);

  if (loading) {
    return (
      <div
        className="relative w-full bg-muted animate-pulse"
        style={{ height: "clamp(300px,60vh,600px)" }}
      >
        <div className="absolute bottom-16 left-8 space-y-4 max-w-lg">
          <div className="h-5 w-24 bg-card rounded" />
          <div className="h-14 w-96 bg-card rounded" />
          <div className="h-4 w-full bg-card rounded" />
          <div className="h-4 w-3/4 bg-card rounded" />
          <div className="flex gap-3 pt-2">
            <div className="h-11 w-32 bg-card rounded" />
            <div className="h-11 w-40 bg-card rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!count) return null;

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ height: "clamp(340px,65vh,680px)" }}
      data-ocid="hero-banner"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Slides */}
      {animeList.map((anime, i) => (
        <HeroSlide
          key={anime.id}
          anime={anime}
          isActive={i === current}
          onWatchlistToggle={
            onWatchlistToggle ? () => onWatchlistToggle(anime.id) : undefined
          }
          isInWatchlist={watchlistIds?.has(anime.id)}
        />
      ))}

      {/* Left arrow */}
      {count > 1 && (
        <button
          type="button"
          className="hero-slider-nav left-4"
          onClick={prev}
          aria-label="Previous slide"
          data-ocid="hero-prev"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {/* Right arrow */}
      {count > 1 && (
        <button
          type="button"
          className="hero-slider-nav right-4"
          onClick={next}
          aria-label="Next slide"
          data-ocid="hero-next"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Dot indicators */}
      {count > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
          {animeList.map((a, i) => (
            <button
              key={a.id}
              type="button"
              onClick={() => go(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`hero-dot-indicator ${i === current ? "active" : ""}`}
              data-ocid={`hero-dot.${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
