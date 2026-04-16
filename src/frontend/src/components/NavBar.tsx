import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Bookmark,
  LogOut,
  Menu,
  Search,
  Shield,
  Tv2,
  User,
  UserPlus,
  X,
} from "lucide-react";
import {
  type KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useAppContext } from "../context/AppContext";
import { useAdminAuth } from "../hooks/useAdminAuth";
import { useAuth } from "../hooks/useAuth";
import { isPreviewMode } from "../lib/modeContext";
import type { Anime } from "../types";
import GenreFilter from "./GenreFilter";

interface NavBarProps {
  onGenreChange?: (genre: string | null) => void;
  activeGenre?: string | null;
}

function useSearchDropdown() {
  const { anime } = useAppContext();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Anime[]>([]);
  const [open, setOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const search = useCallback(
    (q: string) => {
      setQuery(q);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (!q.trim()) {
        setResults([]);
        setOpen(false);
        return;
      }
      debounceRef.current = setTimeout(() => {
        const lower = q.toLowerCase();
        const found = anime
          .filter(
            (a) =>
              a.title.toLowerCase().includes(lower) ||
              a.genres.some((g) => g.toLowerCase().includes(lower)),
          )
          .slice(0, 8)
          .map((a) => ({
            id: a.id,
            title: a.title,
            genre: a.genres,
            rating: a.rating,
            thumbnailUrl: a.coverImageUrl,
            coverImageUrl: a.coverImageUrl,
            isFeatured: a.isFeatured,
            episodeCount: 0,
            viewCount: Number(a.viewCount),
            releaseYear: new Date().getFullYear(),
            status: "ongoing" as const,
            description: a.description,
            createdAt: Date.now(),
          }));
        setResults(found);
        setOpen(found.length > 0);
      }, 300);
    },
    [anime],
  );

  const clear = () => {
    setQuery("");
    setResults([]);
    setOpen(false);
  };

  return { query, search, results, open, setOpen, clear };
}

export default function NavBar({ onGenreChange, activeGenre }: NavBarProps) {
  const { isLoggedIn, user, logout } = useAuth();
  const { isAdminLoggedIn, logout: adminLogout } = useAdminAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSearch, setMobileSearch] = useState(false);
  const navigate = useNavigate();
  const inPreview = isPreviewMode();
  const searchRef = useRef<HTMLDivElement>(null);
  const { query, search, results, open, setOpen, clear } = useSearchDropdown();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [setOpen]);

  const handleAdminLogout = () => {
    adminLogout();
    setMobileOpen(false);
    void navigate({ to: "/preview/login" });
  };

  const handleUserLogout = () => {
    logout();
    setMobileOpen(false);
    void navigate({ to: "/" });
  };

  const handleResultClick = (animeId: string) => {
    clear();
    setMobileOpen(false);
    setMobileSearch(false);
    void navigate({ to: "/anime/$id", params: { id: animeId } });
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      clear();
    }
  };

  return (
    <header
      className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border shadow-subtle"
      data-ocid="navbar"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 h-16">
          {/* Logo */}
          <Link
            to={inPreview ? "/preview/admin" : "/"}
            className="flex items-center gap-2 shrink-0"
            data-ocid="nav-logo"
          >
            <Tv2 className="w-7 h-7 text-primary" />
            <span className="font-display font-bold text-xl text-foreground hidden sm:block">
              Anime<span className="text-primary">Stream</span>
            </span>
          </Link>

          {/* Search (live only, desktop) */}
          {!inPreview && (
            <div className="flex-1 max-w-md hidden md:block" ref={searchRef}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => search(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={() => query && setOpen(results.length > 0)}
                  placeholder="Search anime..."
                  className="w-full h-9 pl-9 pr-9 bg-secondary/50 border border-input rounded-md text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring transition-colors"
                  data-ocid="nav-search-input"
                />
                {query && (
                  <button
                    type="button"
                    onClick={clear}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}

                {/* Dropdown */}
                {open && (
                  <div className="absolute top-full mt-1 left-0 right-0 bg-popover border border-border rounded-md shadow-lg overflow-hidden z-50">
                    {results.map((anime) => (
                      <button
                        key={anime.id}
                        type="button"
                        onClick={() => handleResultClick(anime.id)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-secondary/60 transition-colors text-left"
                        data-ocid={`search-result-${anime.id}`}
                      >
                        <img
                          src={
                            anime.thumbnailUrl ||
                            "/assets/generated/hero-banner.dim_1920x800.jpg"
                          }
                          alt={anime.title}
                          className="w-8 h-10 object-cover rounded shrink-0 bg-muted"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-foreground truncate">
                            {anime.title}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {anime.genre.slice(0, 2).join(" · ")}
                          </p>
                        </div>
                        <span className="text-xs text-muted-foreground shrink-0">
                          ★ {anime.rating.toFixed(1)}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Genre filter (live only, large screens) */}
          {!inPreview && (
            <div className="hidden lg:block shrink-0">
              <GenreFilter
                activeGenre={activeGenre ?? null}
                onGenreChange={onGenreChange ?? (() => {})}
              />
            </div>
          )}

          <div className="flex-1 md:flex-none" />

          {/* Mobile search toggle (live only) */}
          {!inPreview && (
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => {
                setMobileSearch((v) => !v);
                setMobileOpen(false);
              }}
              aria-label="Toggle search"
              data-ocid="nav-mobile-search-toggle"
            >
              <Search className="w-5 h-5" />
            </Button>
          )}

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Preview mode */}
            {inPreview ? (
              isAdminLoggedIn ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="border-primary/50 text-primary hover:bg-primary/10"
                    data-ocid="nav-admin-panel"
                  >
                    <Link to="/preview/admin">
                      <Shield className="w-4 h-4 mr-1.5" />
                      Admin Panel
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleAdminLogout}
                    className="text-muted-foreground hover:text-foreground gap-1.5"
                    data-ocid="nav-admin-logout"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden lg:inline">Admin Logout</span>
                  </Button>
                </>
              ) : (
                <Button
                  variant="default"
                  size="sm"
                  asChild
                  className="bg-primary hover:bg-primary/90 gap-1.5"
                  data-ocid="nav-admin-login"
                >
                  <Link to="/preview/login">
                    <Shield className="w-4 h-4 mr-1" />
                    Admin Login
                  </Link>
                </Button>
              )
            ) : (
              /* Live mode */
              <>
                {isLoggedIn ? (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="gap-1.5"
                      data-ocid="nav-watchlist"
                    >
                      <Link to="/watchlist">
                        <Bookmark className="w-4 h-4" />
                        <span className="hidden lg:inline">Watchlist</span>
                      </Link>
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2"
                          data-ocid="nav-user-menu"
                        >
                          <User className="w-4 h-4" />
                          <span className="hidden lg:inline max-w-24 truncate text-xs">
                            {user?.username}
                          </span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="bg-card border-border"
                      >
                        <DropdownMenuItem asChild>
                          <Link to="/watchlist" className="cursor-pointer">
                            <Bookmark className="w-4 h-4 mr-2" />
                            My Watchlist
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={handleUserLogout}
                          className="text-destructive focus:text-destructive cursor-pointer"
                          data-ocid="nav-logout"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Sign Out
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="gap-1.5"
                      data-ocid="nav-login-btn"
                    >
                      <Link to="/login">
                        <User className="w-4 h-4" />
                        Login
                      </Link>
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      asChild
                      className="bg-primary hover:bg-primary/90 gap-1.5"
                      data-ocid="nav-signup-btn"
                    >
                      <Link to="/login" search={{ mode: "signup" }}>
                        <UserPlus className="w-4 h-4" />
                        Sign Up
                      </Link>
                    </Button>
                  </>
                )}
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => {
              setMobileOpen((v) => !v);
              setMobileSearch(false);
            }}
            aria-label="Toggle menu"
            data-ocid="nav-mobile-menu-toggle"
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile search bar */}
      {mobileSearch && !inPreview && (
        <div
          className="md:hidden bg-card border-t border-border px-4 py-3"
          ref={searchRef}
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => search(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search anime..."
              ref={(el) => el?.focus()}
              className="w-full h-9 pl-9 pr-9 bg-secondary/50 border border-input rounded-md text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              data-ocid="nav-mobile-search-input"
            />
            {query && (
              <button
                type="button"
                onClick={clear}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          {open && (
            <div className="mt-1 bg-popover border border-border rounded-md overflow-hidden">
              {results.map((anime) => (
                <button
                  key={anime.id}
                  type="button"
                  onClick={() => handleResultClick(anime.id)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-secondary/60 transition-colors text-left"
                >
                  <img
                    src={
                      anime.thumbnailUrl ||
                      "/assets/generated/hero-banner.dim_1920x800.jpg"
                    }
                    alt={anime.title}
                    className="w-8 h-10 object-cover rounded shrink-0 bg-muted"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground truncate">
                      {anime.title}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {anime.genre.slice(0, 2).join(" · ")}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Mobile dropdown menu */}
      {mobileOpen && (
        <div className="md:hidden bg-card border-t border-border px-4 py-4 flex flex-col gap-3">
          {/* Genre filter on mobile */}
          {!inPreview && (
            <div className="overflow-x-auto">
              <GenreFilter
                activeGenre={activeGenre ?? null}
                onGenreChange={(g) => {
                  onGenreChange?.(g);
                  setMobileOpen(false);
                }}
              />
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {/* Preview mobile */}
            {inPreview ? (
              isAdminLoggedIn ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="border-primary/50 text-primary"
                  >
                    <Link
                      to="/preview/admin"
                      onClick={() => setMobileOpen(false)}
                    >
                      <Shield className="w-4 h-4 mr-1.5" />
                      Admin Panel
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleAdminLogout}
                    className="text-muted-foreground"
                    data-ocid="mobile-admin-logout"
                  >
                    <LogOut className="w-4 h-4 mr-1.5" />
                    Admin Logout
                  </Button>
                </>
              ) : (
                <Button
                  variant="default"
                  size="sm"
                  asChild
                  className="bg-primary hover:bg-primary/90"
                >
                  <Link
                    to="/preview/login"
                    onClick={() => setMobileOpen(false)}
                  >
                    <Shield className="w-4 h-4 mr-1.5" />
                    Admin Login
                  </Link>
                </Button>
              )
            ) : isLoggedIn ? (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/watchlist" onClick={() => setMobileOpen(false)}>
                    <Bookmark className="w-4 h-4 mr-1.5" />
                    Watchlist
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleUserLogout}
                  data-ocid="mobile-logout"
                >
                  <LogOut className="w-4 h-4 mr-1.5" />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/login" onClick={() => setMobileOpen(false)}>
                    <User className="w-4 h-4 mr-1.5" />
                    User Login
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link
                    to="/preview/login"
                    onClick={() => setMobileOpen(false)}
                  >
                    <Shield className="w-4 h-4 mr-1.5" />
                    Admin Login
                  </Link>
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  asChild
                  className="bg-primary hover:bg-primary/90"
                  data-ocid="mobile-signup-btn"
                >
                  <Link
                    to="/login"
                    search={{ mode: "signup" }}
                    onClick={() => setMobileOpen(false)}
                  >
                    <UserPlus className="w-4 h-4 mr-1.5" />
                    Sign Up
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
