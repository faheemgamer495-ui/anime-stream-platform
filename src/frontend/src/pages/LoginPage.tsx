import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowLeft,
  Bookmark,
  Eye,
  EyeOff,
  Loader2,
  LogIn,
  Tv2,
  UserPlus,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";

const BENEFITS = [
  {
    icon: Bookmark,
    title: "Personal Watchlist",
    description:
      "Save anime and pick up where you left off — anytime, anywhere.",
  },
  {
    icon: Zap,
    title: "Episode Ratings & Comments",
    description: "Rate episodes and join the discussion with other fans.",
  },
  {
    icon: Tv2,
    title: "Anime Requests",
    description: "Request your favourite anime and track when it gets added.",
  },
];

type TabType = "login" | "signup";

export default function LoginPage() {
  const { isLoggedIn, login, signup, isLoggingIn, error, clearError } =
    useAuth();
  const navigate = useNavigate();
  // Read ?mode=signup from URL search params
  const search = useSearch({ strict: false }) as { mode?: string };
  const [tab, setTab] = useState<TabType>(
    search.mode === "signup" ? "signup" : "login",
  );

  // Form fields
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn) {
      void navigate({ to: "/" });
    }
  }, [isLoggedIn, navigate]);

  const switchTab = (t: TabType) => {
    setTab(t);
    setLocalError(null);
    clearError();
    setUsername("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    if (!username.trim() || !password) {
      setLocalError("Please fill in all fields.");
      return;
    }
    const ok = await login(username.trim(), password);
    if (ok) void navigate({ to: "/" });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    if (!username.trim() || !password) {
      setLocalError("Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      setLocalError("Passwords do not match.");
      return;
    }
    const ok = await signup(username.trim(), password);
    if (ok) void navigate({ to: "/" });
  };

  const displayError = localError ?? error;

  if (isLoggedIn) return null;

  return (
    <div
      className="min-h-[90vh] flex items-center justify-center px-4 py-12"
      data-ocid="login-page"
    >
      <div className="w-full max-w-4xl flex flex-col lg:flex-row gap-8 lg:gap-16 items-center">
        {/* Left: Benefits panel */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-1 space-y-8 text-center lg:text-left"
        >
          {/* Logo + Name */}
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-4">
            <div className="w-14 h-14 bg-primary/15 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Tv2 className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h1 className="font-display font-black text-4xl lg:text-5xl text-foreground leading-none">
                Anime<span className="text-primary">Stream</span>
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                Your anime universe, always on
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="font-display font-bold text-2xl text-foreground">
              Join thousands of anime fans
            </h2>
            <p className="text-muted-foreground leading-relaxed max-w-sm mx-auto lg:mx-0">
              Track what you watch, rate episodes, leave comments, and never
              lose your place again.
            </p>
          </div>

          {/* Benefits list */}
          <div className="space-y-4">
            {BENEFITS.map(({ icon: Icon, title, description }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 + i * 0.1 }}
                className="flex items-start gap-3 text-left"
              >
                <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">
                    {title}
                  </p>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    {description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right: Auth card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="w-full lg:w-[400px] flex-shrink-0"
        >
          <div className="bg-card border border-border rounded-2xl shadow-xl overflow-hidden">
            {/* Tab switcher */}
            <div className="grid grid-cols-2 border-b border-border">
              <button
                type="button"
                onClick={() => switchTab("login")}
                data-ocid="tab-login"
                className={[
                  "flex items-center justify-center gap-2 py-4 text-sm font-semibold transition-colors",
                  tab === "login"
                    ? "text-primary border-b-2 border-primary bg-primary/5"
                    : "text-muted-foreground hover:text-foreground",
                ].join(" ")}
              >
                <LogIn className="w-4 h-4" />
                Login
              </button>
              <button
                type="button"
                onClick={() => switchTab("signup")}
                data-ocid="tab-signup"
                className={[
                  "flex items-center justify-center gap-2 py-4 text-sm font-semibold transition-colors",
                  tab === "signup"
                    ? "text-primary border-b-2 border-primary bg-primary/5"
                    : "text-muted-foreground hover:text-foreground",
                ].join(" ")}
              >
                <UserPlus className="w-4 h-4" />
                Sign Up
              </button>
            </div>

            <div className="p-7 space-y-5">
              {/* Error message */}
              {displayError && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-2.5 bg-destructive/10 border border-destructive/30 rounded-lg px-4 py-3"
                  data-ocid="auth-error"
                >
                  <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
                  <p className="text-destructive text-sm leading-snug">
                    {displayError}
                  </p>
                </motion.div>
              )}

              {tab === "login" ? (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="login-username"
                      className="text-sm font-medium text-foreground"
                    >
                      Username
                    </Label>
                    <Input
                      id="login-username"
                      type="text"
                      placeholder="Your username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      autoComplete="username"
                      disabled={isLoggingIn}
                      className="bg-background border-input focus:border-primary/50"
                      data-ocid="login-username-input"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="login-password"
                      className="text-sm font-medium text-foreground"
                    >
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"
                        disabled={isLoggingIn}
                        className="bg-background border-input focus:border-primary/50 pr-10"
                        data-ocid="login-password-input"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
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
                    disabled={isLoggingIn}
                    size="lg"
                    className="w-full bg-primary hover:bg-primary/90 text-white gap-2 font-semibold h-11"
                    data-ocid="login-submit-btn"
                  >
                    {isLoggingIn ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Signing in…
                      </>
                    ) : (
                      <>
                        <LogIn className="w-4 h-4" />
                        Sign In
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    No account yet?{" "}
                    <button
                      type="button"
                      onClick={() => switchTab("signup")}
                      className="text-primary hover:underline font-semibold"
                    >
                      Sign up free
                    </button>
                  </p>
                </form>
              ) : (
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="signup-username"
                      className="text-sm font-medium text-foreground"
                    >
                      Username
                    </Label>
                    <Input
                      id="signup-username"
                      type="text"
                      placeholder="Choose a username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      autoComplete="username"
                      disabled={isLoggingIn}
                      className="bg-background border-input focus:border-primary/50"
                      data-ocid="signup-username-input"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="signup-email"
                      className="text-sm font-medium text-foreground"
                    >
                      Email{" "}
                      <span className="text-muted-foreground text-xs">
                        (optional)
                      </span>
                    </Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                      disabled={isLoggingIn}
                      className="bg-background border-input focus:border-primary/50"
                      data-ocid="signup-email-input"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="signup-password"
                      className="text-sm font-medium text-foreground"
                    >
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="At least 6 characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="new-password"
                        disabled={isLoggingIn}
                        className="bg-background border-input focus:border-primary/50 pr-10"
                        data-ocid="signup-password-input"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
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
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="signup-confirm"
                      className="text-sm font-medium text-foreground"
                    >
                      Confirm Password
                    </Label>
                    <Input
                      id="signup-confirm"
                      type={showPassword ? "text" : "password"}
                      placeholder="Repeat password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      autoComplete="new-password"
                      disabled={isLoggingIn}
                      className="bg-background border-input focus:border-primary/50"
                      data-ocid="signup-confirm-input"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isLoggingIn}
                    size="lg"
                    className="w-full bg-primary hover:bg-primary/90 text-white gap-2 font-semibold h-11"
                    data-ocid="signup-submit-btn"
                  >
                    {isLoggingIn ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Creating account…
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" />
                        Create Account
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => switchTab("login")}
                      className="text-primary hover:underline font-semibold"
                    >
                      Sign in
                    </button>
                  </p>
                </form>
              )}
            </div>
          </div>

          {/* Back to home */}
          <div className="mt-5 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              data-ocid="back-to-home"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to home
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
