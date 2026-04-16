import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Clock, RefreshCw, Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import AnimeCard from "../components/AnimeCard";
import CarouselSection from "../components/CarouselSection";
import GenreFilter from "../components/GenreFilter";
import HeroBanner from "../components/HeroBanner";
import {
  CarouselSkeleton,
  HeroBannerSkeleton,
} from "../components/LoadingSkeleton";
import { useAdsByPlacement } from "../hooks/useAds";
import {
  useAllAnime,
  useAnimeByGenre,
  useFeaturedAnime,
  useLatestAnime,
  usePopularAnime,
  useTrendingAnime,
} from "../hooks/useAnime";
import { useAuth } from "../hooks/useAuth";
import {
  useAddToWatchlist,
  useRemoveFromWatchlist,
  useWatchlist,
} from "../hooks/useWatchlist";
import type { Anime } from "../types";

export default function HomePage() {
  const [activeGenre, setActiveGenre] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search input — update debounced value after 300ms
  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    clearTimeout(window._searchDebounce);
    window._searchDebounce = setTimeout(
      () => setDebouncedSearch(val),
      300,
    ) as unknown as number;
  };

  const { data: featured, isLoading: featuredLoading } = useFeaturedAnime();
  const { data: latest = [], isLoading: latestLoading } = useLatestAnime();
  const { data: trending = [], isLoading: trendingLoading } =
    useTrendingAnime();
  const { data: popular = [], isLoading: popularLoading } = usePopularAnime();
  const { data: filtered = [], isLoading: filteredLoading } =
    useAnimeByGenre(activeGenre);
  const {
    data: allAnime = [],
    isLoading: allAnimeLoading,
    error: allAnimeError,
    refetch: refetchAll,
  } = useAllAnime();
  const { data: bannerAds = [] } = useAdsByPlacement("homepage_banner");

  const { isLoggedIn, principalId } = useAuth();
  const { data: watchlistEntries = [] } = useWatchlist(
    isLoggedIn ? principalId : null,
  );
  const addToWatchlist = useAddToWatchlist();
  const removeFromWatchlist = useRemoveFromWatchlist();

  const watchlistIds = useMemo(
    () => new Set(watchlistEntries.map((e) => e.animeId)),
    [watchlistEntries],
  );

  const watchlistAnime = useMemo(
    () => allAnime.filter((a) => watchlistIds.has(a.id)),
    [allAnime, watchlistIds],
  );

  // Real-time search filter against shared anime store
  const searchResults = useMemo(() => {
    if (!debouncedSearch.trim()) return [];
    const q = debouncedSearch.toLowerCase();
    return allAnime.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.genre.some((g) => g.toLowerCase().includes(q)),
    );
  }, [allAnime, debouncedSearch]);

  const isSearching = debouncedSearch.trim().length > 0;

  const handleWatchlistToggle = (animeId: string) => {
    if (!isLoggedIn || !principalId) {
      toast.error("Sign in to manage your watchlist");
      return;
    }
    const isIn = watchlistIds.has(animeId);
    if (isIn) {
      removeFromWatchlist.mutate({ userId: principalId, animeId });
      toast.success("Removed from watchlist");
    } else {
      addToWatchlist.mutate({ userId: principalId, animeId });
      toast.success("Added to watchlist");
    }
  };

  // Build hero slider list: featured first, then fill from latest up to 5
  const heroAnimeList = useMemo(() => {
    const heroSet = new Set<string>();
    const heroList: Anime[] = [];
    if (featured) {
      heroList.push(featured);
      heroSet.add(featured.id);
    }
    for (const a of latest.slice(0, 5)) {
      if (!heroSet.has(a.id)) {
        heroList.push(a);
        heroSet.add(a.id);
      }
      if (heroList.length >= 5) break;
    }
    return heroList;
  }, [featured, latest]);

  const activeBannerAd = bannerAds[0] ?? null;
  const isContentLoading = allAnimeLoading && allAnime.length === 0;
  const showErrorBanner =
    !isContentLoading && allAnimeError !== null && allAnime.length === 0;

  return (
    <div className="pb-16" data-ocid="homepage">
      {/* Hero Banner — shows featured + top anime as slider */}
      {featuredLoading ? (
        <HeroBannerSkeleton />
      ) : heroAnimeList.length > 0 ? (
        <HeroBanner
          animeList={heroAnimeList}
          onWatchlistToggle={handleWatchlistToggle}
          watchlistIds={watchlistIds}
        />
      ) : null}

      {/* Homepage Banner Ad strip */}
      {activeBannerAd && (
        <a
          href={activeBannerAd.targetUrl}
          className="block relative overflow-hidden group"
          target="_blank"
          rel="noopener noreferrer"
          data-ocid="homepage-banner-ad"
        >
          <img
            src={activeBannerAd.imageUrl}
            alt={activeBannerAd.title}
            className="w-full h-16 sm:h-20 object-cover brightness-75 group-hover:brightness-90 transition-[filter] duration-300"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="font-display font-bold text-white text-sm sm:text-base tracking-wide drop-shadow-lg">
              {activeBannerAd.title}
            </p>
          </div>
          <span className="absolute top-1.5 right-2 bg-black/60 text-[10px] text-muted-foreground px-1.5 py-0.5 rounded uppercase tracking-wide">
            Ad
          </span>
        </a>
      )}

      {/* Search + Genre filter row */}
      <div className="sticky top-16 z-40 bg-background/90 backdrop-blur-sm border-b border-border py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row gap-3">
          {/* Search bar */}
          <div
            className="relative w-full sm:max-w-xs"
            data-ocid="homepage-search"
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              type="text"
              placeholder="Search anime..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-9 pr-8 bg-secondary/50 border-border focus:border-primary/50 text-foreground h-9"
              data-ocid="homepage-search-input"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setDebouncedSearch("");
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          {/* Genre filter — hide when searching */}
          {!isSearching && (
            <div className="flex-1">
              <GenreFilter
                activeGenre={activeGenre}
                onGenreChange={setActiveGenre}
              />
            </div>
          )}
        </div>
      </div>

      {/* Backend error banner */}
      {showErrorBanner && (
        <div
          className="mx-4 sm:mx-6 lg:mx-8 mt-8 max-w-7xl xl:mx-auto rounded-lg border border-primary/40 bg-primary/10 px-5 py-4 flex items-center gap-3"
          data-ocid="anime-load-error"
          role="alert"
        >
          <svg
            className="w-5 h-5 shrink-0 text-primary"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <p className="text-sm text-foreground flex-1">
            <span className="font-semibold text-primary">
              Content is loading.{" "}
            </span>
            If nothing appears, add anime from the admin panel at /preview.
          </p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => refetchAll()}
            className="shrink-0 border-primary/40 text-primary hover:bg-primary/10 gap-1.5"
            data-ocid="anime-load-error-refresh"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Retry
          </Button>
        </div>
      )}

      {/* Content sections */}
      <div className="mt-8 space-y-10">
        {/* Search results view */}
        {isSearching ? (
          <section className="px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <h2 className="font-display font-bold text-xl text-foreground mb-5 flex items-center gap-2">
                <span className="w-1 h-5 bg-primary rounded-full inline-block" />
                Search results for &ldquo;{debouncedSearch}&rdquo;
                <span className="text-sm font-normal text-muted-foreground ml-1">
                  ({searchResults.length})
                </span>
              </h2>
              {allAnimeLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {["a", "b", "c", "d", "e", "f"].map((key) => (
                    <div
                      key={key}
                      className="aspect-[2/3] bg-muted animate-pulse rounded-lg"
                    />
                  ))}
                </div>
              ) : searchResults.length === 0 ? (
                <div
                  className="bg-card border border-border rounded-xl py-14 text-center"
                  data-ocid="search-empty"
                >
                  <Search className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-40" />
                  <p className="text-muted-foreground font-medium">
                    No anime found for &ldquo;{debouncedSearch}&rdquo;
                  </p>
                  <p className="text-xs text-muted-foreground/60 mt-1">
                    Try a different title or genre
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {searchResults.map((a) => (
                    <AnimeCard
                      key={a.id}
                      anime={a}
                      onWatchlistToggle={handleWatchlistToggle}
                      isInWatchlist={watchlistIds.has(a.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </section>
        ) : activeGenre ? (
          /* Genre-filtered view */
          filteredLoading ? (
            <CarouselSkeleton title={`${activeGenre} Anime`} />
          ) : (
            <CarouselSection
              title={`${activeGenre} Anime`}
              anime={filtered}
              loading={false}
              onWatchlistToggle={handleWatchlistToggle}
              watchlistIds={watchlistIds}
            />
          )
        ) : (
          <>
            {/* Loading skeletons while initial data is fetching */}
            {isContentLoading ? (
              <>
                <CarouselSkeleton title="Latest Anime" />
                <CarouselSkeleton title="Trending Now" />
                <CarouselSkeleton title="Popular Series" />
              </>
            ) : allAnime.length === 0 && !allAnimeLoading ? (
              /* Empty store — admin needs to add content */
              <div className="px-4 sm:px-6 lg:px-8">
                <div
                  className="max-w-7xl mx-auto bg-card border border-border rounded-xl py-20 text-center"
                  data-ocid="anime-empty-state"
                >
                  <div className="text-5xl mb-5">🎌</div>
                  <h3 className="font-display font-bold text-foreground text-2xl mb-3">
                    Coming Soon
                  </h3>
                  <p className="text-muted-foreground text-sm max-w-sm mx-auto leading-relaxed">
                    Our anime library is being prepared. Visit the admin panel
                    at <strong>/preview</strong> to add content.
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* Latest Anime */}
                {latestLoading ? (
                  <CarouselSkeleton title="Latest Anime" />
                ) : (
                  <CarouselSection
                    title="Latest Anime"
                    anime={latest}
                    loading={false}
                    onWatchlistToggle={handleWatchlistToggle}
                    watchlistIds={watchlistIds}
                  />
                )}

                {/* Trending Now */}
                {trendingLoading ? (
                  <CarouselSkeleton title="Trending Now" />
                ) : (
                  <CarouselSection
                    title="Trending Now"
                    anime={trending}
                    loading={false}
                    onWatchlistToggle={handleWatchlistToggle}
                    watchlistIds={watchlistIds}
                  />
                )}

                {/* Popular Series */}
                {popularLoading ? (
                  <CarouselSkeleton title="Popular Series" />
                ) : (
                  <CarouselSection
                    title="Popular Series"
                    anime={popular}
                    loading={false}
                    onWatchlistToggle={handleWatchlistToggle}
                    watchlistIds={watchlistIds}
                  />
                )}

                {/* Continue Watching placeholder */}
                <section
                  className="px-4 sm:px-6 lg:px-8"
                  data-ocid="continue-watching-section"
                >
                  <div className="max-w-7xl mx-auto">
                    <h2 className="font-display font-bold text-xl text-foreground mb-4 flex items-center gap-2">
                      <span className="w-1 h-5 bg-primary rounded-full inline-block" />
                      Continue Watching
                    </h2>
                    <div className="bg-card border border-border rounded-xl py-10 px-6 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Clock className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-foreground font-semibold text-sm">
                          Start watching to see your progress here
                        </p>
                        <p className="text-muted-foreground text-xs mt-0.5">
                          Your recently watched episodes will appear in this
                          section
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Your Watchlist — only for logged-in users */}
                {isLoggedIn && (
                  <section className="space-y-4" data-ocid="watchlist-section">
                    {watchlistAnime.length > 0 ? (
                      <CarouselSection
                        title="Your Watchlist"
                        anime={watchlistAnime}
                        loading={false}
                        onWatchlistToggle={handleWatchlistToggle}
                        watchlistIds={watchlistIds}
                      />
                    ) : (
                      <WatchlistEmptyState />
                    )}
                  </section>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function WatchlistEmptyState() {
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-display font-bold text-xl text-foreground mb-4">
          Your Watchlist
        </h2>
        <div
          className="bg-card border border-border rounded-xl py-12 px-6 text-center"
          data-ocid="watchlist-empty"
        >
          <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🎬</span>
          </div>
          <h3 className="font-display font-semibold text-foreground text-lg mb-2">
            Your watchlist is empty
          </h3>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto">
            Browse anime and click the <strong>+</strong> button to save titles
            you want to watch later.
          </p>
        </div>
      </div>
    </div>
  );
}

// Extend window type for debounce timer
declare global {
  interface Window {
    _searchDebounce: number;
  }
}
