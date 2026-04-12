import { RouterProvider, createRouter } from "@tanstack/react-router";
import { Outlet, createRootRoute, createRoute } from "@tanstack/react-router";
import { Suspense, lazy } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import Layout from "./components/Layout";
import { HeroBannerSkeleton } from "./components/LoadingSkeleton";

// Lazy-loaded pages
const HomePage = lazy(() => import("./pages/HomePage"));
const AnimeDetailPage = lazy(() => import("./pages/AnimeDetailPage"));
const WatchPage = lazy(() => import("./pages/WatchPage"));
const WatchPageLegacy = lazy(() => import("./pages/WatchPage"));
const WatchlistPage = lazy(() => import("./pages/WatchlistPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const AdminLoginPage = lazy(() => import("./pages/AdminLoginPage"));
const AdminDashboardPage = lazy(() => import("./pages/AdminDashboardPage"));
const AdminAnimePage = lazy(() => import("./pages/AdminAnimePage"));
const AdminEpisodesPage = lazy(() => import("./pages/AdminEpisodesPage"));
const AdminAdsPage = lazy(() => import("./pages/AdminAdsPage"));
const AdminRequestsPage = lazy(() => import("./pages/AdminRequestsPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

function PageLoader() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
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

// Routes with Layout
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

// New watch route with season number
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

// Legacy watch route for backward compat — auto-selects season from episode
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

// Admin routes (no standard Layout nav for admin)
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

const routeTree = rootRoute.addChildren([
  homeRoute,
  animeDetailRoute,
  watchRoute,
  watchRouteLegacy,
  watchlistRoute,
  loginRoute,
  adminLoginRoute,
  adminDashboardRoute,
  adminAnimeRoute,
  adminEpisodesRoute,
  adminAdsRoute,
  adminRequestsRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
