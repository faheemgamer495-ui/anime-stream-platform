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
import { useNavigate } from "@tanstack/react-router";
import {
  AlertTriangle,
  Edit2,
  Image,
  Loader2,
  Megaphone,
  Plus,
  Trash2,
  Video,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAdminAuth } from "../hooks/useAdminAuth";
import {
  useAllAds,
  useCreateAd,
  useDeleteAd,
  useUpdateAd,
} from "../hooks/useAds";
import type { AdConfig } from "../types";
import { AdminLayout } from "./AdminDashboardPage";

const EMPTY_FORM: Omit<AdConfig, "id" | "createdAt"> = {
  placement: "homepage_banner",
  title: "",
  imageUrl: "",
  targetUrl: "",
  videoUrl: "",
  isEnabled: true,
};

const PLACEMENT_LABELS: Record<AdConfig["placement"], string> = {
  homepage_banner: "Homepage Banner",
  video_pre_roll: "Video Pre-roll",
  video_mid_roll: "Video Mid-roll",
  sidebar: "Sidebar",
};

const PLACEMENT_COLORS: Record<AdConfig["placement"], string> = {
  homepage_banner: "bg-blue-500/15 text-blue-400",
  video_pre_roll: "bg-purple-500/15 text-purple-400",
  video_mid_roll: "bg-amber-500/15 text-amber-400",
  sidebar: "bg-green-500/15 text-green-400",
};

const PLACEMENT_DOT: Record<AdConfig["placement"], string> = {
  homepage_banner: "bg-blue-400",
  video_pre_roll: "bg-purple-400",
  video_mid_roll: "bg-amber-400",
  sidebar: "bg-green-400",
};

