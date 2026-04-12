import { Skeleton } from "@/components/ui/skeleton";

export function AnimeCardSkeleton() {
  return (
    <div className="bg-card rounded-lg overflow-hidden animate-pulse">
      <div className="aspect-[2/3] bg-muted" />
      <div className="p-3 space-y-2">
        <Skeleton className="h-3 w-3/4 bg-muted" />
        <Skeleton className="h-2 w-1/2 bg-muted" />
        <div className="flex gap-1">
          <Skeleton className="h-4 w-12 bg-muted rounded-full" />
          <Skeleton className="h-4 w-14 bg-muted rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function CarouselSkeleton({ title }: { title: string }) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8">
        <Skeleton className="h-6 w-40 bg-muted" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-8 bg-muted" />
          <Skeleton className="h-8 w-8 bg-muted" />
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
    <div className="relative w-full h-[65vh] min-h-[450px] bg-muted animate-pulse">
      <div className="absolute bottom-16 left-8 space-y-4 max-w-lg">
        <Skeleton className="h-5 w-24 bg-card" />
        <Skeleton className="h-14 w-96 bg-card" />
        <Skeleton className="h-4 w-full bg-card" />
        <Skeleton className="h-4 w-3/4 bg-card" />
        <div className="flex gap-3 pt-2">
          <Skeleton className="h-11 w-32 bg-card rounded" />
          <Skeleton className="h-11 w-40 bg-card rounded" />
        </div>
      </div>
    </div>
  );
}
