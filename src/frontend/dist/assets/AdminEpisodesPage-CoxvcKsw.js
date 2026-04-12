import { c as createLucideIcon, R as useAdminAuth, D as useNavigate, v as useActor, f as useAllAnime, r as reactExports, j as jsxRuntimeExports, U as Label, B as Button, a3 as RefreshCw, h as ue, X, W as Input, z as createActor } from "./index-EgDyTYGb.js";
import { T as TriangleAlert, A as AlertDialog, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction } from "./alert-dialog-CTBOrQlX.js";
import { S as Select, d as SelectTrigger, e as SelectValue, f as SelectContent, g as SelectItem, P as Pen, D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle } from "./select-DmEclI_k.js";
import { T as Textarea } from "./textarea-DCtGyOb1.js";
import { u as useEpisodesByAnime, b as useCreateEpisode, c as useUpdateEpisode, d as useDeleteEpisode, e as extractEpisodeError, f as useUploadVideo } from "./useEpisodes-Cn2KRf2A.js";
import { u as useSeasonsByAnime, s as safeSeasonNumber, a as useCreateSeason, b as useUpdateSeason, c as useDeleteSeason } from "./useSeasons-DlWf436U.js";
import { A as AdminLayout, C as Clock, F as Film } from "./AdminDashboardPage-Bh4uuf3a.js";
import { P as Play } from "./play-CBdCPXZ4.js";
import { L as LoaderCircle } from "./loader-circle-CVDrokuk.js";
import { P as Plus } from "./plus-CCOzFWtb.js";
import { T as Trash2 } from "./trash-2-CmuSVtds.js";
import { I as Info } from "./info-D1zCW0Yo.js";
import { C as CircleCheck } from "./circle-check-BmIPXJW8.js";
import "./index-RDfOIdd_.js";
import "./chevron-down-w1cgg2bK.js";
import "./check-CqKCVtSR.js";
import "./chevron-up-h77nSeZm.js";
import "./useAds-BrDSk_pZ.js";
import "./star-Dex4ctD4.js";
import "./tv-YOY82xAF.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$5 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m15 9-6 6", key: "1uzhvr" }],
  ["path", { d: "m9 9 6 6", key: "z0biqf" }]
];
const CircleX = createLucideIcon("circle-x", __iconNode$5);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$4 = [
  ["path", { d: "M15 3h6v6", key: "1q9fwt" }],
  ["path", { d: "M10 14 21 3", key: "gplh6r" }],
  ["path", { d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6", key: "a6xqqp" }]
];
const ExternalLink = createLucideIcon("external-link", __iconNode$4);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["path", { d: "m16 6-4-4-4 4", key: "13yo43" }],
  ["path", { d: "M12 2v8", key: "1q4o3n" }],
  ["rect", { width: "20", height: "8", x: "2", y: "14", rx: "2", key: "w68u3i" }],
  ["path", { d: "M6 18h.01", key: "uhywen" }],
  ["path", { d: "M10 18h.01", key: "h775k" }]
];
const HardDriveUpload = createLucideIcon("hard-drive-upload", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  [
    "path",
    {
      d: "M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z",
      key: "zw3jo"
    }
  ],
  [
    "path",
    {
      d: "M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12",
      key: "1wduqc"
    }
  ],
  [
    "path",
    {
      d: "M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17",
      key: "kqbvx6"
    }
  ]
];
const Layers = createLucideIcon("layers", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M9 17H7A5 5 0 0 1 7 7h2", key: "8i5ue5" }],
  ["path", { d: "M15 7h2a5 5 0 1 1 0 10h-2", key: "1b9ql8" }],
  ["line", { x1: "8", x2: "16", y1: "12", y2: "12", key: "1jonct" }]
];
const Link2 = createLucideIcon("link-2", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",
      key: "1c8476"
    }
  ],
  ["path", { d: "M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7", key: "1ydtos" }],
  ["path", { d: "M7 3v4a1 1 0 0 0 1 1h7", key: "t51u73" }]
];
const Save = createLucideIcon("save", __iconNode);
const EMPTY_FORM = {
  animeId: "",
  episodeNumber: 1,
  title: "",
  description: "",
  videoUrl: "",
  duration: "",
  thumbnailUrl: "",
  seasonId: void 0
};
const DIRECT_VIDEO_RE = /\.(mp4|webm|m3u8)(\?.*)?$/i;
function getGoogleDriveFileId(url) {
  try {
    const u = new URL(url.trim());
    if (!u.hostname.includes("drive.google.com")) return null;
    const fileMatch = u.pathname.match(/\/file\/d\/([^/?#]+)/);
    if (fileMatch) return fileMatch[1];
    const idParam = u.searchParams.get("id");
    if (idParam) return idParam;
  } catch {
  }
  return null;
}
function classifyVideoUrl(url) {
  if (!url.trim()) return "invalid";
  let parsed;
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
function validateAndResolveUrl(raw) {
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
          error: "Invalid Google Drive link — please share using 'Anyone with the link' option"
        };
      }
      const canonicalUrl = `https://drive.google.com/file/d/${fileId}/view`;
      return {
        ok: true,
        url: canonicalUrl,
        notice: "Google Drive link detected and converted. Make sure your file is shared with 'Anyone with the link'."
      };
    }
    default:
      return {
        ok: false,
        url: raw,
        error: "Please enter a direct video link (.mp4, .webm, or .m3u8), YouTube, or Google Drive link"
      };
  }
}
function validateForm(form, hasSeasonsForAnime) {
  const errors = {};
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
function EpisodeCardMobile({
  ep,
  seasonName,
  onEdit,
  onDelete
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex items-start gap-3 px-4 py-3.5 hover:bg-white/3 transition-colors",
      "data-ocid": `episode-row-${ep.id}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-white/8 flex items-center justify-center shrink-0 mt-0.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-black text-white/50", children: Number(ep.episodeNumber) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground truncate text-sm", children: ep.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-1", children: [
            seasonName && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center gap-1 text-[10px] text-primary/70 bg-primary/10 px-1.5 py-0.5 rounded", children: seasonName }),
            ep.duration && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 text-[10px] text-white/40", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-2.5 h-2.5" }),
              ep.duration
            ] }),
            ep.videoUrl && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "a",
              {
                href: ep.videoUrl,
                target: "_blank",
                rel: "noopener noreferrer",
                className: "inline-flex items-center gap-0.5 text-[10px] text-primary hover:underline",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "w-2.5 h-2.5" }),
                  "Video"
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: onEdit,
              "data-ocid": `edit-ep-${ep.id}`,
              "aria-label": "Edit",
              className: "p-2 rounded-lg text-white/40 hover:text-foreground hover:bg-white/10 transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { className: "w-3.5 h-3.5" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: onDelete,
              "data-ocid": `delete-ep-${ep.id}`,
              "aria-label": "Delete",
              className: "p-2 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5" })
            }
          )
        ] })
      ]
    }
  );
}
function VideoUrlTester({
  url,
  onResolved
}) {
  const [status, setStatus] = reactExports.useState("idle");
  const [statusMsg, setStatusMsg] = reactExports.useState("");
  const testUrl = () => {
    if (!url.trim()) {
      ue.error("Enter a video URL first");
      return;
    }
    const validation = validateAndResolveUrl(url);
    if (!validation.ok) {
      setStatus("format-error");
      setStatusMsg(validation.error ?? "Invalid URL format");
      ue.error(validation.error ?? "Invalid URL format");
      return;
    }
    const resolvedUrl = validation.url;
    const kind = classifyVideoUrl(url);
    if (kind === "youtube") {
      setStatus("ok");
      setStatusMsg("YouTube link accepted");
      ue.success("YouTube link accepted — will use iframe embed");
      onResolved == null ? void 0 : onResolved(resolvedUrl);
      return;
    }
    if (kind === "googledrive") {
      const fileId = getGoogleDriveFileId(url);
      if (!fileId) {
        setStatus("format-error");
        setStatusMsg("Could not extract Google Drive file ID — check the link");
        ue.error("Invalid Google Drive link — check the URL format");
        return;
      }
      const canonicalUrl = `https://drive.google.com/file/d/${fileId}/view`;
      setStatus("ok");
      setStatusMsg("Google Drive ✓ — embedded player will be used");
      ue.success("Google Drive link detected — will use embedded player");
      onResolved == null ? void 0 : onResolved(canonicalUrl);
      return;
    }
    if (validation.notice) {
      ue.info(validation.notice);
      onResolved == null ? void 0 : onResolved(resolvedUrl);
    }
    setStatus("testing");
    const v = document.createElement("video");
    v.src = resolvedUrl;
    v.preload = "metadata";
    const timeout = setTimeout(() => {
      setStatus("error");
      setStatusMsg("Timed out — video may not be accessible");
      ue.error("URL timed out — video may not be accessible");
    }, 8e3);
    v.onloadedmetadata = () => {
      clearTimeout(timeout);
      setStatus("ok");
      setStatusMsg("Valid video URL");
      ue.success("Video URL is valid and playable!");
      onResolved == null ? void 0 : onResolved(resolvedUrl);
    };
    v.onerror = () => {
      clearTimeout(timeout);
      setStatus("error");
      setStatusMsg("Video failed to load — check the link");
      ue.error("Video URL failed to load — check the link and try again");
    };
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        onClick: testUrl,
        disabled: status === "testing" || !url.trim(),
        "data-ocid": "test-url-btn",
        className: "inline-flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-lg border transition-colors disabled:opacity-40 disabled:cursor-not-allowed border-primary/40 text-primary hover:bg-primary/10",
        children: [
          status === "testing" ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-3 h-3 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "w-3 h-3" }),
          status === "testing" ? "Testing…" : "Test URL"
        ]
      }
    ),
    status === "ok" && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 text-[11px] text-green-400", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-3.5 h-3.5" }),
      " ",
      statusMsg || "Valid"
    ] }),
    (status === "error" || status === "format-error") && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 text-[11px] text-red-400 max-w-[200px]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-3.5 h-3.5 shrink-0" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: statusMsg || "Failed" })
    ] })
  ] });
}
function DeviceVideoUpload({ onVideoReady, onError }) {
  const fileInputRef = reactExports.useRef(null);
  const { upload, progress, reset } = useUploadVideo();
  const [fileName, setFileName] = reactExports.useState("");
  const [fileSize, setFileSize] = reactExports.useState("");
  const [persistentUrl, setPersistentUrl] = reactExports.useState("");
  const formatFileSize = (bytes) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };
  const handleFileChange = async (e) => {
    var _a;
    const file = (_a = e.target.files) == null ? void 0 : _a[0];
    if (!file) return;
    if (!file.type.startsWith("video/")) {
      const errMsg = "Selected file is not a video. Please pick a video file.";
      onError(errMsg);
      ue.error(errMsg);
      return;
    }
    setFileName(file.name);
    setFileSize(formatFileSize(file.size));
    setPersistentUrl("");
    try {
      const url = await upload(file);
      if (url.startsWith("blob:")) {
        const errMsg = "Upload returned a temporary blob URL which will not persist. Please try again or use a direct URL.";
        onError(errMsg);
        ue.error(errMsg);
        return;
      }
      setPersistentUrl(url);
      onVideoReady(url);
      ue.success(`Video "${file.name}" uploaded successfully!`);
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "Upload failed. Please try again.";
      onError(errMsg);
      ue.error(`Upload failed: ${errMsg}`);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  const uploadState = progress.status;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        ref: fileInputRef,
        type: "file",
        accept: "video/*",
        onChange: handleFileChange,
        className: "hidden",
        id: "device-video-input",
        "data-ocid": "device-video-input",
        "aria-label": "Upload video from device",
        disabled: uploadState === "uploading"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "label",
      {
        htmlFor: "device-video-input",
        className: `flex items-center justify-center gap-2.5 w-full h-11 rounded-lg border transition-all font-semibold text-sm select-none
          ${uploadState === "uploading" ? "cursor-not-allowed opacity-80" : "cursor-pointer"}
          ${uploadState === "done" ? "border-green-500/50 bg-green-500/10 text-green-400 hover:bg-green-500/15" : uploadState === "error" ? "border-red-500/50 bg-red-500/10 text-red-400 hover:bg-red-500/15" : uploadState === "uploading" ? "border-primary/40 bg-primary/8 text-primary" : "border-primary/40 bg-primary/8 text-primary hover:bg-primary/15"}`,
        "data-ocid": "device-upload-btn",
        children: uploadState === "uploading" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "Uploading ",
            progress.percentage,
            "%"
          ] })
        ] }) : uploadState === "done" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4 shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate max-w-[180px]", children: fileName }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] opacity-70 shrink-0", children: [
            "(",
            fileSize,
            ")"
          ] })
        ] }) : uploadState === "error" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-4 h-4" }),
          "Upload failed — tap to retry"
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(HardDriveUpload, { className: "w-4 h-4" }),
          "Upload from Gallery / Device"
        ] })
      }
    ),
    uploadState === "uploading" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-1.5 rounded-full bg-white/10 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "h-full bg-primary rounded-full transition-all duration-300",
        style: { width: `${progress.percentage}%` }
      }
    ) }),
    uploadState === "done" && persistentUrl && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-green-400/80 leading-snug px-1", children: "✓ Video uploaded — persistent URL saved. Fill details below and save." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-3 py-2 rounded-lg bg-white/3 border border-white/8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "w-3 h-3 text-white/30 shrink-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-white/40 truncate flex-1 font-mono", children: persistentUrl }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => {
              reset();
              setPersistentUrl("");
              onVideoReady("");
            },
            className: "text-[10px] text-white/30 hover:text-white/60 transition-colors shrink-0",
            children: "Change"
          }
        )
      ] })
    ] }),
    uploadState === "error" && progress.error && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-red-400/80 leading-snug px-1 truncate", children: [
      "Error: ",
      progress.error
    ] })
  ] });
}
function VideoSourceTabs({
  mode,
  onModeChange
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-0 rounded-lg overflow-hidden border border-white/10 w-fit", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        onClick: () => onModeChange("device"),
        className: `flex items-center gap-1.5 px-3 py-2 text-[11px] font-semibold transition-colors ${mode === "device" ? "bg-primary text-white" : "bg-white/5 text-white/40 hover:text-white/70 hover:bg-white/8"}`,
        "data-ocid": "video-mode-device",
        "aria-label": "Upload from device",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Film, { className: "w-3 h-3" }),
          "From Device"
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        onClick: () => onModeChange("url"),
        className: `flex items-center gap-1.5 px-3 py-2 text-[11px] font-semibold transition-colors ${mode === "url" ? "bg-primary text-white" : "bg-white/5 text-white/40 hover:text-white/70 hover:bg-white/8"}`,
        "data-ocid": "video-mode-url",
        "aria-label": "Paste video URL",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link2, { className: "w-3 h-3" }),
          "Paste URL"
        ]
      }
    )
  ] });
}
function BackendNotReadyBanner() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-4 py-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-sm mb-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin shrink-0" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Connecting to backend… Episode saving will be available once connected." })
  ] });
}
function UrlFormatHint() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] text-white/35 leading-snug", children: [
    "Accepted:",
    " ",
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white/50 font-mono", children: ".mp4 .webm .m3u8" }),
    " · ",
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white/50", children: "YouTube links" }),
    " · ",
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white/50", children: "Google Drive file links" })
  ] });
}
function SeasonRow({ season, episodeCount, onEdit, onDelete }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "tr",
    {
      className: "hover:bg-white/3 transition-colors",
      "data-ocid": `season-row-${season.id}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-black text-primary", children: safeSeasonNumber(season.seasonNumber) }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground text-sm", children: season.name }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-white/50 font-mono", children: episodeCount }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => onEdit(season),
              "data-ocid": `edit-season-${season.id}`,
              "aria-label": "Edit season",
              className: "p-2 rounded-lg text-white/40 hover:text-foreground hover:bg-white/10 transition-colors min-h-[36px]",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { className: "w-3.5 h-3.5" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => onDelete(season),
              "data-ocid": `delete-season-${season.id}`,
              "aria-label": "Delete season",
              className: "p-2 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors min-h-[36px]",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5" })
            }
          )
        ] }) })
      ]
    }
  );
}
function SeasonManagement({ animeId, episodes }) {
  const { data: seasons = [], isLoading } = useSeasonsByAnime(animeId);
  const createSeason = useCreateSeason();
  const updateSeason = useUpdateSeason();
  const deleteSeason = useDeleteSeason();
  const [showAddForm, setShowAddForm] = reactExports.useState(false);
  const [editingSeason, setEditingSeason] = reactExports.useState(null);
  const [newSeasonNumber, setNewSeasonNumber] = reactExports.useState(1);
  const [newSeasonName, setNewSeasonName] = reactExports.useState("");
  const [editNumber, setEditNumber] = reactExports.useState(1);
  const [editName, setEditName] = reactExports.useState("");
  const [deleteTarget, setDeleteTarget] = reactExports.useState(null);
  reactExports.useEffect(() => {
    if (showAddForm) {
      const nextNum = seasons.length > 0 ? Math.max(...seasons.map((s) => safeSeasonNumber(s.seasonNumber))) + 1 : 1;
      const safeNext = Math.max(1, nextNum);
      setNewSeasonNumber(safeNext);
      setNewSeasonName(`Season ${safeNext}`);
    }
  }, [showAddForm, seasons]);
  const episodeCountBySeason = (seasonId) => episodes.filter((ep) => ep.seasonId === seasonId).length;
  const handleAdd = async () => {
    if (!newSeasonName.trim()) {
      ue.error("Season name is required");
      return;
    }
    const safeNum = Math.max(1, newSeasonNumber || 1);
    try {
      await createSeason.mutateAsync({
        animeId,
        seasonNumber: safeNum,
        name: newSeasonName.trim()
      });
      ue.success(`${newSeasonName} created`);
      setShowAddForm(false);
    } catch {
    }
  };
  const openEdit = (s) => {
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
          name: editName.trim()
        }
      });
      ue.success("Season updated");
      setEditingSeason(null);
    } catch {
    }
  };
  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteSeason.mutateAsync({ id: deleteTarget.id, animeId });
      ue.success(`${deleteTarget.name} deleted`);
      setDeleteTarget(null);
    } catch {
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "bg-card border border-white/10 rounded-xl overflow-hidden mb-5",
      "data-ocid": "season-management",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-5 py-3.5 border-b border-white/8 bg-white/2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { className: "w-4 h-4 text-primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-sm text-foreground", children: "Season Management" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-white/40", children: [
              "(",
              seasons.length,
              " season",
              seasons.length !== 1 ? "s" : "",
              ")"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              size: "sm",
              onClick: () => setShowAddForm((v) => !v),
              "data-ocid": "add-season-btn",
              className: "h-8 text-xs gap-1.5 bg-primary hover:bg-primary/90",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3.5 h-3.5" }),
                "Add Season"
              ]
            }
          )
        ] }),
        showAddForm && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end gap-3 px-5 py-4 border-b border-white/8 bg-primary/5 flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-white/60 text-[10px] font-semibold uppercase tracking-wider", children: "Season #" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "number",
                min: "1",
                value: newSeasonNumber,
                onChange: (e) => setNewSeasonNumber(Number.parseInt(e.target.value) || 1),
                className: "bg-white/5 border-white/10 h-9 w-24 text-sm",
                "data-ocid": "new-season-number"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1 flex-1 min-w-[150px]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-white/60 text-[10px] font-semibold uppercase tracking-wider", children: "Season Name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: newSeasonName,
                onChange: (e) => setNewSeasonName(e.target.value),
                placeholder: "Season 1",
                className: "bg-white/5 border-white/10 h-9 text-sm",
                "data-ocid": "new-season-name",
                onKeyDown: (e) => e.key === "Enter" && handleAdd()
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                type: "button",
                size: "sm",
                onClick: handleAdd,
                disabled: createSeason.isPending,
                className: "h-9 bg-primary hover:bg-primary/90 gap-1.5 text-xs",
                "data-ocid": "save-new-season-btn",
                children: [
                  createSeason.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-3.5 h-3.5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "w-3.5 h-3.5" }),
                  "Save"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                size: "sm",
                variant: "outline",
                onClick: () => setShowAddForm(false),
                className: "h-9 border-white/15 text-white/70 hover:bg-white/10 text-xs",
                children: "Cancel"
              }
            )
          ] })
        ] }),
        isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-5 h-5 animate-spin text-primary" }) }) : seasons.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "py-8 text-center text-white/40 text-sm",
            "data-ocid": "no-seasons",
            children: 'No seasons yet — click "Add Season" to create one.'
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-white/2 border-b border-white/8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2.5 text-[10px] font-semibold text-white/40 uppercase tracking-widest w-14", children: "#" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2.5 text-[10px] font-semibold text-white/40 uppercase tracking-widest", children: "Name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-center px-4 py-2.5 text-[10px] font-semibold text-white/40 uppercase tracking-widest w-24", children: "Episodes" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-4 py-2.5 text-[10px] font-semibold text-white/40 uppercase tracking-widest w-24", children: "Actions" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-white/5", children: seasons.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            SeasonRow,
            {
              season: s,
              episodeCount: episodeCountBySeason(s.id),
              onEdit: openEdit,
              onDelete: setDeleteTarget
            },
            s.id
          )) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Dialog,
          {
            open: !!editingSeason,
            onOpenChange: (open) => !open && setEditingSeason(null),
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "bg-card border-white/15 w-[calc(100vw-2rem)] max-w-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display font-bold text-foreground", children: "Edit Season" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 mt-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-white/70 text-xs font-semibold uppercase tracking-wider", children: "Season #" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        type: "number",
                        min: "1",
                        value: editNumber,
                        onChange: (e) => setEditNumber(Number.parseInt(e.target.value) || 1),
                        className: "bg-white/5 border-white/10 h-10",
                        "data-ocid": "edit-season-number"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-white/70 text-xs font-semibold uppercase tracking-wider", children: "Name" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        value: editName,
                        onChange: (e) => setEditName(e.target.value),
                        className: "bg-white/5 border-white/10 h-10",
                        "data-ocid": "edit-season-name",
                        onKeyDown: (e) => e.key === "Enter" && handleUpdate()
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      type: "button",
                      onClick: handleUpdate,
                      disabled: updateSeason.isPending,
                      className: "flex-1 bg-primary hover:bg-primary/90 h-10 gap-2",
                      "data-ocid": "edit-season-submit",
                      children: updateSeason.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin" }) : "Update Season"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      type: "button",
                      variant: "outline",
                      onClick: () => setEditingSeason(null),
                      className: "border-white/15 text-foreground hover:bg-white/10 h-10 px-5",
                      children: "Cancel"
                    }
                  )
                ] })
              ] })
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          AlertDialog,
          {
            open: !!deleteTarget,
            onOpenChange: (open) => !open && setDeleteTarget(null),
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { className: "bg-card border-white/15 text-foreground w-[calc(100vw-2rem)] max-w-md mx-auto", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogTitle, { className: "flex items-center gap-2 font-display", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-5 h-5 text-destructive" }),
                  "Delete Season"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogDescription, { className: "text-white/50", children: [
                  "Delete",
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-foreground font-semibold", children: [
                    '"',
                    deleteTarget == null ? void 0 : deleteTarget.name,
                    '"'
                  ] }),
                  "? This will unlink all episodes from this season. Continue?"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  AlertDialogCancel,
                  {
                    onClick: () => setDeleteTarget(null),
                    className: "border-white/15 text-foreground hover:bg-white/10",
                    children: "Cancel"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  AlertDialogAction,
                  {
                    onClick: handleDelete,
                    "data-ocid": "season-delete-confirm",
                    className: "bg-destructive hover:bg-destructive/90 text-destructive-foreground",
                    children: deleteSeason.isPending ? "Deleting..." : "Delete Season"
                  }
                )
              ] })
            ] })
          }
        )
      ]
    }
  );
}
function AdminEpisodesPage() {
  const { isAdminLoggedIn } = useAdminAuth();
  const navigate = useNavigate();
  const { actor, isFetching: actorLoading } = useActor(createActor);
  const { data: anime = [] } = useAllAnime();
  const [selectedAnimeId, setSelectedAnimeId] = reactExports.useState("");
  const [formAnimeId, setFormAnimeId] = reactExports.useState("");
  const { data: episodes = [], isLoading } = useEpisodesByAnime(
    selectedAnimeId || void 0
  );
  const { data: seasons = [] } = useSeasonsByAnime(
    selectedAnimeId || void 0
  );
  const {
    data: formSeasons = [],
    isLoading: formSeasonsLoading,
    isFetching: formSeasonsFetching
  } = useSeasonsByAnime(formAnimeId || void 0);
  const formSeasonsAnyLoading = formSeasonsLoading || formSeasonsFetching;
  const createEpisode = useCreateEpisode();
  const updateEpisode = useUpdateEpisode();
  const deleteEpisode = useDeleteEpisode();
  const [showForm, setShowForm] = reactExports.useState(false);
  const [dialogKey, setDialogKey] = reactExports.useState(0);
  const [editingEpisode, setEditingEpisode] = reactExports.useState(null);
  const [form, setForm] = reactExports.useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = reactExports.useState({});
  const [deleteTarget, setDeleteTarget] = reactExports.useState(null);
  const [videoMode, setVideoMode] = reactExports.useState("device");
  const [urlConvertNotice, setUrlConvertNotice] = reactExports.useState("");
  const [submitError, setSubmitError] = reactExports.useState("");
  const [lastSubmitData, setLastSubmitData] = reactExports.useState(
    null
  );
  const submitErrorTimerRef = reactExports.useRef(
    null
  );
  reactExports.useEffect(() => {
    if (submitError) {
      if (submitErrorTimerRef.current)
        clearTimeout(submitErrorTimerRef.current);
      submitErrorTimerRef.current = setTimeout(() => setSubmitError(""), 8e3);
    }
    return () => {
      if (submitErrorTimerRef.current)
        clearTimeout(submitErrorTimerRef.current);
    };
  }, [submitError]);
  reactExports.useEffect(() => {
    if (!formSeasonsLoading && !formSeasonsFetching && formAnimeId) {
      console.log(
        `[Seasons] Loaded for form (anime ${formAnimeId}):`,
        formSeasons.map((s) => ({
          id: s.id,
          seasonNumber: safeSeasonNumber(s.seasonNumber),
          name: s.name
        }))
      );
    }
  }, [formSeasons, formSeasonsLoading, formSeasonsFetching, formAnimeId]);
  if (!isAdminLoggedIn) {
    navigate({ to: "/admin/login" });
    return null;
  }
  const backendReady = !!actor && !actorLoading;
  const hasSeasonsForAnime = !formSeasonsAnyLoading && formSeasons.length > 0;
  const resetForm = () => {
    setFormErrors({});
    setUrlConvertNotice("");
    setSubmitError("");
  };
  const seasonMap = new Map(seasons.map((s) => [s.id, s]));
  const getSeasonName = (seasonId) => {
    if (!seasonId) return void 0;
    const s = seasonMap.get(seasonId);
    return s ? s.name : void 0;
  };
  const openCreate = () => {
    if (!selectedAnimeId) {
      ue.error("Please select an anime first");
      return;
    }
    setEditingEpisode(null);
    resetForm();
    setVideoMode("device");
    setFormAnimeId(selectedAnimeId);
    const defaultSeasonId = seasons.length === 1 ? seasons[0].id : void 0;
    setForm({
      ...EMPTY_FORM,
      animeId: selectedAnimeId,
      episodeNumber: (episodes.length || 0) + 1,
      seasonId: defaultSeasonId
    });
    setDialogKey((k) => k + 1);
    setShowForm(true);
  };
  const openEdit = (ep) => {
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
      seasonId: ep.seasonId ?? void 0
    });
    setDialogKey((k) => k + 1);
    setShowForm(true);
  };
  const closeForm = () => {
    setShowForm(false);
    resetForm();
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    const urlResult = validateAndResolveUrl(form.videoUrl);
    const resolvedForm = urlResult.ok ? { ...form, videoUrl: urlResult.url } : form;
    const errors = validateForm(resolvedForm, hasSeasonsForAnime);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      ue.error("Please fix the errors below before saving");
      return;
    }
    setFormErrors({});
    if (urlResult.notice) {
      ue.info(urlResult.notice);
    }
    if (!backendReady) {
      const msg = "Backend is still connecting — please wait and try again";
      setSubmitError(msg);
      ue.error(msg);
      return;
    }
    setLastSubmitData(resolvedForm);
    try {
      if (editingEpisode) {
        await updateEpisode.mutateAsync({
          id: editingEpisode.id,
          data: resolvedForm
        });
        ue.success(`Episode "${resolvedForm.title}" updated successfully`);
      } else {
        await createEpisode.mutateAsync(resolvedForm);
        ue.success(`Episode "${resolvedForm.title}" added successfully`);
      }
      closeForm();
    } catch (err) {
      const friendlyMsg = extractEpisodeError(err);
      console.error("Episode save error:", friendlyMsg, err);
      setSubmitError(friendlyMsg);
      ue.error(friendlyMsg);
    }
  };
  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteEpisode.mutateAsync(deleteTarget.id);
      ue.success(`Episode "${deleteTarget.title}" deleted`);
      setDeleteTarget(null);
    } catch {
    }
  };
  const isSaving = createEpisode.isPending || updateEpisode.isPending;
  const selectedAnime = anime.find((a) => a.id === selectedAnimeId);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    AdminLayout,
    {
      title: "Episode Management",
      subtitle: selectedAnime ? `${episodes.length} episodes — ${selectedAnime.title}` : "Select an anime to manage episodes",
      action: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          onClick: openCreate,
          disabled: !backendReady,
          className: "bg-primary hover:bg-primary/90 gap-2 h-9 md:h-10 text-xs md:text-sm disabled:opacity-50",
          "data-ocid": "add-episode-btn",
          children: [
            actorLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "Add Episode" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sm:hidden", children: "Add" })
          ]
        }
      ),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 md:space-y-5", children: [
          actorLoading && /* @__PURE__ */ jsxRuntimeExports.jsx(BackendNotReadyBanner, {}),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "shrink-0 text-white/50 text-xs font-semibold uppercase tracking-wider", children: "Anime:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Select,
              {
                value: selectedAnimeId,
                onValueChange: (v) => {
                  setSelectedAnimeId(v);
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    SelectTrigger,
                    {
                      className: "w-full sm:w-72 bg-card border-white/10 h-10",
                      "data-ocid": "anime-select",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select anime..." })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { className: "bg-card border-white/15", children: anime.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: a.id, children: a.title }, a.id)) })
                ]
              }
            )
          ] }),
          selectedAnimeId && /* @__PURE__ */ jsxRuntimeExports.jsx(SeasonManagement, { animeId: selectedAnimeId, episodes }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card border border-white/10 rounded-xl overflow-hidden", children: !selectedAnimeId ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex flex-col items-center justify-center py-16 text-white/40 gap-3",
              "data-ocid": "no-anime-selected",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "w-12 h-12 opacity-30" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-center px-4", children: "Select an anime above to view and manage its episodes" })
              ]
            }
          ) : isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center py-16", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-6 h-6 animate-spin text-primary" }) }) : episodes.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex flex-col items-center justify-center py-16 space-y-3 text-white/40",
              "data-ocid": "no-episodes",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "w-12 h-12 opacity-30" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: "No episodes yet for this anime" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    onClick: openCreate,
                    disabled: !backendReady,
                    size: "sm",
                    className: "bg-primary hover:bg-primary/90 gap-2 disabled:opacity-50",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
                      "Add First Episode"
                    ]
                  }
                )
              ]
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "table",
              {
                className: "w-full text-sm hidden md:table",
                "data-ocid": "episodes-table",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-white/3 border-b border-white/10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-5 py-3 text-[10px] font-semibold text-white/40 uppercase tracking-widest w-14", children: "#" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 text-[10px] font-semibold text-white/40 uppercase tracking-widest", children: "Episode" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 text-[10px] font-semibold text-white/40 uppercase tracking-widest hidden lg:table-cell", children: "Season" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 text-[10px] font-semibold text-white/40 uppercase tracking-widest hidden lg:table-cell", children: "Video URL" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-center px-4 py-3 text-[10px] font-semibold text-white/40 uppercase tracking-widest", children: "Duration" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-5 py-3 text-[10px] font-semibold text-white/40 uppercase tracking-widest", children: "Actions" })
                  ] }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-white/5", children: episodes.map((ep) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "tr",
                    {
                      className: "hover:bg-white/3 transition-colors",
                      "data-ocid": `episode-row-${ep.id}`,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-white/8 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-black text-white/50", children: Number(ep.episodeNumber) }) }) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                          ep.thumbnailUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "img",
                            {
                              src: ep.thumbnailUrl,
                              alt: ep.title,
                              className: "w-16 h-9 object-cover rounded shrink-0 hidden sm:block"
                            }
                          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-9 bg-white/5 rounded flex items-center justify-center shrink-0 hidden sm:flex", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "w-3 h-3 text-white/30" }) }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground truncate max-w-[180px] text-sm", children: ep.title }),
                            ep.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-white/40 truncate max-w-[180px]", children: ep.description })
                          ] })
                        ] }) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 hidden lg:table-cell", children: ep.seasonId ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center text-xs text-primary bg-primary/10 px-2 py-0.5 rounded font-semibold", children: getSeasonName(ep.seasonId) ?? "Season" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-white/30", children: "—" }) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 hidden lg:table-cell", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          "a",
                          {
                            href: ep.videoUrl,
                            target: "_blank",
                            rel: "noopener noreferrer",
                            className: "text-primary hover:underline text-xs font-mono truncate max-w-[200px] block inline-flex items-center gap-1",
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "w-2.5 h-2.5 shrink-0" }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: ep.videoUrl })
                            ]
                          }
                        ) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 text-xs text-white/40", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3 h-3" }),
                          ep.duration ?? "—"
                        ] }) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-1", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "button",
                            {
                              type: "button",
                              onClick: () => openEdit(ep),
                              "data-ocid": `edit-ep-${ep.id}`,
                              "aria-label": "Edit",
                              className: "p-2 rounded-lg text-white/40 hover:text-foreground hover:bg-white/10 transition-colors min-h-[36px]",
                              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { className: "w-3.5 h-3.5" })
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "button",
                            {
                              type: "button",
                              onClick: () => setDeleteTarget(ep),
                              "data-ocid": `delete-ep-${ep.id}`,
                              "aria-label": "Delete",
                              className: "p-2 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors min-h-[36px]",
                              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5" })
                            }
                          )
                        ] }) })
                      ]
                    },
                    ep.id
                  )) })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "md:hidden divide-y divide-white/5", children: episodes.map((ep) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              EpisodeCardMobile,
              {
                ep,
                seasonName: getSeasonName(ep.seasonId),
                onEdit: () => openEdit(ep),
                onDelete: () => setDeleteTarget(ep)
              },
              ep.id
            )) })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Dialog,
          {
            open: showForm,
            onOpenChange: (open) => {
              if (!open) closeForm();
              else setShowForm(true);
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              DialogContent,
              {
                className: "bg-card border-white/15 w-[calc(100vw-2rem)] max-w-lg max-h-[90vh] overflow-y-auto",
                "data-ocid": "episode-form-dialog",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display font-bold text-foreground text-lg", children: editingEpisode ? "Edit Episode" : "Add New Episode" }) }),
                  !backendReady && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-3 py-2.5 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-xs", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-3.5 h-3.5 animate-spin shrink-0" }),
                    "Connecting to backend — saving will work once connected"
                  ] }),
                  submitError && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      className: "flex items-start gap-2 px-3 py-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs",
                      "data-ocid": "submit-error-banner",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-3.5 h-3.5 shrink-0 mt-0.5" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1", children: submitError }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 shrink-0", children: [
                          lastSubmitData && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            "button",
                            {
                              type: "button",
                              onClick: async () => {
                                setSubmitError("");
                                try {
                                  if (editingEpisode) {
                                    await updateEpisode.mutateAsync({
                                      id: editingEpisode.id,
                                      data: lastSubmitData
                                    });
                                    ue.success("Episode updated successfully");
                                  } else {
                                    await createEpisode.mutateAsync(lastSubmitData);
                                    ue.success("Episode added successfully");
                                  }
                                  closeForm();
                                } catch (err) {
                                  const msg = extractEpisodeError(err);
                                  setSubmitError(msg);
                                  ue.error(msg);
                                }
                              },
                              className: "inline-flex items-center gap-1 text-[11px] font-semibold text-red-300 hover:text-red-100 transition-colors",
                              "data-ocid": "submit-error-retry-btn",
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-3 h-3" }),
                                " Try Again"
                              ]
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "button",
                            {
                              type: "button",
                              onClick: () => setSubmitError(""),
                              className: "text-red-400/60 hover:text-red-300 transition-colors",
                              "aria-label": "Dismiss error",
                              children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3.5 h-3.5" })
                            }
                          )
                        ] })
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4 mt-2", noValidate: true, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-white/70 text-xs font-semibold uppercase tracking-wider", children: [
                        "Anime ",
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "*" })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        Select,
                        {
                          value: form.animeId,
                          onValueChange: (v) => {
                            setForm((f) => ({ ...f, animeId: v, seasonId: void 0 }));
                            setFormAnimeId(v);
                            setFormErrors((er) => ({
                              ...er,
                              animeId: void 0,
                              seasonId: void 0
                            }));
                          },
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              SelectTrigger,
                              {
                                className: `bg-white/5 border-white/10 h-11 ${formErrors.animeId ? "border-red-500/70" : ""}`,
                                "data-ocid": "ep-anime-select",
                                children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select anime..." })
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { className: "bg-card border-white/15", children: anime.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: a.id, children: a.title }, a.id)) })
                          ]
                        }
                      ),
                      formErrors.animeId && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] text-red-400 flex items-center gap-1", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-3 h-3" }),
                        " ",
                        formErrors.animeId
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-white/70 text-xs font-semibold uppercase tracking-wider", children: [
                        "Season",
                        " ",
                        hasSeasonsForAnime && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "*" })
                      ] }),
                      !form.animeId ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-11 flex items-center px-3 rounded-lg border border-white/8 text-white/30 text-sm bg-white/3", children: "Select an anime first" }) : formSeasonsAnyLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-11 flex items-center gap-2 px-3 rounded-lg border border-white/10 text-white/40 text-sm bg-white/3", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-3.5 h-3.5 animate-spin text-primary shrink-0" }),
                        "Loading seasons..."
                      ] }) : formSeasons.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "div",
                        {
                          className: "h-11 flex items-center px-3 rounded-lg border border-yellow-500/30 text-yellow-400/80 text-sm bg-yellow-500/5",
                          "data-ocid": "no-seasons-warning",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "w-3.5 h-3.5 mr-2 shrink-0" }),
                            "Create a season first in Season Management above"
                          ]
                        }
                      ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        Select,
                        {
                          value: form.seasonId ?? "",
                          onValueChange: (v) => {
                            console.log("[Seasons] Selected season id:", v);
                            setForm((f) => ({
                              ...f,
                              seasonId: v || void 0
                            }));
                            setFormErrors((er) => ({ ...er, seasonId: void 0 }));
                          },
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              SelectTrigger,
                              {
                                className: `bg-white/5 border-white/10 h-11 ${formErrors.seasonId ? "border-red-500/70" : ""}`,
                                "data-ocid": "ep-season-select",
                                children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select season..." })
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { className: "bg-card border-white/15", children: formSeasons.filter((s) => safeSeasonNumber(s.seasonNumber) >= 1).map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: s.id, children: [
                              "Season ",
                              safeSeasonNumber(s.seasonNumber),
                              s.name && s.name !== `Season ${safeSeasonNumber(s.seasonNumber)}` ? ` — ${s.name}` : ""
                            ] }, s.id)) })
                          ]
                        }
                      ),
                      formErrors.seasonId && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] text-red-400 flex items-center gap-1", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-3 h-3" }),
                        " ",
                        formErrors.seasonId
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Label,
                          {
                            htmlFor: "epNumber",
                            className: "text-white/70 text-xs font-semibold uppercase tracking-wider",
                            children: "Episode #"
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Input,
                          {
                            id: "epNumber",
                            type: "number",
                            min: "1",
                            value: form.episodeNumber,
                            onChange: (e) => setForm((f) => ({
                              ...f,
                              episodeNumber: Number.parseInt(e.target.value) || 1
                            })),
                            className: `bg-white/5 border-white/10 h-11 ${formErrors.episodeNumber ? "border-red-500/70" : ""}`,
                            "data-ocid": "ep-number-input"
                          }
                        ),
                        formErrors.episodeNumber && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-red-400", children: formErrors.episodeNumber })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Label,
                          {
                            htmlFor: "duration",
                            className: "text-white/70 text-xs font-semibold uppercase tracking-wider",
                            children: "Duration"
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Input,
                          {
                            id: "duration",
                            type: "text",
                            value: form.duration,
                            onChange: (e) => setForm((f) => ({ ...f, duration: e.target.value })),
                            placeholder: "24:00",
                            className: "bg-white/5 border-white/10 h-11"
                          }
                        )
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        Label,
                        {
                          htmlFor: "epTitle",
                          className: "text-white/70 text-xs font-semibold uppercase tracking-wider",
                          children: [
                            "Title ",
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "*" })
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Input,
                        {
                          id: "epTitle",
                          value: form.title,
                          onChange: (e) => {
                            setForm((f) => ({ ...f, title: e.target.value }));
                            setFormErrors((er) => ({ ...er, title: void 0 }));
                          },
                          placeholder: "Ryomen Sukuna",
                          className: `bg-white/5 border-white/10 h-11 ${formErrors.title ? "border-red-500/70" : ""}`,
                          "data-ocid": "ep-title-input"
                        }
                      ),
                      formErrors.title && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] text-red-400 flex items-center gap-1", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-3 h-3" }),
                        " ",
                        formErrors.title
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2 flex-wrap", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-white/70 text-xs font-semibold uppercase tracking-wider", children: [
                          "Video Source ",
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "*" })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          VideoSourceTabs,
                          {
                            mode: videoMode,
                            onModeChange: (m) => {
                              setVideoMode(m);
                              setForm((f) => ({ ...f, videoUrl: "" }));
                              setFormErrors((er) => ({ ...er, videoUrl: void 0 }));
                              setUrlConvertNotice("");
                            }
                          }
                        )
                      ] }),
                      videoMode === "device" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          DeviceVideoUpload,
                          {
                            onVideoReady: (url) => {
                              setForm((f) => ({ ...f, videoUrl: url }));
                              setFormErrors((er) => ({ ...er, videoUrl: void 0 }));
                            },
                            onError: () => setFormErrors((er) => ({
                              ...er,
                              videoUrl: "Video upload failed"
                            }))
                          }
                        ),
                        form.videoUrl && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-3 py-2 rounded-lg bg-white/3 border border-white/8", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-3.5 h-3.5 text-green-400 shrink-0" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] text-white/50 truncate flex-1 font-mono", children: form.videoUrl }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "button",
                            {
                              type: "button",
                              onClick: () => {
                                setForm((f) => ({ ...f, videoUrl: "" }));
                                setFormErrors((er) => ({
                                  ...er,
                                  videoUrl: void 0
                                }));
                              },
                              className: "text-white/30 hover:text-red-400 transition-colors shrink-0",
                              "aria-label": "Clear video",
                              children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-3.5 h-3.5" })
                            }
                          )
                        ] }),
                        formErrors.videoUrl && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] text-red-400 flex items-center gap-1", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-3 h-3" }),
                          " ",
                          formErrors.videoUrl
                        ] })
                      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Input,
                          {
                            id: "videoUrl",
                            value: form.videoUrl,
                            onChange: (e) => {
                              setForm((f) => ({ ...f, videoUrl: e.target.value }));
                              setFormErrors((er) => ({ ...er, videoUrl: void 0 }));
                              setUrlConvertNotice("");
                            },
                            onBlur: () => {
                              if (!form.videoUrl.trim()) return;
                              const kind = classifyVideoUrl(form.videoUrl);
                              if (kind === "googledrive") {
                                const fileId = getGoogleDriveFileId(form.videoUrl);
                                if (fileId) {
                                  const canonicalUrl = `https://drive.google.com/file/d/${fileId}/view`;
                                  setForm((f) => ({ ...f, videoUrl: canonicalUrl }));
                                  setUrlConvertNotice(
                                    "Google Drive link detected and converted."
                                  );
                                }
                              }
                            },
                            placeholder: "https://drive.google.com/file/d/… or .mp4 URL",
                            className: `bg-white/5 border-white/10 h-11 ${formErrors.videoUrl ? "border-red-500/70" : ""}`,
                            "data-ocid": "ep-video-url-input"
                          }
                        ),
                        classifyVideoUrl(form.videoUrl) === "googledrive" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 px-3 py-2.5 rounded-lg bg-yellow-500/10 border border-yellow-500/30", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "w-3.5 h-3.5 text-yellow-400 shrink-0 mt-0.5" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[11px] text-yellow-300 leading-snug", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Tip:" }),
                            " For Google Drive videos to play, share the file with",
                            " ",
                            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: '"Anyone with the link"' }),
                            " in Google Drive settings."
                          ] })
                        ] }),
                        formErrors.videoUrl ? /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] text-red-400 flex items-center gap-1", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-3 h-3" }),
                          " ",
                          formErrors.videoUrl
                        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 mt-1.5", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(UrlFormatHint, {}),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              VideoUrlTester,
                              {
                                url: form.videoUrl,
                                onResolved: (resolved) => {
                                  setForm((f) => ({ ...f, videoUrl: resolved }));
                                  const kind = classifyVideoUrl(form.videoUrl);
                                  setUrlConvertNotice(
                                    kind === "googledrive" ? "Google Drive link detected and converted." : "URL validated successfully"
                                  );
                                }
                              }
                            )
                          ] }),
                          urlConvertNotice && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 px-2 py-1.5 rounded bg-green-500/10 border border-green-500/20", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-3 h-3 text-green-400 shrink-0" }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] text-green-400", children: urlConvertNotice })
                          ] })
                        ] })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Label,
                        {
                          htmlFor: "epThumbnail",
                          className: "text-white/70 text-xs font-semibold uppercase tracking-wider",
                          children: "Thumbnail URL"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Input,
                        {
                          id: "epThumbnail",
                          value: form.thumbnailUrl,
                          onChange: (e) => setForm((f) => ({ ...f, thumbnailUrl: e.target.value })),
                          placeholder: "https://example.com/thumb.jpg",
                          className: "bg-white/5 border-white/10 h-11"
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        Label,
                        {
                          htmlFor: "epDesc",
                          className: "text-white/70 text-xs font-semibold uppercase tracking-wider",
                          children: [
                            "Description ",
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "*" })
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Textarea,
                        {
                          id: "epDesc",
                          value: form.description,
                          onChange: (e) => {
                            setForm((f) => ({ ...f, description: e.target.value }));
                            setFormErrors((er) => ({
                              ...er,
                              description: void 0
                            }));
                          },
                          rows: 2,
                          placeholder: "Brief description of this episode...",
                          className: `bg-white/5 border-white/10 resize-none ${formErrors.description ? "border-red-500/70" : ""}`
                        }
                      ),
                      formErrors.description && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] text-red-400 flex items-center gap-1", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-3 h-3" }),
                        " ",
                        formErrors.description
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 pt-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Button,
                        {
                          type: "submit",
                          disabled: isSaving || !backendReady || formSeasonsAnyLoading || hasSeasonsForAnime && formSeasons.length === 0,
                          className: "flex-1 bg-primary hover:bg-primary/90 h-11 gap-2 disabled:opacity-60",
                          "data-ocid": "ep-form-submit",
                          children: isSaving ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin" }),
                            "Saving..."
                          ] }) : !backendReady ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin" }),
                            "Connecting…"
                          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: editingEpisode ? "Update Episode" : "Add Episode" })
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Button,
                        {
                          type: "button",
                          variant: "outline",
                          onClick: closeForm,
                          className: "border-white/15 text-foreground hover:bg-white/10 h-11 px-6",
                          children: "Cancel"
                        }
                      )
                    ] })
                  ] })
                ]
              },
              dialogKey
            )
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          AlertDialog,
          {
            open: !!deleteTarget,
            onOpenChange: (open) => !open && setDeleteTarget(null),
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { className: "bg-card border-white/15 text-foreground w-[calc(100vw-2rem)] max-w-md mx-auto", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogTitle, { className: "flex items-center gap-2 font-display", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-5 h-5 text-destructive" }),
                  "Delete Episode"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogDescription, { className: "text-white/50", children: [
                  "Delete",
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-foreground font-semibold", children: [
                    '"Ep ',
                    deleteTarget ? Number(deleteTarget.episodeNumber) : "",
                    ":",
                    " ",
                    deleteTarget == null ? void 0 : deleteTarget.title,
                    '"'
                  ] }),
                  "? This cannot be undone."
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  AlertDialogCancel,
                  {
                    onClick: () => setDeleteTarget(null),
                    className: "border-white/15 text-foreground hover:bg-white/10",
                    children: "Cancel"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  AlertDialogAction,
                  {
                    onClick: handleDelete,
                    "data-ocid": "episode-delete-confirm",
                    className: "bg-destructive hover:bg-destructive/90 text-destructive-foreground",
                    children: deleteEpisode.isPending ? "Deleting..." : "Delete"
                  }
                )
              ] })
            ] })
          }
        )
      ]
    }
  );
}
export {
  AdminEpisodesPage as default
};
