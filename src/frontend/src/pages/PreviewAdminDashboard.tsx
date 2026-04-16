/**
 * PreviewAdminDashboard — /preview/admin
 * Stats + quick actions + ICP persistent storage banner + recent anime with CRUD.
 */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  BarChart3,
  CheckCircle2,
  Clock,
  Database,
  Edit2,
  Eye,
  Film,
  Inbox,
  Layers,
  PlaySquare,
  Star,
  Trash2,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { AnimePublic } from "../backend";
import { PreviewAdminLayout } from "../components/PreviewAdminLayout";
import SaveStateIndicator, {
  type SaveState,
} from "../components/SaveStateIndicator";
import { useAppContext } from "../context/AppContext";
import { useAdminAuth } from "../hooks/useAdminAuth";
import { useAllAnime } from "../hooks/useAnime";
import { usePendingRequestsCount } from "../hooks/useRequests";
import { getEpisodesList, getSeasonsList } from "../lib/localStorageDB";
import type { Anime } from "../types";

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
    <Card className="bg-card border border-white/10 hover:border-white/20 transition-colors">
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

const QUICK_ACTIONS = [
  {
    to: "/preview/admin/anime",
    label: "Manage Anime",
    desc: "Add, edit, or remove anime series",
    icon: Film,
    ocid: "anime",
  },
  {
    to: "/preview/admin/episodes",
    label: "Manage Episodes",
    desc: "Add episodes with video URLs",
    icon: PlaySquare,
    ocid: "episodes",
  },
  {
    to: "/preview/admin/seasons",
    label: "Manage Seasons",
    desc: "Create and organize seasons",
    icon: Layers,
    ocid: "seasons",
  },
  {
    to: "/preview/admin/requests",
    label: "Anime Requests",
    desc: "Review user-submitted requests",
    icon: Inbox,
    ocid: "requests",
  },
];

