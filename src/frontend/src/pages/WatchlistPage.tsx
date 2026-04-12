import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useNavigate } from "@tanstack/react-router";
import { Bookmark, BookmarkX, Play, Tv2 } from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";
import AnimeCard from "../components/AnimeCard";
import { useAllAnime } from "../hooks/useAnime";
import { useAuth } from "../hooks/useAuth";
import { useRemoveFromWatchlist, useWatchlist } from "../hooks/useWatchlist";
import type { Anime } from "../types";

function WatchlistSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {Array.from({ length: 8 }, (_, i) => `wl-skel-${i}`).map((key) => (
        <div key={key} className="space-y-2">
          <Skeleton className="aspect-[2/3] rounded-lg bg-muted" />
          <Skeleton className="h-3 w-3/4 bg-muted" />
          <Skeleton className="h-3 w-1/2 bg-muted" />
        </div>
      ))}
    </div>
  );
}

function EmptyWatchlist() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-card border border-border rounded-2xl py-24 text-center space-y-6"
      data-ocid="empty-watchlist"
    >
      {/* Illustration */}
      <div className="flex justify-center">
        <div className="relative">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
            <BookmarkX className="w-12 h-12 text-primary/60" />
          </div>
          <div className="absolute -top-1 -right-1 w-8 h-8 bg-muted rounded-full flex items-center justify-center border border-border">
            <Tv2 className="w-4 h-4 text-muted-foreground" />
          </div>
        </div>
      </div>

      <div className="space-y-2 max-w-sm mx-auto px-4">
        <h3 className="font-display font-bold text-2xl text-foreground">
          Your watchlist is empty
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Start saving anime you want to watch later. Browse our catalog and
          click the <span className="text-foreground font-medium">+</span> icon
          on any anime card.
        </p>
      </div>

      <Button
        asChild
        size="lg"
        className="bg-primary hover:bg-primary/90 text-white gap-2 font-semibold"
        data-ocid="empty-watchlist-cta"
      >
        <Link to="/">
          <Play className="w-4 h-4 fill-white" />
          Browse Anime
        </Link>
      </Button>
    </motion.div>
  );
}

export default function WatchlistPage() {
  const { isLoggedIn, principalId, isInitializing } = useAuth();
  const navigate = useNavigate();
  const { data: allAnime = [], isLoading: isAnimeLoading } = useAllAnime();
  const { data: watchlistEntries = [], isLoading: isWatchlistLoading } =
    useWatchlist(principalId);
  const removeFromWatchlist = useRemoveFromWatchlist();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isInitializing && !isLoggedIn) {
      navigate({ to: "/login" });
    }
  }, [isLoggedIn, isInitializing, navigate]);

  const isLoading = isAnimeLoading || isWatchlistLoading || isInitializing;

  // Build watchlist anime list: match watchlist entries to full anime objects
  const watchlistAnimeIds = new Set(watchlistEntries.map((e) => e.animeId));
  const watchlistAnime: Anime[] = allAnime.filter((a) =>
    watchlistAnimeIds.has(a.id),
  );

  const handleRemove = (animeId: string) => {
    if (!principalId) return;
    removeFromWatchlist.mutate({ userId: principalId, animeId });
  };

  // Show loading state while auth is being determined
  if (isInitializing) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center gap-3 mb-8">
          <Skeleton className="w-6 h-6 rounded bg-muted" />
          <Skeleton className="h-8 w-48 bg-muted rounded" />
        </div>
        <WatchlistSkeleton />
      </div>
    );
  }

  if (!isLoggedIn) return null; // redirect in effect

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between mb-8"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-primary/15 rounded-lg flex items-center justify-center">
            <Bookmark className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1
              className="font-display font-black text-3xl text-foreground"
              data-ocid="watchlist-heading"
            >
              My Watchlist
            </h1>
            <p className="text-muted-foreground text-sm">
              {isLoading ? (
                <Skeleton className="h-3 w-24 bg-muted inline-block rounded" />
              ) : (
                <>
                  <span className="text-primary font-semibold">
                    {watchlistAnime.length}
                  </span>{" "}
                  {watchlistAnime.length === 1 ? "series" : "series"} saved
                </>
              )}
            </p>
          </div>
        </div>

        {watchlistAnime.length > 0 && (
          <Button
            asChild
            variant="outline"
            size="sm"
            className="border-border text-muted-foreground hover:text-foreground hover:border-primary/50 gap-2"
          >
            <Link to="/">
              <Play className="w-3.5 h-3.5" />
              Browse More
            </Link>
          </Button>
        )}
      </motion.div>

      {/* Content */}
      {isLoading ? (
        <WatchlistSkeleton />
      ) : watchlistAnime.length === 0 ? (
        <EmptyWatchlist />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
          data-ocid="watchlist-grid"
        >
          {watchlistAnime.map((anime, index) => (
            <motion.div
              key={anime.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: index * 0.06 }}
              className="relative group"
            >
              <AnimeCard
                anime={anime}
                isInWatchlist
                onWatchlistToggle={handleRemove}
              />
              {/* Remove overlay label */}
              <div className="absolute bottom-[4.5rem] left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                <span className="bg-black/80 text-xs text-muted-foreground px-2 py-0.5 rounded-sm">
                  Hover card to remove
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
