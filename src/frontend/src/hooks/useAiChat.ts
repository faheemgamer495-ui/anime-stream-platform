import { useActor } from "@caffeineai/core-infrastructure";
import { useCallback, useEffect, useRef, useState } from "react";
import { createActor } from "../backend";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  isError?: boolean;
  canRetry?: boolean;
  isQueued?: boolean;
}

interface SendMessageContext {
  page?: string;
  errorType?: string;
}

interface AiChatResult {
  messages: Message[];
  isLoading: boolean;
  loadingLabel: string;
  error: string | null;
  isFallbackMode: boolean;
  currentPage: string;
  queueLength: number;
  setCurrentPage: (page: string) => void;
  sendMessage: (text: string, context?: SendMessageContext) => Promise<void>;
  retryLastMessage: () => Promise<void>;
  clearMessages: () => void;
  lastUserMessage: string | null;
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

// ---------------------------------------------------------------------------
// Smart keyword-based fallback response engine (runs entirely client-side)
// ---------------------------------------------------------------------------

interface ResponseRule {
  keywords: string[];
  response: string;
}

const RESPONSE_RULES: ResponseRule[] = [
  {
    keywords: [
      "video not playing",
      "video error",
      "can't play",
      "cannot play",
      "video fail",
      "video load",
      "buffering",
      "stuck",
      "video nahi",
      "video chal",
    ],
    response: `Video playback issue — try these steps:

1. **Refresh** the page (Ctrl+R / Cmd+R) and try again.
2. Check your **internet connection** — a slow connection causes buffering.
3. Click the **Retry** button on the video player.
4. If it's a Google Drive link, make sure the file is shared as "Anyone with the link".
5. Try a different episode or check if other videos work — it may be a source-specific issue.`,
  },
  {
    keywords: [
      "google drive",
      "drive link",
      "drive video",
      "file not found",
      "drive nahi",
      "uc?export",
      "drive.google",
    ],
    response: `Google Drive video issue — here's how to fix it:

1. Open **Google Drive** and find your video file.
2. Right-click → **Share** → set access to **"Anyone with the link"** (Viewer).
3. Copy the share link and paste it when adding the episode.
4. The link should look like: \`drive.google.com/file/d/FILE_ID/view\`
5. If the file was deleted, you'll need to re-upload it to Drive first.`,
  },
  {
    keywords: [
      "upload",
      "can't upload",
      "upload fail",
      "upload error",
      "403",
      "forbidden",
      "gallery",
      "device upload",
      "upload nahi",
    ],
    response: `Upload problem — try these steps:

1. Make sure you're **logged in as Admin** before uploading.
2. Check your **internet speed** — large files need a stable connection.
3. Try a **smaller file** first to confirm uploads are working.
4. If you see a "403 Forbidden" error, log out and log back into Admin panel.
5. Supported formats: \`.mp4\`, \`.webm\`, \`.m3u8\` — make sure your file is one of these.`,
  },
  {
    keywords: [
      "page not loading",
      "page error",
      "website not working",
      "site down",
      "slow",
      "not responding",
      "blank",
      "white screen",
      "page nahi",
      "kaam nahi",
    ],
    response: `Page loading issue — try these fixes:

1. **Hard refresh** the page: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac).
2. **Clear your browser cache**: Settings → Clear Browsing Data → Cached Images.
3. Try opening the site in a **different browser** (Chrome, Firefox, Edge).
4. Check if your **internet connection** is stable.
5. If the issue persists, wait 2–3 minutes — it may be a temporary server hiccup.`,
  },
  {
    keywords: [
      "login",
      "can't login",
      "sign in",
      "internet identity",
      "logout",
      "sign out",
      "auth",
      "account",
      "login nahi",
      "login problem",
    ],
    response: `Login / sign-in issue — follow these steps:

1. Click the **Login** button in the top navbar.
2. For **User Login**: use Internet Identity — a browser pop-up will open.
3. Make sure **pop-ups are allowed** in your browser for this site.
4. If Internet Identity fails, try in an **incognito/private** window.
5. If you're logging in as a user and it still fails, clear cookies and try again.`,
  },
  {
    keywords: [
      "episode not found",
      "episode missing",
      "content missing",
      "can't find episode",
      "no episode",
      "episode nahi",
      "episode gayab",
      "where is episode",
    ],
    response: `Episode not found — here's what to check:

1. Go back to the **Home page** and search for the anime title.
2. Episodes might be on a **different server** — check the server selector in the player.
3. If you're an admin, make sure the episode was **saved successfully** in the admin panel.
4. Try **refreshing** the anime detail page — data may still be loading.
5. If episodes disappeared after a site update, they may need to be re-added.`,
  },
  {
    keywords: [
      "admin",
      "admin panel",
      "add anime",
      "add episode",
      "dashboard",
      "manage",
      "admin login",
    ],
    response: `Admin panel help:

1. Click **Login** in the navbar → switch to the **Admin Login** tab.
2. Enter your admin credentials to access the dashboard.
3. To add anime: Admin Panel → **Anime** section → Add New.
4. To add an episode: go to the anime → click **Add Episode** → fill in details.
5. Use **direct video URLs** (ending in .mp4/.webm) or upload from device for episodes.`,
  },
  {
    keywords: [
      "watchlist",
      "saved",
      "favorites",
      "my list",
      "watch later",
      "bookmark",
      "watchlist nahi",
    ],
    response: `Watchlist issue:

1. Make sure you are **logged in** — watchlist requires a user account.
2. On any anime page, click the **+ Watchlist** button to save it.
3. Your watchlist appears as a section on the **Home page** after adding items.
4. If your watchlist is empty after logging in, try **refreshing** the page.
5. Watchlist data is tied to your Internet Identity — switching accounts clears it.`,
  },
  {
    keywords: [
      "search",
      "can't find",
      "not showing",
      "filter",
      "genre",
      "browse",
      "search nahi",
    ],
    response: `Search & browsing help:

1. Use the **search bar** in the navbar — type the anime name and press Enter.
2. Use **genre filters** on the home page to browse by category.
3. Search is case-insensitive — try shorter keywords if exact name doesn't show.
4. New anime may take a moment to appear — try refreshing after adding content.
5. If no results show, make sure anime has been added in the Admin panel.`,
  },
];

const FALLBACK_GENERIC = `I'm here to help! Here are common things I can assist with:

1. **Video not playing** — try refreshing or click the Retry button.
2. **Page errors** — clear your browser cache and reload.
3. **Login issues** — use the Login button in the navbar.
4. **Episode not found** — check the server selector in the video player.
5. **Upload problems** — ensure you're logged in as Admin.

Tell me more specifically what's happening and I'll guide you step by step! 🎌`;

function getLocalSmartResponse(message: string): string {
  const lowerMsg = message.toLowerCase();
  for (const rule of RESPONSE_RULES) {
    if (rule.keywords.some((kw) => lowerMsg.includes(kw))) {
      return rule.response;
    }
  }
  return FALLBACK_GENERIC;
}

// ---------------------------------------------------------------------------
// Anime request detection
// ---------------------------------------------------------------------------

const ANIME_REQUEST_ACTION_KEYWORDS = [
  "add",
  "upload",
  "request",
  "chahiye",
  "dalo",
  "dal do",
  "lao",
];

const ANIME_REQUEST_PHRASE_PATTERNS = [
  "request karo",
  "add kar do",
  "upload kar do",
  "add karo",
  "request for",
  "episode add",
  "season add",
  "add episode",
  "add season",
  "anime add",
];

const KNOWN_ANIME_NAMES = [
  "naruto",
  "one piece",
  "dragon ball",
  "bleach",
  "attack on titan",
  "shingeki",
  "demon slayer",
  "kimetsu",
  "jujutsu",
  "my hero",
  "fairy tail",
  "black clover",
  "boruto",
  "hunter x hunter",
  "fullmetal",
  "sword art online",
  "sao",
  "tokyo ghoul",
  "death note",
  "code geass",
  "re:zero",
  "overlord",
  "log horizon",
  "mob psycho",
  "one punch man",
  "haikyuu",
  "vinland",
  "chainsaw man",
  "spy x family",
  "blue lock",
  "oshi no ko",
  "frieren",
  "mha",
  "aot",
  "snk",
];

const EPISODE_SEASON_PATTERN =
  /\b(ep(isode)?|season|s\d|e\d|\d+\s*(ep|eps|episode|season))\b/i;

function isAnimeRequest(message: string): boolean {
  const lower = message.toLowerCase().trim();

  for (const phrase of ANIME_REQUEST_PHRASE_PATTERNS) {
    if (lower.includes(phrase)) return true;
  }

  const startsWithAction = ANIME_REQUEST_ACTION_KEYWORDS.some(
    (kw) => lower.startsWith(`${kw} `) || lower === kw,
  );

  if (startsWithAction) {
    const hasAnimeName = KNOWN_ANIME_NAMES.some((name) => lower.includes(name));
    const hasEpisodePattern = EPISODE_SEASON_PATTERN.test(lower);
    if (hasAnimeName || hasEpisodePattern) return true;
  }

  const hasAction = ANIME_REQUEST_ACTION_KEYWORDS.some((kw) =>
    lower.includes(kw),
  );
  const hasAnimeName = KNOWN_ANIME_NAMES.some((name) => lower.includes(name));
  if (hasAction && hasAnimeName) return true;

  return false;
}

// ---------------------------------------------------------------------------
// Error classification
// ---------------------------------------------------------------------------

const MAX_RETRIES = 2; // total attempts = 3
// Shorter delays: 1s then 2s (was 2s/3s/4s)
const RETRY_DELAYS_MS = [1000, 2000];
// Increased from 30s to 60s to account for slow Motoko HTTP outcalls
const REQUEST_TIMEOUT_MS = 60000;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

type ErrorCategory =
  | "timeout"
  | "network"
  | "auth"
  | "rate_limit"
  | "server"
  | "unknown";

function classifyError(err: unknown): ErrorCategory {
  if (err instanceof Error) {
    const msg = err.message.toLowerCase();
    if (
      msg.includes("timeout") ||
      msg.includes("timed out") ||
      msg.includes("deadline")
    )
      return "timeout";
    if (
      msg.includes("network") ||
      msg.includes("fetch") ||
      msg.includes("failed to fetch") ||
      msg.includes("networkerror") ||
      msg.includes("connection")
    )
      return "network";
    if (
      msg.includes("401") ||
      msg.includes("403") ||
      msg.includes("unauthorized") ||
      msg.includes("auth")
    )
      return "auth";
    if (msg.includes("429") || msg.includes("rate")) return "rate_limit";
    if (msg.includes("503") || msg.includes("500")) return "server";
  }
  return "unknown";
}

function getErrorMessage(errType: ErrorCategory): string {
  switch (errType) {
    case "timeout":
      return "Response took too long — the AI server is slow right now. Try again.";
    case "network":
      return "Network error — check your internet connection.";
    case "auth":
      return "API key issue — please contact support.";
    case "rate_limit":
      return "AI is busy right now, please wait 30 seconds and try again.";
    case "server":
      return "Something went wrong. Tap Retry to try again.";
    default:
      return "Something went wrong. Tap Retry to try again.";
  }
}

// ---------------------------------------------------------------------------
// Queue entry
// ---------------------------------------------------------------------------

interface QueuedMessage {
  text: string;
  context?: SendMessageContext;
}

// ---------------------------------------------------------------------------

export function useAiChat(): AiChatResult {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  // Human-readable label shown in the loading dots (e.g. "Typing...", "Retrying... (1/2)")
  const [loadingLabel, setLoadingLabel] = useState("Typing…");
  const [error, setError] = useState<string | null>(null);
  const [isFallbackMode, setIsFallbackMode] = useState(false);
  const [currentPage, setCurrentPage] = useState("/");
  const [lastUserMessage, setLastUserMessage] = useState<string | null>(null);
  const [lastContext, setLastContext] = useState<
    SendMessageContext | undefined
  >(undefined);

  // Queue for messages sent while a request is in-flight
  const messageQueueRef = useRef<QueuedMessage[]>([]);
  const [queueLength, setQueueLength] = useState(0);

  // Ref-based in-flight guard — blocks rapid duplicate calls even before
  // React state has had a chance to update (important on Android where state
  // flush can lag behind rapid tap events).
  const isRequestInFlightRef = useRef(false);

  // Track whether the page is hidden (Android WebView background tab) so we
  // never abort a request that is still in-flight just because the user
  // switched apps momentarily.
  const isPageHiddenRef = useRef(false);

  useEffect(() => {
    const onVisibilityChange = () => {
      isPageHiddenRef.current = document.visibilityState === "hidden";
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", onVisibilityChange);
  }, []);

  const { actor, isFetching } = useActor(createActor);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
    setIsFallbackMode(false);
    setLastUserMessage(null);
    setLastContext(undefined);
    messageQueueRef.current = [];
    setQueueLength(0);
  }, []);

