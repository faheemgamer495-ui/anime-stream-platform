import { Input } from "@/components/ui/input";
import { Link } from "@tanstack/react-router";
import { Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSearchAnime } from "../hooks/useAnime";
import type { Anime } from "../types";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [debounced, setDebounced] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounce
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(query), 300);
    return () => clearTimeout(timer);
  }, [query]);

  const { data: results = [] } = useSearchAnime(debounced);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleChange = (v: string) => {
    setQuery(v);
    setOpen(v.length > 1);
  };

  const clear = () => {
    setQuery("");
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative w-full" data-ocid="search-bar">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <Input
          type="text"
          placeholder="Search anime..."
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => query.length > 1 && setOpen(true)}
          className="pl-9 pr-8 bg-secondary/50 border-border focus:border-primary/50 placeholder:text-muted-foreground text-foreground"
          data-ocid="search-input"
        />
        {query && (
          <button
            type="button"
            onClick={clear}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Results overlay */}
      {open && results.length > 0 && (
        <div
          className="absolute top-full mt-1 w-full bg-popover border border-border rounded-lg shadow-xl z-50 overflow-hidden animate-slide-up"
          data-ocid="search-results"
        >
          <div className="max-h-80 overflow-y-auto">
            {results.map((anime: Anime) => (
              <Link
                key={anime.id}
                to="/anime/$id"
                params={{ id: anime.id }}
                onClick={() => {
                  setOpen(false);
                  setQuery("");
                }}
                className="flex items-center gap-3 px-3 py-2.5 hover:bg-secondary/50 transition-colors group"
                data-ocid={`search-result-${anime.id}`}
              >
                <img
                  src={anime.thumbnailUrl}
                  alt={anime.title}
                  className="w-10 h-14 object-cover rounded shrink-0"
                />
                <div className="min-w-0">
                  <p className="font-semibold text-sm text-foreground truncate group-hover:text-primary transition-colors">
                    {anime.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {anime.genre.join(", ")}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    ⭐ {anime.rating.toFixed(1)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {open && debounced.length > 1 && results.length === 0 && (
        <div className="absolute top-full mt-1 w-full bg-popover border border-border rounded-lg shadow-xl z-50 px-4 py-6 text-center animate-slide-up">
          <p className="text-muted-foreground text-sm">
            No anime found for &quot;{debounced}&quot;
          </p>
        </div>
      )}
    </div>
  );
}
