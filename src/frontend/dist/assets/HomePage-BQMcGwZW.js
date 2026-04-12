import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, B as Button, L as Link, u as useFeaturedAnime, a as useLatestAnime, b as useTrendingAnime, d as usePopularAnime, e as useAnimeByGenre, f as useAllAnime, g as useAuth, H as HeroBannerSkeleton, G as GenreFilter, C as CarouselSkeleton, h as ue } from "./index-DnVaqzJ1.js";
import { A as AnimeCard } from "./AnimeCard-rda2pCI2.js";
import { B as Badge } from "./badge-CO852Axe.js";
import { u as useEpisodesByAnime } from "./useEpisodes-BgQq_7c_.js";
import { S as Star } from "./star-D8XNwk1f.js";
import { P as Play } from "./play-DTkjahAx.js";
import { C as Check } from "./check-BkIFvmcv.js";
import { P as Plus } from "./plus-DHvAjDJW.js";
import { I as Info } from "./info-CI9jiliE.js";
import { u as useAdsByPlacement } from "./useAds-BXyexzn5.js";
import { u as useWatchlist, a as useAddToWatchlist, b as useRemoveFromWatchlist } from "./useWatchlist-uUDa_x2O.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [["path", { d: "m15 18-6-6 6-6", key: "1wnfg3" }]];
const ChevronLeft = createLucideIcon("chevron-left", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [["path", { d: "m9 18 6-6-6-6", key: "mthhwq" }]];
const ChevronRight = createLucideIcon("chevron-right", __iconNode);
function CarouselSection({
  title,
  anime,
  onWatchlistToggle,
  watchlistIds,
  loading
}) {
  const scrollRef = reactExports.useRef(null);
  const scroll = (dir) => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.8;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth"
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "section",
    {
      className: "space-y-4",
      "data-ocid": `carousel-${title.toLowerCase().replace(/\s+/g, "-")}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-4 sm:px-6 lg:px-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-xl text-foreground", children: title }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                size: "sm",
                className: "w-8 h-8 p-0 border-border bg-card hover:bg-secondary hover:text-foreground",
                onClick: () => scroll("left"),
                "aria-label": "Scroll left",
                "data-ocid": "carousel-prev",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "w-4 h-4" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                size: "sm",
                className: "w-8 h-8 p-0 border-border bg-card hover:bg-secondary hover:text-foreground",
                onClick: () => scroll("right"),
                "aria-label": "Scroll right",
                "data-ocid": "carousel-next",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-4 h-4" })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            ref: scrollRef,
            className: "flex gap-3 overflow-x-auto pb-2 px-4 sm:px-6 lg:px-8 scrollbar-hide scroll-smooth",
            style: { scrollbarWidth: "none", msOverflowStyle: "none" },
            children: loading ? Array.from({ length: 6 }, (_, i) => `skel-${i}`).map((key) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "shrink-0 w-36 sm:w-44 md:w-48 bg-card rounded-lg overflow-hidden animate-pulse",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-[2/3] bg-muted" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 space-y-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-3 bg-muted rounded w-3/4" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 bg-muted rounded w-1/2" })
                  ] })
                ]
              },
              key
            )) : anime.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "shrink-0 w-36 sm:w-44 md:w-48", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              AnimeCard,
              {
                anime: a,
                onWatchlistToggle,
                isInWatchlist: watchlistIds == null ? void 0 : watchlistIds.has(a.id)
              }
            ) }, a.id))
          }
        )
      ]
    }
  );
}
function HeroBanner({
  anime,
  onWatchlistToggle,
  isInWatchlist,
  loading
}) {
  const { data: episodes = [] } = useEpisodesByAnime(anime == null ? void 0 : anime.id);
  const firstEpisode = episodes[0];
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative w-full h-[60vh] min-h-[400px] bg-muted animate-pulse", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-end pb-12 px-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 max-w-lg", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 w-24 bg-card rounded" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-80 bg-card rounded" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-16 w-full bg-card rounded" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-28 bg-card rounded" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-32 bg-card rounded" })
      ] })
    ] }) }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "relative w-full h-[65vh] min-h-[450px] overflow-hidden",
      "data-ocid": "hero-banner",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: anime.coverImageUrl || "/assets/generated/hero-banner.dim_1920x800.jpg",
            alt: anime.title,
            className: "absolute inset-0 w-full h-full object-cover"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/30" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative h-full flex items-end pb-16 px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-7xl mx-auto w-full", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl space-y-4 animate-slide-up", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            anime.isFeatured && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-primary text-white text-xs font-bold px-3 py-1 rounded-sm tracking-widest uppercase", children: "Featured" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "w-4 h-4 text-yellow-400 fill-yellow-400" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-foreground", children: anime.rating.toFixed(1) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: anime.releaseYear })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-black text-4xl sm:text-5xl lg:text-6xl text-foreground leading-none tracking-tight", children: anime.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: anime.genre.map((g) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            Badge,
            {
              variant: "outline",
              className: "border-border text-muted-foreground text-xs",
              children: g
            },
            g
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-base leading-relaxed line-clamp-3 max-w-xl", children: anime.description }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-3 pt-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                asChild: true,
                size: "lg",
                className: "bg-primary hover:bg-primary/90 text-white font-bold shadow-accent-glow gap-2",
                "data-ocid": "hero-watch-now",
                children: firstEpisode ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Link,
                  {
                    to: "/watch/$animeId/$episodeId",
                    params: { animeId: anime.id, episodeId: firstEpisode.id },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "w-5 h-5 fill-white" }),
                      "Watch Now"
                    ]
                  }
                ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/anime/$id", params: { id: anime.id }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "w-5 h-5 fill-white" }),
                  "Watch Now"
                ] })
              }
            ),
            onWatchlistToggle && /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "secondary",
                size: "lg",
                onClick: onWatchlistToggle,
                className: "bg-white/10 hover:bg-white/20 text-foreground border-white/20 backdrop-blur-sm gap-2",
                "data-ocid": "hero-watchlist-toggle",
                children: isInWatchlist ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-5 h-5" }),
                  " In Watchlist"
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-5 h-5" }),
                  " Add to Watchlist"
                ] })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "ghost",
                size: "lg",
                asChild: true,
                className: "text-muted-foreground hover:text-foreground gap-2",
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/anime/$id", params: { id: anime.id }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "w-5 h-5" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "More Info" })
                ] })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
            anime.episodeCount,
            " episodes ·",
            " ",
            anime.status === "ongoing" ? "Ongoing" : "Completed"
          ] })
        ] }) }) })
      ]
    }
  );
}
function HomePage() {
  const [activeGenre, setActiveGenre] = reactExports.useState(null);
  const { data: featured, isLoading: featuredLoading } = useFeaturedAnime();
  const { data: latest = [], isLoading: latestLoading } = useLatestAnime();
  const { data: trending = [], isLoading: trendingLoading } = useTrendingAnime();
  const { data: popular = [], isLoading: popularLoading } = usePopularAnime();
  const { data: filtered = [], isLoading: filteredLoading } = useAnimeByGenre(activeGenre);
  const { data: allAnime = [] } = useAllAnime();
  const { data: bannerAds = [] } = useAdsByPlacement("homepage_banner");
  const { isLoggedIn, principalId } = useAuth();
  const { data: watchlistEntries = [] } = useWatchlist(
    isLoggedIn ? principalId : null
  );
  const addToWatchlist = useAddToWatchlist();
  const removeFromWatchlist = useRemoveFromWatchlist();
  const watchlistIds = reactExports.useMemo(
    () => new Set(watchlistEntries.map((e) => e.animeId)),
    [watchlistEntries]
  );
  const watchlistAnime = reactExports.useMemo(
    () => allAnime.filter((a) => watchlistIds.has(a.id)),
    [allAnime, watchlistIds]
  );
  const handleWatchlistToggle = (animeId) => {
    if (!isLoggedIn || !principalId) {
      ue.error("Sign in to manage your watchlist");
      return;
    }
    const isIn = watchlistIds.has(animeId);
    if (isIn) {
      removeFromWatchlist.mutate({ userId: principalId, animeId });
      ue.success("Removed from watchlist");
    } else {
      addToWatchlist.mutate({ userId: principalId, animeId });
      ue.success("Added to watchlist");
    }
  };
  const activeBannerAd = bannerAds[0] ?? null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pb-16", "data-ocid": "homepage", children: [
    featuredLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(HeroBannerSkeleton, {}) : featured ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      HeroBanner,
      {
        anime: featured,
        loading: false,
        onWatchlistToggle: () => handleWatchlistToggle(featured.id),
        isInWatchlist: watchlistIds.has(featured.id)
      }
    ) : null,
    activeBannerAd && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "a",
      {
        href: activeBannerAd.targetUrl,
        className: "block relative overflow-hidden group",
        target: "_blank",
        rel: "noopener noreferrer",
        "data-ocid": "homepage-banner-ad",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: activeBannerAd.imageUrl,
              alt: activeBannerAd.title,
              className: "w-full h-16 sm:h-20 object-cover brightness-75 group-hover:brightness-90 transition-[filter] duration-300"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-white text-sm sm:text-base tracking-wide drop-shadow-lg", children: activeBannerAd.title }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute top-1.5 right-2 bg-black/60 text-[10px] text-muted-foreground px-1.5 py-0.5 rounded uppercase tracking-wide", children: "Ad" })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sticky top-16 z-40 bg-background/90 backdrop-blur-sm border-b border-border py-3 px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-7xl mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      GenreFilter,
      {
        activeGenre,
        onGenreChange: setActiveGenre
      }
    ) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 space-y-10", children: activeGenre ? (
      /* Genre-filtered view */
      filteredLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(CarouselSkeleton, { title: `${activeGenre} Anime` }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
        CarouselSection,
        {
          title: `${activeGenre} Anime`,
          anime: filtered,
          loading: false,
          onWatchlistToggle: handleWatchlistToggle,
          watchlistIds
        }
      )
    ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      latestLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(CarouselSkeleton, { title: "Latest Anime" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
        CarouselSection,
        {
          title: "Latest Anime",
          anime: latest,
          loading: false,
          onWatchlistToggle: handleWatchlistToggle,
          watchlistIds
        }
      ),
      trendingLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(CarouselSkeleton, { title: "Trending Now" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
        CarouselSection,
        {
          title: "Trending Now",
          anime: trending,
          loading: false,
          onWatchlistToggle: handleWatchlistToggle,
          watchlistIds
        }
      ),
      popularLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(CarouselSkeleton, { title: "Popular Series" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
        CarouselSection,
        {
          title: "Popular Series",
          anime: popular,
          loading: false,
          onWatchlistToggle: handleWatchlistToggle,
          watchlistIds
        }
      ),
      isLoggedIn && /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "space-y-4", "data-ocid": "watchlist-section", children: watchlistAnime.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        CarouselSection,
        {
          title: "Your Watchlist",
          anime: watchlistAnime,
          loading: false,
          onWatchlistToggle: handleWatchlistToggle,
          watchlistIds
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx(WatchlistEmptyState, {}) })
    ] }) })
  ] });
}
function WatchlistEmptyState() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-xl text-foreground mb-4", children: "Your Watchlist" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "bg-card border border-border rounded-xl py-12 px-6 text-center",
        "data-ocid": "watchlist-empty",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl", children: "🎬" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-foreground text-lg mb-2", children: "Your watchlist is empty" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground text-sm max-w-sm mx-auto", children: [
            "Browse anime and click the ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "+" }),
            " button to save titles you want to watch later."
          ] })
        ]
      }
    )
  ] }) });
}
export {
  HomePage as default
};
