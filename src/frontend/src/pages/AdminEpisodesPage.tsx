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
  CheckCircle2,
  Clock,
  Edit2,
  ExternalLink,
  Film,
  HardDriveUpload,
  Info,
  LayersIcon,
  Link2,
  Loader2,
  Play,
  Plus,
  RefreshCw,
  Save,
  Trash2,
  X,
  XCircle,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useAdminAuth } from "../hooks/useAdminAuth";
import { useAllAnime } from "../hooks/useAnime";
import {
  type EpisodeFormData,
  extractEpisodeError,
  useCreateEpisode,
  useDeleteEpisode,
  useEpisodesByAnime,
  useUpdateEpisode,
  useUploadVideo,
} from "../hooks/useEpisodes";
import {
  type SeasonFormData,
  safeSeasonNumber,
  useCreateSeason,
  useDeleteSeason,
  useSeasonsByAnime,
  useUpdateSeason,
} from "../hooks/useSeasons";
import type { SeasonPublic } from "../lib/localStorageDB";
import type { Episode } from "../lib/localStorageDB";
import { getSeasonsByAnime as lsGetSeasonsByAnime } from "../lib/localStorageDB";
import { AdminLayout } from "./AdminDashboardPage";

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

// ── URL validation helpers ──────────────────────────────────────────────────

const DIRECT_VIDEO_RE = /\.(mp4|webm|m3u8)(\?.*)?$/i;

type UrlKind = "direct" | "youtube" | "googledrive" | "invalid";

