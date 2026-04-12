import { c as createLucideIcon, j as jsxRuntimeExports, t as cn, v as useActor, w as useQuery, x as useQueryClient, y as useMutation, z as createActor, R as useAdminAuth, D as useNavigate, f as useAllAnime, E as Eye, L as Link, r as reactExports, au as Menu, X, av as LogOut } from "./index-DnVaqzJ1.js";
import { a as useAllAds } from "./useAds-BXyexzn5.js";
import { S as Star } from "./star-D8XNwk1f.js";
import { T as Tv } from "./tv-CIfmeAcW.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$7 = [
  ["path", { d: "M3 3v16a2 2 0 0 0 2 2h16", key: "c24i48" }],
  ["path", { d: "M18 17V9", key: "2bz60n" }],
  ["path", { d: "M13 17V5", key: "1frdt8" }],
  ["path", { d: "M8 17v-3", key: "17ska0" }]
];
const ChartColumn = createLucideIcon("chart-column", __iconNode$7);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$6 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["polyline", { points: "12 6 12 12 16 14", key: "68esgv" }]
];
const Clock = createLucideIcon("clock", __iconNode$6);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$5 = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", key: "afitv7" }],
  ["path", { d: "M7 3v18", key: "bbkbws" }],
  ["path", { d: "M3 7.5h4", key: "zfgn84" }],
  ["path", { d: "M3 12h18", key: "1i2n21" }],
  ["path", { d: "M3 16.5h4", key: "1230mu" }],
  ["path", { d: "M17 3v18", key: "in4fa5" }],
  ["path", { d: "M17 7.5h4", key: "myr1c1" }],
  ["path", { d: "M17 16.5h4", key: "go4c1d" }]
];
const Film = createLucideIcon("film", __iconNode$5);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$4 = [
  ["polyline", { points: "22 12 16 12 14 15 10 15 8 12 2 12", key: "o97t9d" }],
  [
    "path",
    {
      d: "M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z",
      key: "oot6mr"
    }
  ]
];
const Inbox = createLucideIcon("inbox", __iconNode$4);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["rect", { width: "7", height: "9", x: "3", y: "3", rx: "1", key: "10lvy0" }],
  ["rect", { width: "7", height: "5", x: "14", y: "3", rx: "1", key: "16une8" }],
  ["rect", { width: "7", height: "9", x: "14", y: "12", rx: "1", key: "1hutg5" }],
  ["rect", { width: "7", height: "5", x: "3", y: "16", rx: "1", key: "ldoo1y" }]
];
const LayoutDashboard = createLucideIcon("layout-dashboard", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "m3 11 18-5v12L3 14v-3z", key: "n962bs" }],
  ["path", { d: "M11.6 16.8a3 3 0 1 1-5.8-1.6", key: "1yl0tm" }]
];
const Megaphone = createLucideIcon("megaphone", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", key: "afitv7" }],
  ["path", { d: "m9 8 6 4-6 4Z", key: "f1r3lt" }]
];
const SquarePlay = createLucideIcon("square-play", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M16 7h6v6", key: "box55l" }],
  ["path", { d: "m22 7-8.5 8.5-5-5L2 17", key: "1t1m79" }]
];
const TrendingUp = createLucideIcon("trending-up", __iconNode);
function Card({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "card",
      className: cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
        className
      ),
      ...props
    }
  );
}
function CardHeader({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "card-header",
      className: cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      ),
      ...props
    }
  );
}
function CardTitle({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "card-title",
      className: cn("leading-none font-semibold", className),
      ...props
    }
  );
}
function CardContent({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "card-content",
      className: cn("px-6", className),
      ...props
    }
  );
}
function toFrontendRequest(r) {
  return {
    id: r.id,
    requestText: r.requestText,
    username: r.username,
    status: r.status,
    createdAt: r.createdAt
  };
}
function useAnimeRequests(adminToken) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["anime-requests", adminToken],
    queryFn: async () => {
      if (!actor) return [];
      try {
        const result = await actor.getAnimeRequests(adminToken);
        return result.map(toFrontendRequest);
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
    staleTime: 15e3
  });
}
function useMarkRequestComplete() {
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      adminToken
    }) => {
      if (!actor || isFetching)
        throw new Error("Backend is still loading — please wait and try again");
      const success = await actor.markRequestComplete(id, adminToken);
      if (!success) throw new Error("Failed to mark request as complete");
      return success;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["anime-requests"] });
    }
  });
}
function useDeleteRequest() {
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      adminToken
    }) => {
      if (!actor || isFetching)
        throw new Error("Backend is still loading — please wait and try again");
      const success = await actor.deleteAnimeRequest(id, adminToken);
      if (!success) throw new Error("Failed to delete request");
      return success;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["anime-requests"] });
    }
  });
}
function usePendingRequestsCount(adminToken) {
  const { data: requests = [] } = useAnimeRequests(adminToken);
  return requests.filter((r) => r.status === "pending").length;
}
const NAV_ITEMS = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/anime", label: "Anime", icon: Film, exact: false },
  { to: "/admin/episodes", label: "Episodes", icon: SquarePlay, exact: false },
  { to: "/admin/ads", label: "Ad Management", icon: Megaphone, exact: false },
  { to: "/admin/requests", label: "Anime Requests", icon: Inbox, exact: false }
];
function SidebarContent({ onClose }) {
  const { logout } = useAdminAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate({ to: "/admin/login" });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col h-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-5 py-4 border-b border-white/10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Link,
        {
          to: "/",
          className: "flex items-center gap-2.5 hover:opacity-80 transition-opacity",
          onClick: onClose,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Tv, { className: "w-4 h-4 text-primary" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-black text-sm text-foreground leading-none", children: "AnimeStream" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-white/40 font-medium mt-0.5", children: "Admin Panel" })
            ] })
          ]
        }
      ),
      onClose && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: onClose,
          className: "p-1.5 rounded-lg text-white/50 hover:text-foreground hover:bg-white/10 transition-colors lg:hidden",
          "aria-label": "Close menu",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4" })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "flex-1 p-3 space-y-0.5", "data-ocid": "admin-sidebar-nav", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "px-3 pt-3 pb-1.5 text-[10px] font-semibold text-white/30 uppercase tracking-widest", children: "Navigation" }),
      NAV_ITEMS.map(({ to, label, icon: Icon, exact }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Link,
        {
          to,
          activeOptions: { exact },
          onClick: onClose,
          className: "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/60 hover:text-foreground hover:bg-white/8 transition-all",
          activeProps: {
            className: "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium bg-primary/15 text-primary border border-primary/25 shadow-sm"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-4 h-4 shrink-0" }),
            label
          ]
        },
        to
      ))
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 border-t border-white/10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 px-3 py-2.5 mb-1 rounded-lg bg-white/5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold text-primary", children: "F" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-foreground", children: "Faheem01" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-white/40", children: "Administrator" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: handleLogout,
          "data-ocid": "admin-logout-btn",
          className: "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/50 hover:text-red-400 hover:bg-red-500/10 transition-all",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "w-4 h-4 shrink-0" }),
            "Sign Out"
          ]
        }
      )
    ] })
  ] });
}
function AdminSidebar() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("aside", { className: "hidden lg:flex w-64 bg-card border-r border-white/10 min-h-screen flex-col shrink-0 sticky top-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SidebarContent, {}) });
}
function AdminLayout({
  children,
  title,
  subtitle,
  action
}) {
  const [mobileOpen, setMobileOpen] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("aside", { className: "hidden lg:flex w-64 bg-card border-r border-white/10 flex-col shrink-0 sticky top-0 h-screen", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SidebarContent, {}) }),
    mobileOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden",
        onClick: () => setMobileOpen(false),
        onKeyDown: (e) => e.key === "Escape" && setMobileOpen(false),
        role: "button",
        tabIndex: -1,
        "aria-hidden": "true"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "aside",
      {
        className: `fixed left-0 top-0 h-full w-72 z-50 bg-card border-r border-white/10 flex flex-col transition-transform duration-300 lg:hidden ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(SidebarContent, { onClose: () => setMobileOpen(false) })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "sticky top-0 z-30 bg-card/95 backdrop-blur-sm border-b border-white/10 px-4 md:px-6 py-3.5 flex items-center justify-between gap-4 shrink-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => setMobileOpen(true),
              className: "p-2 -ml-1 rounded-lg text-white/60 hover:text-foreground hover:bg-white/10 transition-colors lg:hidden",
              "aria-label": "Open menu",
              "data-ocid": "admin-hamburger",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Menu, { className: "w-5 h-5" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-base md:text-lg font-display font-bold text-foreground leading-tight truncate", children: title }),
            subtitle && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-white/40 hidden sm:block mt-0.5", children: subtitle })
          ] })
        ] }),
        action && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "shrink-0", children: action })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 p-4 md:p-6 overflow-auto", children })
    ] })
  ] });
}
function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  iconClass
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "bg-card border border-white/10 hover:border-white/20 transition-colors group", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-4 md:p-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 md:gap-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `p-2.5 rounded-xl shrink-0 ${iconClass}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-4 h-4 md:w-5 md:h-5" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] md:text-xs text-white/40 uppercase tracking-widest font-semibold", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl md:text-2xl font-display font-black text-foreground mt-1", children: value }),
      sub && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] md:text-xs text-white/30 mt-0.5", children: sub })
    ] })
  ] }) }) });
}
function AdminDashboardPage() {
  const { isAdminLoggedIn } = useAdminAuth();
  const navigate = useNavigate();
  const { data: anime = [] } = useAllAnime();
  const { data: ads = [] } = useAllAds();
  const pendingRequestsCount = usePendingRequestsCount("adminfaheem123");
  if (!isAdminLoggedIn) {
    navigate({ to: "/admin/login" });
    return null;
  }
  const totalViews = anime.reduce((sum, a) => sum + a.viewCount, 0);
  const enabledAds = ads.filter((a) => a.isEnabled).length;
  const featuredCount = anime.filter((a) => a.isFeatured).length;
  const topAnime = [...anime].sort((a, b) => b.viewCount - a.viewCount).slice(0, 5);
  const recentAnime = [...anime].sort((a, b) => b.createdAt - a.createdAt).slice(0, 5);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AdminLayout, { title: "Dashboard", subtitle: "Overview of your platform", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 md:space-y-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard,
        {
          icon: Film,
          label: "Total Anime",
          value: anime.length,
          sub: `${featuredCount} featured`,
          iconClass: "bg-primary/15 text-primary"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard,
        {
          icon: Megaphone,
          label: "Active Ads",
          value: `${enabledAds}/${ads.length}`,
          sub: "configured",
          iconClass: "bg-amber-500/15 text-amber-400"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard,
        {
          icon: Eye,
          label: "Total Views",
          value: totalViews >= 1e6 ? `${(totalViews / 1e6).toFixed(1)}M` : `${(totalViews / 1e3).toFixed(0)}K`,
          sub: "all-time",
          iconClass: "bg-green-500/15 text-green-400"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard,
        {
          icon: Clock,
          label: "Pending Requests",
          value: pendingRequestsCount,
          sub: "awaiting review",
          iconClass: "bg-orange-500/15 text-orange-400"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xs font-semibold text-white/40 uppercase tracking-widest mb-3", children: "Quick Actions" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4", children: [
        {
          to: "/admin/anime",
          label: "Manage Anime",
          desc: "Add, edit, or remove anime series",
          icon: Film,
          ocid: "anime"
        },
        {
          to: "/admin/episodes",
          label: "Manage Episodes",
          desc: "Add episodes with video URLs",
          icon: SquarePlay,
          ocid: "episodes"
        },
        {
          to: "/admin/ads",
          label: "Manage Ads",
          desc: "Configure ad placements and content",
          icon: Megaphone,
          ocid: "ads"
        },
        {
          to: "/admin/requests",
          label: "Anime Requests",
          desc: `${pendingRequestsCount} pending from users`,
          icon: Inbox,
          ocid: "requests"
        }
      ].map(({ to, label, desc, icon: Icon, ocid }) => /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to, "data-ocid": `dashboard-quick-${ocid}`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-card border border-white/10 hover:border-primary/40 hover:bg-primary/5 transition-all group cursor-pointer h-full", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2 pt-4 px-4 md:px-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2.5 text-sm text-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-1.5 rounded-lg bg-primary/15 group-hover:bg-primary/25 transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-4 h-4 text-primary" }) }),
          label
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "px-4 md:px-5 pb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-white/50", children: desc }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-primary mt-2 group-hover:underline", children: "Open →" })
        ] })
      ] }) }, to)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-white/10 rounded-xl overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-4 md:px-5 py-3.5 border-b border-white/10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Film, { className: "w-4 h-4 text-primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-foreground", children: "Recently Added" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Link,
            {
              to: "/admin/anime",
              className: "text-[11px] text-primary hover:underline font-medium",
              children: "View all →"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("table", { className: "w-full text-sm hidden md:table", children: /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-white/5", children: recentAnime.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-white/3 transition-colors", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: a.thumbnailUrl,
                alt: a.title,
                className: "w-7 h-10 object-cover rounded shrink-0"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-foreground truncate text-xs max-w-[150px]", children: a.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-white/40", children: a.releaseYear })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 text-xs text-amber-400", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "w-3 h-3 fill-current" }),
            a.rating
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: `text-[10px] px-2 py-0.5 rounded-full font-semibold ${a.status === "ongoing" ? "bg-green-500/15 text-green-400" : a.status === "completed" ? "bg-blue-500/15 text-blue-400" : "bg-amber-500/15 text-amber-400"}`,
              children: a.status
            }
          ) })
        ] }, a.id)) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "md:hidden divide-y divide-white/5", children: recentAnime.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 px-4 py-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: a.thumbnailUrl,
              alt: a.title,
              className: "w-8 h-11 object-cover rounded shrink-0"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-foreground truncate text-xs", children: a.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-white/40", children: a.releaseYear })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: `text-[10px] px-1.5 py-0.5 rounded-full font-semibold shrink-0 ${a.status === "ongoing" ? "bg-green-500/15 text-green-400" : a.status === "completed" ? "bg-blue-500/15 text-blue-400" : "bg-amber-500/15 text-amber-400"}`,
              children: a.status
            }
          )
        ] }, a.id)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-white/10 rounded-xl overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-4 md:px-5 py-3.5 border-b border-white/10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "w-4 h-4 text-primary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-foreground", children: "Top Performing" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("table", { className: "w-full text-sm hidden md:table", children: /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-white/5", children: topAnime.map((a, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-white/3 transition-colors", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3 w-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "span",
            {
              className: `text-xs font-black ${i === 0 ? "text-primary" : i === 1 ? "text-white/60" : "text-white/30"}`,
              children: [
                "#",
                i + 1
              ]
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-foreground truncate text-xs max-w-[160px]", children: a.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-white/40", children: a.genre.slice(0, 2).join(", ") })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { className: "w-3 h-3 text-white/30" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-foreground font-medium", children: a.viewCount.toLocaleString() })
          ] }) })
        ] }, a.id)) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "md:hidden divide-y divide-white/5", children: topAnime.map((a, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 px-4 py-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "span",
            {
              className: `text-sm font-black w-6 shrink-0 ${i === 0 ? "text-primary" : "text-white/30"}`,
              children: [
                "#",
                i + 1
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-foreground truncate text-xs", children: a.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-white/40", children: a.genre.slice(0, 2).join(", ") })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-white/50 font-medium shrink-0", children: a.viewCount.toLocaleString() })
        ] }, a.id)) })
      ] })
    ] })
  ] }) });
}
const AdminDashboardPage$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  AdminLayout,
  AdminSidebar,
  default: AdminDashboardPage
}, Symbol.toStringTag, { value: "Module" }));
export {
  AdminLayout as A,
  Clock as C,
  Film as F,
  Inbox as I,
  Megaphone as M,
  useMarkRequestComplete as a,
  useDeleteRequest as b,
  AdminDashboardPage$1 as c,
  useAnimeRequests as u
};
