/**
 * PreviewLoginPage — admin login for /preview/login
 * Netflix dark theme, admin-only, no signup.
 * Includes brute-force lockout UI: attempt counter + countdown timer.
 */
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  AlertTriangle,
  Clock,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Shield,
  Tv2,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useAdminAuth } from "../hooks/useAdminAuth";

function formatCountdown(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function PreviewLoginPage() {
  const navigate = useNavigate();
  const {
    isAdminLoggedIn,
    loginWithCredentials,
    isLoggingIn,
    error,
    failedAttempts,
    maxAttempts,
    isLocked,
    lockoutSecondsLeft,
  } = useAdminAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAdminLoggedIn) {
      void navigate({ to: "/preview/admin" });
    }
  }, [isAdminLoggedIn, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return;
    await loginWithCredentials(username.trim(), password);
  };

  const attemptsUsed = Math.min(failedAttempts, maxAttempts);
  const showAttemptWarning = attemptsUsed > 0 && !isLocked;

  return (
    <div
      className="min-h-screen bg-background flex items-center justify-center p-4"
      data-ocid="preview-login-page"
    >
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]" />
      </div>

      {/* Preview Mode badge — top right corner */}
      <div className="fixed top-4 right-4 z-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-primary/20 text-primary border border-primary/30 shadow-lg">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          Preview Mode
        </span>
      </div>

      <div className="relative w-full max-w-[400px] space-y-6">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center space-y-5"
        >
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
            <p className="text-sm text-muted-foreground font-medium">
              Admin Login
            </p>
          </div>
        </motion.div>

        {/* Login card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-2xl"
        >
          <div className="mb-6">
            <h1 className="font-display font-bold text-2xl text-foreground">
              Sign In as Admin
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Authorized personnel only.
            </p>
          </div>

          {/* Lockout state */}
          {isLocked && (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-3 bg-destructive/10 border border-destructive/30 rounded-xl px-4 py-5 mb-5"
              data-ocid="preview-lockout-banner"
            >
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-destructive shrink-0" />
                <p className="text-sm font-semibold text-destructive">
                  Account Temporarily Locked
                </p>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                {maxAttempts} failed attempts detected. Please wait before
                trying again.
              </p>
              <div
                className="flex items-center gap-2 bg-background/50 border border-destructive/20 rounded-lg px-4 py-2"
                data-ocid="lockout-countdown"
              >
                <Clock className="w-4 h-4 text-destructive" />
                <span className="font-mono text-lg font-bold text-destructive tabular-nums">
                  {formatCountdown(lockoutSecondsLeft)}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Locked until timer reaches 00:00
              </p>
            </motion.div>
          )}

          {/* Attempt warning (not yet locked) */}
          {showAttemptWarning && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between bg-yellow-500/10 border border-yellow-500/25 rounded-xl px-3.5 py-2.5 mb-4"
              data-ocid="preview-attempt-counter"
            >
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-400 shrink-0" />
                <span className="text-xs text-yellow-300 font-medium">
                  Failed attempts
                </span>
              </div>
              <div className="flex items-center gap-1">
                {(["1", "2", "3", "4", "5"] as const)
                  .slice(0, maxAttempts)
                  .map((key, i) => (
                    <div
                      key={key}
                      className={[
                        "w-2.5 h-2.5 rounded-full transition-colors",
                        i < attemptsUsed
                          ? "bg-red-500"
                          : "bg-muted-foreground/30",
                      ].join(" ")}
                    />
                  ))}
                <span className="text-xs text-muted-foreground ml-1.5 font-mono">
                  {attemptsUsed}/{maxAttempts}
                </span>
              </div>
            </motion.div>
          )}

          {/* Generic error (no lockout) */}
          {error && !isLocked && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-2.5 bg-destructive/10 border border-destructive/25 rounded-xl px-3.5 py-3 text-sm text-destructive mb-5"
              data-ocid="preview-login-error"
            >
              <Shield className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username / Email */}
            <div className="space-y-1.5">
              <Label
                htmlFor="preview-username"
                className="text-muted-foreground text-xs font-semibold uppercase tracking-wider"
              >
                Email or Username
              </Label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50 pointer-events-none" />
                <Input
                  id="preview-username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin@anime.com"
                  autoComplete="username"
                  disabled={isLoggingIn || isLocked}
                  className="pl-10 h-12 bg-secondary/40 border-border focus:border-primary/50 transition-colors disabled:opacity-50"
                  data-ocid="preview-login-username"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label
                htmlFor="preview-password"
                className="text-muted-foreground text-xs font-semibold uppercase tracking-wider"
              >
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50 pointer-events-none" />
                <Input
                  id="preview-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  autoComplete="current-password"
                  disabled={isLoggingIn || isLocked}
                  className="pl-10 pr-12 h-12 bg-secondary/40 border-border focus:border-primary/50 transition-colors disabled:opacity-50"
                  data-ocid="preview-login-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-muted-foreground transition-colors p-1"
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
              disabled={
                isLoggingIn || isLocked || !username.trim() || !password.trim()
              }
              size="lg"
              className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold gap-2 mt-2 text-sm disabled:opacity-60"
              data-ocid="preview-login-submit"
            >
              {isLocked ? (
                <>
                  <Clock className="w-4 h-4" />
                  Locked — {formatCountdown(lockoutSecondsLeft)}
                </>
              ) : isLoggingIn ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Verifying…
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  Sign In as Admin
                </>
              )}
            </Button>
          </form>

          <div className="mt-5 pt-5 border-t border-border flex items-center justify-center">
            <p className="text-[11px] text-muted-foreground/50 text-center">
              Access restricted to authorized administrators only
            </p>
          </div>
        </motion.div>

        <div className="text-center">
          <Link
            to="/"
            className="text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors hover:underline"
            data-ocid="preview-login-back"
          >
            ← Back to AnimeStream
          </Link>
        </div>
      </div>
    </div>
  );
}
