/**
 * PreviewAdminEpisodesPage — /preview/admin/episodes
 * Episode CRUD with anime + season selectors + SaveStateIndicator.
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
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertTriangle,
  Clock,
  Edit2,
  Link2,
  Loader2,
  Play,
  Plus,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PreviewAdminLayout } from "../components/PreviewAdminLayout";
import SaveStateIndicator, {
  type SaveState,
} from "../components/SaveStateIndicator";
import { useAdminAuth } from "../hooks/useAdminAuth";
import { useAllAnime } from "../hooks/useAnime";
import {
  type EpisodeFormData,
  useCreateEpisode,
  useDeleteEpisode,
  useEpisodesByAnime,
  useUpdateEpisode,
} from "../hooks/useEpisodes";
import { safeSeasonNumber, useSeasonsByAnime } from "../hooks/useSeasons";
import type { Episode } from "../lib/localStorageDB";
import { getSeasonsByAnime as lsGetSeasonsByAnime } from "../lib/localStorageDB";

const EMPTY_FORM: EpisodeFormData = {
  animeId: "",
  episodeNumber: 1,
  title: "",
  description: "",
  videoUrl: "",
  duration: "",
  thumbnailUrl: "",
  seasonId: undefined,
};

export default function PreviewAdminEpisodesPage() {
  const { isAdminLoggedIn } = useAdminAuth();
  const navigate = useNavigate();
  const { data: anime = [] } = useAllAnime();
  const [selectedAnimeId, setSelectedAnimeId] = useState<string>("");

  const { data: episodes = [], isLoading } = useEpisodesByAnime(
    selectedAnimeId || undefined,
  );
  const { data: seasons = [] } = useSeasonsByAnime(
    selectedAnimeId || undefined,
  );

  const [formAnimeId, setFormAnimeId] = useState<string>("");
  const { data: formSeasons = [], isLoading: formSeasonsLoading } =
    useSeasonsByAnime(formAnimeId || undefined);

  const createEpisode = useCreateEpisode();
  const updateEpisode = useUpdateEpisode();
  const deleteEpisode = useDeleteEpisode();

  const [showForm, setShowForm] = useState(false);
  const [editingEpisode, setEditingEpisode] = useState<Episode | null>(null);
  const [form, setForm] = useState<EpisodeFormData>(EMPTY_FORM);
  const [deleteTarget, setDeleteTarget] = useState<Episode | null>(null);
  const [saveState, setSaveState] = useState<SaveState>("idle");

  useEffect(() => {
    if (!isAdminLoggedIn) navigate({ to: "/preview/login" });
  }, [isAdminLoggedIn, navigate]);

  if (!isAdminLoggedIn) return null;

  const seasonMap = new Map(seasons.map((s) => [s.id, s]));

  const getSeasonName = (seasonId: string | undefined) => {
    if (!seasonId) return undefined;
    return seasonMap.get(seasonId)?.name;
  };

  const formSeasonsHasLocalData = formAnimeId
    ? lsGetSeasonsByAnime(formAnimeId).length > 0
    : false;
  const hasSeasonsForAnime =
    !formSeasonsLoading || formSeasonsHasLocalData
      ? formSeasons.length > 0
      : false;

  const openCreate = () => {
    if (!selectedAnimeId) {
      toast.error("Please select an anime first");
      return;
    }
    setEditingEpisode(null);
    setFormAnimeId(selectedAnimeId);
    const defaultSeasonId = seasons.length === 1 ? seasons[0].id : undefined;
    setForm({
      ...EMPTY_FORM,
      animeId: selectedAnimeId,
      episodeNumber: (episodes.length || 0) + 1,
      seasonId: defaultSeasonId,
    });
    setSaveState("idle");
    setShowForm(true);
  };

  const openEdit = (ep: Episode) => {
    setEditingEpisode(ep);
    setFormAnimeId(ep.animeId);
    setForm({
      animeId: ep.animeId,
      episodeNumber: Number(ep.episodeNumber),
      title: ep.title,
      description: ep.description,
      videoUrl: ep.videoUrl,
      duration: ep.duration ?? "",
      thumbnailUrl: ep.thumbnailUrl ?? "",
      seasonId: ep.seasonId ?? undefined,
    });
    setSaveState("idle");
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error("Episode title is required");
      return;
    }
    if (!form.videoUrl.trim()) {
      toast.error("Video URL is required");
      return;
    }
    if (hasSeasonsForAnime && !form.seasonId) {
      toast.error("Please select a season");
      return;
    }
    setSaveState("saving");
    try {
      if (editingEpisode) {
        await updateEpisode.mutateAsync({ id: editingEpisode.id, data: form });
        setSaveState("saved");
        toast.success(`Episode "${form.title}" updated`);
      } else {
        await createEpisode.mutateAsync(form);
        setSaveState("saved");
        toast.success(`Episode "${form.title}" added`);
      }
      setTimeout(() => {
        setSaveState("idle");
        setShowForm(false);
      }, 800);
    } catch (err) {
      setSaveState("error");
      const msg = err instanceof Error ? err.message : "Failed to save episode";
      toast.error(msg);
      setTimeout(() => setSaveState("idle"), 3000);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteEpisode.mutateAsync(deleteTarget.id);
      toast.success(`Episode "${deleteTarget.title}" deleted`);
      setDeleteTarget(null);
    } catch {
      // hook shows toast
    }
  };

  const isSaving = createEpisode.isPending || updateEpisode.isPending;
  const selectedAnime = anime.find((a) => a.id === selectedAnimeId);

  return (
    <PreviewAdminLayout
      title="Episode Management"
      subtitle={
        selectedAnime
          ? `${episodes.length} episodes — ${selectedAnime.title}`
          : "Select an anime to manage episodes"
      }
      action={
        <div className="flex items-center gap-2">
          <SaveStateIndicator state={saveState} />
          <Button
            onClick={openCreate}
            className="bg-primary hover:bg-primary/90 gap-2 h-9 md:h-10 text-xs md:text-sm"
            data-ocid="preview-add-episode-btn"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Episode</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </div>
      }
    >
      <div className="space-y-4 md:space-y-5">
        {/* Anime selector */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
          <Label className="shrink-0 text-white/50 text-xs font-semibold uppercase tracking-wider">
            Anime:
          </Label>
          <Select value={selectedAnimeId} onValueChange={setSelectedAnimeId}>
            <SelectTrigger
              className="w-full sm:w-72 bg-card border-white/10 h-10"
              data-ocid="preview-episodes-anime-select"
            >
              <SelectValue placeholder="Select anime..." />
            </SelectTrigger>
            <SelectContent className="bg-card border-white/15">
              {anime.map((a) => (
                <SelectItem key={a.id} value={a.id}>
                  {a.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Episodes container */}
        <div className="bg-card border border-white/10 rounded-xl overflow-hidden">
          {!selectedAnimeId ? (
            <div
              className="flex flex-col items-center justify-center py-16 text-white/40 gap-3"
              data-ocid="preview-no-anime-selected"
            >
              <Play className="w-12 h-12 opacity-30" />
              <p className="text-sm text-center px-4">
                Select an anime above to view and manage its episodes
              </p>
            </div>
          ) : isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : episodes.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-16 space-y-3 text-white/40"
              data-ocid="preview-no-episodes"
            >
              <Play className="w-12 h-12 opacity-30" />
              <p className="text-sm">No episodes yet for this anime</p>
              <Button
                onClick={openCreate}
                size="sm"
                className="bg-primary hover:bg-primary/90 gap-2"
              >
                <Plus className="w-4 h-4" />
                Add First Episode
              </Button>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <table
                className="w-full text-sm hidden md:table"
                data-ocid="preview-episodes-table"
              >
                <thead className="bg-white/3 border-b border-white/10">
                  <tr>
                    <th className="text-left px-5 py-3 text-[10px] font-semibold text-white/40 uppercase tracking-widest w-14">
                      #
                    </th>
                    <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/40 uppercase tracking-widest">
                      Episode
                    </th>
                    <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/40 uppercase tracking-widest hidden lg:table-cell">
                      Season
                    </th>
                    <th className="text-center px-4 py-3 text-[10px] font-semibold text-white/40 uppercase tracking-widest hidden lg:table-cell">
                      Duration
                    </th>
                    <th className="text-right px-5 py-3 text-[10px] font-semibold text-white/40 uppercase tracking-widest">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {episodes.map((ep, idx) => (
                    <tr
                      key={ep.id}
                      className="hover:bg-white/3 transition-colors"
                      data-ocid={`preview-episode-row.${idx + 1}`}
                    >
                      <td className="px-5 py-3">
                        <div className="w-8 h-8 rounded-lg bg-white/8 flex items-center justify-center">
                          <span className="text-xs font-black text-white/50">
                            {Number(ep.episodeNumber)}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-foreground truncate max-w-[200px] text-sm">
                          {ep.title}
                        </p>
                        {ep.description && (
                          <p className="text-xs text-white/40 truncate max-w-[200px]">
                            {ep.description}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        {ep.seasonId ? (
                          <span className="inline-flex items-center text-xs text-primary bg-primary/10 px-2 py-0.5 rounded font-semibold">
                            {getSeasonName(ep.seasonId) ?? "Season"}
                          </span>
                        ) : (
                          <span className="text-xs text-white/30">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center hidden lg:table-cell">
                        <span className="inline-flex items-center gap-1 text-xs text-white/40">
                          <Clock className="w-3 h-3" />
                          {ep.duration ?? "—"}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => openEdit(ep)}
                            data-ocid={`preview-edit-episode.${idx + 1}`}
                            aria-label="Edit"
                            className="p-2 rounded-lg text-white/40 hover:text-foreground hover:bg-white/10 transition-colors min-h-[36px]"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(ep)}
                            data-ocid={`preview-delete-episode.${idx + 1}`}
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
                {episodes.map((ep, idx) => (
                  <div
                    key={ep.id}
                    className="flex items-start gap-3 px-4 py-3.5"
                    data-ocid={`preview-episode-row.${idx + 1}`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-white/8 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-xs font-black text-white/50">
                        {Number(ep.episodeNumber)}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-foreground truncate text-sm">
                        {ep.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        {ep.seasonId && (
                          <span className="inline-flex items-center text-[10px] text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                            {getSeasonName(ep.seasonId) ?? "Season"}
                          </span>
                        )}
                        {ep.duration && (
                          <span className="text-[10px] text-white/40 inline-flex items-center gap-0.5">
                            <Clock className="w-2.5 h-2.5" />
                            {ep.duration}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => openEdit(ep)}
                        aria-label="Edit"
                        className="p-2 rounded-lg text-white/40 hover:text-foreground hover:bg-white/10 transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(ep)}
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

      {/* Episode form dialog */}
      <Dialog
        open={showForm}
        onOpenChange={(open) => {
          if (!open) setShowForm(false);
        }}
      >
        <DialogContent
          className="bg-card border-white/15 w-[calc(100vw-2rem)] max-w-lg max-h-[90vh] overflow-y-auto"
          data-ocid="preview-episode-form-dialog"
        >
          <DialogHeader>
            <div className="flex items-center justify-between gap-3">
              <DialogTitle className="font-display font-bold text-foreground text-lg">
                {editingEpisode ? "Edit Episode" : "Add New Episode"}
              </DialogTitle>
              <SaveStateIndicator state={saveState} />
            </div>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-1.5">
                <Label className="text-white/70 text-xs font-semibold uppercase tracking-wider">
                  Anime *
                </Label>
                <Select
                  value={form.animeId}
                  onValueChange={(v) => {
                    setForm((f) => ({ ...f, animeId: v, seasonId: undefined }));
                    setFormAnimeId(v);
                  }}
                >
                  <SelectTrigger
                    className="bg-white/5 border-white/10 h-11"
                    data-ocid="preview-ep-form-anime-select"
                  >
                    <SelectValue placeholder="Select anime..." />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-white/15">
                    {anime.map((a) => (
                      <SelectItem key={a.id} value={a.id}>
                        {a.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Season selector */}
              <div className="col-span-2 space-y-1.5">
                <Label className="text-white/70 text-xs font-semibold uppercase tracking-wider">
                  Season
                </Label>
                {!formAnimeId ? (
                  <p className="text-xs text-white/40 italic">
                    Select an anime first
                  </p>
                ) : formSeasonsLoading && !formSeasonsHasLocalData ? (
                  <div className="flex items-center gap-2 text-xs text-white/40">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Loading seasons...
                  </div>
                ) : formSeasons.length === 0 ? (
                  <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span>
                      Create a season first in{" "}
                      <a
                        href="/preview/admin/seasons"
                        className="underline font-semibold"
                      >
                        Season Management
                      </a>
                    </span>
                  </div>
                ) : (
                  <Select
                    value={form.seasonId ?? ""}
                    onValueChange={(v) =>
                      setForm((f) => ({ ...f, seasonId: v || undefined }))
                    }
                  >
                    <SelectTrigger
                      className="bg-white/5 border-white/10 h-11"
                      data-ocid="preview-ep-form-season-select"
                    >
                      <SelectValue placeholder="Select season..." />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-white/15">
                      {formSeasons.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          Season {safeSeasonNumber(s.seasonNumber)} — {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              <div className="space-y-1.5">
                <Label className="text-white/70 text-xs font-semibold uppercase tracking-wider">
                  Episode #
                </Label>
                <Input
                  type="number"
                  min="1"
                  value={form.episodeNumber}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      episodeNumber: Number.parseInt(e.target.value) || 1,
                    }))
                  }
                  className="bg-white/5 border-white/10 h-11"
                  data-ocid="preview-ep-number-input"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-white/70 text-xs font-semibold uppercase tracking-wider">
                  Duration
                </Label>
                <Input
                  value={form.duration}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, duration: e.target.value }))
                  }
                  placeholder="24:00"
                  className="bg-white/5 border-white/10 h-11"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-white/70 text-xs font-semibold uppercase tracking-wider">
                Title *
              </Label>
              <Input
                value={form.title}
                onChange={(e) =>
                  setForm((f) => ({ ...f, title: e.target.value }))
                }
                placeholder="Episode 1 - The Beginning"
                className="bg-white/5 border-white/10 h-11"
                data-ocid="preview-ep-title-input"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-white/70 text-xs font-semibold uppercase tracking-wider">
                Video URL *
              </Label>
              <div className="relative">
                <Link2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                <Input
                  value={form.videoUrl}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, videoUrl: e.target.value }))
                  }
                  placeholder="https://example.com/video.mp4"
                  className="pl-10 bg-white/5 border-white/10 h-11"
                  data-ocid="preview-ep-video-input"
                />
              </div>
              <p className="text-[11px] text-white/35">
                Accepted: .mp4 .webm .m3u8 · YouTube links · Google Drive links
              </p>
            </div>

            <div className="space-y-1.5">
              <Label className="text-white/70 text-xs font-semibold uppercase tracking-wider">
                Thumbnail URL
              </Label>
              <Input
                value={form.thumbnailUrl}
                onChange={(e) =>
                  setForm((f) => ({ ...f, thumbnailUrl: e.target.value }))
                }
                placeholder="https://example.com/thumb.jpg"
                className="bg-white/5 border-white/10 h-11"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-white/70 text-xs font-semibold uppercase tracking-wider">
                Description
              </Label>
              <Textarea
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                placeholder="Brief episode synopsis..."
                rows={3}
                className="bg-white/5 border-white/10 resize-none"
                data-ocid="preview-ep-description-input"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="submit"
                disabled={isSaving}
                className="flex-1 bg-primary hover:bg-primary/90 h-11 gap-2"
                data-ocid="preview-ep-form-submit"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>{editingEpisode ? "Update Episode" : "Add Episode"}</>
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
              Delete Episode
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
              data-ocid="preview-ep-delete-cancel"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              data-ocid="preview-ep-delete-confirm"
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              {deleteEpisode.isPending ? (
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
