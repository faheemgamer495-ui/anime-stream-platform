import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowLeft,
  ChevronDown,
  List,
  Loader2,
  Maximize,
  Minimize,
  Pause,
  Play,
  Settings,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { EpisodeComments } from "../components/EpisodeComments";
import { useAdsByPlacement } from "../hooks/useAds";
import { useAnimeDetail } from "../hooks/useAnime";
import { useSeasonsByAnime } from "../hooks/useSeasons";
import { getEpisodesList } from "../lib/localStorageDB";
import type { Episode, SeasonPublic } from "../lib/localStorageDB";

// ── Episode hooks (shared store) ──────────────────────────────────────────────

function useEpisodesByAnime(animeId: string | undefined) {
  return useQuery<Episode[]>({
    queryKey: ["episodes_by_anime", animeId],
    queryFn: () => {
      if (!animeId) return [];
      return getEpisodesList()
        .filter((e) => e.animeId === animeId)
        .sort((a, b) => Number(a.episodeNumber) - Number(b.episodeNumber));
    },
    enabled: !!animeId,
    staleTime: 0,
  });
}

function useEpisode(
  animeId: string | undefined,
  episodeId: string | undefined,
) {
  return useQuery<Episode | null>({
    queryKey: ["episode", animeId, episodeId],
    queryFn: () => {
      if (!episodeId) return null;
      return getEpisodesList().find((e) => e.id === episodeId) ?? null;
    },
    enabled: !!animeId && !!episodeId,
    staleTime: 0,
  });
}

// ── Constants ─────────────────────────────────────────────────────────────────

const QUALITY_OPTIONS = ["Auto", "1080p", "720p", "480p"] as const;
type Quality = (typeof QUALITY_OPTIONS)[number];
const STORAGE_KEY = "anime-stream-quality";

function formatTime(secs: number): string {
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

// ── URL type detection helpers ─────────────────────────────────────────────

function getYouTubeId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtube.com")) return u.searchParams.get("v");
    if (u.hostname === "youtu.be")
      return u.pathname.slice(1).split("?")[0] || null;
  } catch {
    // not a valid URL
  }
  return null;
}

function getGoogleDriveFileId(url: string): string | null {
  try {
    const u = new URL(url);
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

function isGoogleDriveUrl(url: string): boolean {
  try {
    return new URL(url).hostname.includes("drive.google.com");
  } catch {
    return false;
  }
}

function getGoogleDriveEmbedUrl(url: string): string | null {
  const fileId = getGoogleDriveFileId(url);
  if (!fileId) return null;
  return `https://drive.google.com/file/d/${fileId}/preview`;
}

type VideoType = "youtube" | "googledrive" | "html5";

function detectVideoType(url: string): VideoType {
  if (!url) return "html5";
  if (getYouTubeId(url)) return "youtube";
  if (isGoogleDriveUrl(url)) return "googledrive";
  return "html5";
}

function getVideoErrorMessage(code: number | undefined): string {
  switch (code) {
    case 4:
      return "Video could not be loaded. Format not supported or URL is invalid.";
    case 2:
      return "Network error — check your internet connection and try again.";
    case 3:
      return "Video file appears corrupt or damaged. Contact the admin.";
    default:
      return "Video could not be loaded. Try a different episode or check back later.";
  }
}

// ── Pre-roll ad overlay ────────────────────────────────────────────────────

interface PreRollAdProps {
  videoUrl: string;
  onComplete: () => void;
}

function PreRollAd({ videoUrl, onComplete }: PreRollAdProps) {
  const adRef = useRef<HTMLVideoElement>(null);
  const [countdown, setCountdown] = useState(5);
  const [canSkip, setCanSkip] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(timer);
          setCanSkip(true);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    adRef.current?.play().catch(() => {});
  }, []);

  return (
    <div
      className="absolute inset-0 bg-black z-20 flex items-center justify-center"
      data-ocid="preroll-ad"
    >
      <video
        ref={adRef}
        src={videoUrl}
        className="w-full h-full object-contain"
        muted={false}
        autoPlay
        onEnded={onComplete}
      >
        <track kind="captions" />
      </video>
      <div className="absolute bottom-6 right-6">
        {canSkip ? (
          <Button
            size="sm"
            onClick={onComplete}
            className="bg-white/10 hover:bg-white/20 text-white border border-white/30 gap-2 backdrop-blur-sm"
            data-ocid="skip-ad-btn"
          >
            Skip Ad <SkipForward className="w-4 h-4" />
          </Button>
        ) : (
          <div className="bg-black/60 text-muted-foreground text-xs px-3 py-2 rounded-lg border border-border backdrop-blur-sm">
            Skip in {countdown}s
          </div>
        )}
      </div>
    </div>
  );
}

function VideoLoadingOverlay() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-10 pointer-events-none">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <span className="text-white/70 text-xs font-mono tracking-wide">
          Loading…
        </span>
      </div>
    </div>
  );
}

interface VideoErrorOverlayProps {
  message: string;
  isRetrying: boolean;
  canRetry: boolean;
  onRetry: () => void;
}

