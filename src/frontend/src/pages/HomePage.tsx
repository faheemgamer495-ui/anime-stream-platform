import { useMemo, useState } from "react";
import { toast } from "sonner";
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

export default function HomePage() {
  const [activeGenre, setActiveGenre] = useState<string | null>(null);

  const { data: featured, isLoading: featuredLoading } = useFeaturedAnime();
  const { data: latest = [], isLoading: latestLoading } = useLatestAnime();
  const { data: trending = [], isLoading: trendingLoading } =
    useTrendingAnime();
  const { data: popular = [], isLoading: popularLoading } = usePopularAnime();
  const { data: filtered = [], isLoading: filteredLoading } =
    useAnimeByGenre(activeGenre);
  const { data: allAnime = [] } = useAllAnime();
  const { data: bannerAds = [] } = useAdsByPlacement("homepage_banner");

  const { isLoggedIn, principalId } = useAuth();
  const { data: watchlistEntries = [] } = useWatchlist(
    isLoggedIn ? principalId : null,
  );
  const addToWatchlist = useAddToWatchlist();
  const removeFromWatchlist = useRemoveFromWatchlist();

  // Build a set of watchlisted anime IDs for O(1) lookups
  const watchlistIds = useMemo(
    () => new Set(watchlistEntries.map((e) => e.animeId)),
    [watchlistEntries],
  );

  // Derive watchlist anime for the carousel
  const watchlistAnime = useMemo(
    () => allAnime.filter((a) => watchlistIds.has(a.id)),
    [allAnime, watchlistIds],
  );

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

  const activeBannerAd = bannerAds[0] ?? null;

  return (
    <div className="pb-16" data-ocid="homepage">
      {/* Hero Banner */}
      {featuredLoading ? (
        <HeroBannerSkeleton />
      ) : featured ? (
        <HeroBanner
          anime={featured}
          loading={false}
          onWatchlistToggle={() => handleWatchlistToggle(featured.id)}
          isInWatchlist={watchlistIds.has(featured.id)}
        />
      ) : null}

      {/* Homepage Banner Ad strip — between hero and content */}
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

      {/* Genre filter row */}
      <div className="sticky top-16 z-40 bg-background/90 backdrop-blur-sm border-b border-border py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <GenreFilter
            activeGenre={activeGenre}
            onGenreChange={setActiveGenre}
          />
        </div>
      </div>

      {/* Content sections */}
      <div className="mt-8 space-y-10">
        {activeGenre ? (
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
