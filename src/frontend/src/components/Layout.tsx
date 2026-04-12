import { Link } from "@tanstack/react-router";
import { Tv2 } from "lucide-react";
import AiChatWidget from "./AiChatWidget";
import NavBar from "./NavBar";

interface LayoutProps {
  children: React.ReactNode;
  hideNav?: boolean;
}

export default function Layout({ children, hideNav = false }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {!hideNav && <NavBar />}
      <main className="flex-1">{children}</main>
      <footer className="bg-card border-t border-border py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Tv2 className="w-5 h-5 text-primary" />
              <span className="font-display font-bold text-foreground">
                AnimeStream
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
              <span className="cursor-default hover:text-foreground transition-colors">
                About
              </span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <p className="text-xs text-muted-foreground">
                © {new Date().getFullYear()}. Built with love using{" "}
                <a
                  href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                    typeof window !== "undefined"
                      ? window.location.hostname
                      : "",
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
        </div>
      </footer>
      <AiChatWidget />
    </div>
  );
}
