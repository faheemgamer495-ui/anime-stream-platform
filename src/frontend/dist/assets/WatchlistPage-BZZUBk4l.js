import { c as createLucideIcon, g as useAuth, D as useNavigate, f as useAllAnime, r as reactExports, j as jsxRuntimeExports, S as Skeleton, O as Bookmark, B as Button, L as Link, T as TvMinimal } from "./index-EgDyTYGb.js";
import { A as AnimeCard } from "./AnimeCard-DBV2hksL.js";
import { u as useWatchlist, b as useRemoveFromWatchlist } from "./useWatchlist-CqIoLCKD.js";
import { m as motion } from "./proxy-DQXsdb5c.js";
import { P as Play } from "./play-CBdCPXZ4.js";
import "./badge-DoY1tOCt.js";
import "./star-Dex4ctD4.js";
import "./check-CqKCVtSR.js";
import "./plus-CCOzFWtb.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z", key: "169p4p" }],
  ["path", { d: "m14.5 7.5-5 5", key: "3lb6iw" }],
  ["path", { d: "m9.5 7.5 5 5", key: "ko136h" }]
];
const BookmarkX = createLucideIcon("bookmark-x", __iconNode);
function WatchlistSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4", children: Array.from({ length: 8 }, (_, i) => `wl-skel-${i}`).map((key) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "aspect-[2/3] rounded-lg bg-muted" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-3/4 bg-muted" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-1/2 bg-muted" })
  ] }, key)) });
}
function EmptyWatchlist() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.5 },
      className: "bg-card border border-border rounded-2xl py-24 text-center space-y-6",
      "data-ocid": "empty-watchlist",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BookmarkX, { className: "w-12 h-12 text-primary/60" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-1 -right-1 w-8 h-8 bg-muted rounded-full flex items-center justify-center border border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TvMinimal, { className: "w-4 h-4 text-muted-foreground" }) })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 max-w-sm mx-auto px-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold text-2xl text-foreground", children: "Your watchlist is empty" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground text-sm leading-relaxed", children: [
            "Start saving anime you want to watch later. Browse our catalog and click the ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-medium", children: "+" }),
            " icon on any anime card."
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            asChild: true,
            size: "lg",
            className: "bg-primary hover:bg-primary/90 text-white gap-2 font-semibold",
            "data-ocid": "empty-watchlist-cta",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "w-4 h-4 fill-white" }),
              "Browse Anime"
            ] })
          }
        )
      ]
    }
  );
}
function WatchlistPage() {
  const { isLoggedIn, principalId, isInitializing } = useAuth();
  const navigate = useNavigate();
  const { data: allAnime = [], isLoading: isAnimeLoading } = useAllAnime();
  const { data: watchlistEntries = [], isLoading: isWatchlistLoading } = useWatchlist(principalId);
  const removeFromWatchlist = useRemoveFromWatchlist();
  reactExports.useEffect(() => {
    if (!isInitializing && !isLoggedIn) {
      navigate({ to: "/login" });
    }
  }, [isLoggedIn, isInitializing, navigate]);
  const isLoading = isAnimeLoading || isWatchlistLoading || isInitializing;
  const watchlistAnimeIds = new Set(watchlistEntries.map((e) => e.animeId));
  const watchlistAnime = allAnime.filter(
    (a) => watchlistAnimeIds.has(a.id)
  );
  const handleRemove = (animeId) => {
    if (!principalId) return;
    removeFromWatchlist.mutate({ userId: principalId, animeId });
  };
  if (isInitializing) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-6 h-6 rounded bg-muted" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-48 bg-muted rounded" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(WatchlistSkeleton, {})
    ] });
  }
  if (!isLoggedIn) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, x: -16 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 0.4 },
        className: "flex items-center justify-between mb-8",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 bg-primary/15 rounded-lg flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bookmark, { className: "w-5 h-5 text-primary" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h1",
                {
                  className: "font-display font-black text-3xl text-foreground",
                  "data-ocid": "watchlist-heading",
                  children: "My Watchlist"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-24 bg-muted inline-block rounded" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary font-semibold", children: watchlistAnime.length }),
                " ",
                watchlistAnime.length === 1 ? "series" : "series",
                " saved"
              ] }) })
            ] })
          ] }),
          watchlistAnime.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              asChild: true,
              variant: "outline",
              size: "sm",
              className: "border-border text-muted-foreground hover:text-foreground hover:border-primary/50 gap-2",
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "w-3.5 h-3.5" }),
                "Browse More"
              ] })
            }
          )
        ]
      }
    ),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(WatchlistSkeleton, {}) : watchlistAnime.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyWatchlist, {}) : /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.4, delay: 0.1 },
        className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4",
        "data-ocid": "watchlist-grid",
        children: watchlistAnime.map((anime, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 16 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.35, delay: index * 0.06 },
            className: "relative group",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                AnimeCard,
                {
                  anime,
                  isInWatchlist: true,
                  onWatchlistToggle: handleRemove
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-[4.5rem] left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-black/80 text-xs text-muted-foreground px-2 py-0.5 rounded-sm", children: "Hover card to remove" }) })
            ]
          },
          anime.id
        ))
      }
    )
  ] });
}
export {
  WatchlistPage as default
};
