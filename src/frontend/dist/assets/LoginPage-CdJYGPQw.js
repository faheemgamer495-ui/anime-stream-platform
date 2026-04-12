import { c as createLucideIcon, g as useAuth, D as useNavigate, r as reactExports, j as jsxRuntimeExports, T as TvMinimal, O as Bookmark, Z as Zap, Q as Shield, F as CircleAlert, B as Button, L as Link } from "./index-DnVaqzJ1.js";
import { m as motion } from "./proxy--DDleVmc.js";
import { L as LoaderCircle } from "./loader-circle-i9Bo2C9F.js";
import { A as ArrowLeft } from "./arrow-left-BJ7Bk4SY.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "m10 17 5-5-5-5", key: "1bsop3" }],
  ["path", { d: "M15 12H3", key: "6jk70r" }],
  ["path", { d: "M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4", key: "u53s6r" }]
];
const LogIn = createLucideIcon("log-in", __iconNode);
const BENEFITS = [
  {
    icon: Bookmark,
    title: "Personal Watchlist",
    description: "Save anime and pick up where you left off — anytime, anywhere."
  },
  {
    icon: Zap,
    title: "Personalized Experience",
    description: "Get recommendations tailored to your taste and watch history."
  },
  {
    icon: Shield,
    title: "Secure & Passwordless",
    description: "Blockchain-backed identity — no passwords, no data breaches."
  }
];
function LoginPage() {
  const { login, isLoggingIn, isLoggedIn, isInitializing, loginStatus } = useAuth();
  const navigate = useNavigate();
  reactExports.useEffect(() => {
    if (!isInitializing && isLoggedIn) {
      navigate({ to: "/" });
    }
  }, [isLoggedIn, isInitializing, navigate]);
  const hasError = loginStatus === "loginError";
  if (isInitializing) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-[80vh] flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" }) });
  }
  if (isLoggedIn) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "min-h-[90vh] flex items-center justify-center px-4 py-12",
      "data-ocid": "login-page",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-4xl flex flex-col lg:flex-row gap-8 lg:gap-16 items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, x: -24 },
            animate: { opacity: 1, x: 0 },
            transition: { duration: 0.5 },
            className: "flex-1 space-y-8 text-center lg:text-left",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col lg:flex-row items-center lg:items-start gap-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 bg-primary/15 rounded-2xl flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TvMinimal, { className: "w-7 h-7 text-primary" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display font-black text-4xl lg:text-5xl text-foreground leading-none", children: [
                    "Anime",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "Stream" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mt-1", children: "Your anime universe, always on" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-2xl text-foreground", children: "Sign in to unlock everything" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground leading-relaxed max-w-sm mx-auto lg:mx-0", children: "Join thousands of anime fans. Track what you watch, discover new series, and never lose your place again." })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: BENEFITS.map(({ icon: Icon, title, description }, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                motion.div,
                {
                  initial: { opacity: 0, y: 12 },
                  animate: { opacity: 1, y: 0 },
                  transition: { duration: 0.4, delay: 0.1 + i * 0.1 },
                  className: "flex items-start gap-3 text-left",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-4.5 h-4.5 text-primary" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground text-sm", children: title }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-xs leading-relaxed", children: description })
                    ] })
                  ]
                },
                title
              )) })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 24 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.5, delay: 0.15 },
            className: "w-full lg:w-[380px] flex-shrink-0",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-2xl p-8 space-y-7 shadow-xl", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1 text-center", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-xl text-foreground", children: "Welcome Back" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: "Sign in with Internet Identity — secure and passwordless." })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px bg-border" }),
                hasError && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2.5 bg-destructive/10 border border-destructive/30 rounded-lg px-4 py-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-4 h-4 text-destructive flex-shrink-0 mt-0.5" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-destructive text-sm leading-snug", children: "Sign-in failed. Please try again or check your Internet Identity setup." })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    onClick: login,
                    disabled: isLoggingIn,
                    size: "lg",
                    className: "w-full bg-primary hover:bg-primary/90 text-white gap-2 font-semibold h-12 text-base",
                    "data-ocid": "login-btn",
                    children: isLoggingIn ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-5 h-5 animate-spin" }),
                      "Signing in…"
                    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(LogIn, { className: "w-5 h-5" }),
                      "Sign in with Internet Identity"
                    ] })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground text-center leading-relaxed", children: "Internet Identity is a blockchain-based authentication system by the Internet Computer. No passwords. No tracking. You own your identity." })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-5 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Link,
                {
                  to: "/",
                  className: "inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors",
                  "data-ocid": "back-to-home",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-4 h-4" }),
                    "Back to home"
                  ]
                }
              ) })
            ]
          }
        )
      ] })
    }
  );
}
export {
  LoginPage as default
};
