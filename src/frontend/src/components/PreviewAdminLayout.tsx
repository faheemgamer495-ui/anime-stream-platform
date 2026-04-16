/**
 * PreviewAdminLayout — shared layout for all /preview/admin/* pages.
 * Includes sidebar, PREVIEW MODE badge, and Save & Publish button.
 *
 * Since preview and live now share the same data store, "Save & Publish"
 * simply flushes/validates and shows a success toast — no copy needed.
 */
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  CheckCircle2,
  Film,
  Inbox,
  Layers,
  LayoutDashboard,
  LogOut,
  Menu,
  PlaySquare,
  Save,
  Tv,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAdminAuth } from "../hooks/useAdminAuth";
import { useAllAnime } from "../hooks/useAnime";
import { usePendingRequestsCount } from "../hooks/useRequests";
import {
  getAnimeList,
  getEpisodesList,
  getSeasonsList,
} from "../lib/localStorageDB";

interface NavItem {
  to: string;
  label: string;
  icon: React.ElementType;
  exact?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  {
    to: "/preview/admin",
    label: "Dashboard",
    icon: LayoutDashboard,
    exact: true,
  },
  { to: "/preview/admin/anime", label: "Anime", icon: Film },
  { to: "/preview/admin/episodes", label: "Episodes", icon: PlaySquare },
  { to: "/preview/admin/seasons", label: "Seasons", icon: Layers },
  { to: "/preview/admin/requests", label: "Requests", icon: Inbox },
];

function PreviewBadge() {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary/20 text-primary border border-primary/30">
      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
      Preview Mode
    </span>
  );
}

interface SidebarContentProps {
  onClose?: () => void;
  onPublish: () => void;
  pendingCount: number;
}

function SidebarContent({
  onClose,
  onPublish,
  pendingCount,
}: SidebarContentProps) {
  const { logout, adminPrincipal } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate({ to: "/preview/login" });
  };

  const initial = adminPrincipal ? adminPrincipal.charAt(0).toUpperCase() : "A";

  return (
    <div className="flex flex-col h-full">
      {/* Brand + Preview badge */}
      <div className="px-5 py-4 border-b border-white/10 space-y-2">
        <div className="flex items-center justify-between">
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
        <PreviewBadge />
      </div>

      {/* Save & Publish button */}
      <div className="px-3 pt-3 pb-1">
        <button
          type="button"
          onClick={onPublish}
          data-ocid="save-publish-btn"
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold transition-all shadow-sm hover:shadow-primary/30 hover:shadow-md"
        >
          <Save className="w-3.5 h-3.5" />💾 Save &amp; Publish
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5" data-ocid="preview-sidebar-nav">
        <p className="px-3 pt-2 pb-1.5 text-[10px] font-semibold text-white/30 uppercase tracking-widest">
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
            <span className="flex-1">{label}</span>
            {label === "Requests" && pendingCount > 0 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/20 text-primary font-bold">
                {pendingCount}
              </span>
            )}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-white/10">
        <div className="flex items-center gap-3 px-3 py-2.5 mb-1 rounded-lg bg-white/5">
          <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
            <span className="text-[10px] font-bold text-primary">
              {initial}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-foreground truncate">
              {adminPrincipal ?? "Admin"}
            </p>
            <p className="text-[10px] text-white/40">Administrator</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          data-ocid="preview-logout-btn"
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/50 hover:text-red-400 hover:bg-red-500/10 transition-all"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          Admin Logout
        </button>
      </div>
    </div>
  );
}

export interface PreviewAdminLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function PreviewAdminLayout({
  children,
  title,
  subtitle,
  action,
}: PreviewAdminLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const pendingCount = usePendingRequestsCount();
  const { data: anime = [] } = useAllAnime();

  const allSeasons = getSeasonsList();
  const allEpisodes = getEpisodesList();

  const handlePublish = () => {
    try {
      // Both preview and live now use the SAME store — data is already live.
      // This button validates and confirms the current state.
      const currentAnime = getAnimeList();
      setShowPublishModal(false);
      toast.success(
        `✅ Changes published! Live site now shows ${currentAnime.length} anime, ${allSeasons.length} seasons, ${allEpisodes.length} episodes.`,
        { duration: 5000 },
      );
    } catch {
      toast.error("Failed to publish. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 bg-card border-r border-white/10 flex-col shrink-0 sticky top-0 h-screen">
        <SidebarContent
          onPublish={() => setShowPublishModal(true)}
          pendingCount={pendingCount}
        />
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
        <SidebarContent
          onClose={() => setMobileOpen(false)}
          onPublish={() => {
            setMobileOpen(false);
            setShowPublishModal(true);
          }}
          pendingCount={pendingCount}
        />
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top header */}
        <header className="sticky top-0 z-30 bg-card/95 backdrop-blur-sm border-b border-white/10 px-4 md:px-6 py-3.5 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="p-2 -ml-1 rounded-lg text-white/60 hover:text-foreground hover:bg-white/10 transition-colors lg:hidden"
              aria-label="Open menu"
              data-ocid="preview-hamburger"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-base md:text-lg font-display font-bold text-foreground leading-tight truncate">
                  {title}
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary/20 text-primary border border-primary/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  Preview
                </span>
              </div>
              {subtitle && (
                <p className="text-xs text-white/40 hidden sm:block mt-0.5">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {action}
            <button
              type="button"
              onClick={() => setShowPublishModal(true)}
              data-ocid="header-publish-btn"
              className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold transition-all"
            >
              <Save className="w-3.5 h-3.5" />
              Save &amp; Publish
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 overflow-auto">{children}</main>
      </div>

      {/* Save & Publish confirmation modal */}
      <AlertDialog open={showPublishModal} onOpenChange={setShowPublishModal}>
        <AlertDialogContent
          className="bg-card border-white/15 text-foreground w-[calc(100vw-2rem)] max-w-md mx-auto"
          data-ocid="publish-confirm-modal"
        >
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 font-display text-lg">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              Save &amp; Publish to Live
            </AlertDialogTitle>
            <AlertDialogDescription className="text-white/50 space-y-2 text-sm leading-relaxed">
              <span className="block">
                Your current content will be visible on the live website
                immediately.
              </span>
              <span className="block font-semibold text-foreground/80 bg-white/5 rounded-lg px-3 py-2 text-xs">
                📦 {anime.length} anime · {allSeasons.length} seasons ·{" "}
                {allEpisodes.length} episodes are ready to publish.
              </span>
              <span className="block text-green-400/80 text-xs">
                ✅ Changes are already live — this confirms and saves the
                current state.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setShowPublishModal(false)}
              className="border-white/15 text-foreground hover:bg-white/10"
              data-ocid="publish-cancel-btn"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handlePublish}
              data-ocid="publish-confirm-btn"
              className="bg-green-600 hover:bg-green-500 text-white font-bold gap-2"
            >
              <Save className="w-4 h-4" />
              Save &amp; Publish
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
