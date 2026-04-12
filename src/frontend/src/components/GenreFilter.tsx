const GENRES = [
  "All",
  "Action",
  "Adventure",
  "Comedy",
  "Drama",
  "Fantasy",
  "Horror",
  "Romance",
  "School",
  "Sci-Fi",
  "Supernatural",
  "Thriller",
];

interface GenreFilterProps {
  activeGenre: string | null;
  onGenreChange: (genre: string | null) => void;
}

export default function GenreFilter({
  activeGenre,
  onGenreChange,
}: GenreFilterProps) {
  return (
    <div
      className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide"
      style={{ scrollbarWidth: "none" }}
      data-ocid="genre-filter"
    >
      {GENRES.map((genre) => {
        const isActive = genre === "All" ? !activeGenre : activeGenre === genre;
        return (
          <button
            type="button"
            key={genre}
            onClick={() => onGenreChange(genre === "All" ? null : genre)}
            className={[
              "shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-all duration-200",
              isActive
                ? "bg-primary text-white shadow-accent-glow"
                : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground",
            ].join(" ")}
            data-ocid={`genre-${genre.toLowerCase()}`}
          >
            {genre}
          </button>
        );
      })}
    </div>
  );
}
