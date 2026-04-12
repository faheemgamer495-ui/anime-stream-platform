import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { Home, Search } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div
      className="min-h-[70vh] flex items-center justify-center px-4"
      data-ocid="not-found-page"
    >
      <div className="text-center space-y-6 max-w-md">
        <div className="font-display font-black text-8xl text-primary/20 leading-none select-none">
          404
        </div>
        <div className="space-y-2">
          <h1 className="font-display font-bold text-3xl text-foreground">
            Page Not Found
          </h1>
          <p className="text-muted-foreground">
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved.
          </p>
        </div>
        <div className="flex gap-3 justify-center flex-wrap">
          <Button
            asChild
            className="bg-primary hover:bg-primary/90 gap-2"
            data-ocid="go-home-btn"
          >
            <Link to="/">
              <Home className="w-4 h-4" />
              Go Home
            </Link>
          </Button>
          <Button variant="outline" asChild className="gap-2 border-border">
            <Link to="/">
              <Search className="w-4 h-4" />
              Browse Anime
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