function getGoogleDriveFileId(url: string): string | null {
  try {
    const u = new URL(url.trim());
    if (!u.hostname.includes("drive.google.com")) return null;
    const fileMatch = u.pathname.match(/\/file\/d\/([^/?#]+)/);
    if (fileMatch) return fileMatch[1];
    const idParam = u.searchParams.get("id");
    if (idParam) return idParam;
  } catch {
    // ignore
  }
  return null;
}

function classifyVideoUrl(url: string): UrlKind {
  if (!url.trim()) return "invalid";
  let parsed: URL;
  try {
    parsed = new URL(url.trim());
  } catch {
    return "invalid";
  }
  if (!["http:", "https:"].includes(parsed.protocol)) return "invalid";
  const host = parsed.hostname.toLowerCase();
  if (host.includes("youtube.com") || host === "youtu.be") return "youtube";
  if (host.includes("drive.google.com")) return "googledrive";
  const pathAndQuery = parsed.pathname + parsed.search;
  if (DIRECT_VIDEO_RE.test(pathAndQuery)) return "direct";
  return "invalid";
}

function validateAndResolveUrl(raw: string): {
  ok: boolean;
  url: string;
  notice?: string;
  error?: string;
} {
  if (!raw.trim()) {
    return { ok: false, url: raw, error: "Video URL is required" };
  }
  const kind = classifyVideoUrl(raw);
  switch (kind) {
    case "direct":
      return { ok: true, url: raw };
    case "youtube":
      return { ok: true, url: raw };
    case "googledrive": {
      const fileId = getGoogleDriveFileId(raw);
      if (!fileId) {
        return {
          ok: false,
          url: raw,
          error:
            "Invalid Google Drive link — please share using 'Anyone with the link' option",
        };
      }
      const canonicalUrl = `https://drive.google.com/file/d/${fileId}/view`;
      return {
        ok: true,
        url: canonicalUrl,
        notice:
          "Google Drive link detected and converted. Make sure your file is shared with 'Anyone with the link'.",
      };
    }
    default:
      return {
        ok: false,
        url: raw,
        error:
          "Please enter a direct video link (.mp4, .webm, or .m3u8), YouTube, or Google Drive link",
      };
  }
}

// ── Form validation ─────────────────────────────────────────────────────────

interface FormErrors {
  animeId?: string;
  seasonId?: string;
  title?: string;
  description?: string;
  videoUrl?: string;
  episodeNumber?: string;
}

function validateForm(
  form: EpisodeFormData,
  hasSeasonsForAnime: boolean,
): FormErrors {
  const errors: FormErrors = {};
  if (!form.animeId.trim()) errors.animeId = "Please select an anime";
  if (hasSeasonsForAnime && !form.seasonId)
    errors.seasonId = "Please select a season";
  if (!form.title.trim()) errors.title = "Title is required";
  if (!form.description.trim()) errors.description = "Description is required";
  if (form.episodeNumber < 1) errors.episodeNumber = "Must be at least 1";

  const urlCheck = validateAndResolveUrl(form.videoUrl);
  if (!urlCheck.ok) {
    errors.videoUrl = urlCheck.error;
  }

  return errors;
}

// ── Episode mobile card ─────────────────────────────────────────────────────

function EpisodeCardMobile({
  ep,
  seasonName,
  onEdit,
  onDelete,
}: {
  ep: Episode;
  seasonName?: string;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div
      className="flex items-start gap-3 px-4 py-3.5 hover:bg-white/3 transition-colors"
      data-ocid={`episode-row-${ep.id}`}
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
          {seasonName && (
            <span className="inline-flex items-center gap-1 text-[10px] text-primary/70 bg-primary/10 px-1.5 py-0.5 rounded">
              {seasonName}
            </span>
          )}
          {ep.duration && (
            <span className="inline-flex items-center gap-1 text-[10px] text-white/40">
              <Clock className="w-2.5 h-2.5" />
              {ep.duration}
            </span>
          )}
          {ep.videoUrl && (
            <a
              href={ep.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-0.5 text-[10px] text-primary hover:underline"
            >
              <ExternalLink className="w-2.5 h-2.5" />
              Video
            </a>
          )}
        </div>
      </div>
      <div className="flex gap-1 shrink-0">
        <button
          type="button"
          onClick={onEdit}
          data-ocid={`edit-ep-${ep.id}`}
          aria-label="Edit"
          className="p-2 rounded-lg text-white/40 hover:text-foreground hover:bg-white/10 transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
        >
          <Edit2 className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={onDelete}
          data-ocid={`delete-ep-${ep.id}`}
          aria-label="Delete"
          className="p-2 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

// ── Video URL Tester ────────────────────────────────────────────────────────

type TestStatus = "idle" | "testing" | "ok" | "error" | "format-error";

function VideoUrlTester({
  url,
  onResolved,
}: {
  url: string;
  onResolved?: (resolvedUrl: string) => void;
}) {
  const [status, setStatus] = useState<TestStatus>("idle");
  const [statusMsg, setStatusMsg] = useState("");

  const testUrl = () => {
    if (!url.trim()) {
      toast.error("Enter a video URL first");
      return;
    }
    const validation = validateAndResolveUrl(url);
    if (!validation.ok) {
      setStatus("format-error");
      setStatusMsg(validation.error ?? "Invalid URL format");
      toast.error(validation.error ?? "Invalid URL format");
      return;
    }
    const resolvedUrl = validation.url;
    const kind = classifyVideoUrl(url);
    if (kind === "youtube") {
      setStatus("ok");
      setStatusMsg("YouTube link accepted");
      toast.success("YouTube link accepted — will use iframe embed");
      onResolved?.(resolvedUrl);
      return;
    }
    if (kind === "googledrive") {
      const fileId = getGoogleDriveFileId(url);
      if (!fileId) {
        setStatus("format-error");
        setStatusMsg("Could not extract Google Drive file ID — check the link");
        toast.error("Invalid Google Drive link — check the URL format");
        return;
      }
      const canonicalUrl = `https://drive.google.com/file/d/${fileId}/view`;
      setStatus("ok");
      setStatusMsg("Google Drive ✓ — embedded player will be used");
      toast.success("Google Drive link detected — will use embedded player");
      onResolved?.(canonicalUrl);
      return;
    }
    if (validation.notice) {
      toast.info(validation.notice);
      onResolved?.(resolvedUrl);
    }
    setStatus("testing");
    const v = document.createElement("video");
    v.src = resolvedUrl;
    v.preload = "metadata";
    const timeout = setTimeout(() => {
      setStatus("error");
      setStatusMsg("Timed out — video may not be accessible");
      toast.error("URL timed out — video may not be accessible");
    }, 8000);
    v.onloadedmetadata = () => {
      clearTimeout(timeout);
      setStatus("ok");
      setStatusMsg("Valid video URL");
      toast.success("Video URL is valid and playable!");
      onResolved?.(resolvedUrl);
    };
    v.onerror = () => {
      clearTimeout(timeout);
      setStatus("error");
      setStatusMsg("Video failed to load — check the link");
      toast.error("Video URL failed to load — check the link and try again");
    };
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <button
        type="button"
        onClick={testUrl}
        disabled={status === "testing" || !url.trim()}
        data-ocid="test-url-btn"
        className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-lg border transition-colors disabled:opacity-40 disabled:cursor-not-allowed border-primary/40 text-primary hover:bg-primary/10"
      >
        {status === "testing" ? (
          <Loader2 className="w-3 h-3 animate-spin" />
        ) : (
          <Play className="w-3 h-3" />
        )}
        {status === "testing" ? "Testing…" : "Test URL"}
      </button>
      {status === "ok" && (
        <span className="inline-flex items-center gap-1 text-[11px] text-green-400">
          <CheckCircle2 className="w-3.5 h-3.5" /> {statusMsg || "Valid"}
        </span>
      )}
      {(status === "error" || status === "format-error") && (
        <span className="inline-flex items-center gap-1 text-[11px] text-red-400 max-w-[200px]">
          <XCircle className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{statusMsg || "Failed"}</span>
        </span>
      )}
    </div>
  );
}

// ── Device Video Uploader ───────────────────────────────────────────────────

type UploadMode = "url" | "device";

interface DeviceVideoUploadProps {
  onVideoReady: (url: string) => void;
  onError: (msg: string) => void;
}

function DeviceVideoUpload({ onVideoReady, onError }: DeviceVideoUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { upload, progress, reset } = useUploadVideo();
  const [fileName, setFileName] = useState<string>("");
  const [fileSize, setFileSize] = useState<string>("");
  const [persistentUrl, setPersistentUrl] = useState<string>("");

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("video/")) {
      const errMsg = "Selected file is not a video. Please pick a video file.";
      onError(errMsg);
      toast.error(errMsg);
      return;
    }
    setFileName(file.name);
    setFileSize(formatFileSize(file.size));
    setPersistentUrl("");
    try {
      const url = await upload(file);
      if (url.startsWith("blob:")) {
        const errMsg =
          "Upload returned a temporary blob URL which will not persist. Please try again or use a direct URL.";
        onError(errMsg);
        toast.error(errMsg);
        return;
      }
      setPersistentUrl(url);
      onVideoReady(url);
      toast.success(`Video "${file.name}" uploaded successfully!`);
    } catch (err) {
      const errMsg =
        err instanceof Error ? err.message : "Upload failed. Please try again.";
      onError(errMsg);
      toast.error(`Upload failed: ${errMsg}`);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const uploadState = progress.status;

  return (
    <div className="space-y-2">
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        onChange={handleFileChange}
        className="hidden"
        id="device-video-input"
        data-ocid="device-video-input"
        aria-label="Upload video from device"
        disabled={uploadState === "uploading"}
      />
      <label
        htmlFor="device-video-input"
        className={`flex items-center justify-center gap-2.5 w-full h-11 rounded-lg border transition-all font-semibold text-sm select-none
          ${uploadState === "uploading" ? "cursor-not-allowed opacity-80" : "cursor-pointer"}
          ${
            uploadState === "done"
              ? "border-green-500/50 bg-green-500/10 text-green-400 hover:bg-green-500/15"
              : uploadState === "error"
                ? "border-red-500/50 bg-red-500/10 text-red-400 hover:bg-red-500/15"
                : uploadState === "uploading"
                  ? "border-primary/40 bg-primary/8 text-primary"
                  : "border-primary/40 bg-primary/8 text-primary hover:bg-primary/15"
          }`}
        data-ocid="device-upload-btn"
      >
        {uploadState === "uploading" ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin shrink-0" />
            <span>Uploading {progress.percentage}%</span>
          </>
        ) : uploadState === "done" ? (
          <>
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span className="truncate max-w-[180px]">{fileName}</span>
            <span className="text-[10px] opacity-70 shrink-0">
              ({fileSize})
            </span>
          </>
        ) : uploadState === "error" ? (
          <>
            <XCircle className="w-4 h-4" />
            Upload failed — tap to retry
          </>
        ) : (
          <>
            <HardDriveUpload className="w-4 h-4" />
            Upload from Gallery / Device
          </>
        )}
      </label>
      {uploadState === "uploading" && (
        <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${progress.percentage}%` }}
          />
        </div>
      )}
      {uploadState === "done" && persistentUrl && (
        <div className="space-y-1.5">
          <p className="text-[10px] text-green-400/80 leading-snug px-1">
            ✓ Video uploaded — persistent URL saved. Fill details below and
            save.
          </p>
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/3 border border-white/8">
            <Info className="w-3 h-3 text-white/30 shrink-0" />
            <span className="text-[10px] text-white/40 truncate flex-1 font-mono">
              {persistentUrl}
            </span>
            <button
              type="button"
              onClick={() => {
                reset();
                setPersistentUrl("");
                onVideoReady("");
              }}
              className="text-[10px] text-white/30 hover:text-white/60 transition-colors shrink-0"
            >
              Change
            </button>
          </div>
        </div>
      )}
      {uploadState === "error" && progress.error && (
        <p className="text-[10px] text-red-400/80 leading-snug px-1 truncate">
          Error: {progress.error}
        </p>
      )}
    </div>
  );
}

// ── Video Source Tabs ────────────────────────────────────────────────────────

function VideoSourceTabs({
  mode,
  onModeChange,
}: { mode: UploadMode; onModeChange: (m: UploadMode) => void }) {
  return (
    <div className="flex gap-0 rounded-lg overflow-hidden border border-white/10 w-fit">
      <button
        type="button"
        onClick={() => onModeChange("device")}
        className={`flex items-center gap-1.5 px-3 py-2 text-[11px] font-semibold transition-colors ${
          mode === "device"
            ? "bg-primary text-white"
            : "bg-white/5 text-white/40 hover:text-white/70 hover:bg-white/8"
        }`}
        data-ocid="video-mode-device"
        aria-label="Upload from device"
      >
        <Film className="w-3 h-3" />
        From Device
      </button>
      <button
        type="button"
        onClick={() => onModeChange("url")}
        className={`flex items-center gap-1.5 px-3 py-2 text-[11px] font-semibold transition-colors ${
          mode === "url"
            ? "bg-primary text-white"
            : "bg-white/5 text-white/40 hover:text-white/70 hover:bg-white/8"
        }`}
        data-ocid="video-mode-url"
        aria-label="Paste video URL"
      >
        <Link2 className="w-3 h-3" />
        Paste URL
      </button>
    </div>
  );
}

function UrlFormatHint() {
  return (
    <p className="text-[11px] text-white/35 leading-snug">
      Accepted:{" "}
      <span className="text-white/50 font-mono">.mp4 .webm .m3u8</span>
      {" · "}
      <span className="text-white/50">YouTube links</span>
      {" · "}
      <span className="text-white/50">Google Drive file links</span>
    </p>
  );
}

// ── Season Management Section ───────────────────────────────────────────────

interface SeasonRowProps {
  season: SeasonPublic;
  episodeCount: number;
  onEdit: (s: SeasonPublic) => void;
  onDelete: (s: SeasonPublic) => void;
}

function SeasonRow({ season, episodeCount, onEdit, onDelete }: SeasonRowProps) {
  return (
    <tr
      className="hover:bg-white/3 transition-colors"
      data-ocid={`season-row-${season.id}`}
    >
      <td className="px-4 py-3">
        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
          <span className="text-xs font-black text-primary">
            {safeSeasonNumber(season.seasonNumber)}
          </span>
        </div>
      </td>
      <td className="px-4 py-3">
        <p className="font-semibold text-foreground text-sm">{season.name}</p>
      </td>
      <td className="px-4 py-3 text-center">
        <span className="text-xs text-white/50 font-mono">{episodeCount}</span>
      </td>
      <td className="px-4 py-3 text-right">
        <div className="inline-flex items-center gap-1">
          <button
            type="button"
            onClick={() => onEdit(season)}
            data-ocid={`edit-season-${season.id}`}
            aria-label="Edit season"
            className="p-2 rounded-lg text-white/40 hover:text-foreground hover:bg-white/10 transition-colors min-h-[36px]"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(season)}
            data-ocid={`delete-season-${season.id}`}
            aria-label="Delete season"
            className="p-2 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors min-h-[36px]"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </td>
    </tr>
  );
}

interface SeasonManagementProps {
  animeId: string;
  episodes: Episode[];
}

function SeasonManagement({ animeId, episodes }: SeasonManagementProps) {
  const { data: seasons = [], isLoading } = useSeasonsByAnime(animeId);
  const createSeason = useCreateSeason();
  const updateSeason = useUpdateSeason();
  const deleteSeason = useDeleteSeason();

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSeason, setEditingSeason] = useState<SeasonPublic | null>(null);
  const [newSeasonNumber, setNewSeasonNumber] = useState(1);
  const [newSeasonName, setNewSeasonName] = useState("");
  const [editNumber, setEditNumber] = useState(1);
  const [editName, setEditName] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<SeasonPublic | null>(null);

  // Auto-fill next season number
  useEffect(() => {
    if (showAddForm) {
      const nextNum =
        seasons.length > 0
          ? Math.max(...seasons.map((s) => safeSeasonNumber(s.seasonNumber))) +
            1
          : 1;
      // Ensure never below 1
      const safeNext = Math.max(1, nextNum);
      setNewSeasonNumber(safeNext);
      setNewSeasonName(`Season ${safeNext}`);
    }
  }, [showAddForm, seasons]);

  const episodeCountBySeason = (seasonId: string) =>
    episodes.filter((ep) => ep.seasonId === seasonId).length;

  const handleAdd = async () => {
    if (!newSeasonName.trim()) {
      toast.error("Season name is required");
      return;
    }
    // Enforce minimum season number of 1
    const safeNum = Math.max(1, newSeasonNumber || 1);
    try {
      await createSeason.mutateAsync({
        animeId,
        seasonNumber: safeNum,
        name: newSeasonName.trim(),
      });
      toast.success(`${newSeasonName} created`);
      setShowAddForm(false);
    } catch {
      // hook shows toast
    }
  };

  const openEdit = (s: SeasonPublic) => {
    setEditingSeason(s);
    setEditNumber(safeSeasonNumber(s.seasonNumber));
    setEditName(s.name);
  };

  const handleUpdate = async () => {
    if (!editingSeason || !editName.trim()) return;
    try {
      await updateSeason.mutateAsync({
        id: editingSeason.id,
        data: {
          animeId,
          seasonNumber: editNumber,
          name: editName.trim(),
        },
      });
      toast.success("Season updated");
      setEditingSeason(null);
    } catch {
      // hook shows toast
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteSeason.mutateAsync({ id: deleteTarget.id, animeId });
      toast.success(`${deleteTarget.name} deleted`);
      setDeleteTarget(null);
    } catch {
      // hook shows toast
    }
  };

  return (
    <div
      className="bg-card border border-white/10 rounded-xl overflow-hidden mb-5"
      data-ocid="season-management"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/8 bg-white/2">
        <div className="flex items-center gap-2">
          <LayersIcon className="w-4 h-4 text-primary" />
          <h3 className="font-semibold text-sm text-foreground">
            Season Management
          </h3>
          <span className="text-xs text-white/40">
            ({seasons.length} season{seasons.length !== 1 ? "s" : ""})
          </span>
        </div>
        <Button
          type="button"
          size="sm"
          onClick={() => setShowAddForm((v) => !v)}
          data-ocid="add-season-btn"
          className="h-8 text-xs gap-1.5 bg-primary hover:bg-primary/90"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Season
        </Button>
      </div>

      {/* Add season inline form */}
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
              data-ocid="new-season-number"
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
              data-ocid="new-season-name"
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            />
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              size="sm"
              onClick={handleAdd}
              disabled={createSeason.isPending}
              className="h-9 bg-primary hover:bg-primary/90 gap-1.5 text-xs"
              data-ocid="save-new-season-btn"
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
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
        </div>
      ) : seasons.length === 0 ? (
        <div
          className="py-8 text-center text-white/40 text-sm"
          data-ocid="no-seasons"
        >
          No seasons yet — click "Add Season" to create one.
        </div>
      ) : (
        <table className="w-full text-sm">
          <thead className="bg-white/2 border-b border-white/8">
            <tr>
              <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-white/40 uppercase tracking-widest w-14">
                #
              </th>
              <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-white/40 uppercase tracking-widest">
                Name
              </th>
              <th className="text-center px-4 py-2.5 text-[10px] font-semibold text-white/40 uppercase tracking-widest w-24">
                Episodes
              </th>
              <th className="text-right px-4 py-2.5 text-[10px] font-semibold text-white/40 uppercase tracking-widest w-24">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {seasons.map((s) => (
              <SeasonRow
                key={s.id}
                season={s}
                episodeCount={episodeCountBySeason(s.id)}
                onEdit={openEdit}
                onDelete={setDeleteTarget}
              />
            ))}
          </tbody>
        </table>
      )}

      {/* Edit inline dialog */}
      <Dialog
        open={!!editingSeason}
        onOpenChange={(open) => !open && setEditingSeason(null)}
      >
        <DialogContent className="bg-card border-white/15 w-[calc(100vw-2rem)] max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display font-bold text-foreground">
              Edit Season
            </DialogTitle>
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
                  data-ocid="edit-season-number"
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
                  data-ocid="edit-season-name"
                  onKeyDown={(e) => e.key === "Enter" && handleUpdate()}
                />
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                type="button"
                onClick={handleUpdate}
                disabled={updateSeason.isPending}
                className="flex-1 bg-primary hover:bg-primary/90 h-10 gap-2"
                data-ocid="edit-season-submit"
              >
                {updateSeason.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
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
              ? This will unlink all episodes from this season. Continue?
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
              data-ocid="season-delete-confirm"
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              {deleteSeason.isPending ? "Deleting..." : "Delete Season"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ── Main page ───────────────────────────────────────────────────────────────

export default function AdminEpisodesPage() {
  const { isAdminLoggedIn } = useAdminAuth();
  const navigate = useNavigate();
  const { data: anime = [] } = useAllAnime();
  const [selectedAnimeId, setSelectedAnimeId] = useState<string>("");
  // Tracks the anime selected inside the episode form (may differ from outer filter)
  const [formAnimeId, setFormAnimeId] = useState<string>("");
  const { data: episodes = [], isLoading } = useEpisodesByAnime(
    selectedAnimeId || undefined,
  );
  const { data: seasons = [] } = useSeasonsByAnime(
    selectedAnimeId || undefined,
  );
  // Separate hook for seasons inside the episode form — uses formAnimeId
  const {
    data: formSeasons = [],
    isLoading: formSeasonsLoading,
    isFetching: formSeasonsFetching,
  } = useSeasonsByAnime(formAnimeId || undefined);
  // Only show "loading seasons" spinner if there's no localStorage data yet
  // This prevents false "Create a season first" message during backend sync
  const formSeasonsHasLocalData = formAnimeId
    ? lsGetSeasonsByAnime(formAnimeId).length > 0
    : false;
  const formSeasonsAnyLoading =
    (formSeasonsLoading || formSeasonsFetching) && !formSeasonsHasLocalData;
  const createEpisode = useCreateEpisode();
  const updateEpisode = useUpdateEpisode();
  const deleteEpisode = useDeleteEpisode();

  const [showForm, setShowForm] = useState(false);
  const [dialogKey, setDialogKey] = useState(0);
  const [editingEpisode, setEditingEpisode] = useState<Episode | null>(null);
  const [form, setForm] = useState<EpisodeFormData>(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [deleteTarget, setDeleteTarget] = useState<Episode | null>(null);
  const [videoMode, setVideoMode] = useState<UploadMode>("device");
  const [urlConvertNotice, setUrlConvertNotice] = useState<string>("");
  const [submitError, setSubmitError] = useState<string>("");
  const [lastSubmitData, setLastSubmitData] = useState<EpisodeFormData | null>(
    null,
  );
  const submitErrorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  useEffect(() => {
    if (submitError) {
      if (submitErrorTimerRef.current)
        clearTimeout(submitErrorTimerRef.current);
      submitErrorTimerRef.current = setTimeout(() => setSubmitError(""), 8000);
    }
    return () => {
      if (submitErrorTimerRef.current)
        clearTimeout(submitErrorTimerRef.current);
    };
  }, [submitError]);

  // Debug: log seasons whenever they load for the form
  useEffect(() => {
    if (!formSeasonsLoading && !formSeasonsFetching && formAnimeId) {
      console.log(
        `[Seasons] Loaded for form (anime ${formAnimeId}):`,
        formSeasons.map((s) => ({
          id: s.id,
          seasonNumber: safeSeasonNumber(s.seasonNumber),
          name: s.name,
        })),
      );
    }
  }, [formSeasons, formSeasonsLoading, formSeasonsFetching, formAnimeId]);

  if (!isAdminLoggedIn) {
    navigate({ to: "/admin/login" });
    return null;
  }

  const backendReady = true; // localStorage-only mode, always ready
  // hasSeasonsForAnime: only true when loading is done AND seasons exist
  // With localStorage as initialData, this should be true immediately if seasons were created
  const hasSeasonsForAnime = !formSeasonsAnyLoading && formSeasons.length > 0;

  const resetForm = () => {
    setFormErrors({});
    setUrlConvertNotice("");
    setSubmitError("");
  };

  // Map season id → season
  const seasonMap = new Map(seasons.map((s) => [s.id, s]));

  const getSeasonName = (seasonId: string | undefined): string | undefined => {
    if (!seasonId) return undefined;
    const s = seasonMap.get(seasonId);
    return s ? s.name : undefined;
  };

  const openCreate = () => {
    if (!selectedAnimeId) {
      toast.error("Please select an anime first");
      return;
    }
    setEditingEpisode(null);
    resetForm();
    setVideoMode("device");
    setFormAnimeId(selectedAnimeId);
    // Auto-select first season if only one exists
    const defaultSeasonId = seasons.length === 1 ? seasons[0].id : undefined;
    setForm({
      ...EMPTY_FORM,
      animeId: selectedAnimeId,
      episodeNumber: (episodes.length || 0) + 1,
      seasonId: defaultSeasonId,
    });
    setDialogKey((k) => k + 1);
    setShowForm(true);
  };

  const openEdit = (ep: Episode) => {
    setEditingEpisode(ep);
    resetForm();
    setVideoMode("url");
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
    setDialogKey((k) => k + 1);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");

    const urlResult = validateAndResolveUrl(form.videoUrl);
    const resolvedForm: EpisodeFormData = urlResult.ok
      ? { ...form, videoUrl: urlResult.url }
      : form;

    const errors = validateForm(resolvedForm, hasSeasonsForAnime);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error("Please fix the errors below before saving");
      return;
    }
    setFormErrors({});

    if (urlResult.notice) {
      toast.info(urlResult.notice);
    }

    setLastSubmitData(resolvedForm);

    try {
      if (editingEpisode) {
        await updateEpisode.mutateAsync({
          id: editingEpisode.id,
          data: resolvedForm,
        });
        toast.success(`Episode "${resolvedForm.title}" updated successfully`);
      } else {
        await createEpisode.mutateAsync(resolvedForm);
        toast.success(`Episode "${resolvedForm.title}" added successfully`);
      }
      closeForm();
    } catch (err) {
      const friendlyMsg = extractEpisodeError(err);
      console.error("Episode save error:", friendlyMsg, err);
      setSubmitError(friendlyMsg);
      toast.error(friendlyMsg);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteEpisode.mutateAsync(deleteTarget.id);
      toast.success(`Episode "${deleteTarget.title}" deleted`);
      setDeleteTarget(null);
    } catch {
      // onError in hook shows toast
    }
  };

  const isSaving = createEpisode.isPending || updateEpisode.isPending;
  // Allow saving even when backend is not yet connected — localStorage write-through handles persistence
  const canSave = !isSaving && !formSeasonsAnyLoading;
  const selectedAnime = anime.find((a) => a.id === selectedAnimeId);

  return (
    <AdminLayout
      title="Episode Management"
      subtitle={
        selectedAnime
          ? `${episodes.length} episodes — ${selectedAnime.title}`
          : "Select an anime to manage episodes"
      }
      action={
        <Button
          onClick={openCreate}
          disabled={false}
          className="bg-primary hover:bg-primary/90 gap-2 h-9 md:h-10 text-xs md:text-sm disabled:opacity-50"
          data-ocid="add-episode-btn"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Episode</span>
          <span className="sm:hidden">Add</span>
        </Button>
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
            }}
          >
            <SelectTrigger
              className="w-full sm:w-72 bg-card border-white/10 h-10"
              data-ocid="anime-select"
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

        {/* Season management — only when anime is selected */}
        {selectedAnimeId && (
          <SeasonManagement animeId={selectedAnimeId} episodes={episodes} />
        )}

        {/* Episodes container */}
        <div className="bg-card border border-white/10 rounded-xl overflow-hidden">
          {!selectedAnimeId ? (
            <div
              className="flex flex-col items-center justify-center py-16 text-white/40 gap-3"
              data-ocid="no-anime-selected"
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
              data-ocid="no-episodes"
            >
              <Play className="w-12 h-12 opacity-30" />
              <p className="text-sm">No episodes yet for this anime</p>
              <Button
                onClick={openCreate}
                disabled={false}
                size="sm"
                className="bg-primary hover:bg-primary/90 gap-2 disabled:opacity-50"
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
                data-ocid="episodes-table"
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
                    <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/40 uppercase tracking-widest hidden lg:table-cell">
                      Video URL
                    </th>
                    <th className="text-center px-4 py-3 text-[10px] font-semibold text-white/40 uppercase tracking-widest">
                      Duration
                    </th>
                    <th className="text-right px-5 py-3 text-[10px] font-semibold text-white/40 uppercase tracking-widest">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {episodes.map((ep) => (
                    <tr
                      key={ep.id}
                      className="hover:bg-white/3 transition-colors"
                      data-ocid={`episode-row-${ep.id}`}
                    >
                      <td className="px-5 py-3">
                        <div className="w-8 h-8 rounded-lg bg-white/8 flex items-center justify-center">
                          <span className="text-xs font-black text-white/50">
                            {Number(ep.episodeNumber)}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {ep.thumbnailUrl ? (
                            <img
                              src={ep.thumbnailUrl}
                              alt={ep.title}
                              className="w-16 h-9 object-cover rounded shrink-0 hidden sm:block"
                            />
                          ) : (
                            <div className="w-16 h-9 bg-white/5 rounded flex items-center justify-center shrink-0 hidden sm:flex">
                              <Play className="w-3 h-3 text-white/30" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="font-semibold text-foreground truncate max-w-[180px] text-sm">
                              {ep.title}
                            </p>
                            {ep.description && (
                              <p className="text-xs text-white/40 truncate max-w-[180px]">
                                {ep.description}
                              </p>
                            )}
                          </div>
                        </div>
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
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <a
                          href={ep.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline text-xs font-mono truncate max-w-[200px] block inline-flex items-center gap-1"
                        >
                          <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                          <span className="truncate">{ep.videoUrl}</span>
                        </a>
                      </td>
                      <td className="px-4 py-3 text-center">
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
                            data-ocid={`edit-ep-${ep.id}`}
                            aria-label="Edit"
                            className="p-2 rounded-lg text-white/40 hover:text-foreground hover:bg-white/10 transition-colors min-h-[36px]"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(ep)}
                            data-ocid={`delete-ep-${ep.id}`}
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
                {episodes.map((ep) => (
                  <EpisodeCardMobile
                    key={ep.id}
                    ep={ep}
                    seasonName={getSeasonName(ep.seasonId)}
                    onEdit={() => openEdit(ep)}
                    onDelete={() => setDeleteTarget(ep)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Form dialog */}
      <Dialog
        open={showForm}
        onOpenChange={(open) => {
          if (!open) closeForm();
          else setShowForm(true);
        }}
      >
        <DialogContent
          key={dialogKey}
          className="bg-card border-white/15 w-[calc(100vw-2rem)] max-w-lg max-h-[90vh] overflow-y-auto"
          data-ocid="episode-form-dialog"
        >
          <DialogHeader>
            <DialogTitle className="font-display font-bold text-foreground text-lg">
              {editingEpisode ? "Edit Episode" : "Add New Episode"}
            </DialogTitle>
          </DialogHeader>

          {!backendReady && (
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-xs">
              <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
              Connecting to backend — data is saved locally and will sync when
              connected
            </div>
          )}

          {submitError && (
            <div
              className="flex items-start gap-2 px-3 py-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs"
              data-ocid="submit-error-banner"
            >
              <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span className="flex-1">{submitError}</span>
              <div className="flex items-center gap-1.5 shrink-0">
                {lastSubmitData && (
                  <button
                    type="button"
                    onClick={async () => {
                      setSubmitError("");
                      try {
                        if (editingEpisode) {
                          await updateEpisode.mutateAsync({
                            id: editingEpisode.id,
                            data: lastSubmitData,
                          });
                          toast.success("Episode updated successfully");
                        } else {
                          await createEpisode.mutateAsync(lastSubmitData);
                          toast.success("Episode added successfully");
                        }
                        closeForm();
                      } catch (err) {
                        const msg = extractEpisodeError(err);
                        setSubmitError(msg);
                        toast.error(msg);
                      }
                    }}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-300 hover:text-red-100 transition-colors"
                    data-ocid="submit-error-retry-btn"
                  >
                    <RefreshCw className="w-3 h-3" /> Try Again
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setSubmitError("")}
                  className="text-red-400/60 hover:text-red-300 transition-colors"
                  aria-label="Dismiss error"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 mt-2" noValidate>
            {/* Anime selector */}
            <div className="space-y-1.5">
              <Label className="text-white/70 text-xs font-semibold uppercase tracking-wider">
                Anime <span className="text-primary">*</span>
              </Label>
              <Select
                value={form.animeId}
                onValueChange={(v) => {
                  setForm((f) => ({ ...f, animeId: v, seasonId: undefined }));
                  setFormAnimeId(v);
                  setFormErrors((er) => ({
                    ...er,
                    animeId: undefined,
                    seasonId: undefined,
                  }));
                }}
              >
                <SelectTrigger
                  className={`bg-white/5 border-white/10 h-11 ${formErrors.animeId ? "border-red-500/70" : ""}`}
                  data-ocid="ep-anime-select"
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
              {formErrors.animeId && (
                <p className="text-[11px] text-red-400 flex items-center gap-1">
                  <XCircle className="w-3 h-3" /> {formErrors.animeId}
                </p>
              )}
            </div>

            {/* Season selector */}
            <div className="space-y-1.5">
              <Label className="text-white/70 text-xs font-semibold uppercase tracking-wider">
                Season{" "}
                {hasSeasonsForAnime && <span className="text-primary">*</span>}
              </Label>
              {!form.animeId ? (
                <div className="h-11 flex items-center px-3 rounded-lg border border-white/8 text-white/30 text-sm bg-white/3">
                  Select an anime first
                </div>
              ) : formSeasonsAnyLoading ? (
                <div className="h-11 flex items-center gap-2 px-3 rounded-lg border border-white/10 text-white/40 text-sm bg-white/3">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-primary shrink-0" />
                  Loading seasons...
                </div>
              ) : formSeasons.length === 0 ? (
                <div
                  className="h-11 flex items-center px-3 rounded-lg border border-yellow-500/30 text-yellow-400/80 text-sm bg-yellow-500/5"
                  data-ocid="no-seasons-warning"
                >
                  <Info className="w-3.5 h-3.5 mr-2 shrink-0" />
                  Create a season first in Season Management above
                </div>
              ) : (
                <Select
                  value={form.seasonId ?? ""}
                  onValueChange={(v) => {
                    console.log("[Seasons] Selected season id:", v);
                    setForm((f) => ({
                      ...f,
                      seasonId: v || undefined,
                    }));
                    setFormErrors((er) => ({ ...er, seasonId: undefined }));
                  }}
                >
                  <SelectTrigger
                    className={`bg-white/5 border-white/10 h-11 ${formErrors.seasonId ? "border-red-500/70" : ""}`}
                    data-ocid="ep-season-select"
                  >
                    <SelectValue placeholder="Select season..." />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-white/15">
                    {formSeasons
                      .filter((s) => safeSeasonNumber(s.seasonNumber) >= 1)
                      .map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          Season {safeSeasonNumber(s.seasonNumber)}
                          {s.name &&
                          s.name !==
                            `Season ${safeSeasonNumber(s.seasonNumber)}`
                            ? ` — ${s.name}`
                            : ""}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              )}
              {formErrors.seasonId && (
                <p className="text-[11px] text-red-400 flex items-center gap-1">
                  <XCircle className="w-3 h-3" /> {formErrors.seasonId}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label
                  htmlFor="epNumber"
                  className="text-white/70 text-xs font-semibold uppercase tracking-wider"
                >
                  Episode #
                </Label>
                <Input
                  id="epNumber"
                  type="number"
                  min="1"
                  value={form.episodeNumber}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      episodeNumber: Number.parseInt(e.target.value) || 1,
                    }))
                  }
                  className={`bg-white/5 border-white/10 h-11 ${formErrors.episodeNumber ? "border-red-500/70" : ""}`}
                  data-ocid="ep-number-input"
                />
                {formErrors.episodeNumber && (
                  <p className="text-[11px] text-red-400">
                    {formErrors.episodeNumber}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label
                  htmlFor="duration"
                  className="text-white/70 text-xs font-semibold uppercase tracking-wider"
                >
                  Duration
                </Label>
                <Input
                  id="duration"
                  type="text"
                  value={form.duration}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, duration: e.target.value }))
                  }
                  placeholder="24:00"
                  className="bg-white/5 border-white/10 h-11"
                />
              </div>
            </div>

            {/* Title */}
            <div className="space-y-1.5">
              <Label
                htmlFor="epTitle"
                className="text-white/70 text-xs font-semibold uppercase tracking-wider"
              >
                Title <span className="text-primary">*</span>
              </Label>
              <Input
                id="epTitle"
                value={form.title}
                onChange={(e) => {
                  setForm((f) => ({ ...f, title: e.target.value }));
                  setFormErrors((er) => ({ ...er, title: undefined }));
                }}
                placeholder="Ryomen Sukuna"
                className={`bg-white/5 border-white/10 h-11 ${formErrors.title ? "border-red-500/70" : ""}`}
                data-ocid="ep-title-input"
              />
              {formErrors.title && (
                <p className="text-[11px] text-red-400 flex items-center gap-1">
                  <XCircle className="w-3 h-3" /> {formErrors.title}
                </p>
              )}
            </div>

            {/* Video Source */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <Label className="text-white/70 text-xs font-semibold uppercase tracking-wider">
                  Video Source <span className="text-primary">*</span>
                </Label>
                <VideoSourceTabs
                  mode={videoMode}
                  onModeChange={(m) => {
                    setVideoMode(m);
                    setForm((f) => ({ ...f, videoUrl: "" }));
                    setFormErrors((er) => ({ ...er, videoUrl: undefined }));
                    setUrlConvertNotice("");
                  }}
                />
              </div>

              {videoMode === "device" ? (
                <div className="space-y-2">
                  <DeviceVideoUpload
                    onVideoReady={(url) => {
                      setForm((f) => ({ ...f, videoUrl: url }));
                      setFormErrors((er) => ({ ...er, videoUrl: undefined }));
                    }}
                    onError={() =>
                      setFormErrors((er) => ({
                        ...er,
                        videoUrl: "Video upload failed",
                      }))
                    }
                  />
                  {form.videoUrl && (
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/3 border border-white/8">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-400 shrink-0" />
                      <span className="text-[11px] text-white/50 truncate flex-1 font-mono">
                        {form.videoUrl}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setForm((f) => ({ ...f, videoUrl: "" }));
                          setFormErrors((er) => ({
                            ...er,
                            videoUrl: undefined,
                          }));
                        }}
                        className="text-white/30 hover:text-red-400 transition-colors shrink-0"
                        aria-label="Clear video"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                  {formErrors.videoUrl && (
                    <p className="text-[11px] text-red-400 flex items-center gap-1">
                      <XCircle className="w-3 h-3" /> {formErrors.videoUrl}
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-1.5">
                  <Input
                    id="videoUrl"
                    value={form.videoUrl}
                    onChange={(e) => {
                      setForm((f) => ({ ...f, videoUrl: e.target.value }));
                      setFormErrors((er) => ({ ...er, videoUrl: undefined }));
                      setUrlConvertNotice("");
                    }}
                    onBlur={() => {
                      if (!form.videoUrl.trim()) return;
                      const kind = classifyVideoUrl(form.videoUrl);
                      if (kind === "googledrive") {
                        const fileId = getGoogleDriveFileId(form.videoUrl);
                        if (fileId) {
                          const canonicalUrl = `https://drive.google.com/file/d/${fileId}/view`;
                          setForm((f) => ({ ...f, videoUrl: canonicalUrl }));
                          setUrlConvertNotice(
                            "Google Drive link detected and converted.",
                          );
                        }
                      }
                    }}
                    placeholder="https://drive.google.com/file/d/… or .mp4 URL"
                    className={`bg-white/5 border-white/10 h-11 ${formErrors.videoUrl ? "border-red-500/70" : ""}`}
                    data-ocid="ep-video-url-input"
                  />
                  {classifyVideoUrl(form.videoUrl) === "googledrive" && (
                    <div className="flex items-start gap-2 px-3 py-2.5 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                      <Info className="w-3.5 h-3.5 text-yellow-400 shrink-0 mt-0.5" />
                      <span className="text-[11px] text-yellow-300 leading-snug">
                        <strong>Tip:</strong> For Google Drive videos to play,
                        share the file with{" "}
                        <strong>"Anyone with the link"</strong> in Google Drive
                        settings.
                      </span>
                    </div>
                  )}
                  {formErrors.videoUrl ? (
                    <p className="text-[11px] text-red-400 flex items-center gap-1">
                      <XCircle className="w-3 h-3" /> {formErrors.videoUrl}
                    </p>
                  ) : (
                    <div className="space-y-1.5 mt-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <UrlFormatHint />
                        <VideoUrlTester
                          url={form.videoUrl}
                          onResolved={(resolved) => {
                            setForm((f) => ({ ...f, videoUrl: resolved }));
                            const kind = classifyVideoUrl(form.videoUrl);
                            setUrlConvertNotice(
                              kind === "googledrive"
                                ? "Google Drive link detected and converted."
                                : "URL validated successfully",
                            );
                          }}
                        />
                      </div>
                      {urlConvertNotice && (
                        <div className="flex items-center gap-1.5 px-2 py-1.5 rounded bg-green-500/10 border border-green-500/20">
                          <CheckCircle2 className="w-3 h-3 text-green-400 shrink-0" />
                          <span className="text-[11px] text-green-400">
                            {urlConvertNotice}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Thumbnail URL */}
            <div className="space-y-1.5">
              <Label
                htmlFor="epThumbnail"
                className="text-white/70 text-xs font-semibold uppercase tracking-wider"
              >
                Thumbnail URL
              </Label>
              <Input
                id="epThumbnail"
                value={form.thumbnailUrl}
                onChange={(e) =>
                  setForm((f) => ({ ...f, thumbnailUrl: e.target.value }))
                }
                placeholder="https://example.com/thumb.jpg"
                className="bg-white/5 border-white/10 h-11"
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label
                htmlFor="epDesc"
                className="text-white/70 text-xs font-semibold uppercase tracking-wider"
              >
                Description <span className="text-primary">*</span>
              </Label>
              <Textarea
                id="epDesc"
                value={form.description}
                onChange={(e) => {
                  setForm((f) => ({ ...f, description: e.target.value }));
                  setFormErrors((er) => ({
                    ...er,
                    description: undefined,
                  }));
                }}
                rows={2}
                placeholder="Brief description of this episode..."
                className={`bg-white/5 border-white/10 resize-none ${formErrors.description ? "border-red-500/70" : ""}`}
              />
              {formErrors.description && (
                <p className="text-[11px] text-red-400 flex items-center gap-1">
                  <XCircle className="w-3 h-3" /> {formErrors.description}
                </p>
              )}
            </div>

            <div className="flex gap-3 pt-1">
              <Button
                type="submit"
                disabled={
                  !canSave || (hasSeasonsForAnime && formSeasons.length === 0)
                }
                className="flex-1 bg-primary hover:bg-primary/90 h-11 gap-2 disabled:opacity-60"
                data-ocid="ep-form-submit"
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
                onClick={closeForm}
                className="border-white/15 text-foreground hover:bg-white/10 h-11 px-6"
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete episode confirmation */}
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
                "Ep {deleteTarget ? Number(deleteTarget.episodeNumber) : ""}:{" "}
                {deleteTarget?.title}"
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
              data-ocid="episode-delete-confirm"
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              {deleteEpisode.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