function VideoErrorOverlay({
  message,
  isRetrying,
  canRetry,
  onRetry,
}: VideoErrorOverlayProps) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/80 z-10">
      <AlertCircle className="w-12 h-12 text-destructive" />
      <div className="text-center space-y-1 px-6">
        <p className="text-foreground font-semibold text-base">
          {isRetrying ? "Retrying…" : "Video could not be loaded"}
        </p>
        <p className="text-muted-foreground text-sm max-w-xs">{message}</p>
      </div>
      {canRetry && !isRetrying && (
        <Button
          size="sm"
          onClick={onRetry}
          className="bg-primary hover:bg-primary/90 text-white gap-2"
          data-ocid="video-retry-btn"
        >
          <Play className="w-4 h-4" /> Retry
        </Button>
      )}
      {isRetrying && <Loader2 className="w-5 h-5 text-primary animate-spin" />}
    </div>
  );
}

// ── YouTube/Drive iframe player ───────────────────────────────────────────

interface IframePlayerProps {
  src: string;
  title: string;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  showDriveNotice?: boolean;
}

function IframePlayer({
  src,
  title,
  isFullscreen,
  onToggleFullscreen,
  showDriveNotice = false,
}: IframePlayerProps) {
  const [iframeLoading, setIframeLoading] = useState(true);
  const [iframeError, setIframeError] = useState(false);

  return (
    <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
      {iframeLoading && !iframeError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-10 pointer-events-none">
          <Loader2 className="w-10 h-10 text-primary animate-spin mb-3" />
          <span className="text-white/60 text-sm">Loading video…</span>
        </div>
      )}
      {iframeError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-10 gap-4 px-6">
          <AlertCircle className="w-12 h-12 text-destructive" />
          <p className="text-foreground font-semibold text-center">
            Video could not be loaded
          </p>
          <p className="text-muted-foreground text-sm text-center max-w-xs">
            {showDriveNotice
              ? "If using Google Drive, make sure the file is shared with 'Anyone with the link' in Google Drive settings."
              : "The video source is unavailable or blocked."}
          </p>
        </div>
      )}
      <iframe
        src={src}
        className="absolute inset-0 w-full h-full"
        allow="autoplay; fullscreen; accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        sandbox="allow-scripts allow-same-origin allow-forms allow-presentation allow-popups"
        title={title}
        onLoad={() => setIframeLoading(false)}
        onError={() => {
          setIframeLoading(false);
          setIframeError(true);
        }}
      />
      <button
        type="button"
        onClick={onToggleFullscreen}
        aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        data-ocid="iframe-fullscreen-btn"
        className="absolute bottom-3 right-3 z-20 bg-black/70 hover:bg-black/90 text-white rounded p-1.5 transition-opacity duration-200 opacity-60 hover:opacity-100 focus:opacity-100"
        style={{ lineHeight: 0 }}
      >
        {isFullscreen ? (
          <Minimize className="w-5 h-5" />
        ) : (
          <Maximize className="w-5 h-5" />
        )}
      </button>
    </div>
  );
}

// ── Season Selector ──────────────────────────────────────────────────────

interface SeasonSelectorProps {
  seasons: SeasonPublic[];
  activeSeason: string | null;
  onSeasonChange: (seasonId: string) => void;
}