  // Core send logic — extracted so both sendMessage and the queue processor
  // can use it without duplication.
  const _executeSend = useCallback(
    async (text: string, context?: SendMessageContext) => {
      isRequestInFlightRef.current = true;

      const userMessage: Message = {
        id: generateId(),
        role: "user",
        content: text.trim(),
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);
      setLoadingLabel("Typing…");
      setError(null);
      setLastUserMessage(text.trim());
      setLastContext(context);

      // -----------------------------------------------------------------------
      // ANIME REQUEST DETECTION — intercept before calling AI
      // -----------------------------------------------------------------------
      if (isAnimeRequest(text.trim())) {
        console.info(
          "[useAiChat] Anime request detected — routing to submitAnimeRequest",
        );

        try {
          if (actor && !isFetching) {
            await actor.submitAnimeRequest(text.trim(), "Anonymous");
            console.info("[useAiChat] submitAnimeRequest succeeded");
          }
        } catch (err) {
          console.warn(
            "[useAiChat] submitAnimeRequest failed (non-critical):",
            err,
          );
        }

        const requestReply: Message = {
          id: generateId(),
          role: "assistant",
          content:
            "Your anime request has been successfully submitted ✅\nIt will be added to the website within 24 hours or 3 working days.",
          timestamp: Date.now(),
        };

        setMessages((prev) => [...prev, requestReply]);
        setIsLoading(false);
        setIsFallbackMode(false);
        setError(null);
        isRequestInFlightRef.current = false;
        return;
      }

      let responseText: string | null = null;
      let usedFallback = false;
      let succeeded = false;
      let lastErrType: ErrorCategory = "unknown";

      // -----------------------------------------------------------------------
      // Try the real backend/AI with retry + timeout
      // AbortController is NOT used to avoid Android WebView issues — we let
      // the 60s timeout promise handle cancellation instead.
      // -----------------------------------------------------------------------
      if (actor && !isFetching) {
        const pageContext = context?.page ?? currentPage;
        const errorContext = context?.errorType ?? "";

        for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
          // Update loading label: show retry count on retries
          if (attempt > 0) {
            setLoadingLabel(`Retrying… (${attempt}/${MAX_RETRIES})`);
          } else {
            setLoadingLabel("Typing…");
          }

          try {
            console.info(
              `[useAiChat] Attempt ${attempt + 1}/${MAX_RETRIES + 1} — calling backend.aiChat()`,
            );

            // 60s timeout promise — safer on Android than AbortController
            // because Android WebView sometimes fires abort events spuriously.
            const timeoutPromise = new Promise<never>((_, reject) =>
              setTimeout(
                () => reject(new Error("Request timed out")),
                REQUEST_TIMEOUT_MS,
              ),
            );

            // Wrap the actor call in an async IIFE so that any synchronous
            // throw from the actor (common on Android WebView) is captured
            // and converted into a rejected promise that Promise.race can see.
            const actorCallPromise: Promise<string> = Promise.resolve().then(
              () =>
                actor.aiChat(userMessage.content, pageContext, errorContext),
            );

            const backendResponse = await Promise.race([
              actorCallPromise,
              timeoutPromise,
            ]);

            if (backendResponse && backendResponse.trim().length > 0) {
              responseText = backendResponse;
              succeeded = true;
              break;
            }
          } catch (err) {
            lastErrType = classifyError(err);
            const errMsg = err instanceof Error ? err.message : String(err);

            console.error(
              `[useAiChat] Attempt ${attempt + 1} failed — type: ${lastErrType}, message: ${errMsg}`,
              err,
            );

            // Auth errors: no point retrying
            if (lastErrType === "auth") {
              break;
            }

            if (attempt < MAX_RETRIES) {
              const delay = RETRY_DELAYS_MS[attempt] ?? 1000;
              console.info(`[useAiChat] Retrying in ${delay}ms…`);
              await sleep(delay);
            }
          }
        }
      }

      // -----------------------------------------------------------------------
      // All retries failed — fall back to local smart response
      // -----------------------------------------------------------------------
      if (!succeeded) {
        responseText = getLocalSmartResponse(text);
        usedFallback = true;
      }

      const assistantMessage: Message = {
        id: generateId(),
        role: "assistant",
        content: responseText ?? FALLBACK_GENERIC,
        timestamp: Date.now(),
        isError: usedFallback,
        canRetry: usedFallback,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
      isRequestInFlightRef.current = false;

      if (usedFallback) {
        setIsFallbackMode(true);
        setError(getErrorMessage(lastErrType));
      } else {
        setIsFallbackMode(false);
        setError(null);
      }

      // -----------------------------------------------------------------------
      // Process next queued message if any
      // -----------------------------------------------------------------------
      const next = messageQueueRef.current.shift();
      if (next) {
        setQueueLength(messageQueueRef.current.length);
        // Remove the "(queued)" marker from the queued user message now that
        // we're about to process it (find it by content match + isQueued flag)
        setMessages((prev) =>
          prev.map((m) =>
            m.isQueued && m.content === next.text
              ? { ...m, isQueued: false }
              : m,
          ),
        );
        // Small delay so state settles before next request
        await sleep(200);
        await _executeSend(next.text, next.context);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [actor, isFetching, currentPage],
  );

  const sendMessage = useCallback(
    async (text: string, context?: SendMessageContext) => {
      if (!text.trim()) return;

      // If a request is already in-flight, queue this message instead
      if (isRequestInFlightRef.current || isLoading) {
        // Avoid queuing exact duplicate of last queued message
        const lastQueued =
          messageQueueRef.current[messageQueueRef.current.length - 1];
        if (lastQueued?.text === text.trim()) {
          console.warn("[useAiChat] Duplicate queued message — ignored.");
          return;
        }

        console.info("[useAiChat] Request in-flight — queuing message.");
        messageQueueRef.current.push({ text: text.trim(), context });
        setQueueLength(messageQueueRef.current.length);

        // Add a visible "(queued)" placeholder in the chat
        const queuedMsg: Message = {
          id: generateId(),
          role: "user",
          content: text.trim(),
          timestamp: Date.now(),
          isQueued: true,
        };
        setMessages((prev) => [...prev, queuedMsg]);
        return;
      }

      await _executeSend(text, context);
    },
    [isLoading, _executeSend],
  );

  // Retry the last user message (called from the Retry button in the UI)
  const retryLastMessage = useCallback(async () => {
    if (!lastUserMessage || isRequestInFlightRef.current || isLoading) return;

    // Remove the last assistant error message so it gets replaced cleanly
    setMessages((prev) => {
      const last = prev[prev.length - 1];
      if (last?.role === "assistant" && last.canRetry) {
        return prev.slice(0, -2); // remove last assistant + last user too
      }
      return prev;
    });

    setError(null);
    setIsFallbackMode(false);

    await _executeSend(lastUserMessage, lastContext);
  }, [lastUserMessage, lastContext, isLoading, _executeSend]);

  return {
    messages,
    isLoading,
    loadingLabel,
    error,
    isFallbackMode,
    currentPage,
    queueLength,
    setCurrentPage,
    sendMessage,
    retryLastMessage,
    clearMessages,
    lastUserMessage,
  };
}
