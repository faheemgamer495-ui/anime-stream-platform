/**
 * PreviewAdminAnimePage — /preview/admin/anime
 * Anime CRUD with SaveStateIndicator for visual feedback on mutations.
 */
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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertTriangle,
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
import type { AnimeInput, AnimePublic } from "../backend";
import { PreviewAdminLayout } from "../components/PreviewAdminLayout";
import SaveStateIndicator, {
  type SaveState,
} from "../components/SaveStateIndicator";
import { useAppContext } from "../context/AppContext";
import { useAdminAuth } from "../hooks/useAdminAuth";

interface AnimeFormState {
  title: string;
  description: string;
  genres: string[];
  rating: number;
  coverImageUrl: string;
  isFeatured: boolean;
}

const EMPTY_FORM: AnimeFormState = {
  title: "",
  description: "",
  genres: [],
  rating: 4.0,
  coverImageUrl: "",
  isFeatured: false,
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

export default function PreviewAdminAnimePage() {
  const { isAdminLoggedIn } = useAdminAuth();
  const navigate = useNavigate();
  const { anime, loading, createAnime, updateAnime, deleteAnime } =
    useAppContext();

  const isLoading = loading["anime.list"] ?? false;
  const isCreating = loading["admin.createAnime"] ?? false;
  const isUpdating = Object.keys(loading).some(
    (k) => k.startsWith("admin.updateAnime") && loading[k],
  );
  const isDeleting = Object.keys(loading).some(
    (k) => k.startsWith("admin.deleteAnime") && loading[k],
  );

  const [showForm, setShowForm] = useState(false);
  const [editingAnime, setEditingAnime] = useState<AnimePublic | null>(null);
  const [form, setForm] = useState<AnimeFormState>(EMPTY_FORM);
  const [deleteTarget, setDeleteTarget] = useState<AnimePublic | null>(null);
  const [search, setSearch] = useState("");
  const [saveState, setSaveState] = useState<SaveState>("idle");

  useEffect(() => {
    if (!isAdminLoggedIn) navigate({ to: "/preview/login" });
  }, [isAdminLoggedIn, navigate]);

  if (!isAdminLoggedIn) return null;

  const filtered = anime.filter(
    (a) =>
      !search ||
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.genres.some((g) => g.toLowerCase().includes(search.toLowerCase())),
  );

  const openCreate = () => {
    setEditingAnime(null);
    setForm(EMPTY_FORM);
    setSaveState("idle");
    setShowForm(true);
  };

  const openEdit = (a: AnimePublic) => {
    setEditingAnime(a);
    setForm({
      title: a.title,
      description: a.description,
      genres: a.genres,
      rating: a.rating,
      coverImageUrl: a.coverImageUrl,
      isFeatured: a.isFeatured,
    });
    setSaveState("idle");
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.coverImageUrl.trim()) {
      toast.error("Title and cover image URL are required");
      return;
    }
    const input: AnimeInput = {
      title: form.title.trim(),
      description: form.description.trim(),
      genres: form.genres,
      rating: form.rating,
      coverImageUrl: form.coverImageUrl.trim(),
      isFeatured: form.isFeatured,
    };
    setSaveState("saving");
    try {
      if (editingAnime) {
        await updateAnime(editingAnime.id, input);
        setSaveState("saved");
        toast.success(`"${form.title}" updated`);
      } else {
        await createAnime(input);
        setSaveState("saved");
        toast.success(`"${form.title}" added to library`);
      }
      setTimeout(() => {
        setSaveState("idle");
        setShowForm(false);
      }, 800);
    } catch {
      setSaveState("error");
      toast.error("Failed to save anime");
      setTimeout(() => setSaveState("idle"), 3000);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setSaveState("saving");
    try {
      await deleteAnime(deleteTarget.id);
      setSaveState("saved");
      toast.success(`"${deleteTarget.title}" deleted`);
      setDeleteTarget(null);
      setTimeout(() => setSaveState("idle"), 2000);
    } catch {
      setSaveState("error");
      toast.error("Failed to delete anime");
      setTimeout(() => setSaveState("idle"), 3000);
    }
  };

  const toggleGenre = (g: string) => {
    setForm((f) => ({
      ...f,
      genres: f.genres.includes(g)
        ? f.genres.filter((x) => x !== g)
        : [...f.genres, g],
    }));
  };

  const isSaving = isCreating || isUpdating;

  return (
    <PreviewAdminLayout
      title="Anime Management"
      subtitle={`${anime.length} titles in library`}
      action={
        <div className="flex items-center gap-2">
          <SaveStateIndicator state={saveState} />
          <Button
            onClick={openCreate}
            className="bg-primary hover:bg-primary/90 gap-2 h-9 md:h-10 text-xs md:text-sm"
            data-ocid="preview-add-anime-btn"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Anime</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </div>
      }
    >
      <div className="space-y-4 md:space-y-5">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or genre..."
            className="pl-9 bg-card border-white/10 w-full md:max-w-sm"
            data-ocid="preview-anime-search"
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

        {/* Content */}
        <div className="bg-card border border-white/10 rounded-xl overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : filtered.length === 0 ? (
            <div
              className="py-16 text-center text-white/40"
              data-ocid="preview-anime-empty"
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
                data-ocid="preview-anime-table"
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
                    <th className="text-center px-4 py-3 text-[10px] font-semibold text-white/40 uppercase tracking-widest hidden xl:table-cell">
                      Featured
                    </th>
                    <th className="text-right px-5 py-3 text-[10px] font-semibold text-white/40 uppercase tracking-widest">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filtered.map((a, idx) => (
                    <tr
                      key={a.id}
                      className="hover:bg-white/3 transition-colors"
                      data-ocid={`preview-anime-row.${idx + 1}`}
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={a.coverImageUrl}
                            alt={a.title}
                            className="w-9 object-cover rounded shrink-0"
                            style={{ height: "3.25rem" }}
                          />
                          <div className="min-w-0">
                            <p className="font-semibold text-foreground truncate max-w-[160px] text-sm">
                              {a.title}
                            </p>
                            <p className="text-xs text-white/40">
                              {a.genres.slice(0, 2).join(", ")}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {a.genres.slice(0, 2).map((g) => (
                            <Badge
                              key={g}
                              variant="secondary"
                              className="text-[10px] px-1.5 py-0 bg-white/8 text-white/60 border-0"
                            >
                              {g}
                            </Badge>
                          ))}
                          {a.genres.length > 2 && (
                            <span className="text-[10px] text-white/30">
                              +{a.genres.length - 2}
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
                      <td className="px-4 py-3 text-center hidden xl:table-cell">
                        {a.isFeatured ? (
                          <span className="text-xs text-green-400 font-semibold">
                            Yes
                          </span>
                        ) : (
                          <span className="text-xs text-white/20">No</span>
                        )}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => openEdit(a)}
                            data-ocid={`preview-edit-anime.${idx + 1}`}
                            aria-label="Edit"
                            className="p-2 rounded-lg text-white/40 hover:text-foreground hover:bg-white/10 transition-colors min-h-[36px]"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(a)}
                            data-ocid={`preview-delete-anime.${idx + 1}`}
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

              {/* Mobile list */}
              <div className="md:hidden divide-y divide-white/5">
                {filtered.map((a, idx) => (
                  <div
                    key={a.id}
                    className="flex items-center gap-3 px-4 py-3.5 hover:bg-white/3 transition-colors"
                    data-ocid={`preview-anime-row.${idx + 1}`}
                  >
                    <img
                      src={a.coverImageUrl}
                      alt={a.title}
                      className="w-10 h-14 object-cover rounded shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-foreground truncate text-sm">
                        {a.title}
                      </p>
                      <p className="text-[10px] text-white/40 mt-0.5">
                        {a.genres.slice(0, 2).join(", ")}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="inline-flex items-center gap-0.5 text-[10px] text-amber-400">
                          <Star className="w-2.5 h-2.5 fill-current" />
                          {a.rating}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => openEdit(a)}
                        aria-label="Edit"
                        className="p-2 rounded-lg text-white/40 hover:text-foreground hover:bg-white/10 transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(a)}
                        aria-label="Delete"
                        className="p-2 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
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
          data-ocid="preview-anime-form-dialog"
        >
          <DialogHeader>
            <div className="flex items-center justify-between gap-3">
              <DialogTitle className="font-display font-bold text-foreground text-lg">
                {editingAnime ? "Edit Anime" : "Add New Anime"}
              </DialogTitle>
              <SaveStateIndicator state={saveState} />
            </div>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2 space-y-1.5">
                <Label
                  htmlFor="preview-title"
                  className="text-white/70 text-xs font-semibold uppercase tracking-wider"
                >
                  Title *
                </Label>
                <Input
                  id="preview-title"
                  value={form.title}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, title: e.target.value }))
                  }
                  placeholder="Jujutsu Kaisen"
                  className="bg-white/5 border-white/10 h-11"
                  data-ocid="preview-anime-title-input"
                />
              </div>
              <div className="space-y-1.5">
                <Label
                  htmlFor="preview-rating"
                  className="text-white/70 text-xs font-semibold uppercase tracking-wider"
                >
                  Rating (0–10)
                </Label>
                <Input
                  id="preview-rating"
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
                />
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/8 self-end">
                <Switch
                  id="preview-featured"
                  checked={form.isFeatured}
                  onCheckedChange={(v) =>
                    setForm((f) => ({ ...f, isFeatured: v }))
                  }
                  data-ocid="preview-anime-featured-toggle"
                />
                <div>
                  <Label
                    htmlFor="preview-featured"
                    className="cursor-pointer text-sm font-medium"
                  >
                    Feature on homepage
                  </Label>
                  <p className="text-[11px] text-white/40">Hero banner</p>
                </div>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label
                htmlFor="preview-cover"
                className="text-white/70 text-xs font-semibold uppercase tracking-wider"
              >
                Cover Image URL *
              </Label>
              <Input
                id="preview-cover"
                value={form.coverImageUrl}
                onChange={(e) =>
                  setForm((f) => ({ ...f, coverImageUrl: e.target.value }))
                }
                placeholder="https://example.com/cover.jpg"
                className="bg-white/5 border-white/10 h-11"
                data-ocid="preview-anime-thumbnail-input"
              />
            </div>
            <div className="space-y-1.5">
              <Label
                htmlFor="preview-desc"
                className="text-white/70 text-xs font-semibold uppercase tracking-wider"
              >
                Description
              </Label>
              <Textarea
                id="preview-desc"
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                placeholder="A brief synopsis of the anime..."
                rows={3}
                className="bg-white/5 border-white/10 resize-none"
                data-ocid="preview-anime-description-input"
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
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all min-h-[32px] ${form.genres.includes(g) ? "bg-primary text-primary-foreground shadow-sm" : "bg-white/8 text-white/50 hover:bg-white/15 hover:text-foreground"}`}
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
                data-ocid="preview-anime-form-submit"
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
              ? This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setDeleteTarget(null)}
              className="border-white/15 text-foreground hover:bg-white/10"
              data-ocid="preview-anime-delete-cancel"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              data-ocid="preview-anime-delete-confirm"
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PreviewAdminLayout>
  );
}
