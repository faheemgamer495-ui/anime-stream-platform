import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  BarChart3,
  Clock,
  Eye,
  Film,
  Inbox,
  LayoutDashboard,
  LogOut,
  Megaphone,
  Menu,
  PlaySquare,
  Star,
  TrendingUp,
  Tv,
  X,
} from "lucide-react";
import { useState } from "react";
import { useAdminAuth } from "../hooks/useAdminAuth";
import { useAllAds } from "../hooks/useAds";
import { useAllAnime } from "../hooks/useAnime";
import { usePendingRequestsCount } from "../hooks/useRequests";

const NAV_ITEMS = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/anime", label: "Anime", icon: Film, exact: false },
  { to: "/admin/episodes", label: "Episodes", icon: PlaySquare, exact: false },
  { to: "/admin/ads", label: "Ad Management", icon: Megaphone, exact: false },
  { to: "/admin/requests", label: "Anime Requests", icon: Inbox, exact: false },
];

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const { logout } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate({ to: "/admin/login" });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
        <Link
          to="/"
          className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
          onClick={onClose}
        >
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <Tv className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="font-display font-black text-sm text-foreground leading-none">
              AnimeStream
            </p>
            <p className="text-[10px] text-white/40 font-medium mt-0.5">
              Admin Panel
            </p>
          </div>
        </Link>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/50 hover:text-foreground hover:bg-white/10 transition-colors lg:hidden"
            aria-label="Close menu"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5" data-ocid="admin-sidebar-nav">
        <p className="px-3 pt-3 pb-1.5 text-[10px] font-semibold text-white/30 uppercase tracking-widest">
          Navigation
        </p>
        {NAV_ITEMS.map(({ to, label, icon: Icon, exact }) => (
          <Link
            key={to}
            to={to}
            activeOptions={{ exact }}
            onClick={onClose}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/60 hover:text-foreground hover:bg-white/8 transition-all"
            activeProps={{
              className:
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium bg-primary/15 text-primary border border-primary/25 shadow-sm",
            }}
          >
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-white/10">
        <div className="flex items-center gap-3 px-3 py-2.5 mb-1 rounded-lg bg-white/5">
          <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
            <span className="text-[10px] font-bold text-primary">F</span>
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-foreground">Faheem01</p>
            <p className="text-[10px] text-white/40">Administrator</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          data-ocid="admin-logout-btn"
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/50 hover:text-red-400 hover:bg-red-500/10 transition-all"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          Sign Out
        </button>
      </div>
    </div>
  );
}

/** AdminSidebar — exported for compatibility */
export function AdminSidebar() {
  return (
    <aside className="hidden lg:flex w-64 bg-card border-r border-white/10 min-h-screen flex-col shrink-0 sticky top-0">
      <SidebarContent />
    </aside>
  );
}

/** Shared wrapper for all admin pages */
export function AdminLayout({
  children,
  title,
  subtitle,
  action,
}: {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 bg-card border-r border-white/10 flex-col shrink-0 sticky top-0 h-screen">
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
          onKeyDown={(e) => e.key === "Escape" && setMobileOpen(false)}
          role="button"
          tabIndex={-1}
          aria-hidden="true"
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`fixed left-0 top-0 h-full w-72 z-50 bg-card border-r border-white/10 flex flex-col transition-transform duration-300 lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent onClose={() => setMobileOpen(false)} />
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top header bar */}
        <header className="sticky top-0 z-30 bg-card/95 backdrop-blur-sm border-b border-white/10 px-4 md:px-6 py-3.5 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            {/* Hamburger — mobile only */}
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="p-2 -ml-1 rounded-lg text-white/60 hover:text-foreground hover:bg-white/10 transition-colors lg:hidden"
              aria-label="Open menu"
              data-ocid="admin-hamburger"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <h1 className="text-base md:text-lg font-display font-bold text-foreground leading-tight truncate">
                {title}
              </h1>
              {subtitle && (
                <p className="text-xs text-white/40 hidden sm:block mt-0.5">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </header>

        <main className="flex-1 p-4 md:p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  iconClass,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
  iconClass: string;
}) {
  return (
    <Card className="bg-card border border-white/10 hover:border-white/20 transition-colors group">
      <CardContent className="p-4 md:p-5">
        <div className="flex items-start gap-3 md:gap-4">
          <div className={`p-2.5 rounded-xl shrink-0 ${iconClass}`}>
            <Icon className="w-4 h-4 md:w-5 md:h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] md:text-xs text-white/40 uppercase tracking-widest font-semibold">
              {label}
            </p>
            <p className="text-xl md:text-2xl font-display font-black text-foreground mt-1">
              {value}
            </p>
            {sub && (
              <p className="text-[10px] md:text-xs text-white/30 mt-0.5">
                {sub}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminDashboardPage() {
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
  const topAnime = [...anime]
    .sort((a, b) => b.viewCount - a.viewCount)
    .slice(0, 5);
  const recentAnime = [...anime]
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 5);

  return (
    <AdminLayout title="Dashboard" subtitle="Overview of your platform">
      <div className="space-y-6 md:space-y-8">
        {/* Stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <StatCard
            icon={Film}
            label="Total Anime"
            value={anime.length}
            sub={`${featuredCount} featured`}
            iconClass="bg-primary/15 text-primary"
          />
          <StatCard
            icon={Megaphone}
            label="Active Ads"
            value={`${enabledAds}/${ads.length}`}
            sub="configured"
            iconClass="bg-amber-500/15 text-amber-400"
          />
          <StatCard
            icon={Eye}
            label="Total Views"
            value={
              totalViews >= 1_000_000
                ? `${(totalViews / 1_000_000).toFixed(1)}M`
                : `${(totalViews / 1000).toFixed(0)}K`
            }
            sub="all-time"
            iconClass="bg-green-500/15 text-green-400"
          />
          <StatCard
            icon={Clock}
            label="Pending Requests"
            value={pendingRequestsCount}
            sub="awaiting review"
            iconClass="bg-orange-500/15 text-orange-400"
          />
        </div>

        {/* Quick actions */}
        <div>
          <h2 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-3">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {[
              {
                to: "/admin/anime",
                label: "Manage Anime",
                desc: "Add, edit, or remove anime series",
                icon: Film,
                ocid: "anime",
              },
              {
                to: "/admin/episodes",
                label: "Manage Episodes",
                desc: "Add episodes with video URLs",
                icon: PlaySquare,
                ocid: "episodes",
              },
              {
                to: "/admin/ads",
                label: "Manage Ads",
                desc: "Configure ad placements and content",
                icon: Megaphone,
                ocid: "ads",
              },
              {
                to: "/admin/requests",
                label: "Anime Requests",
                desc: `${pendingRequestsCount} pending from users`,
                icon: Inbox,
                ocid: "requests",
              },
            ].map(({ to, label, desc, icon: Icon, ocid }) => (
              <Link key={to} to={to} data-ocid={`dashboard-quick-${ocid}`}>
                <Card className="bg-card border border-white/10 hover:border-primary/40 hover:bg-primary/5 transition-all group cursor-pointer h-full">
                  <CardHeader className="pb-2 pt-4 px-4 md:px-5">
                    <CardTitle className="flex items-center gap-2.5 text-sm text-foreground">
                      <div className="p-1.5 rounded-lg bg-primary/15 group-hover:bg-primary/25 transition-colors">
                        <Icon className="w-4 h-4 text-primary" />
                      </div>
                      {label}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 md:px-5 pb-4">
                    <p className="text-xs text-white/50">{desc}</p>
                    <p className="text-xs font-medium text-primary mt-2 group-hover:underline">
                      Open →
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Tables section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Recently Added */}
          <div className="bg-card border border-white/10 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 md:px-5 py-3.5 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Film className="w-4 h-4 text-primary" />
                <h2 className="text-sm font-semibold text-foreground">
                  Recently Added
                </h2>
              </div>
              <Link
                to="/admin/anime"
                className="text-[11px] text-primary hover:underline font-medium"
              >
                View all →
              </Link>
            </div>

            {/* Desktop table */}
            <table className="w-full text-sm hidden md:table">
              <tbody className="divide-y divide-white/5">
                {recentAnime.map((a) => (
                  <tr key={a.id} className="hover:bg-white/3 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={a.thumbnailUrl}
                          alt={a.title}
                          className="w-7 h-10 object-cover rounded shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-medium text-foreground truncate text-xs max-w-[150px]">
                            {a.title}
                          </p>
                          <p className="text-[10px] text-white/40">
                            {a.releaseYear}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="inline-flex items-center gap-1 text-xs text-amber-400">
                        <Star className="w-3 h-3 fill-current" />
                        {a.rating}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                          a.status === "ongoing"
                            ? "bg-green-500/15 text-green-400"
                            : a.status === "completed"
                              ? "bg-blue-500/15 text-blue-400"
                              : "bg-amber-500/15 text-amber-400"
                        }`}
                      >
                        {a.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile card list */}
            <div className="md:hidden divide-y divide-white/5">
              {recentAnime.map((a) => (
                <div key={a.id} className="flex items-center gap-3 px-4 py-3">
                  <img
                    src={a.thumbnailUrl}
                    alt={a.title}
                    className="w-8 h-11 object-cover rounded shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-foreground truncate text-xs">
                      {a.title}
                    </p>
                    <p className="text-[10px] text-white/40">{a.releaseYear}</p>
                  </div>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold shrink-0 ${
                      a.status === "ongoing"
                        ? "bg-green-500/15 text-green-400"
                        : a.status === "completed"
                          ? "bg-blue-500/15 text-blue-400"
                          : "bg-amber-500/15 text-amber-400"
                    }`}
                  >
                    {a.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Performing */}
          <div className="bg-card border border-white/10 rounded-xl overflow-hidden">
            <div className="flex items-center gap-2 px-4 md:px-5 py-3.5 border-b border-white/10">
              <TrendingUp className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-semibold text-foreground">
                Top Performing
              </h2>
            </div>

            {/* Desktop */}
            <table className="w-full text-sm hidden md:table">
              <tbody className="divide-y divide-white/5">
                {topAnime.map((a, i) => (
                  <tr key={a.id} className="hover:bg-white/3 transition-colors">
                    <td className="px-5 py-3 w-10">
                      <span
                        className={`text-xs font-black ${i === 0 ? "text-primary" : i === 1 ? "text-white/60" : "text-white/30"}`}
                      >
                        #{i + 1}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-foreground truncate text-xs max-w-[160px]">
                        {a.title}
                      </p>
                      <p className="text-[10px] text-white/40">
                        {a.genre.slice(0, 2).join(", ")}
                      </p>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <BarChart3 className="w-3 h-3 text-white/30" />
                        <p className="text-xs text-foreground font-medium">
                          {a.viewCount.toLocaleString()}
                        </p>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile */}
            <div className="md:hidden divide-y divide-white/5">
              {topAnime.map((a, i) => (
                <div key={a.id} className="flex items-center gap-3 px-4 py-3">
                  <span
                    className={`text-sm font-black w-6 shrink-0 ${i === 0 ? "text-primary" : "text-white/30"}`}
                  >
                    #{i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-foreground truncate text-xs">
                      {a.title}
                    </p>
                    <p className="text-[10px] text-white/40">
                      {a.genre.slice(0, 2).join(", ")}
                    </p>
                  </div>
                  <p className="text-xs text-white/50 font-medium shrink-0">
                    {a.viewCount.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
