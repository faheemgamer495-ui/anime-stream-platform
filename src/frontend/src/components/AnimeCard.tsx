import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { Check, Play, Plus, Star } from "lucide-react";
import { useState } from "react";
import type { Anime } from "../types";

interface AnimeCardProps {
  anime: Anime;
  onWatchlistToggle?: (animeId: string) => void;
  isInWatchlist?: boolean;
  compact?: boolean;
}

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&h=600&fit=crop";

export default function AnimeCard({
  anime,
  onWatchlistToggle,
  isInWatchlist,
  compact,
}: AnimeCardProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      className="group relative bg-card rounded-lg overflow-hidden cursor-pointer scale-hover"
      data-ocid={`anime-card-${anime.id}`}
    >
      <Link to="/anime/$id" params={{ id: anime.id }} className="block">
        {/* Thumbnail */}
        <div className="relative aspect-[2/3] overflow-hidden bg-muted">
          <img
            src={
              imgError || !anime.thumbnailUrl
                ? FALLBACK_IMG
                : anime.thumbnailUrl
            }
            alt={anime.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
            onError={() => setImgError(true)}
          />

          {/* Hover gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Play button */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-primary/90 rounded-full p-3 shadow-lg glow-accent">
              <Play className="w-6 h-6 text-white fill-white" />
            </div>
          </div>

          {/* Status badge */}
          {anime.status === "ongoing" && (
            <div className="absolute top-2 left-2">
              <span className="bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-sm uppercase tracking-wide">
                New
              </span>
            </div>
          )}

          {/* View count */}
          <div className="absolute top-2 right-2 bg-black/60 rounded px-1.5 py-0.5 flex items-center gap-1">
            <Play className="w-2.5 h-2.5 text-muted-foreground fill-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              {anime.viewCount >= 1000000
                ? `${(anime.viewCount / 1000000).toFixed(1)}M`
                : `${Math.max(0, Math.floor(anime.viewCount / 1000))}K`}
            </span>
          </div>
        </div>

        {/* Info */}
        {!compact && (
          <div className="p-3 space-y-1.5">
            <h3 className="font-display font-semibold text-foreground text-sm leading-tight truncate group-hover:text-primary transition-colors duration-200">
              {anime.title}
            </h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                <span className="text-xs text-muted-foreground">
                  {anime.rating.toFixed(1)}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">
                {anime.episodeCount} eps
              </span>
            </div>
            <div className="flex flex-wrap gap-1">
              {anime.genre.slice(0, 2).map((g) => (
                <Badge
                  key={g}
                  variant="secondary"
                  className="text-xs px-1.5 py-0 bg-secondary/80 text-secondary-foreground"
                >
                  {g}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </Link>

      {/* Watchlist button (hover) */}
      {onWatchlistToggle && (
        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Button
            variant="secondary"
            size="sm"
            className="h-7 w-7 p-0 bg-card/90 hover:bg-primary hover:text-white border-border"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onWatchlistToggle(anime.id);
            }}
            aria-label={
              isInWatchlist ? "Remove from watchlist" : "Add to watchlist"
            }
            data-ocid={`watchlist-toggle-${anime.id}`}
          >
            {isInWatchlist ? (
              <Check className="w-3.5 h-3.5" />
            ) : (
              <Plus className="w-3.5 h-3.5" />
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