function AdCardMobile({
  ad,
  onEdit,
  onDelete,
  onToggle,
}: {
  ad: AdConfig;
  onEdit: () => void;
  onDelete: () => void;
  onToggle: () => void;
}) {
  const isVideo = !!ad.videoUrl;
  return (
    <div
      className="flex items-start gap-3 px-4 py-3.5 hover:bg-white/3 transition-colors"
      data-ocid={`ad-row-${ad.id}`}
    >
      {ad.imageUrl ? (
        <img
          src={ad.imageUrl}
          alt={ad.title}
          className="w-14 h-8 object-cover rounded shrink-0 mt-0.5"
        />
      ) : (
        <div className="w-14 h-8 bg-white/5 rounded flex items-center justify-center shrink-0 mt-0.5">
          <Megaphone className="w-3.5 h-3.5 text-white/30" />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-foreground truncate text-sm">
          {ad.title}
        </p>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <span
            className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold inline-flex items-center gap-1 ${PLACEMENT_COLORS[ad.placement]}`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${PLACEMENT_DOT[ad.placement]}`}
            />
            {PLACEMENT_LABELS[ad.placement]}
          </span>
          <span className="inline-flex items-center gap-0.5 text-[10px] text-white/40">
            {isVideo ? (
              <Video className="w-2.5 h-2.5" />
            ) : (
              <Image className="w-2.5 h-2.5" />
            )}
            {isVideo ? "Video" : "Banner"}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        <Switch
          checked={ad.isEnabled}
          onCheckedChange={onToggle}
          aria-label={`Toggle "${ad.title}"`}
          data-ocid={`ad-toggle-${ad.id}`}
        />
        <button
          type="button"
          onClick={onEdit}
          data-ocid={`edit-ad-${ad.id}`}
          aria-label="Edit"
          className="p-2 rounded-lg text-white/40 hover:text-foreground hover:bg-white/10 transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
        >
          <Edit2 className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={onDelete}
          data-ocid={`delete-ad-${ad.id}`}
          aria-label="Delete"
          className="p-2 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

export default function AdminAdsPage() {
  const { isAdminLoggedIn } = useAdminAuth();
  const navigate = useNavigate();
  const { data: ads = [], isLoading } = useAllAds();
  const createAd = useCreateAd();
  const updateAd = useUpdateAd();
  const deleteAd = useDeleteAd();

  const [showForm, setShowForm] = useState(false);
  const [editingAd, setEditingAd] = useState<AdConfig | null>(null);
  const [form, setForm] =
    useState<Omit<AdConfig, "id" | "createdAt">>(EMPTY_FORM);
  const [deleteTarget, setDeleteTarget] = useState<AdConfig | null>(null);

  if (!isAdminLoggedIn) {
    navigate({ to: "/admin/login" });
    return null;
  }

  const openCreate = () => {
    setEditingAd(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };
  const openEdit = (ad: AdConfig) => {
    setEditingAd(ad);
    setForm({
      placement: ad.placement,
      title: ad.title,
      imageUrl: ad.imageUrl,
      targetUrl: ad.targetUrl,
      videoUrl: ad.videoUrl ?? "",
      isEnabled: ad.isEnabled,
    });
    setShowForm(true);
  };

  const handleToggle = async (ad: AdConfig) => {
    try {
      await updateAd.mutateAsync({
        id: ad.id,
        data: { isEnabled: !ad.isEnabled },
      });
      toast.success(
        `Ad "${ad.title}" ${!ad.isEnabled ? "enabled" : "disabled"}`,
      );
    } catch {
      toast.error("Failed to update ad");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.imageUrl) {
      toast.error("Title and image URL are required");
      return;
    }
    try {
      if (editingAd) {
        await updateAd.mutateAsync({ id: editingAd.id, data: form });
        toast.success(`Ad "${form.title}" updated`);
      } else {
        await createAd.mutateAsync(form);
        toast.success(`Ad "${form.title}" created`);
      }
      setShowForm(false);
    } catch {
      toast.error("Failed to save ad");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteAd.mutateAsync(deleteTarget.id);
      toast.success(`Ad "${deleteTarget.title}" deleted`);
      setDeleteTarget(null);
    } catch {
      toast.error("Failed to delete ad");
    }
  };

  const isSaving = createAd.isPending || updateAd.isPending;
  const enabledCount = ads.filter((a) => a.isEnabled).length;
  const placementStats = (
    Object.keys(PLACEMENT_LABELS) as AdConfig["placement"][]
  ).map((p) => ({
    placement: p,
    total: ads.filter((a) => a.placement === p).length,
    enabled: ads.filter((a) => a.placement === p && a.isEnabled).length,
  }));

  return (
    <AdminLayout
      title="Ad Management"
      subtitle={`${ads.length} ads configured · ${enabledCount} enabled`}
      action={
        <Button
          onClick={openCreate}
          className="bg-primary hover:bg-primary/90 gap-2 h-9 md:h-10 text-xs md:text-sm"
          data-ocid="add-ad-btn"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Ad</span>
          <span className="sm:hidden">Add</span>
        </Button>
      }
    >
      <div className="space-y-4 md:space-y-6">
        {/* Placement summary cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {placementStats.map(({ placement, total, enabled }) => (
            <div
              key={placement}
              className="bg-card border border-white/10 rounded-xl p-3.5 md:p-4 hover:border-white/20 transition-colors"
            >
              <div className="flex items-center gap-1.5 mb-2">
                <span
                  className={`w-2 h-2 rounded-full ${PLACEMENT_DOT[placement]}`}
                />
                <p className="text-[10px] text-white/40 font-medium truncate">
                  {PLACEMENT_LABELS[placement]}
                </p>
              </div>
              <p className="text-xl md:text-2xl font-display font-black text-foreground">
                {total}
              </p>
              <p className="text-[10px] text-white/30 mt-0.5">
                {enabled} active
              </p>
            </div>
          ))}
        </div>

        {/* Ads list */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : ads.length === 0 ? (
          <div
            className="bg-card border border-white/10 rounded-xl py-16 text-center space-y-3"
            data-ocid="empty-ads"
          >
            <Megaphone className="w-12 h-12 text-white/20 mx-auto" />
            <p className="text-white/40 text-sm">No ads configured yet</p>
            <Button
              onClick={openCreate}
              size="sm"
              className="bg-primary hover:bg-primary/90 gap-2"
            >
              <Plus className="w-4 h-4" />
              Add First Ad
            </Button>
          </div>
        ) : (
          <div className="bg-card border border-white/10 rounded-xl overflow-hidden">
            {/* Desktop table */}
            <table
              className="w-full text-sm hidden md:table"
              data-ocid="ads-table"
            >
              <thead className="bg-white/3 border-b border-white/10">
                <tr>
                  <th className="text-left px-5 py-3 text-[10px] font-semibold text-white/40 uppercase tracking-widest">
                    Ad
                  </th>
                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/40 uppercase tracking-widest hidden md:table-cell">
                    Placement
                  </th>
                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/40 uppercase tracking-widest hidden lg:table-cell">
                    Type
                  </th>
                  <th className="text-center px-4 py-3 text-[10px] font-semibold text-white/40 uppercase tracking-widest">
                    Enabled
                  </th>
                  <th className="text-right px-5 py-3 text-[10px] font-semibold text-white/40 uppercase tracking-widest">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {ads.map((ad) => {
                  const isVideoAd = !!ad.videoUrl;
                  return (
                    <tr
                      key={ad.id}
                      className="hover:bg-white/3 transition-colors"
                      data-ocid={`ad-row-${ad.id}`}
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          {ad.imageUrl ? (
                            <img
                              src={ad.imageUrl}
                              alt={ad.title}
                              className="w-20 h-11 object-cover rounded shrink-0"
                            />
                          ) : (
                            <div className="w-20 h-11 bg-white/5 rounded flex items-center justify-center shrink-0">
                              <Megaphone className="w-4 h-4 text-white/20" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="font-semibold text-foreground truncate max-w-[180px] text-sm">
                              {ad.title}
                            </p>
                            {ad.targetUrl && (
                              <p className="text-[10px] text-white/40 font-mono truncate max-w-[180px]">
                                {ad.targetUrl}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-semibold inline-flex items-center gap-1.5 ${PLACEMENT_COLORS[ad.placement]}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${PLACEMENT_DOT[ad.placement]}`}
                          />
                          {PLACEMENT_LABELS[ad.placement]}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <Badge
                          variant="secondary"
                          className="gap-1 text-[10px] bg-white/8 text-white/50 border-0"
                        >
                          {isVideoAd ? (
                            <Video className="w-3 h-3" />
                          ) : (
                            <Image className="w-3 h-3" />
                          )}
                          {isVideoAd ? "Video" : "Banner"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Switch
                          checked={ad.isEnabled}
                          onCheckedChange={() => handleToggle(ad)}
                          aria-label={`Toggle "${ad.title}"`}
                          data-ocid={`ad-toggle-${ad.id}`}
                        />
                      </td>
                      <td className="px-5 py-3 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => openEdit(ad)}
                            data-ocid={`edit-ad-${ad.id}`}
                            aria-label="Edit"
                            className="p-2 rounded-lg text-white/40 hover:text-foreground hover:bg-white/10 transition-colors min-h-[36px]"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(ad)}
                            data-ocid={`delete-ad-${ad.id}`}
                            aria-label="Delete"
                            className="p-2 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors min-h-[36px]"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Mobile card list */}
            <div className="md:hidden divide-y divide-white/5">
              {ads.map((ad) => (
                <AdCardMobile
                  key={ad.id}
                  ad={ad}
                  onEdit={() => openEdit(ad)}
                  onDelete={() => setDeleteTarget(ad)}
                  onToggle={() => handleToggle(ad)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Form dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent
          className="bg-card border-white/15 w-[calc(100vw-2rem)] max-w-lg"
          data-ocid="ad-form-dialog"
        >
          <DialogHeader>
            <DialogTitle className="font-display font-bold text-foreground text-lg">
              {editingAd ? "Edit Ad" : "Add New Ad"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <Label className="text-white/70 text-xs font-semibold uppercase tracking-wider">
                Placement
              </Label>
              <Select
                value={form.placement}
                onValueChange={(v: AdConfig["placement"]) =>
                  setForm((f) => ({ ...f, placement: v }))
                }
              >
                <SelectTrigger
                  className="bg-white/5 border-white/10 h-11"
                  data-ocid="ad-placement-select"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-white/15">
                  {(
                    Object.keys(PLACEMENT_LABELS) as AdConfig["placement"][]
                  ).map((p) => (
                    <SelectItem key={p} value={p}>
                      {PLACEMENT_LABELS[p]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label
                htmlFor="adTitle"
                className="text-white/70 text-xs font-semibold uppercase tracking-wider"
              >
                Ad Name *
              </Label>
              <Input
                id="adTitle"
                value={form.title}
                onChange={(e) =>
                  setForm((f) => ({ ...f, title: e.target.value }))
                }
                placeholder="Summer Anime Promotion"
                className="bg-white/5 border-white/10 h-11"
                data-ocid="ad-title-input"
              />
            </div>
            <div className="space-y-1.5">
              <Label
                htmlFor="adImage"
                className="text-white/70 text-xs font-semibold uppercase tracking-wider"
              >
                Image URL *
              </Label>
              <Input
                id="adImage"
                value={form.imageUrl}
                onChange={(e) =>
                  setForm((f) => ({ ...f, imageUrl: e.target.value }))
                }
                placeholder="https://example.com/ad-banner.jpg"
                className="bg-white/5 border-white/10 h-11"
                data-ocid="ad-image-input"
              />
            </div>
            <div className="space-y-1.5">
              <Label
                htmlFor="adTarget"
                className="text-white/70 text-xs font-semibold uppercase tracking-wider"
              >
                Target URL
              </Label>
              <Input
                id="adTarget"
                value={form.targetUrl}
                onChange={(e) =>
                  setForm((f) => ({ ...f, targetUrl: e.target.value }))
                }
                placeholder="https://example.com/landing"
                className="bg-white/5 border-white/10 h-11"
              />
            </div>
            {(form.placement === "video_pre_roll" ||
              form.placement === "video_mid_roll") && (
              <div className="space-y-1.5">
                <Label
                  htmlFor="adVideo"
                  className="text-white/70 text-xs font-semibold uppercase tracking-wider"
                >
                  Video URL
                </Label>
                <Input
                  id="adVideo"
                  value={form.videoUrl}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, videoUrl: e.target.value }))
                  }
                  placeholder="https://example.com/video-ad.mp4"
                  className="bg-white/5 border-white/10 h-11"
                  data-ocid="ad-video-input"
                />
              </div>
            )}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/8">
              <Switch
                id="adEnabled"
                checked={form.isEnabled}
                onCheckedChange={(v) =>
                  setForm((f) => ({ ...f, isEnabled: v }))
                }
                data-ocid="ad-enabled-toggle"
              />
              <Label
                htmlFor="adEnabled"
                className="cursor-pointer text-sm font-medium"
              >
                Enable this ad
              </Label>
            </div>
            <div className="flex gap-3 pt-1">
              <Button
                type="submit"
                disabled={isSaving}
                className="flex-1 bg-primary hover:bg-primary/90 h-11 gap-2"
                data-ocid="ad-form-submit"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>{editingAd ? "Update Ad" : "Add Ad"}</>
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
              Delete Ad
            </AlertDialogTitle>
            <AlertDialogDescription className="text-white/50">
              Delete ad{" "}
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
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              data-ocid="ad-delete-confirm"
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              {deleteAd.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
