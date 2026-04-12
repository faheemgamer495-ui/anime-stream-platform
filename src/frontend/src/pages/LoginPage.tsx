import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowLeft,
  Bookmark,
  Loader2,
  LogIn,
  Shield,
  Tv2,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";
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
    title: "Personalized Experience",
    description:
      "Get recommendations tailored to your taste and watch history.",
  },
  {
    icon: Shield,
    title: "Secure & Passwordless",
    description: "Blockchain-backed identity — no passwords, no data breaches.",
  },
];

export default function LoginPage() {
  const { login, isLoggingIn, isLoggedIn, isInitializing, loginStatus } =
    useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (!isInitializing && isLoggedIn) {
      navigate({ to: "/" });
    }
  }, [isLoggedIn, isInitializing, navigate]);

  const hasError = loginStatus === "loginError";

  if (isInitializing) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isLoggedIn) return null; // redirect in effect

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
              Sign in to unlock everything
            </h2>
            <p className="text-muted-foreground leading-relaxed max-w-sm mx-auto lg:mx-0">
              Join thousands of anime fans. Track what you watch, discover new
              series, and never lose your place again.
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
                  <Icon className="w-4.5 h-4.5 text-primary" />
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

        {/* Right: Login card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="w-full lg:w-[380px] flex-shrink-0"
        >
          <div className="bg-card border border-border rounded-2xl p-8 space-y-7 shadow-xl">
            {/* Card header */}
            <div className="space-y-1 text-center">
              <h2 className="font-display font-bold text-xl text-foreground">
                Welcome Back
              </h2>
              <p className="text-muted-foreground text-sm">
                Sign in with Internet Identity — secure and passwordless.
              </p>
            </div>

            {/* Divider */}
            <div className="h-px bg-border" />

            {/* Error state */}
            {hasError && (
              <div className="flex items-start gap-2.5 bg-destructive/10 border border-destructive/30 rounded-lg px-4 py-3">
                <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
                <p className="text-destructive text-sm leading-snug">
                  Sign-in failed. Please try again or check your Internet
                  Identity setup.
                </p>
              </div>
            )}

            {/* Primary CTA */}
            <Button
              onClick={login}
              disabled={isLoggingIn}
              size="lg"
              className="w-full bg-primary hover:bg-primary/90 text-white gap-2 font-semibold h-12 text-base"
              data-ocid="login-btn"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing in…
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Sign in with Internet Identity
                </>
              )}
            </Button>

            {/* Trust note */}
            <p className="text-xs text-muted-foreground text-center leading-relaxed">
              Internet Identity is a blockchain-based authentication system by
              the Internet Computer. No passwords. No tracking. You own your
              identity.
            </p>
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