function SeasonSelector({
  seasons,
  activeSeason,
  onSeasonChange,
}: SeasonSelectorProps) {
  if (seasons.length === 0) return null;

  return (
    <div className="flex-shrink-0" data-ocid="season-selector">
      {/* Mobile: dropdown */}
      <div className="block md:hidden">
        <select
          value={activeSeason ?? ""}
          onChange={(e) => onSeasonChange(e.target.value)}
          className="w-full bg-background border border-white/15 text-foreground text-sm rounded-lg h-10 px-3 focus:outline-none focus:border-primary"
          aria-label="Select season"
        >
          {seasons.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>
      {/* Desktop: tabs */}
      <div className="hidden md:flex items-center gap-1 flex-wrap">
        {seasons.map((s) => {
          const isActive = s.id === activeSeason;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => onSeasonChange(s.id)}
              data-ocid={`season-tab-${s.id}`}
              className={[
                "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
                isActive
                  ? "bg-primary text-white shadow-sm"
                  : "bg-white/8 text-white/60 hover:bg-white/15 hover:text-white",
              ].join(" ")}
            >
              {s.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Episode Sidebar ──────────────────────────────────────────────────────

interface EpisodeSidebarProps {
  episodes: Episode[];
  currentEpisodeId: string;
  seasons: SeasonPublic[];
  activeSeason: string | null;
  onSeasonChange: (seasonId: string) => void;
  onEpisodeClick: (ep: Episode) => void;
  isOpen: boolean;
  onClose: () => void;
}

function EpisodeSidebar({
  episodes,
  currentEpisodeId,
  seasons,
  activeSeason,
  onSeasonChange,
  onEpisodeClick,
  isOpen,
  onClose,
}: EpisodeSidebarProps) {
  const currentRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen && currentRef.current) {
      currentRef.current.scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });
    }
  }, [isOpen]);

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          role="button"
          tabIndex={-1}
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          onClick={onClose}
          onKeyDown={(e) => e.key === "Escape" && onClose()}
          aria-label="Close episode list"
        />
      )}

      {/* Sidebar panel */}
      <div
        data-ocid="episode-sidebar"
        className={[
          "flex flex-col bg-card border-l border-border/60",
          // Desktop: always-visible right column, 280px wide
          "lg:relative lg:translate-x-0 lg:w-72 lg:flex lg:z-auto",
          // Mobile/tablet: slide-in drawer from right
          "fixed right-0 top-0 h-full w-72 z-40 transition-transform duration-300",
          isOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0",
        ].join(" ")}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between px-3 py-2.5 border-b border-border/60 shrink-0">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Episodes
          </span>
          {/* Close button — mobile only */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close episode list"
            data-ocid="episode-sidebar-close"
            className="lg:hidden p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Season selector inside sidebar */}
        {seasons.length > 1 && (
          <div className="px-3 py-2 border-b border-border/40 shrink-0">
            <select
              value={activeSeason ?? ""}
              onChange={(e) => onSeasonChange(e.target.value)}
              className="w-full bg-background border border-border/60 text-foreground text-xs rounded-md h-8 px-2 focus:outline-none focus:border-primary"
              aria-label="Select season"
              data-ocid="sidebar-season-select"
            >
              {seasons.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Episode list */}
        <ScrollArea className="flex-1">
          <div className="py-1">
            {episodes.length === 0 ? (
              <div
                className="px-4 py-8 text-center text-muted-foreground text-xs"
                data-ocid="episode-sidebar-empty"
              >
                No episodes in this season
              </div>
            ) : (
              episodes.map((ep, idx) => {
                const isCurrent = ep.id === currentEpisodeId;
                return (
                  <button
                    key={ep.id}
                    ref={isCurrent ? currentRef : undefined}
                    type="button"
                    onClick={() => onEpisodeClick(ep)}
                    data-ocid={`episode-sidebar-item.${idx + 1}`}
                    className={[
                      "w-full flex items-start gap-2.5 px-3 py-2.5 text-left transition-colors border-l-2",
                      isCurrent
                        ? "bg-primary/10 border-primary text-foreground"
                        : "border-transparent hover:bg-muted/40 hover:border-primary/40 text-muted-foreground hover:text-foreground",
                    ].join(" ")}
                    aria-current={isCurrent ? "true" : undefined}
                  >
                    {/* Thumbnail */}
                    {ep.thumbnailUrl ? (
                      <img
                        src={ep.thumbnailUrl}
                        alt=""
                        aria-hidden
                        className="w-14 h-9 object-cover rounded shrink-0 bg-muted"
                      />
                    ) : (
                      <div className="w-14 h-9 rounded shrink-0 bg-muted flex items-center justify-center">
                        {isCurrent ? (
                          <Play className="w-3.5 h-3.5 text-primary fill-primary" />
                        ) : (
                          <Play className="w-3.5 h-3.5 text-muted-foreground/50" />
                        )}
                      </div>
                    )}
                    {/* Meta */}
                    <div className="min-w-0 flex-1">
                      <p
                        className={[
                          "text-[11px] font-mono leading-none mb-0.5",
                          isCurrent
                            ? "text-primary"
                            : "text-muted-foreground/60",
                        ].join(" ")}
                      >
                        Ep {Number(ep.episodeNumber)}
                      </p>
                      <p className="text-xs font-medium leading-tight line-clamp-2 break-words">
                        {ep.title}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </ScrollArea>
      </div>
    </>
  );
}

// ── Main WatchPage ─────────────────────────────────────────────────────────

const MAX_AUTO_RETRIES = 1;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyParams = any;

export default function WatchPage() {
  const rawParams = useParams({ strict: false }) as AnyParams;
  const animeId: string = rawParams.animeId ?? "";
  const episodeId: string = rawParams.episodeId ?? "";
  const seasonNumberParam: string | undefined = rawParams.seasonNumber;
  const seasonNumber = seasonNumberParam
    ? Number(seasonNumberParam) || null
    : null;
  const isLegacy = !seasonNumberParam;
  const navigate = useNavigate();

  const { data: anime } = useAnimeDetail(animeId);
  const { data: episode, isLoading: episodeLoading } = useEpisode(
    animeId,
    episodeId,
  );
  const { data: allEpisodes = [] } = useEpisodesByAnime(animeId);
  const { data: seasons = [] } = useSeasonsByAnime(animeId);
  const { data: preRollAds = [] } = useAdsByPlacement("video_pre_roll");

  const [activeSeason, setActiveSeason] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (activeSeason !== null) return;
    if (seasons.length === 0) return;

    if (seasonNumber) {
      const matched = seasons.find(
        (s) => Number(s.seasonNumber) === seasonNumber,
      );
      if (matched) {
        setActiveSeason(matched.id);
        return;
      }
    }

    if (episode?.seasonId) {
      setActiveSeason(episode.seasonId);
    } else {
      setActiveSeason(seasons[0].id);
    }
  }, [seasons, episode, seasonNumber, activeSeason]);

  const handleSeasonChange = (newSeasonId: string) => {
    if (newSeasonId === activeSeason) return;
    setActiveSeason(newSeasonId);
    const newSeasonEps = allEpisodes
      .filter((ep) => ep.seasonId === newSeasonId)
      .sort((a, b) =>
        a.episodeNumber < b.episodeNumber
          ? -1
          : a.episodeNumber > b.episodeNumber
            ? 1
            : 0,
      );
    if (newSeasonEps.length > 0) {
      const firstEp = newSeasonEps[0];
      const targetSeason = seasons.find((s) => s.id === newSeasonId);
      if (targetSeason) {
        navigate({
          to: "/watch/$animeId/$seasonNumber/$episodeId",
          params: {
            animeId,
            seasonNumber: String(targetSeason.seasonNumber),
            episodeId: firstEp.id,
          },
        });
      }
    }
  };

  // Redirect legacy routes to canonical URL
  useEffect(() => {
    if (!isLegacy || !episode || seasons.length === 0) return;
    const targetSeason = episode.seasonId
      ? seasons.find((s) => s.id === episode.seasonId)
      : seasons[0];
    if (!targetSeason) return;
    navigate({
      to: "/watch/$animeId/$seasonNumber/$episodeId",
      params: {
        animeId,
        seasonNumber: String(targetSeason.seasonNumber),
        episodeId,
      },
      replace: true,
    });
  }, [isLegacy, episode, seasons, animeId, episodeId, navigate]);

  const seasonEpisodes =
    activeSeason !== null
      ? allEpisodes.filter((ep) => ep.seasonId === activeSeason)
      : allEpisodes;

  const currentIdx = seasonEpisodes.findIndex((e) => e.id === episodeId);
  const prevEpisode = currentIdx > 0 ? seasonEpisodes[currentIdx - 1] : null;
  const nextEpisode =
    currentIdx < seasonEpisodes.length - 1
      ? seasonEpisodes[currentIdx + 1]
      : null;

  const watchLink = (epId: string, epSeasonId?: string) => {
    if (seasons.length === 0) {
      return {
        to: "/watch/$animeId/$episodeId" as const,
        params: { animeId, episodeId: epId },
      };
    }
    const season = epSeasonId
      ? seasons.find((s) => s.id === epSeasonId)
      : activeSeason
        ? seasons.find((s) => s.id === activeSeason)
        : seasons[0];
    const sNum = season ? String(season.seasonNumber) : "1";
    return {
      to: "/watch/$animeId/$seasonNumber/$episodeId" as const,
      params: { animeId, seasonNumber: sNum, episodeId: epId },
    };
  };

  const handleEpisodeNavClick = (ep: Episode) => {
    const link = watchLink(ep.id, ep.seasonId ?? undefined);
    navigate(link);
    setSidebarOpen(false);
  };

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [quality, setQuality] = useState<Quality>(
    () => (localStorage.getItem(STORAGE_KEY) as Quality) ?? "Auto",
  );
  const [showControls, setShowControls] = useState(true);
  const [showAd, setShowAd] = useState(false);
  const [adDismissed, setAdDismissed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [videoBuffering, setVideoBuffering] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [videoErrorMessage, setVideoErrorMessage] = useState("");
  const retryCountRef = useRef(0);
  const [isRetrying, setIsRetrying] = useState(false);

  const episodeIdRef = useRef(episodeId);
  useEffect(() => {
    if (episodeIdRef.current === episodeId) return;
    episodeIdRef.current = episodeId;
    setAdDismissed(false);
    setShowAd(false);
    setPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setVideoError(false);
    setVideoErrorMessage("");
    setVideoBuffering(false);
    setIsLoading(false);
    retryCountRef.current = 0;
    setIsRetrying(false);
  });

  useEffect(() => {
    if (!adDismissed && preRollAds.length > 0 && episode?.videoUrl) {
      setShowAd(true);
    }
  }, [preRollAds, episode, adDismissed]);

  const autoRetryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resolvedVideoUrlRef = useRef<string>("");

  const rawVideoUrl = episode?.videoUrl ?? "";
  const videoType = rawVideoUrl ? detectVideoType(rawVideoUrl) : "html5";
  const youTubeId = videoType === "youtube" ? getYouTubeId(rawVideoUrl) : null;
  const googleDriveEmbedUrl =
    videoType === "googledrive" ? getGoogleDriveEmbedUrl(rawVideoUrl) : null;
  const resolvedVideoUrl =
    videoType === "html5" && rawVideoUrl ? rawVideoUrl : rawVideoUrl;
  resolvedVideoUrlRef.current = resolvedVideoUrl;

  const handleVideoError = useCallback(() => {
    const errCode = videoRef.current?.error?.code;
    const errMsg = videoRef.current?.error?.message ?? "";
    console.error("Video playback error:", {
      url: videoRef.current?.src,
      errorCode: errCode,
      errorMessage: errMsg,
    });
    setVideoBuffering(false);
    setPlaying(false);
    retryCountRef.current += 1;
    const nextCount = retryCountRef.current;
    if (nextCount <= MAX_AUTO_RETRIES) {
      setIsRetrying(true);
      setVideoError(false);
      setVideoErrorMessage(getVideoErrorMessage(errCode));
      const targetSrc = resolvedVideoUrlRef.current;
      autoRetryTimerRef.current = setTimeout(() => {
        if (!videoRef.current) {
          setIsRetrying(false);
          setVideoError(true);
          return;
        }
        videoRef.current.src = "";
        videoRef.current.load();
        setTimeout(() => {
          if (videoRef.current) {
            videoRef.current.src = targetSrc;
            videoRef.current.load();
            videoRef.current.play().catch(() => {});
          }
          setIsRetrying(false);
        }, 200);
      }, 1500);
    } else {
      setVideoError(true);
      setIsRetrying(false);
      setVideoErrorMessage(getVideoErrorMessage(errCode));
    }
  }, []);

  useEffect(() => {
    return () => {
      if (autoRetryTimerRef.current) clearTimeout(autoRetryTimerRef.current);
    };
  }, []);

  const hideControlsAfterDelay = useCallback(() => {
    if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
    controlsTimerRef.current = setTimeout(() => {
      if (playing) setShowControls(false);
    }, 3000);
  }, [playing]);

  const handleMouseMove = () => {
    setShowControls(true);
    hideControlsAfterDelay();
  };

  useEffect(() => {
    hideControlsAfterDelay();
    return () => {
      if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
    };
  }, [hideControlsAfterDelay]);

  useEffect(() => {
    const onFsChange = () => {
      type DocWithVendorFS = Document & {
        webkitFullscreenElement?: Element | null;
        mozFullScreenElement?: Element | null;
        msFullscreenElement?: Element | null;
      };
      const d = document as DocWithVendorFS;
      const fsEl =
        d.fullscreenElement ||
        d.webkitFullscreenElement ||
        d.mozFullScreenElement ||
        d.msFullscreenElement;
      setFullscreen(!!fsEl);
    };
    document.addEventListener("fullscreenchange", onFsChange);
    document.addEventListener("webkitfullscreenchange", onFsChange);
    document.addEventListener("mozfullscreenchange", onFsChange);
    document.addEventListener("MSFullscreenChange", onFsChange);
    return () => {
      document.removeEventListener("fullscreenchange", onFsChange);
      document.removeEventListener("webkitfullscreenchange", onFsChange);
      document.removeEventListener("mozfullscreenchange", onFsChange);
      document.removeEventListener("MSFullscreenChange", onFsChange);
    };
  }, []);

  const handleAdComplete = () => {
    setShowAd(false);
    setAdDismissed(true);
    setTimeout(() => {
      videoRef.current?.play().catch(() => {});
    }, 100);
  };

  const handleRetry = () => {
    if (autoRetryTimerRef.current) clearTimeout(autoRetryTimerRef.current);
    setVideoError(false);
    setVideoErrorMessage("");
    retryCountRef.current = 0;
    setIsRetrying(false);
    setIsLoading(false);
    if (!videoRef.current || !episode?.videoUrl) return;
    setTimeout(() => {
      if (!videoRef.current) return;
      videoRef.current.src = "";
      videoRef.current.load();
      requestAnimationFrame(() => {
        if (videoRef.current) {
          videoRef.current.src = resolvedVideoUrl;
          videoRef.current.load();
          videoRef.current.play().catch(() => {});
        }
      });
    }, 500);
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (playing) videoRef.current.pause();
    else videoRef.current.play().catch(() => setVideoError(true));
  };

  const skip = (secs: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.max(
      0,
      Math.min(duration, currentTime + secs),
    );
  };

  const handleVolumeChange = (val: number[]) => {
    const v = val[0];
    setVolume(v);
    if (videoRef.current) videoRef.current.volume = v;
    setMuted(v === 0);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const next = !muted;
    videoRef.current.muted = next;
    setMuted(next);
  };

  const handleSeek = (val: number[]) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = val[0];
    setCurrentTime(val[0]);
  };

  const toggleFullscreen = () => {
    type DocWithVendorFS = Document & {
      webkitExitFullscreen?: () => Promise<void>;
      mozCancelFullScreen?: () => Promise<void>;
      msExitFullscreen?: () => Promise<void>;
    };
    type ElWithVendorFS = HTMLElement & {
      webkitRequestFullscreen?: () => Promise<void>;
      mozRequestFullScreen?: () => Promise<void>;
      msRequestFullscreen?: () => Promise<void>;
    };
    const d = document as DocWithVendorFS;
    const isInFS =
      !!document.fullscreenElement ||
      !!(d as unknown as Record<string, unknown>).webkitFullscreenElement ||
      !!(d as unknown as Record<string, unknown>).mozFullScreenElement;
    if (isInFS) {
      if (d.exitFullscreen) d.exitFullscreen();
      else if (d.webkitExitFullscreen) d.webkitExitFullscreen();
      else if (d.mozCancelFullScreen) d.mozCancelFullScreen();
      else if (d.msExitFullscreen) d.msExitFullscreen();
    } else {
      const el = containerRef.current as ElWithVendorFS | null;
      if (!el) return;
      if (el.requestFullscreen) el.requestFullscreen();
      else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
      else if (el.mozRequestFullScreen) el.mozRequestFullScreen();
      else if (el.msRequestFullscreen) el.msRequestFullscreen();
    }
  };

  const handleQualityChange = (q: Quality) => {
    setQuality(q);
    localStorage.setItem(STORAGE_KEY, q);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === "INPUT") return;
      if (e.key === " ") {
        e.preventDefault();
        togglePlay();
      }
      if (e.key === "ArrowLeft") skip(-10);
      if (e.key === "ArrowRight") skip(10);
      if (e.key === "f" || e.key === "F") toggleFullscreen();
      if (e.key === "m" || e.key === "M") toggleMute();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  });

  const activeAd = preRollAds[0];
  const progressPct = duration > 0 ? (currentTime / duration) * 100 : 0;
  const epNumber = episode ? Number(episode.episodeNumber) : null;
  const isIframePlayer = videoType === "youtube" || videoType === "googledrive";
  const googleDriveInvalid =
    videoType === "googledrive" && !googleDriveEmbedUrl;

  if (episodeLoading) {
    return (
      <div
        className="min-h-screen bg-black flex items-center justify-center"
        data-ocid="watch-page-loading"
      >
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col" data-ocid="watch-page">
      {/* ── Top bar ──────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 px-4 py-3 bg-[#0a0a0a] border-b border-border/50 z-10">
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="gap-2 text-muted-foreground hover:text-foreground shrink-0"
        >
          <Link to="/anime/$id" params={{ id: animeId }}>
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">{anime?.title ?? "Back"}</span>
          </Link>
        </Button>

        {episode && (
          <div className="flex-1 min-w-0 text-center">
            <p className="text-sm font-semibold text-foreground truncate">
              {anime?.title && (
                <span className="text-muted-foreground mr-2">
                  {anime.title} ·
                </span>
              )}
              Ep {epNumber}: {episode.title}
            </p>
          </div>
        )}

        <div className="flex items-center gap-2 shrink-0">
          {/* Episodes toggle — mobile/tablet, hidden on lg where sidebar is always visible */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen((o) => !o)}
            className="lg:hidden gap-1.5 text-muted-foreground hover:text-foreground text-xs"
            data-ocid="episode-list-toggle"
            aria-label="Toggle episode list"
            aria-expanded={sidebarOpen}
          >
            <List className="w-4 h-4" />
            <span className="hidden sm:inline">Episodes</span>
          </Button>

          {nextEpisode && (
            <Button
              size="sm"
              asChild
              className="bg-primary hover:bg-primary/90 text-white gap-1.5 text-xs"
              data-ocid="next-ep-header-btn"
            >
              <Link
                {...watchLink(
                  nextEpisode.id,
                  nextEpisode.seasonId ?? undefined,
                )}
              >
                Next <SkipForward className="w-3.5 h-3.5" />
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* ── Main content: player + sidebar ───────────────────────────── */}
      <div className="flex flex-1 min-h-0">
        {/* Player column */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* ── Player container ─────────────────────────────────────── */}
          <div
            ref={containerRef}
            className="relative flex-1 bg-black flex items-center justify-center"
            style={{ cursor: showControls ? "default" : "none" }}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => playing && setShowControls(false)}
            data-ocid="video-player"
          >
            {showAd && activeAd?.videoUrl && (
              <PreRollAd
                videoUrl={activeAd.videoUrl}
                onComplete={handleAdComplete}
              />
            )}

            {rawVideoUrl ? (
              <div className="relative w-full flex items-center justify-center">
                {videoType === "youtube" && youTubeId ? (
                  <div className="w-full max-h-[calc(100vh-13rem)]">
                    <IframePlayer
                      src={`https://www.youtube.com/embed/${youTubeId}?autoplay=1&enablejsapi=1&rel=0&fs=1&modestbranding=1&playsinline=0`}
                      title="YouTube video player"
                      isFullscreen={fullscreen}
                      onToggleFullscreen={toggleFullscreen}
                    />
                  </div>
                ) : videoType === "googledrive" ? (
                  <div className="w-full max-h-[calc(100vh-13rem)]">
                    {googleDriveInvalid ? (
                      <div className="flex flex-col items-center justify-center gap-4 h-64">
                        <AlertCircle className="w-12 h-12 text-destructive" />
                        <div className="text-center space-y-1 px-6">
                          <p className="text-foreground font-semibold text-base">
                            Invalid Google Drive link
                          </p>
                          <p className="text-muted-foreground text-sm max-w-xs">
                            Please share the file using "Anyone with the link"
                            option and copy the share URL.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <IframePlayer
                        src={googleDriveEmbedUrl!}
                        title="Google Drive video player"
                        isFullscreen={fullscreen}
                        onToggleFullscreen={toggleFullscreen}
                        showDriveNotice={true}
                      />
                    )}
                  </div>
                ) : (
                  <>
                    {(videoBuffering || isLoading) &&
                      !videoError &&
                      !isRetrying && <VideoLoadingOverlay />}
                    {(videoError || isRetrying) && (
                      <VideoErrorOverlay
                        message={videoErrorMessage}
                        isRetrying={isRetrying}
                        canRetry={!isRetrying}
                        onRetry={handleRetry}
                      />
                    )}
                    <video
                      ref={videoRef}
                      key={resolvedVideoUrl}
                      src={resolvedVideoUrl}
                      className="w-full max-h-[calc(100vh-13rem)] object-contain"
                      preload="metadata"
                      playsInline
                      onLoadStart={() => setIsLoading(true)}
                      onTimeUpdate={(e) =>
                        setCurrentTime(e.currentTarget.currentTime)
                      }
                      onLoadedMetadata={(e) => {
                        setDuration(e.currentTarget.duration);
                        setIsLoading(false);
                        setVideoBuffering(false);
                        setVideoError(false);
                        setIsRetrying(false);
                      }}
                      onWaiting={() => setVideoBuffering(true)}
                      onCanPlay={() => {
                        setIsLoading(false);
                        setVideoBuffering(false);
                      }}
                      onPlaying={() => {
                        setIsLoading(false);
                        setVideoBuffering(false);
                        setVideoError(false);
                        setIsRetrying(false);
                      }}
                      onPlay={() => setPlaying(true)}
                      onPause={() => setPlaying(false)}
                      onError={handleVideoError}
                    >
                      <track kind="captions" />
                    </video>
                    {!videoError && !isRetrying && (
                      <button
                        type="button"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onClick={togglePlay}
                        onKeyDown={(e) => e.key === " " && togglePlay()}
                        aria-label={playing ? "Pause video" : "Play video"}
                      />
                    )}
                  </>
                )}
              </div>
            ) : (
              <div
                className="flex flex-col items-center justify-center gap-4 h-64"
                data-ocid="no-video"
              >
                <div className="w-14 h-14 border-2 border-muted rounded-full flex items-center justify-center">
                  <Play className="w-6 h-6 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground text-sm">
                  {episode
                    ? "No video source assigned to this episode."
                    : "Episode not found."}
                </p>
              </div>
            )}

            {/* Big play/pause indicator — only for HTML5 player */}
            {!showAd && !videoError && videoType === "html5" && (
              <div
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                aria-hidden
              >
                <div
                  className={[
                    "bg-black/50 rounded-full p-4 transition-opacity duration-200",
                    playing ? "opacity-0" : "opacity-100",
                  ].join(" ")}
                >
                  <Play className="w-10 h-10 text-white fill-white" />
                </div>
              </div>
            )}

            {/* ── Controls overlay ─────────────────────────────────── */}
            {!showAd && !videoError && (
              <div
                className={[
                  "absolute inset-0 flex flex-col justify-end transition-opacity duration-300 pointer-events-none",
                  isIframePlayer
                    ? "opacity-0"
                    : showControls || !playing
                      ? "opacity-100"
                      : "opacity-0",
                ].join(" ")}
              >
                {videoType === "html5" && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30" />
                )}

                <div className="relative pointer-events-auto px-3 sm:px-5 pb-3 sm:pb-4 space-y-2">
                  {videoType === "html5" && (
                    <div className="relative group/progress">
                      <Slider
                        value={[currentTime]}
                        min={0}
                        max={duration || 100}
                        step={0.5}
                        onValueChange={handleSeek}
                        className="cursor-pointer [&_[role=slider]]:bg-primary [&_[role=slider]]:border-primary [&_.bg-primary]:bg-primary"
                        data-ocid="video-progress"
                      />
                      <div
                        className="absolute -top-6 text-[10px] font-mono bg-black/80 text-white px-1.5 py-0.5 rounded pointer-events-none"
                        style={{
                          left: `clamp(0px, ${progressPct}%, calc(100% - 48px))`,
                        }}
                      >
                        {formatTime(currentTime)}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-2">
                    {videoType === "html5" && (
                      <div className="flex items-center gap-1 sm:gap-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => skip(-10)}
                          className="text-white hover:bg-white/10 p-2 h-9 w-9"
                          aria-label="Skip back 10 seconds"
                          data-ocid="skip-back"
                        >
                          <SkipBack className="w-5 h-5" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={togglePlay}
                          className="text-white hover:bg-white/10 p-2 h-10 w-10"
                          aria-label={playing ? "Pause" : "Play"}
                          data-ocid="play-pause"
                        >
                          {playing ? (
                            <Pause className="w-6 h-6 fill-white" />
                          ) : (
                            <Play className="w-6 h-6 fill-white" />
                          )}
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => skip(10)}
                          className="text-white hover:bg-white/10 p-2 h-9 w-9"
                          aria-label="Skip forward 10 seconds"
                          data-ocid="skip-forward"
                        >
                          <SkipForward className="w-5 h-5" />
                        </Button>
                        <div className="flex items-center gap-1.5">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={toggleMute}
                            className="text-white hover:bg-white/10 p-2 h-9 w-9"
                            aria-label={muted ? "Unmute" : "Mute"}
                            data-ocid="volume-toggle"
                          >
                            {muted || volume === 0 ? (
                              <VolumeX className="w-5 h-5" />
                            ) : (
                              <Volume2 className="w-5 h-5" />
                            )}
                          </Button>
                          <div className="w-18 hidden sm:block">
                            <Slider
                              value={[muted ? 0 : volume]}
                              min={0}
                              max={1}
                              step={0.05}
                              onValueChange={handleVolumeChange}
                              className="[&_[role=slider]]:bg-white [&_.bg-primary]:bg-white"
                              data-ocid="volume-slider"
                            />
                          </div>
                        </div>
                        <span className="text-white text-xs font-mono hidden sm:block whitespace-nowrap">
                          {formatTime(currentTime)}
                          <span className="text-white/50 mx-0.5">/</span>
                          {formatTime(duration)}
                        </span>
                      </div>
                    )}

                    <div
                      className={[
                        "flex items-center gap-1",
                        isIframePlayer ? "ml-auto" : "",
                      ].join(" ")}
                    >
                      {videoType === "html5" && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-white hover:bg-white/10 gap-1 text-xs h-9 px-2"
                              data-ocid="quality-selector"
                            >
                              <Settings className="w-4 h-4" />
                              <span className="hidden sm:inline font-mono">
                                {quality}
                              </span>
                              <ChevronDown className="w-3 h-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="bg-card border-border min-w-[5rem]"
                          >
                            {QUALITY_OPTIONS.map((q) => (
                              <DropdownMenuItem
                                key={q}
                                onClick={() => handleQualityChange(q)}
                                className={[
                                  "font-mono text-xs cursor-pointer",
                                  quality === q ? "text-primary font-bold" : "",
                                ].join(" ")}
                                data-ocid={`quality-${q}`}
                              >
                                {quality === q && (
                                  <span className="mr-1.5">✓</span>
                                )}
                                {q}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={toggleFullscreen}
                        className="text-white hover:bg-white/10 p-2 h-9 w-9"
                        aria-label={
                          fullscreen ? "Exit fullscreen" : "Fullscreen"
                        }
                        data-ocid="fullscreen-toggle"
                      >
                        {fullscreen ? (
                          <Minimize className="w-4 h-4" />
                        ) : (
                          <Maximize className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── Season selector + episode navigation bar ────────────── */}
          <div className="bg-[#0a0a0a] border-t border-border/50 px-4 py-3">
            <div className="max-w-5xl mx-auto space-y-3">
              {seasons.length > 0 && (
                <div
                  className="flex items-center gap-3 flex-wrap"
                  data-ocid="watch-season-bar"
                >
                  <span className="text-[10px] font-semibold text-white/40 uppercase tracking-wider shrink-0">
                    Season
                  </span>
                  <SeasonSelector
                    seasons={seasons}
                    activeSeason={activeSeason}
                    onSeasonChange={handleSeasonChange}
                  />
                </div>
              )}

              <div className="flex items-center justify-between gap-4">
                {prevEpisode ? (
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="gap-2 border-border text-foreground hover:bg-secondary"
                    data-ocid="prev-episode-btn"
                  >
                    <Link
                      {...watchLink(
                        prevEpisode.id,
                        prevEpisode.seasonId ?? undefined,
                      )}
                    >
                      <SkipBack className="w-4 h-4" />
                      <span className="hidden sm:inline">
                        Ep {Number(prevEpisode.episodeNumber)}
                      </span>
                    </Link>
                  </Button>
                ) : (
                  <div />
                )}

                <div className="text-center min-w-0">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono">
                    Episode {epNumber} of {seasonEpisodes.length}
                    {seasons.length > 0 && activeSeason && (
                      <span className="text-primary ml-1">
                        · {seasons.find((s) => s.id === activeSeason)?.name}
                      </span>
                    )}
                  </p>
                  <p className="text-sm font-semibold text-foreground truncate max-w-xs">
                    {episode?.title}
                  </p>
                </div>

                {nextEpisode ? (
                  <Button
                    variant="default"
                    size="sm"
                    asChild
                    className="gap-2 bg-primary hover:bg-primary/90 text-white"
                    data-ocid="next-episode-btn"
                  >
                    <Link
                      {...watchLink(
                        nextEpisode.id,
                        nextEpisode.seasonId ?? undefined,
                      )}
                    >
                      <span className="hidden sm:inline">
                        Ep {Number(nextEpisode.episodeNumber)}
                      </span>
                      <SkipForward className="w-4 h-4" />
                    </Link>
                  </Button>
                ) : (
                  <div />
                )}
              </div>
            </div>
          </div>

          {/* ── Rating & Comments ──────────────────────────────────── */}
          <EpisodeComments episodeId={episodeId} animeId={animeId} />
        </div>

        {/* ── Episode Sidebar (desktop: fixed right column; mobile: drawer) ── */}
        <EpisodeSidebar
          episodes={seasonEpisodes}
          currentEpisodeId={episodeId}
          seasons={seasons}
          activeSeason={activeSeason}
          onSeasonChange={handleSeasonChange}
          onEpisodeClick={handleEpisodeNavClick}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      </div>
    </div>
  );
}
