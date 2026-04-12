import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import type { Anime } from "../types";
import AnimeCard from "./AnimeCard";

interface CarouselSectionProps {
  title: string;
  anime: Anime[];
  onWatchlistToggle?: (animeId: string) => void;
  watchlistIds?: Set<string>;
  loading?: boolean;
}

export default function CarouselSection({
  title,
  anime,
  onWatchlistToggle,
  watchlistIds,
  loading,
}: CarouselSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.8;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <section
      className="space-y-4"
      data-ocid={`carousel-${title.toLowerCase().replace(/\s+/g, "-")}`}
    >
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8">
        <h2 className="font-display font-bold text-xl text-foreground">
          {title}
        </h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="w-8 h-8 p-0 border-border bg-card hover:bg-secondary hover:text-foreground"
            onClick={() => scroll("left")}
            aria-label="Scroll left"
            data-ocid="carousel-prev"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-8 h-8 p-0 border-border bg-card hover:bg-secondary hover:text-foreground"
            onClick={() => scroll("right")}
            aria-label="Scroll right"
            data-ocid="carousel-next"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto pb-2 px-4 sm:px-6 lg:px-8 scrollbar-hide scroll-smooth"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {loading
          ? Array.from({ length: 6 }, (_, i) => `skel-${i}`).map((key) => (
              <div
                key={key}
                className="shrink-0 w-36 sm:w-44 md:w-48 bg-card rounded-lg overflow-hidden animate-pulse"
              >
                <div className="aspect-[2/3] bg-muted" />
                <div className="p-3 space-y-2">
                  <div className="h-3 bg-muted rounded w-3/4" />
                  <div className="h-2 bg-muted rounded w-1/2" />
                </div>
              </div>
            ))
          : anime.map((a) => (
              <div key={a.id} className="shrink-0 w-36 sm:w-44 md:w-48">
                <AnimeCard
                  anime={a}
                  onWatchlistToggle={onWatchlistToggle}
                  isInWatchlist={watchlistIds?.has(a.id)}
                />
              </div>
            ))}
      </div>
    </section>
  );
}
