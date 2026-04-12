import { c as createLucideIcon, i as useParams, k as useAnimeDetail, f as useAllAnime, g as useAuth, r as reactExports, j as jsxRuntimeExports, S as Skeleton, B as Button, L as Link, E as Eye, h as ue } from "./index-DnVaqzJ1.js";
import { B as Badge } from "./badge-CO852Axe.js";
import { u as useEpisodesByAnime } from "./useEpisodes-BgQq_7c_.js";
import { u as useSeasonsByAnime, s as safeSeasonNumber } from "./useSeasons-CkdOogZT.js";
import { c as useIsInWatchlist, a as useAddToWatchlist, b as useRemoveFromWatchlist } from "./useWatchlist-uUDa_x2O.js";
import { A as ArrowLeft } from "./arrow-left-BJ7Bk4SY.js";
import { m as motion } from "./proxy--DDleVmc.js";
import { T as Tv } from "./tv-CIfmeAcW.js";
import { P as Play } from "./play-DTkjahAx.js";
import { C as ChevronUp } from "./chevron-up-EschEVc0.js";
import { C as ChevronDown } from "./chevron-down-CIvrwsTE.js";
import { C as Check } from "./check-BkIFvmcv.js";
import { S as Star } from "./star-D8XNwk1f.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "M8 2v4", key: "1cmpym" }],
  ["path", { d: "M16 2v4", key: "4m81vk" }],
  ["rect", { width: "18", height: "18", x: "3", y: "4", rx: "2", key: "1hopcy" }],
  ["path", { d: "M3 10h18", key: "8toen8" }]
];
const Calendar = createLucideIcon("calendar", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["line", { x1: "2", y1: "2", x2: "22", y2: "22", key: "1w4vcy" }],
  [
    "path",
    { d: "M16.5 16.5 12 21l-7-7c-1.5-1.45-3-3.2-3-5.5a5.5 5.5 0 0 1 2.14-4.35", key: "3mpagl" }
  ],
  [
    "path",
    {
      d: "M8.76 3.1c1.15.22 2.13.78 3.24 1.9 1.5-1.5 2.74-2 4.5-2A5.5 5.5 0 0 1 22 8.5c0 2.12-1.3 3.78-2.67 5.17",
      key: "1gh3v3"
    }
  ]
];
const HeartOff = createLucideIcon("heart-off", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z",
      key: "c3ymky"
    }
  ]
];
const Heart = createLucideIcon("heart", __iconNode);
function StarRating({ rating }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-0.5", children: [1, 2, 3, 4, 5].map((star) => {
      const filled = rating / (5 / 5) >= star;
      const half = !filled && rating / (5 / 5) > star - 1;
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        Star,
        {
          className: [
            "w-4 h-4",
            filled ? "text-yellow-400 fill-yellow-400" : half ? "text-yellow-400 fill-yellow-400/50" : "text-muted-foreground"
          ].join(" ")
        },
        star
      );
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold text-foreground", children: rating.toFixed(1) })
  ] });
}
function EpisodeCard({
  episode,
  animeId,
  seasonNumber,
  index
}) {
  const watchTo = seasonNumber !== null ? {
    to: "/watch/$animeId/$seasonNumber/$episodeId",
    params: {
      animeId,
      seasonNumber: String(seasonNumber),
      episodeId: episode.id
    }
  } : {
    to: "/watch/$animeId/$episodeId",
    params: { animeId, episodeId: episode.id }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      initial: { opacity: 0, y: 16 },
      animate: { opacity: 1, y: 0 },
      transition: { delay: index * 0.05 },
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Link,
        {
          ...watchTo,
          className: "flex items-start gap-4 bg-card hover:bg-secondary border border-border rounded-xl p-3 transition-colors group",
          "data-ocid": `episode-card-${episode.id}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "shrink-0 relative w-32 h-18 rounded-lg overflow-hidden", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src: episode.thumbnailUrl || "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&h=225&fit=crop",
                  alt: episode.title,
                  className: "w-32 h-[4.5rem] object-cover scale-hover"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-primary rounded-full p-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "w-4 h-4 text-white fill-white" }) }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-1 right-1 bg-black/80 text-white text-[10px] font-mono px-1.5 py-0.5 rounded", children: episode.duration ?? "—" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0 py-0.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 mb-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-bold text-primary font-mono bg-primary/10 px-2 py-0.5 rounded", children: [
                "EP ",
                Number(episode.episodeNumber)
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-foreground text-sm group-hover:text-primary transition-colors line-clamp-1", children: episode.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground line-clamp-2 mt-1 leading-relaxed", children: episode.description })
            ] })
          ]
        }
      )
    }
  );
}
function SeasonTabs({
  seasons,
  activeSeasonId,
  onSeasonChange
}) {
  if (seasons.length === 0) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4", "data-ocid": "detail-season-selector", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "block sm:hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "select",
      {
        value: activeSeasonId ?? "",
        onChange: (e) => onSeasonChange(e.target.value),
        className: "w-full bg-card border border-border text-foreground text-sm rounded-lg h-10 px-3 focus:outline-none focus:border-primary",
        "aria-label": "Select season",
        children: seasons.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: s.id, children: s.name }, s.id))
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden sm:flex items-center gap-1.5 flex-wrap", children: seasons.map((s) => {
      const isActive = s.id === activeSeasonId;
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => onSeasonChange(s.id),
          "data-ocid": `detail-season-tab-${s.id}`,
          className: [
            "px-4 py-1.5 rounded-lg text-sm font-semibold transition-all",
            isActive ? "bg-primary text-white shadow-sm" : "bg-card border border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
          ].join(" "),
          children: s.name
        },
        s.id
      );
    }) })
  ] });
}
function RelatedAnimeCard({ anime }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Link,
    {
      to: "/anime/$id",
      params: { id: anime.id },
      "data-ocid": `related-anime-${anime.id}`,
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "group relative overflow-hidden rounded-xl bg-card border border-border hover:border-primary/50 transition-all scale-hover", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: anime.thumbnailUrl,
            alt: anime.title,
            className: "w-full aspect-[2/3] object-cover"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-0 left-0 right-0 p-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm text-foreground line-clamp-2 leading-tight", children: anime.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 mt-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "w-3 h-3 text-yellow-400 fill-yellow-400" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: anime.rating.toFixed(1) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-primary rounded-full p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "w-5 h-5 text-white fill-white" }) }) })
      ] })
    }
  );
}
function AnimeDetailPage() {
  var _a;
  const { id } = useParams({ from: "/anime/$id" });
  const { data: anime, isLoading } = useAnimeDetail(id);
  const { data: episodes = [], isLoading: epsLoading } = useEpisodesByAnime(id);
  const { data: seasons = [] } = useSeasonsByAnime(id);
  const { data: allAnime = [] } = useAllAnime();
  const { isLoggedIn, principalId } = useAuth();
  const { data: isInWatchlist } = useIsInWatchlist(principalId, id);
  const addToWatchlist = useAddToWatchlist();
  const removeFromWatchlist = useRemoveFromWatchlist();
  const [descExpanded, setDescExpanded] = reactExports.useState(false);
  const [activeSeasonId, setActiveSeasonId] = reactExports.useState(null);
  reactExports.useEffect(() => {
    if (activeSeasonId !== null || seasons.length === 0) return;
    setActiveSeasonId(seasons[0].id);
  }, [seasons, activeSeasonId]);
  const displayedEpisodes = seasons.length > 0 && activeSeasonId ? episodes.filter((ep) => ep.seasonId === activeSeasonId) : episodes;
  const activeSeason = seasons.find((s) => s.id === activeSeasonId);
  const activeSeasonNumber = activeSeason ? safeSeasonNumber(activeSeason.seasonNumber) : null;
  reactExports.useEffect(() => {
  }, [anime]);
  const toggleWatchlist = () => {
    if (!isLoggedIn || !principalId) {
      ue.error("Sign in to manage your watchlist");
      return;
    }
    if (isInWatchlist) {
      removeFromWatchlist.mutate({ userId: principalId, animeId: id });
      ue.success("Removed from watchlist");
    } else {
      addToWatchlist.mutate({ userId: principalId, animeId: id });
      ue.success("Added to watchlist ❤️");
    }
  };
  const relatedAnime = allAnime.filter((a) => a.id !== id && a.genre.some((g) => anime == null ? void 0 : anime.genre.includes(g))).slice(0, 6);
  const firstEpisode = seasons.length > 0 && activeSeasonId ? episodes.find((ep) => ep.seasonId === activeSeasonId) : episodes[0];
  const descriptionLong = (((_a = anime == null ? void 0 : anime.description) == null ? void 0 : _a.length) ?? 0) > 180;
  const firstEpisodeLink = firstEpisode && activeSeasonNumber !== null ? {
    to: "/watch/$animeId/$seasonNumber/$episodeId",
    params: {
      animeId: id,
      seasonNumber: String(activeSeasonNumber),
      episodeId: firstEpisode.id
    }
  } : firstEpisode ? {
    to: "/watch/$animeId/$episodeId",
    params: { animeId: id, episodeId: firstEpisode.id }
  } : null;
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-[55vh] w-full bg-muted" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-64 bg-muted" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-full bg-muted" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-3/4 bg-muted" })
      ] })
    ] });
  }
  if (!anime) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-[60vh] flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl font-bold text-foreground", children: "Anime not found" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, variant: "outline", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", children: "Go Home" }) })
    ] }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pb-16", "data-ocid": "anime-detail-page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full h-[60vh] min-h-[420px] overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "img",
        {
          src: anime.coverImageUrl,
          alt: anime.title,
          className: "w-full h-full object-cover object-center"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-black/95 via-black/70 to-black/10" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/30" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-5 left-4 sm:left-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          size: "sm",
          asChild: true,
          className: "gap-2 bg-black/50 hover:bg-black/70 backdrop-blur-sm text-white border border-white/10",
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-4 h-4" }),
            "Browse"
          ] })
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-0 left-0 right-0 px-4 sm:px-8 lg:px-16 pb-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.5 },
          className: "max-w-2xl space-y-4",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
              anime.genre.map((g) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  variant: "outline",
                  className: "border-primary/50 text-primary bg-primary/10 text-xs font-semibold",
                  children: g
                },
                g
              )),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  variant: anime.status === "ongoing" ? "default" : "secondary",
                  className: anime.status === "ongoing" ? "bg-green-500/20 text-green-400 border-green-500/30 border" : anime.status === "completed" ? "bg-muted text-muted-foreground" : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30 border",
                  children: anime.status.charAt(0).toUpperCase() + anime.status.slice(1)
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-black text-4xl sm:text-5xl lg:text-6xl text-foreground leading-none tracking-tight", children: anime.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 text-sm text-muted-foreground flex-wrap", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(StarRating, { rating: anime.rating }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "w-3.5 h-3.5" }),
                anime.releaseYear
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Tv, { className: "w-3.5 h-3.5" }),
                anime.episodeCount,
                " eps"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "w-3.5 h-3.5" }),
                (anime.viewCount / 1e3).toFixed(0),
                "K views"
              ] }),
              seasons.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5 text-primary", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Tv, { className: "w-3.5 h-3.5" }),
                seasons.length,
                " season",
                seasons.length !== 1 ? "s" : ""
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 flex-wrap", children: [
              firstEpisodeLink ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  asChild: true,
                  size: "lg",
                  className: "bg-primary hover:bg-primary/90 text-white gap-2 glow-accent font-semibold px-6",
                  "data-ocid": "hero-watch-btn",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { ...firstEpisodeLink, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "w-5 h-5 fill-white" }),
                    "Watch Now"
                  ] })
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "lg", disabled: true, className: "gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "w-5 h-5" }),
                "No Episodes Yet"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "secondary",
                  size: "lg",
                  onClick: toggleWatchlist,
                  className: [
                    "gap-2 font-semibold transition-all px-6",
                    isInWatchlist ? "bg-primary/20 hover:bg-primary/30 border-primary/50 text-primary border" : "bg-white/10 hover:bg-white/20 border-white/20 text-foreground border"
                  ].join(" "),
                  "data-ocid": "watchlist-toggle-btn",
                  children: isInWatchlist ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(HeartOff, { className: "w-4 h-4" }),
                    "Remove"
                  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "w-4 h-4" }),
                    "Watchlist"
                  ] })
                }
              )
            ] })
          ]
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-2 space-y-10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display font-bold text-lg text-foreground mb-3 flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1 h-5 bg-primary rounded-full inline-block" }),
              "Synopsis"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: [
                    "text-muted-foreground leading-relaxed text-sm transition-all",
                    !descExpanded && descriptionLong ? "line-clamp-4" : ""
                  ].join(" "),
                  children: anime.description
                }
              ),
              descriptionLong && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setDescExpanded((p) => !p),
                  className: "mt-2 flex items-center gap-1 text-primary text-xs font-semibold hover:text-primary/80 transition-colors",
                  "data-ocid": "expand-description",
                  children: descExpanded ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "w-3.5 h-3.5" }),
                    " Show less"
                  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "w-3.5 h-3.5" }),
                    " Read more"
                  ] })
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { "data-ocid": "episodes-section", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display font-bold text-lg text-foreground flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1 h-5 bg-primary rounded-full inline-block" }),
              "Episodes",
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-normal text-muted-foreground ml-1", children: [
                "(",
                displayedEpisodes.length,
                ")"
              ] })
            ] }) }),
            seasons.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
              SeasonTabs,
              {
                seasons,
                activeSeasonId,
                onSeasonChange: setActiveSeasonId
              }
            ),
            epsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              Skeleton,
              {
                className: "h-[5.5rem] w-full bg-muted rounded-xl"
              },
              i
            )) }) : displayedEpisodes.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "bg-card border border-border rounded-xl py-14 text-center",
                "data-ocid": "no-episodes-empty",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Tv, { className: "w-12 h-12 text-muted-foreground mx-auto mb-3" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground font-medium", children: seasons.length > 0 && activeSeasonId ? "No episodes available for this season" : "No episodes yet" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground/70 mt-1", children: "Check back soon for new episodes." })
                ]
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2.5", children: displayedEpisodes.map((ep, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              EpisodeCard,
              {
                episode: ep,
                animeId: anime.id,
                seasonNumber: activeSeasonNumber,
                index: idx
              },
              ep.id
            )) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-xl p-5 space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold text-sm text-foreground uppercase tracking-widest text-muted-foreground", children: "Series Info" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3 text-sm", children: [
              {
                label: "Rating",
                value: `${anime.rating.toFixed(1)} / 5.0`
              },
              { label: "Year", value: String(anime.releaseYear) },
              {
                label: "Status",
                value: anime.status.charAt(0).toUpperCase() + anime.status.slice(1)
              },
              { label: "Episodes", value: String(anime.episodeCount) },
              {
                label: "Views",
                value: `${(anime.viewCount / 1e3).toFixed(0)}K`
              },
              ...seasons.length > 0 ? [
                {
                  label: "Seasons",
                  value: String(seasons.length)
                }
              ] : []
            ].map(({ label, value }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex justify-between items-center py-2 border-b border-border last:border-0",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: label }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-semibold", children: value })
                ]
              },
              label
            )) })
          ] }),
          seasons.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-xl p-5 space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold text-sm text-muted-foreground uppercase tracking-widest", children: "Seasons" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5", children: seasons.map((s) => {
              const isActive = s.id === activeSeasonId;
              const epCount = episodes.filter(
                (ep) => ep.seasonId === s.id
              ).length;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => setActiveSeasonId(s.id),
                  "data-ocid": `sidebar-season-${s.id}`,
                  className: [
                    "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-semibold transition-all text-left",
                    isActive ? "bg-primary/20 text-primary border border-primary/30" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  ].join(" "),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: s.name }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "span",
                      {
                        className: [
                          "text-xs font-mono",
                          isActive ? "text-primary/70" : "text-muted-foreground/60"
                        ].join(" "),
                        children: [
                          epCount,
                          " ep",
                          epCount !== 1 ? "s" : ""
                        ]
                      }
                    )
                  ]
                },
                s.id
              );
            }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              onClick: toggleWatchlist,
              className: [
                "w-full gap-2 font-semibold",
                isInWatchlist ? "bg-primary/20 hover:bg-primary/30 border-primary/40 text-primary border" : "bg-primary hover:bg-primary/90 text-white glow-accent"
              ].join(" "),
              "data-ocid": "sidebar-watchlist-btn",
              children: isInWatchlist ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-4 h-4" }),
                " In Your Watchlist"
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "w-4 h-4" }),
                " Add to Watchlist"
              ] })
            }
          )
        ] })
      ] }),
      relatedAnime.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-14", "data-ocid": "related-anime-section", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display font-bold text-xl text-foreground mb-6 flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1 h-6 bg-primary rounded-full inline-block" }),
          "You Might Also Like"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4", children: relatedAnime.map((a, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, scale: 0.95 },
            whileInView: { opacity: 1, scale: 1 },
            viewport: { once: true },
            transition: { delay: idx * 0.07 },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(RelatedAnimeCard, { anime: a })
          },
          a.id
        )) })
      ] })
    ] })
  ] });
}
export {
  AnimeDetailPage as default
};
