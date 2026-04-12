import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Bookmark,
  Eye,
  EyeOff,
  KeyRound,
  LogOut,
  Menu,
  Shield,
  Tv2,
  User,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAdminAuth } from "../hooks/useAdminAuth";
import { useAuth } from "../hooks/useAuth";
import GenreFilter from "./GenreFilter";
import SearchBar from "./SearchBar";

interface NavBarProps {
  onGenreChange?: (genre: string | null) => void;
  activeGenre?: string | null;
}

type LoginTab = "user" | "admin";

function LoginModal({ onClose }: { onClose: () => void }) {
  const { login, isLoggingIn: isIILoggingIn } = useAuth();
  const {
    loginWithCredentials,
    isLoggingIn: isAdminLoggingIn,
    error: adminError,
  } = useAdminAuth();
  const navigate = useNavigate();

  const [tab, setTab] = useState<LoginTab>("user");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await loginWithCredentials(username, password);
    // If login succeeded (no error), adminError will be null from the hook
    // We check after the call completes via a small effect
  };

  // Redirect to admin after successful admin login
  const { isAdminLoggedIn } = useAdminAuth();
  useEffect(() => {
    if (isAdminLoggedIn) {
      onClose();
      navigate({ to: "/admin" });
    }
  }, [isAdminLoggedIn, navigate, onClose]);

  const handleUserLogin = () => {
    login();
    onClose();
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.85)" }}
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape" && e.target === overlayRef.current) onClose();
      }}
      data-ocid="login-modal-overlay"
    >
      <div
        className="relative w-full max-w-sm rounded-xl border border-border bg-card shadow-2xl overflow-hidden"
        style={{
          animation: "modalSlideIn 0.22s cubic-bezier(0.4,0,0.2,1)",
        }}
        data-ocid="login-modal"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <div className="flex items-center gap-2">
            <Tv2 className="w-5 h-5 text-primary" />
            <span className="font-display font-bold text-lg text-foreground">
              Anime<span className="text-primary">Stream</span>
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            aria-label="Close login"
            data-ocid="login-modal-close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex mx-6 mb-5 rounded-lg overflow-hidden border border-border">
          <button
            type="button"
            className={`flex-1 py-2 text-sm font-medium transition-colors ${
              tab === "user"
                ? "bg-primary text-white"
                : "bg-muted/30 text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setTab("user")}
            data-ocid="login-tab-user"
          >
            <User className="w-3.5 h-3.5 inline mr-1.5 mb-0.5" />
            User Login
          </button>
          <button
            type="button"
            className={`flex-1 py-2 text-sm font-medium transition-colors ${
              tab === "admin"
                ? "bg-primary text-white"
                : "bg-muted/30 text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setTab("admin")}
            data-ocid="login-tab-admin"
          >
            <Shield className="w-3.5 h-3.5 inline mr-1.5 mb-0.5" />
            Admin Login
          </button>
        </div>

        <div className="px-6 pb-6">
          {/* User Login Tab */}
          {tab === "user" && (
            <div
              className="flex flex-col items-center gap-4 py-2"
              data-ocid="login-user-panel"
            >
              <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
                <User className="w-7 h-7 text-primary" />
              </div>
              <div className="text-center">
                <p className="text-foreground font-medium mb-1">
                  Sign in with Internet Identity
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Use your Internet Identity to securely log in. Your watchlist
                  and preferences will sync automatically.
                </p>
              </div>
              <Button
                onClick={handleUserLogin}
                disabled={isIILoggingIn}
                className="w-full bg-primary hover:bg-primary/90 text-white font-semibold"
                data-ocid="login-ii-btn"
              >
                {isIILoggingIn ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Connecting...
                  </span>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4 mr-2" />
                    Continue with Internet Identity
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Admin Login Tab */}
          {tab === "admin" && (
            <form
              onSubmit={handleAdminSubmit}
              className="flex flex-col gap-4"
              data-ocid="login-admin-panel"
            >
              <div className="flex flex-col items-center gap-2 pb-1">
                <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
                  <Shield className="w-7 h-7 text-primary" />
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  Admin access only. Enter your credentials below.
                </p>
              </div>

              {adminError && (
                <div
                  className="rounded-lg px-3 py-2.5 text-sm text-white font-medium"
                  style={{ background: "#E50914" }}
                  data-ocid="login-admin-error"
                >
                  {adminError}
                </div>
              )}

              <div className="space-y-1.5">
                <Label
                  htmlFor="admin-username"
                  className="text-xs text-muted-foreground uppercase tracking-wide"
                >
                  Username
                </Label>
                <Input
                  id="admin-username"
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Admin username"
                  className="bg-muted/40 border-border focus:border-primary"
                  required
                  data-ocid="login-admin-username"
                />
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="admin-password"
                  className="text-xs text-muted-foreground uppercase tracking-wide"
                >
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="admin-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Admin password"
                    className="bg-muted/40 border-border focus:border-primary pr-10"
                    required
                    data-ocid="login-admin-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    tabIndex={-1}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isAdminLoggingIn || !username || !password}
                className="w-full bg-primary hover:bg-primary/90 text-white font-semibold mt-1"
                data-ocid="login-admin-submit"
              >
                {isAdminLoggingIn ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Logging in...
                  </span>
                ) : (
                  <>
                    <Shield className="w-4 h-4 mr-2" />
                    Login as Admin
                  </>
                )}
              </Button>
            </form>
          )}
        </div>
      </div>

      <style>{`
        @keyframes modalSlideIn {
          from { opacity: 0; transform: translateY(-16px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
      `}</style>
    </div>
  );
}

export default function NavBar({ onGenreChange, activeGenre }: NavBarProps) {
  const { isLoggedIn, logout, principalId } = useAuth();
  const { isAdminLoggedIn, logout: adminLogout } = useAdminAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  return (
    <>
      <header
        className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border"
        data-ocid="navbar"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 h-16">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2 shrink-0"
              data-ocid="nav-logo"
            >
              <Tv2 className="w-7 h-7 text-primary" />
              <span className="font-display font-bold text-xl text-foreground hidden sm:block">
                Anime<span className="text-primary">Stream</span>
              </span>
            </Link>

            {/* Search */}
            <div className="flex-1 max-w-xl hidden md:block">
              <SearchBar />
            </div>

            {/* Genre filter */}
            <div className="hidden lg:block shrink-0">
              <GenreFilter
                activeGenre={activeGenre ?? null}
                onGenreChange={onGenreChange ?? (() => {})}
              />
            </div>

            <div className="flex-1 md:flex-none" />

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-3">
              {isAdminLoggedIn && (
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="border-primary/50 text-primary hover:bg-primary/10"
                >
                  <Link to="/admin" data-ocid="nav-admin">
                    <Shield className="w-4 h-4 mr-1.5" />
                    Admin
                  </Link>
                </Button>
              )}

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

              {isLoggedIn ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      data-ocid="nav-user-menu"
                    >
                      <User className="w-4 h-4" />
                      <span className="hidden lg:inline max-w-20 truncate text-xs">
                        {principalId?.slice(0, 8)}...
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
                      onClick={logout}
                      className="text-destructive focus:text-destructive cursor-pointer"
                      data-ocid="nav-logout"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => setLoginOpen(true)}
                  className="bg-primary hover:bg-primary/90 gap-1.5"
                  data-ocid="nav-login-btn"
                >
                  <KeyRound className="w-4 h-4" />
                  Login
                </Button>
              )}

              {/* Admin logout button when admin is logged in but user is not */}
              {isAdminLoggedIn && !isLoggedIn && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={adminLogout}
                  className="text-muted-foreground hover:text-foreground gap-1.5"
                  data-ocid="nav-admin-logout"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              )}
            </div>

            {/* Mobile menu toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileOpen && (
          <div className="md:hidden bg-card border-t border-border px-4 py-4 flex flex-col gap-3 animate-slide-up">
            <SearchBar />
            <div className="flex flex-wrap gap-2">
              {isAdminLoggedIn && (
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="border-primary/50 text-primary"
                >
                  <Link to="/admin" onClick={() => setMobileOpen(false)}>
                    <Shield className="w-4 h-4 mr-1.5" />
                    Admin
                  </Link>
                </Button>
              )}
              <Button variant="ghost" size="sm" asChild>
                <Link to="/watchlist" onClick={() => setMobileOpen(false)}>
                  <Bookmark className="w-4 h-4 mr-1.5" />
                  Watchlist
                </Link>
              </Button>
              {isLoggedIn ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    logout();
                    setMobileOpen(false);
                  }}
                  data-ocid="mobile-logout"
                >
                  <LogOut className="w-4 h-4 mr-1.5" />
                  Sign Out
                </Button>
              ) : (
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => {
                    setMobileOpen(false);
                    setLoginOpen(true);
                  }}
                  className="bg-primary hover:bg-primary/90 gap-1.5"
                  data-ocid="mobile-login-btn"
                >
                  <KeyRound className="w-4 h-4" />
                  Login
                </Button>
              )}
              {isAdminLoggedIn && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    adminLogout();
                    setMobileOpen(false);
                  }}
                  className="text-muted-foreground"
                  data-ocid="mobile-admin-logout"
                >
                  <LogOut className="w-4 h-4 mr-1.5" />
                  Admin Logout
                </Button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Login Modal */}
      {loginOpen && <LoginModal onClose={() => setLoginOpen(false)} />}
    </>
  );
}
