import { j as jsxRuntimeExports, L as Link, B as Button } from "./index-DnVaqzJ1.js";
import { B as Badge } from "./badge-CO852Axe.js";
import { P as Play } from "./play-DTkjahAx.js";
import { S as Star } from "./star-D8XNwk1f.js";
import { C as Check } from "./check-BkIFvmcv.js";
import { P as Plus } from "./plus-DHvAjDJW.js";
function AnimeCard({
  anime,
  onWatchlistToggle,
  isInWatchlist,
  compact
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "group relative bg-card rounded-lg overflow-hidden cursor-pointer scale-hover",
      "data-ocid": `anime-card-${anime.id}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/anime/$id", params: { id: anime.id }, className: "block", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative aspect-[2/3] overflow-hidden bg-muted", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: anime.thumbnailUrl,
                alt: anime.title,
                className: "w-full h-full object-cover transition-transform duration-500 group-hover:scale-110",
                loading: "lazy"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-primary/90 rounded-full p-3 shadow-accent-glow", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "w-6 h-6 text-white fill-white" }) }) }),
            anime.status === "ongoing" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-2 left-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-sm uppercase tracking-wide", children: "New" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-2 right-2 bg-black/60 rounded px-1.5 py-0.5 flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "w-2.5 h-2.5 text-muted-foreground fill-muted-foreground" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: anime.viewCount >= 1e6 ? `${(anime.viewCount / 1e6).toFixed(1)}M` : `${Math.floor(anime.viewCount / 1e3)}K` })
            ] })
          ] }),
          !compact && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-foreground text-sm leading-tight truncate group-hover:text-primary transition-colors", children: anime.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "w-3 h-3 text-yellow-400 fill-yellow-400" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: anime.rating.toFixed(1) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
                anime.episodeCount,
                " eps"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1", children: anime.genre.slice(0, 2).map((g) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              Badge,
              {
                variant: "secondary",
                className: "text-xs px-1.5 py-0 bg-secondary/80 text-secondary-foreground",
                children: g
              },
              g
            )) })
          ] })
        ] }),
        onWatchlistToggle && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "secondary",
            size: "sm",
            className: "h-7 w-7 p-0 bg-card/90 hover:bg-primary hover:text-white border-border",
            onClick: (e) => {
              e.preventDefault();
              e.stopPropagation();
              onWatchlistToggle(anime.id);
            },
            "aria-label": isInWatchlist ? "Remove from watchlist" : "Add to watchlist",
            "data-ocid": `watchlist-toggle-${anime.id}`,
            children: isInWatchlist ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-3.5 h-3.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3.5 h-3.5" })
          }
        ) })
      ]
    }
  );
}
export {
  AnimeCard as A
};
