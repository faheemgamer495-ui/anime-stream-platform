import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertTriangle,
  Check,
  Edit2,
  Film,
  Loader2,
  Plus,
  Search,
  Star,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAdminAuth } from "../hooks/useAdminAuth";
import {
  loadData,
  useAllAnime,
  useCreateAnime,
  useDeleteAnime,
  useUpdateAnime,
} from "../hooks/useAnime";
import type { Anime, AnimeFormData } from "../types";
import { AdminLayout } from "./AdminDashboardPage";

const EMPTY_FORM: AnimeFormData = {
  title: "",
  description: "",
  genre: [],
  rating: 4.0,
  thumbnailUrl: "",
  coverImageUrl: "",
  isFeatured: false,
  releaseYear: new Date().getFullYear(),
  status: "ongoing",
};

const ALL_GENRES = [
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
  "Mystery",
  "Sports",
  "Slice of Life",
];

function StatusBadge({ status }: { status: string }) {
  const cls =
    status === "ongoing"
      ? "bg-green-500/15 text-green-400"
      : status === "completed"
        ? "bg-blue-500/15 text-blue-400"
        : "bg-amber-500/15 text-amber-400";
  return (
    <span
      className={`text-[10px] px-2 py-0.5 rounded-full font-semibold capitalize ${cls}`}
    >
      {status}
    </span>
  );
}

