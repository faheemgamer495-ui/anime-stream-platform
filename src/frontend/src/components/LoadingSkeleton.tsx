import { Skeleton } from "@/components/ui/skeleton";

export function AnimeCardSkeleton() {
  return (
    <div className="bg-card rounded-lg overflow-hidden animate-pulse">
      <div className="aspect-[2/3] bg-muted" />
      <div className="p-3 space-y-2">
        <Skeleton className="h-3 w-3/4 bg-muted/80" />
        <Skeleton className="h-2 w-1/2 bg-muted/80" />
        <div className="flex gap-1">
          <Skeleton className="h-4 w-12 bg-muted/80 rounded-full" />
          <Skeleton className="h-4 w-14 bg-muted/80 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function CarouselSkeleton({ title }: { title: string }) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8">
        <Skeleton className="h-6 w-40 bg-muted" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-8 bg-muted rounded-md" />
          <Skeleton className="h-8 w-8 bg-muted rounded-md" />
        </div>
      </div>
      <div className="flex gap-3 px-4 sm:px-6 lg:px-8">
        {Array.from({ length: 6 }, (_, i) => `skel-${title}-${i}`).map(
          (key) => (
            <div key={key} className="shrink-0 w-36 sm:w-44 md:w-48">
              <AnimeCardSkeleton />
            </div>
          ),
        )}
      </div>
    </section>
  );
}

export function HeroBannerSkeleton() {
  return (
    <div
      className="relative w-full bg-muted animate-pulse"
      style={{ height: "clamp(340px,65vh,680px)" }}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
      <div className="absolute bottom-20 left-8 space-y-4 max-w-lg">
        <Skeleton className="h-5 w-28 bg-card/60" />
        <Skeleton className="h-14 w-96 bg-card/60" />
        <Skeleton className="h-4 w-full bg-card/60" />
        <Skeleton className="h-4 w-3/4 bg-card/60" />
        <div className="flex gap-3 pt-2">
          <Skeleton className="h-11 w-32 bg-card/60 rounded-md" />
          <Skeleton className="h-11 w-40 bg-card/60 rounded-md" />
        </div>
      </div>
      {/* Dot indicators skeleton */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className="w-2 h-2 rounded-full bg-card/60" />
        ))}
      </div>
    </div>
  );
}

export function EpisodeListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }, (_, i) => `ep-skel-${i}`).map((key) => (
        <div
          key={key}
          className="flex gap-3 p-3 rounded-md bg-card animate-pulse"
        >
          <Skeleton className="w-32 h-20 bg-muted shrink-0 rounded" />
          <div className="flex-1 space-y-2 pt-1">
            <Skeleton className="h-3 w-16 bg-muted" />
            <Skeleton className="h-4 w-3/4 bg-muted" />
            <Skeleton className="h-3 w-full bg-muted" />
            <Skeleton className="h-3 w-2/3 bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function AnimeDetailSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Banner */}
      <div className="h-72 bg-muted w-full" />
      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex gap-6">
          <Skeleton className="w-32 h-48 bg-muted shrink-0 rounded-lg" />
          <div className="flex-1 space-y-3 pt-2">
            <Skeleton className="h-8 w-72 bg-muted" />
            <Skeleton className="h-4 w-48 bg-muted" />
            <Skeleton className="h-4 w-full bg-muted" />
            <Skeleton className="h-4 w-5/6 bg-muted" />
            <div className="flex gap-2 pt-2">
              <Skeleton className="h-10 w-32 bg-muted rounded-md" />
              <Skeleton className="h-10 w-36 bg-muted rounded-md" />
            </div>
          </div>
        </div>
        <EpisodeListSkeleton />
      </div>
    </div>
  );
}
