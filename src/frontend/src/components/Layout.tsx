import { Link } from "@tanstack/react-router";
import { Eye, Tv2 } from "lucide-react";
import { isPreviewMode } from "../lib/modeContext";
import NavBar from "./NavBar";
import { ToastContainer } from "./Toast";

interface LayoutProps {
  children: React.ReactNode;
  hideNav?: boolean;
  onGenreChange?: (genre: string | null) => void;
  activeGenre?: string | null;
}

export default function Layout({
  children,
  hideNav = false,
  onGenreChange,
  activeGenre,
}: LayoutProps) {
  const inPreview = isPreviewMode();

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Preview mode indicator */}
      {inPreview && (
        <div
          className="fixed top-0 right-0 z-[200] flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-bl-lg"
          style={{
            background: "oklch(0.52 0.23 23 / 0.95)",
            color: "oklch(0.98 0 0)",
            boxShadow: "0 2px 8px oklch(0.52 0.23 23 / 0.4)",
          }}
          data-ocid="preview-indicator"
        >
          <Eye className="w-3 h-3" />
          Preview Mode
        </div>
      )}

      {!hideNav && (
        <NavBar onGenreChange={onGenreChange} activeGenre={activeGenre} />
      )}

      <main className="flex-1">{children}</main>

      <footer className="bg-card border-t border-border py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Tv2 className="w-5 h-5 text-primary" />
              <span className="font-display font-bold text-foreground">
                Anime<span className="text-primary">Stream</span>
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link to="/" className="hover:text-foreground transition-colors">
                Home
              </Link>
              <Link
                to="/watchlist"
                className="hover:text-foreground transition-colors"
              >
                Watchlist
              </Link>
              <span>About</span>
            </div>
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()}. Built with love using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                  typeof window !== "undefined" ? window.location.hostname : "",
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>

      {/* Global toast notifications */}
      <ToastContainer />
    </div>
  );
}
