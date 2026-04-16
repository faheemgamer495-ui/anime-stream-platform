import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, Loader2, Lock, Shield, Tv2, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useAdminAuth } from "../hooks/useAdminAuth";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { isAdminLoggedIn, loginWithCredentials, isLoggingIn, error } =
    useAdminAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAdminLoggedIn) navigate({ to: "/preview/admin" });
  }, [isAdminLoggedIn, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return;
    await loginWithCredentials(username.trim(), password);
  };

  return (
    <div
      className="min-h-screen bg-background flex items-center justify-center p-4"
      data-ocid="admin-login-page"
    >
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-primary/6 blur-[100px]" />
      </div>

      <div className="relative w-full max-w-[400px] space-y-6">
        {/* Logo */}
        <div className="text-center space-y-5">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/15 border border-primary/25 shadow-lg">
            <Shield className="w-7 h-7 text-primary" />
          </div>
          <div>
            <div className="flex items-center justify-center gap-2 mb-1.5">
              <Tv2 className="w-5 h-5 text-primary" />
              <span className="font-display font-black text-xl text-foreground tracking-tight">
                AnimeStream
              </span>
            </div>
            <p className="text-sm text-white/40">Admin Control Panel</p>
          </div>
        </div>

        {/* Login card */}
        <div className="bg-card border border-white/12 rounded-2xl p-6 md:p-8 shadow-2xl">
          <div className="mb-6">
            <h1 className="font-display font-bold text-2xl text-foreground">
              Sign In
            </h1>
            <p className="text-sm text-white/40 mt-1">
              Authorized personnel only.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div
              className="flex items-start gap-2.5 bg-red-500/10 border border-red-500/25 rounded-xl px-3.5 py-3 text-sm text-red-400 mb-5"
              data-ocid="admin-login-error"
            >
              <Shield className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div className="space-y-1.5">
              <Label
                htmlFor="admin-username"
                className="text-white/60 text-xs font-semibold uppercase tracking-wider"
              >
                Username
              </Label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                <Input
                  id="admin-username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter admin username"
                  autoComplete="username"
                  className="pl-10 h-12 bg-white/5 border-white/10 focus:border-primary/50 transition-colors"
                  data-ocid="admin-login-username"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label
                htmlFor="admin-password"
                className="text-white/60 text-xs font-semibold uppercase tracking-wider"
              >
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                <Input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  autoComplete="current-password"
                  className="pl-10 pr-12 h-12 bg-white/5 border-white/10 focus:border-primary/50 transition-colors"
                  data-ocid="admin-login-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors p-1"
                  aria-label={showPassword ? "Hide password" : "Show password"}
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
              disabled={isLoggingIn || !username.trim() || !password.trim()}
              size="lg"
              className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold gap-2 mt-2 text-sm"
              data-ocid="admin-login-submit"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  Sign In to Admin Panel
                </>
              )}
            </Button>
          </form>

          <div className="mt-5 pt-5 border-t border-white/8 flex items-center justify-center">
            <p className="text-[11px] text-white/25 text-center">
              Access restricted to authorized administrators only
            </p>
          </div>
        </div>

        <div className="text-center">
          <Link
            to="/"
            className="text-xs text-white/30 hover:text-white/60 transition-colors hover:underline"
          >
            ← Back to AnimeStream
          </Link>
        </div>
      </div>
    </div>
  );
}
