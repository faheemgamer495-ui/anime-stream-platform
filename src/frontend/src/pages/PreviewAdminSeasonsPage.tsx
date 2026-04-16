/**
 * PreviewAdminSeasonsPage — /preview/admin/seasons
 * Season CRUD using useCreateSeason/useUpdateSeason/useDeleteSeason hooks.
 * Includes SaveStateIndicator for mutation feedback.
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
import { useNavigate } from "@tanstack/react-router";
import {
  AlertTriangle,
  Edit2,
  Layers,
  Loader2,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { SeasonPublic } from "../backend";
import { PreviewAdminLayout } from "../components/PreviewAdminLayout";
import SaveStateIndicator, {
  type SaveState,
} from "../components/SaveStateIndicator";
import { useAdminAuth } from "../hooks/useAdminAuth";
import { useAnimeCtx } from "../hooks/useAnime";
import { useEpisodesByAnime } from "../hooks/useEpisodes";
import {
  safeSeasonNumber,
  useCreateSeason,
  useDeleteSeason,
  useSeasonsByAnime,
  useUpdateSeason,
} from "../hooks/useSeasons";

export default function PreviewAdminSeasonsPage() {
  const { isAdminLoggedIn } = useAdminAuth();
  const navigate = useNavigate();
  const { data: anime = [] } = useAnimeCtx();
  const [selectedAnimeId, setSelectedAnimeId] = useState<string>("");

  const { data: seasons = [], isLoading } = useSeasonsByAnime(
    selectedAnimeId || undefined,
  );
  const { data: episodes = [] } = useEpisodesByAnime(
    selectedAnimeId || undefined,
  );

  const createSeason = useCreateSeason();
  const updateSeason = useUpdateSeason();
  const deleteSeason = useDeleteSeason();

  const [showAddForm, setShowAddForm] = useState(false);
  const [newSeasonNumber, setNewSeasonNumber] = useState(1);
  const [newSeasonName, setNewSeasonName] = useState("");
  const [editingSeason, setEditingSeason] = useState<SeasonPublic | null>(null);
  const [editNumber, setEditNumber] = useState(1);
  const [editName, setEditName] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<SeasonPublic | null>(null);
  const [saveState, setSaveState] = useState<SaveState>("idle");

  useEffect(() => {
    if (!isAdminLoggedIn) navigate({ to: "/preview/login" });
  }, [isAdminLoggedIn, navigate]);

  // Auto-fill next season number when add form opens
  useEffect(() => {
    if (showAddForm && selectedAnimeId) {
      const nextNum =
        seasons.length > 0
          ? Math.max(...seasons.map((s) => safeSeasonNumber(s.seasonNumber))) +
            1
          : 1;
      const safeNext = Math.max(1, nextNum);
      setNewSeasonNumber(safeNext);
      setNewSeasonName(`Season ${safeNext}`);
    }
  }, [showAddForm, seasons, selectedAnimeId]);

  if (!isAdminLoggedIn) return null;

  const episodeCountBySeason = (seasonId: string) =>
    episodes.filter((ep) => ep.seasonId === seasonId).length;

  const selectedAnime = anime.find((a) => a.id === selectedAnimeId);

  const handleAdd = async () => {
    if (!selectedAnimeId) {
      toast.error("Please select an anime first");
      return;
    }
    if (!newSeasonName.trim()) {
      toast.error("Season name is required");
      return;
    }
    const safeNum = Math.max(1, newSeasonNumber || 1);
    setSaveState("saving");
    try {
      await createSeason.mutateAsync({
        animeId: selectedAnimeId,
        seasonNumber: safeNum,
        name: newSeasonName.trim(),
      });
      setSaveState("saved");
      toast.success(`${newSeasonName} created`);
      setShowAddForm(false);
      setTimeout(() => setSaveState("idle"), 2000);
    } catch (err) {
      setSaveState("error");
      toast.error(
        err instanceof Error ? err.message : "Failed to create season",
      );
      setTimeout(() => setSaveState("idle"), 3000);
    }
  };

  const openEdit = (s: SeasonPublic) => {
    setEditingSeason(s);
    setEditNumber(safeSeasonNumber(s.seasonNumber));
    setEditName(s.name);
  };

  const handleUpdate = async () => {
    if (!editingSeason || !editName.trim() || !selectedAnimeId) return;
    setSaveState("saving");
    try {
      await updateSeason.mutateAsync({
        id: editingSeason.id,
        data: {
          animeId: selectedAnimeId,
          seasonNumber: Math.max(1, editNumber || 1),
          name: editName.trim(),
        },
      });
      setSaveState("saved");
      toast.success("Season updated");
      setEditingSeason(null);
      setTimeout(() => setSaveState("idle"), 2000);
    } catch (err) {
      setSaveState("error");
      toast.error(
        err instanceof Error ? err.message : "Failed to update season",
      );
      setTimeout(() => setSaveState("idle"), 3000);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget || !selectedAnimeId) return;
    setSaveState("saving");
    try {
      await deleteSeason.mutateAsync({
        id: deleteTarget.id,
        animeId: selectedAnimeId,
      });
      setSaveState("saved");
      toast.success(`${deleteTarget.name} deleted`);
      setDeleteTarget(null);
      setTimeout(() => setSaveState("idle"), 2000);
    } catch {
      setSaveState("error");
      toast.error("Failed to delete season");
      setTimeout(() => setSaveState("idle"), 3000);
    }
  };

  const isMutating =
    createSeason.isPending || updateSeason.isPending || deleteSeason.isPending;

  return (
    <PreviewAdminLayout
      title="Season Management"
      subtitle={
        selectedAnime
          ? `${seasons.length} season${seasons.length !== 1 ? "s" : ""} — ${selectedAnime.title}`
          : "Select an anime to manage seasons"
      }
      action={
        <div className="flex items-center gap-2">
          <SaveStateIndicator state={saveState} />
          {selectedAnimeId && (
            <Button
              onClick={() => setShowAddForm((v) => !v)}
              className="bg-primary hover:bg-primary/90 gap-2 h-9 md:h-10 text-xs md:text-sm"
              data-ocid="preview-add-season-btn"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Season</span>
              <span className="sm:hidden">Add</span>
            </Button>
          )}
        </div>
      }
    >
      <div className="space-y-4 md:space-y-5">
        {/* Anime selector */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
          <Label className="shrink-0 text-white/50 text-xs font-semibold uppercase tracking-wider">
            Anime:
          </Label>
          <Select
            value={selectedAnimeId}
            onValueChange={(v) => {
              setSelectedAnimeId(v);
              setShowAddForm(false);
            }}
          >
            <SelectTrigger
              className="w-full sm:w-72 bg-card border-white/10 h-10"
              data-ocid="preview-seasons-anime-select"
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

        {/* Seasons container */}
        {!selectedAnimeId ? (
          <div
            className="bg-card border border-white/10 rounded-xl py-16 text-center text-white/40"
            data-ocid="preview-seasons-no-anime"
          >
            <Layers className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">
              Select an anime above to manage its seasons
            </p>
          </div>
        ) : (
          <div className="bg-card border border-white/10 rounded-xl overflow-hidden">
            {/* Add form */}
            {showAddForm && (
              <div className="flex items-end gap-3 px-5 py-4 border-b border-white/8 bg-primary/5 flex-wrap">
                <div className="space-y-1">
                  <Label className="text-white/60 text-[10px] font-semibold uppercase tracking-wider">
                    Season #
                  </Label>
                  <Input
                    type="number"
                    min="1"
                    value={newSeasonNumber}
                    onChange={(e) =>
                      setNewSeasonNumber(Number.parseInt(e.target.value) || 1)
                    }
                    className="bg-white/5 border-white/10 h-9 w-24 text-sm"
                    data-ocid="preview-new-season-number"
                  />
                </div>
                <div className="space-y-1 flex-1 min-w-[150px]">
                  <Label className="text-white/60 text-[10px] font-semibold uppercase tracking-wider">
                    Season Name
                  </Label>
                  <Input
                    value={newSeasonName}
                    onChange={(e) => setNewSeasonName(e.target.value)}
                    placeholder="Season 1"
                    className="bg-white/5 border-white/10 h-9 text-sm"
                    data-ocid="preview-new-season-name"
                    onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleAdd}
                    disabled={isMutating}
                    className="h-9 bg-primary hover:bg-primary/90 gap-1.5 text-xs"
                    data-ocid="preview-save-new-season-btn"
                  >
                    {createSeason.isPending ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Save className="w-3.5 h-3.5" />
                    )}
                    Save
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => setShowAddForm(false)}
                    className="h-9 border-white/15 text-white/70 hover:bg-white/10 text-xs"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
              </div>
            ) : seasons.length === 0 ? (
              <div
                className="py-12 text-center text-white/40"
                data-ocid="preview-no-seasons"
              >
                <Layers className="w-10 h-10 mx-auto mb-3 opacity-25" />
                <p className="text-sm">
                  No seasons yet — click "Add Season" to create one.
                </p>
              </div>
            ) : (
              <table
                className="w-full text-sm"
                data-ocid="preview-seasons-table"
              >
                <thead className="bg-white/2 border-b border-white/8">
                  <tr>
                    <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-white/40 uppercase tracking-widest w-14">
                      #
                    </th>
                    <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-white/40 uppercase tracking-widest">
                      Name
                    </th>
                    <th className="text-center px-4 py-2.5 text-[10px] font-semibold text-white/40 uppercase tracking-widest w-28">
                      Episodes
                    </th>
                    <th className="text-right px-4 py-2.5 text-[10px] font-semibold text-white/40 uppercase tracking-widest w-24">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {seasons.map((s, idx) => (
                    <tr
                      key={s.id}
                      className="hover:bg-white/3 transition-colors"
                      data-ocid={`preview-season-row.${idx + 1}`}
                    >
                      <td className="px-4 py-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                          <span className="text-xs font-black text-primary">
                            {safeSeasonNumber(s.seasonNumber)}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-foreground text-sm">
                          {s.name}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-xs text-white/50 font-mono">
                          {episodeCountBySeason(s.id)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => openEdit(s)}
                            data-ocid={`preview-edit-season.${idx + 1}`}
                            aria-label="Edit season"
                            className="p-2 rounded-lg text-white/40 hover:text-foreground hover:bg-white/10 transition-colors min-h-[36px]"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(s)}
                            data-ocid={`preview-delete-season.${idx + 1}`}
                            aria-label="Delete season"
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
            )}
          </div>
        )}
      </div>

      {/* Edit dialog */}
      <Dialog
        open={!!editingSeason}
        onOpenChange={(open) => !open && setEditingSeason(null)}
      >
        <DialogContent className="bg-card border-white/15 w-[calc(100vw-2rem)] max-w-sm">
          <DialogHeader>
            <div className="flex items-center justify-between gap-3">
              <DialogTitle className="font-display font-bold text-foreground">
                Edit Season
              </DialogTitle>
              <SaveStateIndicator state={saveState} />
            </div>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-white/70 text-xs font-semibold uppercase tracking-wider">
                  Season #
                </Label>
                <Input
                  type="number"
                  min="1"
                  value={editNumber}
                  onChange={(e) =>
                    setEditNumber(Number.parseInt(e.target.value) || 1)
                  }
                  className="bg-white/5 border-white/10 h-10"
                  data-ocid="preview-edit-season-number"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-white/70 text-xs font-semibold uppercase tracking-wider">
                  Name
                </Label>
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="bg-white/5 border-white/10 h-10"
                  data-ocid="preview-edit-season-name"
                  onKeyDown={(e) => e.key === "Enter" && handleUpdate()}
                />
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                type="button"
                onClick={handleUpdate}
                disabled={isMutating}
                className="flex-1 bg-primary hover:bg-primary/90 h-10 gap-2"
                data-ocid="preview-edit-season-submit"
              >
                {updateSeason.isPending ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Update Season"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditingSeason(null)}
                className="border-white/15 text-foreground hover:bg-white/10 h-10 px-5"
              >
                Cancel
              </Button>
            </div>
          </div>
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
              Delete Season
            </AlertDialogTitle>
            <AlertDialogDescription className="text-white/50">
              Delete{" "}
              <span className="text-foreground font-semibold">
                "{deleteTarget?.name}"
              </span>
              ? Episodes in this season will be unlinked. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setDeleteTarget(null)}
              className="border-white/15 text-foreground hover:bg-white/10"
              data-ocid="preview-season-delete-cancel"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              data-ocid="preview-season-delete-confirm"
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              {deleteSeason.isPending ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                  Deleting...
                </>
              ) : (
                "Delete Season"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PreviewAdminLayout>
  );
}
