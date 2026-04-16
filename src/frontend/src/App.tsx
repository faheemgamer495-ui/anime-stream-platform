import { RouterProvider, createRouter } from "@tanstack/react-router";
import {
  Outlet,
  createRootRoute,
  createRoute,
  useNavigate,
} from "@tanstack/react-router";
import { Suspense, lazy, useEffect } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import Layout from "./components/Layout";
import { HeroBannerSkeleton } from "./components/LoadingSkeleton";
import { ToastProvider } from "./components/Toast";
import { AppProvider } from "./context/AppContext";
import { useAdminAuth } from "./hooks/useAdminAuth";

// Lazy-loaded pages — Live site
const HomePage = lazy(() => import("./pages/HomePage"));
const AnimeDetailPage = lazy(() => import("./pages/AnimeDetailPage"));
const WatchPage = lazy(() => import("./pages/WatchPage"));
const WatchPageLegacy = lazy(() => import("./pages/WatchPage"));
const WatchlistPage = lazy(() => import("./pages/WatchlistPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

// Lazy-loaded pages — Admin / Preview
const AdminLoginPage = lazy(() => import("./pages/AdminLoginPage"));
const AdminDashboardPage = lazy(() => import("./pages/AdminDashboardPage"));
const AdminAnimePage = lazy(() => import("./pages/AdminAnimePage"));
const AdminEpisodesPage = lazy(() => import("./pages/AdminEpisodesPage"));
const AdminAdsPage = lazy(() => import("./pages/AdminAdsPage"));
const AdminRequestsPage = lazy(() => import("./pages/AdminRequestsPage"));

// Preview (new /preview/*) routes — dedicated admin pages
const PreviewLoginPage = lazy(() => import("./pages/PreviewLoginPage"));
const PreviewDashboardPage = lazy(
  () => import("./pages/PreviewAdminDashboard"),
);
const PreviewAnimePage = lazy(() => import("./pages/PreviewAdminAnimePage"));
const PreviewEpisodesPage = lazy(
  () => import("./pages/PreviewAdminEpisodesPage"),
);
const PreviewSeasonsPage = lazy(
  () => import("./pages/PreviewAdminSeasonsPage"),
);
const PreviewRequestsPage = lazy(
  () => import("./pages/PreviewAdminRequestsPage"),
);

function PageLoader() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

// Redirects /preview → /preview/admin if logged in, else /preview/login
function PreviewIndexRedirect() {
  const { isAdminLoggedIn } = useAdminAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (isAdminLoggedIn) {
      navigate({ to: "/preview/admin" });
    } else {
      navigate({ to: "/preview/login" });
    }
  }, [isAdminLoggedIn, navigate]);
  return <PageLoader />;
}

// Root route
const rootRoute = createRootRoute({
  component: () => (
    <ErrorBoundary>
      <Outlet />
    </ErrorBoundary>
  ),
  notFoundComponent: () => (
    <Layout>
      <ErrorBoundary>
        <Suspense fallback={<PageLoader />}>
          <NotFoundPage />
        </Suspense>
      </ErrorBoundary>
    </Layout>
  ),
});

// ── Live routes (read from live_* stores) ─────────────────────────────────────

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => (
    <Layout>
      <Suspense fallback={<HeroBannerSkeleton />}>
        <HomePage />
      </Suspense>
    </Layout>
  ),
});

const animeDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/anime/$id",
  component: () => (
    <Layout>
      <Suspense fallback={<PageLoader />}>
        <AnimeDetailPage />
      </Suspense>
    </Layout>
  ),
});

const watchRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/watch/$animeId/$seasonNumber/$episodeId",
  component: () => (
    <Layout hideNav>
      <Suspense fallback={<PageLoader />}>
        <WatchPage />
      </Suspense>
    </Layout>
  ),
});

const watchRouteLegacy = createRoute({
  getParentRoute: () => rootRoute,
  path: "/watch/$animeId/$episodeId",
  component: () => (
    <Layout hideNav>
      <Suspense fallback={<PageLoader />}>
        <WatchPageLegacy />
      </Suspense>
    </Layout>
  ),
});

const watchlistRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/watchlist",
  component: () => (
    <Layout>
      <Suspense fallback={<PageLoader />}>
        <WatchlistPage />
      </Suspense>
    </Layout>
  ),
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: () => (
    <Layout>
      <Suspense fallback={<PageLoader />}>
        <LoginPage />
      </Suspense>
    </Layout>
  ),
});

// ── Legacy /admin/* routes (backward compat) ──────────────────────────────────

const adminLoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/login",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <AdminLoginPage />
    </Suspense>
  ),
});

const adminDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <AdminDashboardPage />
    </Suspense>
  ),
});

const adminAnimeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/anime",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <AdminAnimePage />
    </Suspense>
  ),
});

const adminEpisodesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/episodes",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <AdminEpisodesPage />
    </Suspense>
  ),
});

const adminAdsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/ads",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <AdminAdsPage />
    </Suspense>
  ),
});

const adminRequestsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/requests",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <AdminRequestsPage />
    </Suspense>
  ),
});

// ── /preview/* routes (primary admin interface) ───────────────────────────────

const previewIndexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/preview",
  component: () => <PreviewIndexRedirect />,
});

const previewLoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/preview/login",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <PreviewLoginPage />
    </Suspense>
  ),
});

const previewDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/preview/admin",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <PreviewDashboardPage />
    </Suspense>
  ),
});

const previewAnimeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/preview/admin/anime",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <PreviewAnimePage />
    </Suspense>
  ),
});

const previewEpisodesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/preview/admin/episodes",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <PreviewEpisodesPage />
    </Suspense>
  ),
});

const previewSeasonsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/preview/admin/seasons",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <PreviewSeasonsPage />
    </Suspense>
  ),
});

const previewRequestsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/preview/admin/requests",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <PreviewRequestsPage />
    </Suspense>
  ),
});

const routeTree = rootRoute.addChildren([
  // Live
  homeRoute,
  animeDetailRoute,
  watchRoute,
  watchRouteLegacy,
  watchlistRoute,
  loginRoute,
  // Legacy admin
  adminLoginRoute,
  adminDashboardRoute,
  adminAnimeRoute,
  adminEpisodesRoute,
  adminAdsRoute,
  adminRequestsRoute,
  // Preview admin
  previewIndexRoute,
  previewLoginRoute,
  previewDashboardRoute,
  previewAnimeRoute,
  previewEpisodesRoute,
  previewSeasonsRoute,
  previewRequestsRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <AppProvider>
      <ToastProvider>
        <RouterProvider router={router} />
      </ToastProvider>
    </AppProvider>
  );
}