function AnimeCardMobile({
  a,
  onEdit,
  onDelete,
}: { a: Anime; onEdit: () => void; onDelete: () => void }) {
  return (
    <div
      className="flex items-center gap-3 px-4 py-3.5 hover:bg-white/3 transition-colors"
      data-ocid={`anime-row-${a.id}`}
    >
      <img
        src={a.thumbnailUrl}
        alt={a.title}
        className="w-10 h-14 object-cover rounded shrink-0"
      />
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-foreground truncate text-sm">
          {a.title}
        </p>
        <p className="text-[10px] text-white/40 mt-0.5">
          {a.releaseYear} · {a.episodeCount} eps
        </p>
        <div className="flex items-center gap-2 mt-1.5">
          <StatusBadge status={a.status} />
          <span className="inline-flex items-center gap-0.5 text-[10px] text-amber-400">
            <Star className="w-2.5 h-2.5 fill-current" />
            {a.rating}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-1.5 shrink-0">
        <button
          type="button"
          onClick={onEdit}
          data-ocid={`edit-anime-${a.id}`}
          aria-label="Edit"
          className="p-2 rounded-lg text-white/40 hover:text-foreground hover:bg-white/10 transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
        >
          <Edit2 className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={onDelete}
          data-ocid={`delete-anime-${a.id}`}
          aria-label="Delete"
          className="p-2 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

export default function AdminAnimePage() {
  const { isAdminLoggedIn } = useAdminAuth();
  const navigate = useNavigate();
  const { data: anime = [], isLoading } = useAllAnime();
  const createAnime = useCreateAnime();
  const updateAnime = useUpdateAnime();
  const deleteAnime = useDeleteAnime();

  const [showForm, setShowForm] = useState(false);
  const [editingAnime, setEditingAnime] = useState<Anime | null>(null);
  const [form, setForm] = useState<AnimeFormData>(EMPTY_FORM);
  const [deleteTarget, setDeleteTarget] = useState<Anime | null>(null);
  const [search, setSearch] = useState("");

  // Safety initialization: pre-load localStorage cache on mount so the table
  // shows data instantly even before the backend actor responds
  useEffect(() => {
    loadData("anime_cache");
  }, []);

  if (!isAdminLoggedIn) {
    navigate({ to: "/admin/login" });
    return null;
  }

  const filtered = anime.filter(
    (a) =>
      !search ||
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.genre.some((g) => g.toLowerCase().includes(search.toLowerCase())),
  );

  const openCreate = () => {
    setEditingAnime(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };
  const openEdit = (a: Anime) => {
    setEditingAnime(a);
    setForm({
      title: a.title,
      description: a.description,
      genre: a.genre,
      rating: a.rating,
      thumbnailUrl: a.thumbnailUrl,
      coverImageUrl: a.coverImageUrl,
      isFeatured: a.isFeatured,
      releaseYear: a.releaseYear,
      status: a.status,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.thumbnailUrl) {
      toast.error("Title and thumbnail URL are required");
      return;
    }
    try {
      if (editingAnime) {
        await updateAnime.mutateAsync({ id: editingAnime.id, data: form });
        toast.success(`"${form.title}" updated`);
      } else {
        await createAnime.mutateAsync(form);
        toast.success(`"${form.title}" added to library`);
      }
      setShowForm(false);
    } catch {
      toast.error("Failed to save anime");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteAnime.mutateAsync(deleteTarget.id);
      toast.success(`"${deleteTarget.title}" deleted`);
      setDeleteTarget(null);
    } catch {
      toast.error("Failed to delete anime");
    }
  };

  const toggleGenre = (g: string) => {
    setForm((f) => ({
      ...f,
      genre: f.genre.includes(g)
        ? f.genre.filter((x) => x !== g)
        : [...f.genre, g],
    }));
  };

  const isSaving = createAnime.isPending || updateAnime.isPending;

  return (
    <AdminLayout
      title="Anime Management"
      subtitle={`${anime.length} titles in library`}
      action={
        <Button
          onClick={openCreate}
          className="bg-primary hover:bg-primary/90 gap-2 h-9 md:h-10 text-xs md:text-sm"
          data-ocid="add-anime-btn"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Anime</span>
          <span className="sm:hidden">Add</span>
        </Button>
      }
    >
      <div className="space-y-4 md:space-y-5">
        {/* Search bar — full width mobile */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or genre..."
            className="pl-9 bg-card border-white/10 w-full md:max-w-sm"
            data-ocid="anime-search-input"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-foreground p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Content container */}
        <div className="bg-card border border-white/10 rounded-xl overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : filtered.length === 0 ? (
            <div
              className="py-16 text-center text-white/40"
              data-ocid="anime-empty-state"
            >
              <Film className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">
                {search
                  ? `No results for "${search}"`
                  : "No anime yet. Add your first title!"}
              </p>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <table
                className="w-full text-sm hidden md:table"
                data-ocid="anime-table"
              >
                <thead className="bg-white/3 border-b border-white/10">
                  <tr>
                    <th className="text-left px-5 py-3 text-[10px] font-semibold text-white/40 uppercase tracking-widest">
                      Anime
                    </th>
                    <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/40 uppercase tracking-widest hidden lg:table-cell">
                      Genre
                    </th>
                    <th className="text-center px-4 py-3 text-[10px] font-semibold text-white/40 uppercase tracking-widest">
                      Rating
                    </th>
                    <th className="text-center px-4 py-3 text-[10px] font-semibold text-white/40 uppercase tracking-widest hidden lg:table-cell">
                      Status
                    </th>
                    <th className="text-center px-4 py-3 text-[10px] font-semibold text-white/40 uppercase tracking-widest hidden xl:table-cell">
                      Featured
                    </th>
                    <th className="text-right px-5 py-3 text-[10px] font-semibold text-white/40 uppercase tracking-widest">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filtered.map((a) => (
                    <tr
                      key={a.id}
                      className="hover:bg-white/3 transition-colors"
                      data-ocid={`anime-row-${a.id}`}
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={a.thumbnailUrl}
                            alt={a.title}
                            className="w-9 object-cover rounded shrink-0"
                            style={{ height: "3.25rem" }}
                          />
                          <div className="min-w-0">
                            <p className="font-semibold text-foreground truncate max-w-[160px] text-sm">
                              {a.title}
                            </p>
                            <p className="text-xs text-white/40">
                              {a.releaseYear} · {a.episodeCount} eps
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {a.genre.slice(0, 2).map((g) => (
                            <Badge
                              key={g}
                              variant="secondary"
                              className="text-[10px] px-1.5 py-0 bg-white/8 text-white/60 border-0"
                            >
                              {g}
                            </Badge>
                          ))}
                          {a.genre.length > 2 && (
                            <span className="text-[10px] text-white/30">
                              +{a.genre.length - 2}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-flex items-center gap-1 text-amber-400">
                          <Star className="w-3 h-3 fill-current" />
                          <span className="text-xs font-medium text-foreground">
                            {a.rating}
                          </span>
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center hidden lg:table-cell">
                        <StatusBadge status={a.status} />
                      </td>
                      <td className="px-4 py-3 text-center hidden xl:table-cell">
                        {a.isFeatured ? (
                          <Check className="w-4 h-4 text-green-400 mx-auto" />
                        ) : (
                          <X className="w-4 h-4 text-white/20 mx-auto" />
                        )}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => openEdit(a)}
                            data-ocid={`edit-anime-${a.id}`}
                            aria-label="Edit"
                            className="p-2 rounded-lg text-white/40 hover:text-foreground hover:bg-white/10 transition-colors min-h-[36px]"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(a)}
                            data-ocid={`delete-anime-${a.id}`}
                            aria-label="Delete"
                            className="p-2 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors min-h-[36px]"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Mobile card list */}
              <div className="md:hidden divide-y divide-white/5">
                {filtered.map((a) => (
                  <AnimeCardMobile
                    key={a.id}
                    a={a}
                    onEdit={() => openEdit(a)}
                    onDelete={() => setDeleteTarget(a)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Form dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent
          className="bg-card border-white/15 w-full max-w-lg md:max-w-2xl max-h-[90vh] overflow-y-auto mx-4"
          data-ocid="anime-form-dialog"
        >
          <DialogHeader>
            <DialogTitle className="font-display font-bold text-foreground text-lg">
              {editingAnime ? "Edit Anime" : "Add New Anime"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2 space-y-1.5">
                <Label
                  htmlFor="title"
                  className="text-white/70 text-xs font-semibold uppercase tracking-wider"
                >
                  Title *
                </Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, title: e.target.value }))
                  }
                  placeholder="Jujutsu Kaisen"
                  className="bg-white/5 border-white/10 h-11"
                  data-ocid="anime-title-input"
                />
              </div>
              <div className="space-y-1.5">
                <Label
                  htmlFor="rating"
                  className="text-white/70 text-xs font-semibold uppercase tracking-wider"
                >
                  Rating (0–10)
                </Label>
                <Input
                  id="rating"
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  value={form.rating}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      rating: Number.parseFloat(e.target.value) || 0,
                    }))
                  }
                  className="bg-white/5 border-white/10 h-11"
                  data-ocid="anime-rating-input"
                />
              </div>
              <div className="space-y-1.5">
                <Label
                  htmlFor="releaseYear"
                  className="text-white/70 text-xs font-semibold uppercase tracking-wider"
                >
                  Release Year
                </Label>
                <Input
                  id="releaseYear"
                  type="number"
                  min="1960"
                  max="2030"
                  value={form.releaseYear}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      releaseYear: Number.parseInt(e.target.value) || 2024,
                    }))
                  }
                  className="bg-white/5 border-white/10 h-11"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-white/70 text-xs font-semibold uppercase tracking-wider">
                  Status
                </Label>
                <Select
                  value={form.status}
                  onValueChange={(v: "ongoing" | "completed" | "upcoming") =>
                    setForm((f) => ({ ...f, status: v }))
                  }
                >
                  <SelectTrigger
                    className="bg-white/5 border-white/10 h-11"
                    data-ocid="anime-status-select"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-white/15">
                    <SelectItem value="ongoing">Ongoing</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="sm:col-span-2 flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/8">
                <Switch
                  id="featured"
                  checked={form.isFeatured}
                  onCheckedChange={(v) =>
                    setForm((f) => ({ ...f, isFeatured: v }))
                  }
                  data-ocid="anime-featured-toggle"
                />
                <div>
                  <Label
                    htmlFor="featured"
                    className="cursor-pointer text-sm font-medium"
                  >
                    Feature on homepage
                  </Label>
                  <p className="text-[11px] text-white/40">
                    Will appear in the hero banner
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="thumbnailUrl"
                className="text-white/70 text-xs font-semibold uppercase tracking-wider"
              >
                Thumbnail URL *
              </Label>
              <Input
                id="thumbnailUrl"
                value={form.thumbnailUrl}
                onChange={(e) =>
                  setForm((f) => ({ ...f, thumbnailUrl: e.target.value }))
                }
                placeholder="https://example.com/thumbnail.jpg"
                className="bg-white/5 border-white/10 h-11"
                data-ocid="anime-thumbnail-input"
              />
            </div>
            <div className="space-y-1.5">
              <Label
                htmlFor="coverImageUrl"
                className="text-white/70 text-xs font-semibold uppercase tracking-wider"
              >
                Cover Image URL
              </Label>
              <Input
                id="coverImageUrl"
                value={form.coverImageUrl}
                onChange={(e) =>
                  setForm((f) => ({ ...f, coverImageUrl: e.target.value }))
                }
                placeholder="https://example.com/cover.jpg"
                className="bg-white/5 border-white/10 h-11"
              />
            </div>
            <div className="space-y-1.5">
              <Label
                htmlFor="description"
                className="text-white/70 text-xs font-semibold uppercase tracking-wider"
              >
                Description
              </Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                placeholder="A brief synopsis of the anime..."
                rows={3}
                className="bg-white/5 border-white/10 resize-none"
                data-ocid="anime-description-input"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white/70 text-xs font-semibold uppercase tracking-wider">
                Genres
              </Label>
              <div className="flex flex-wrap gap-1.5">
                {ALL_GENRES.map((g) => (
                  <button
                    type="button"
                    key={g}
                    onClick={() => toggleGenre(g)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all min-h-[32px] ${
                      form.genre.includes(g)
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-white/8 text-white/50 hover:bg-white/15 hover:text-foreground"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="submit"
                disabled={isSaving}
                className="flex-1 bg-primary hover:bg-primary/90 h-11 gap-2"
                data-ocid="anime-form-submit"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>{editingAnime ? "Update Anime" : "Add Anime"}</>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowForm(false)}
                className="border-white/15 text-foreground hover:bg-white/10 h-11 px-6"
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent className="bg-card border-white/15 text-foreground w-[calc(100vw-2rem)] max-w-md mx-auto">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 font-display">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              Delete Anime
            </AlertDialogTitle>
            <AlertDialogDescription className="text-white/50">
              Delete{" "}
              <span className="text-foreground font-semibold">
                "{deleteTarget?.title}"
              </span>
              ? All associated episodes will also be removed. This cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setDeleteTarget(null)}
              className="border-white/15 text-foreground hover:bg-white/10"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              data-ocid="anime-delete-confirm"
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              {deleteAnime.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