export default function PreviewAdminDashboard() {
  const { isAdminLoggedIn } = useAdminAuth();
  const navigate = useNavigate();
  const { data: anime = [] } = useAllAnime();
  const { deleteAnime, loading } = useAppContext();
  const pendingRequestsCount = usePendingRequestsCount();
  const [saveState, setSaveState] = useState<SaveState>("idle");

  useEffect(() => {
    if (!isAdminLoggedIn) {
      navigate({ to: "/preview/login" });
    }
  }, [isAdminLoggedIn, navigate]);

  if (!isAdminLoggedIn) return null;

  const allEpisodes = getEpisodesList();
  const allSeasons = getSeasonsList();
  const totalViews = anime.reduce(
    (sum, a) => sum + Number(a.viewCount ?? 0),
    0,
  );
  const featuredCount = anime.filter((a) => a.isFeatured).length;
  const topAnime = [...anime]
    .sort((a, b) => Number(b.viewCount ?? 0) - Number(a.viewCount ?? 0))
    .slice(0, 5);
  const recentAnime = [...anime]
    .sort((a, b) => Number(b.createdAt ?? 0) - Number(a.createdAt ?? 0))
    .slice(0, 5);

  const isDeleting = Object.keys(loading).some(
    (k) => k.startsWith("admin.deleteAnime") && loading[k],
  );

  const handleQuickDelete = async (a: Anime) => {
    if (!confirm(`Delete "${a.title}"? This cannot be undone.`)) return;
    setSaveState("saving");
    try {
      await deleteAnime(a.id);
      setSaveState("saved");
      toast.success(`"${a.title}" deleted`);
      setTimeout(() => setSaveState("idle"), 2500);
    } catch {
      setSaveState("error");
      toast.error("Failed to delete anime");
      setTimeout(() => setSaveState("idle"), 3000);
    }
  };

  return (
    <PreviewAdminLayout
      title="Dashboard"
      subtitle="Admin panel — changes go live instantly"
    >
      <div className="space-y-6 md:space-y-8">
        {/* ICP Persistent Storage Banner */}
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-green-500/8 border border-green-500/20">
          <div className="w-8 h-8 rounded-lg bg-green-500/15 flex items-center justify-center shrink-0">
            <Database className="w-4 h-4 text-green-400" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-green-400">
              All data saved to cloud — powered by Internet Computer
            </p>
            <p className="text-[11px] text-white/40 mt-0.5">
              Anime, episodes, and seasons are stored permanently in ICP
              canister stable state
            </p>
          </div>
          <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
          <SaveStateIndicator state={saveState} className="shrink-0" />
        </div>

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
            icon={PlaySquare}
            label="Total Episodes"
            value={allEpisodes.length}
            sub="across all seasons"
            iconClass="bg-blue-500/15 text-blue-400"
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

        {/* Summary pills */}
        <div className="grid grid-cols-3 gap-3">
          {[
            {
              label: "Total Anime",
              value: anime.length,
              color: "text-primary",
            },
            {
              label: "Total Seasons",
              value: allSeasons.length,
              color: "text-blue-400",
            },
            {
              label: "Total Episodes",
              value: allEpisodes.length,
              color: "text-green-400",
            },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              className="bg-card border border-white/10 rounded-xl p-3.5 text-center"
            >
              <p className={`text-2xl font-display font-black ${color}`}>
                {value}
              </p>
              <p className="text-[10px] text-white/40 mt-1 font-medium">
                {label}
              </p>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div>
          <h2 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-3">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {QUICK_ACTIONS.map(({ to, label, desc, icon: Icon, ocid }) => (
              <Link key={to} to={to} data-ocid={`preview-quick-${ocid}`}>
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
          {/* Recently Added with quick actions */}
          <div className="bg-card border border-white/10 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 md:px-5 py-3.5 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Film className="w-4 h-4 text-primary" />
                <h2 className="text-sm font-semibold text-foreground">
                  Recently Added
                </h2>
              </div>
              <Link
                to="/preview/admin/anime"
                className="text-[11px] text-primary hover:underline font-medium"
              >
                View all →
              </Link>
            </div>
            {recentAnime.length === 0 ? (
              <div
                className="py-10 text-center text-white/30 text-sm"
                data-ocid="dashboard-recent-empty"
              >
                <Film className="w-10 h-10 mx-auto mb-2 opacity-20" />
                No anime yet
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {recentAnime.map((a, idx) => (
                  <div
                    key={a.id}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-white/3 transition-colors group"
                    data-ocid={`dashboard-recent-item.${idx + 1}`}
                  >
                    <img
                      src={a.coverImageUrl}
                      alt={a.title}
                      className="w-8 h-11 object-cover rounded shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-foreground truncate text-xs">
                        {a.title}
                      </p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Star className="w-2.5 h-2.5 text-amber-400 fill-current" />
                        <span className="text-[10px] text-white/40">
                          {a.rating}
                        </span>
                        {a.isFeatured && (
                          <span className="text-[9px] px-1 py-0.5 rounded bg-primary/15 text-primary font-semibold">
                            Featured
                          </span>
                        )}
                      </div>
                    </div>
                    {/* Quick actions — visible on hover */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                      <Link
                        to="/preview/admin/anime"
                        aria-label={`Edit ${a.title}`}
                        data-ocid={`dashboard-edit-anime.${idx + 1}`}
                        className="p-1.5 rounded-lg text-white/40 hover:text-foreground hover:bg-white/10 transition-colors min-h-[28px] min-w-[28px] flex items-center justify-center"
                      >
                        <Edit2 className="w-3 h-3" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleQuickDelete(a)}
                        disabled={isDeleting}
                        aria-label={`Delete ${a.title}`}
                        data-ocid={`dashboard-delete-anime.${idx + 1}`}
                        className="p-1.5 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors min-h-[28px] min-w-[28px] flex items-center justify-center"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Top Performing */}
          <div className="bg-card border border-white/10 rounded-xl overflow-hidden">
            <div className="flex items-center gap-2 px-4 md:px-5 py-3.5 border-b border-white/10">
              <TrendingUp className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-semibold text-foreground">
                Top Performing
              </h2>
            </div>
            {topAnime.length === 0 ? (
              <div className="py-10 text-center text-white/30 text-sm">
                No anime yet
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {topAnime.map((a, i) => (
                  <div key={a.id} className="flex items-center gap-3 px-4 py-3">
                    <span
                      className={`text-sm font-black w-6 shrink-0 ${
                        i === 0 ? "text-primary" : "text-white/30"
                      }`}
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
                    <div className="flex items-center gap-1 shrink-0">
                      <BarChart3 className="w-3 h-3 text-white/30" />
                      <p className="text-xs text-white/50">
                        {Number(a.viewCount ?? 0).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </PreviewAdminLayout>
  );
}
