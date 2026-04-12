import { useRouterState } from "@tanstack/react-router";
import { Bot, MessageCircle, RefreshCw, Send, X, Zap } from "lucide-react";
import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { useAiChat } from "../hooks/useAiChat";
import { useErrorDetection } from "../hooks/useErrorDetection";

const QUICK_REPLIES = [
  { label: "🎬 Video not playing", message: "Video not playing" },
  { label: "🌐 Page not loading", message: "Page not loading" },
  { label: "🔑 Login problem", message: "Login problem" },
  { label: "📺 Episode not found", message: "Episode not found" },
  { label: "☁️ Google Drive issue", message: "Google Drive video not working" },
  { label: "⬆️ Upload failed", message: "Upload failed" },
];

// Render assistant message with basic markdown-ish bold support
function AssistantMessageContent({ content }: { content: string }) {
  const lines = content.split("\n").filter((l) => l.trim().length > 0);
  return (
    <div className="flex flex-col gap-1">
      {lines.map((line) => {
        const parts = line.trim().split(/\*\*(.*?)\*\*/g);
        const key = line.slice(0, 40);
        return (
          <p key={key} className="text-sm leading-relaxed">
            {parts.map((part, pi) => {
              const pKey = `${key}-${pi}`;
              return pi % 2 === 1 ? (
                <strong
                  key={pKey}
                  className="font-semibold"
                  style={{ color: "#fca5a5" }}
                >
                  {part}
                </strong>
              ) : (
                <span key={pKey}>{part}</span>
              );
            })}
          </p>
        );
      })}
    </div>
  );
}

// Animated loading dots — shows the current loading label (e.g. retry count)
function LoadingDots({ label }: { label: string }) {
  return (
    <div className="flex justify-start items-end gap-2">
      <div
        className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
        style={{
          background: "rgba(229,9,20,0.15)",
          border: "1px solid rgba(229,9,20,0.3)",
        }}
      >
        <Bot className="w-3 h-3" style={{ color: "#E50914" }} />
      </div>
      <div
        className="px-4 py-3 rounded-xl flex flex-col gap-1"
        style={{ background: "#27272a", borderRadius: "16px 16px 16px 4px" }}
      >
        <div className="flex items-center gap-1">
          <div
            className="w-1.5 h-1.5 rounded-full animate-bounce"
            style={{ background: "#71717a", animationDelay: "0s" }}
          />
          <div
            className="w-1.5 h-1.5 rounded-full animate-bounce"
            style={{ background: "#71717a", animationDelay: "0.15s" }}
          />
          <div
            className="w-1.5 h-1.5 rounded-full animate-bounce"
            style={{ background: "#71717a", animationDelay: "0.30s" }}
          />
        </div>
        <span className="text-xs" style={{ color: "#71717a" }}>
          {label}
        </span>
      </div>
    </div>
  );
}

// The full chat panel — only mounted once the user opens the widget for the
// first time (lazy DOM for performance).
function ChatPanel() {
  const [inputValue, setInputValue] = useState("");
  const [proactiveShown, setProactiveShown] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(true);

  const {
    messages,
    isLoading,
    loadingLabel,
    error,
    isFallbackMode,
    queueLength,
    sendMessage,
    retryLastMessage,
    setCurrentPage,
    lastUserMessage,
  } = useAiChat();
  const { lastError, clearError } = useErrorDetection();

  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  // Sync current page to chat hook
  useEffect(() => {
    setCurrentPage(currentPath);
  }, [currentPath, setCurrentPage]);

  // Proactive error suggestion when chat opens with a detected error
  const hasMessages = messages.length > 0;
  useEffect(() => {
    if (isOpen && lastError && !proactiveShown && !hasMessages) {
      setProactiveShown(true);
      clearError();
      const timer = setTimeout(() => {
        void sendMessage(
          "I noticed a technical issue on this page. Video not playing — help me fix it.",
          { page: currentPath, errorType: lastError },
        );
      }, 400);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [
    isOpen,
    lastError,
    proactiveShown,
    hasMessages,
    clearError,
    sendMessage,
    currentPath,
  ]);

  // Reset proactive flag when chat is closed
  useEffect(() => {
    if (!isOpen) setProactiveShown(false);
  }, [isOpen]);

  // Auto-scroll to bottom on new messages or loading state change
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  });

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 100);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [isOpen]);

  const handleSend = () => {
    const text = inputValue.trim();
    if (!text) return;
    setInputValue("");
    void sendMessage(text, { page: currentPath });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickReply = (message: string) => {
    void sendMessage(message, { page: currentPath });
  };

  const lastMsg = messages[messages.length - 1];
  const showRetryButton =
    !isLoading && lastMsg?.role === "assistant" && lastMsg.canRetry;

  // Expose close via prop-less internal state toggling
  const handleClose = () => setIsOpen(false);

  if (!isOpen) return null;

  return (
    <div
      className="flex flex-col rounded-xl shadow-2xl overflow-hidden w-[390px] h-[540px] max-sm:w-[calc(100vw-24px)] max-sm:h-[75vh] max-sm:max-h-[540px] transition-all duration-300"
      style={{ background: "#1a1a1a", border: "1px solid #3f3f46" }}
      data-ocid="ai-chat-window"
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 flex-shrink-0"
        style={{ background: "#111111", borderBottom: "1px solid #27272a" }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
            style={{
              background: "rgba(229,9,20,0.18)",
              border: "1px solid rgba(229,9,20,0.4)",
            }}
          >
            <Bot className="w-4 h-4" style={{ color: "#E50914" }} />
          </div>
          <div>
            <p className="font-semibold text-white text-sm leading-tight">
              AI Support
            </p>
            <p className="text-xs leading-tight" style={{ color: "#71717a" }}>
              {isLoading ? (
                <span style={{ color: "#facc15" }}>
                  {loadingLabel.startsWith("Retry")
                    ? loadingLabel
                    : "Responding…"}
                </span>
              ) : queueLength > 0 ? (
                <span style={{ color: "#a78bfa" }}>
                  {queueLength} message{queueLength > 1 ? "s" : ""} queued
                </span>
              ) : (
                "Anime Stream Helper"
              )}
            </p>
          </div>
          <div
            className="w-1.5 h-1.5 rounded-full ml-1"
            style={{
              background: isLoading
                ? "#facc15"
                : queueLength > 0
                  ? "#a78bfa"
                  : "#22c55e",
              animation:
                isLoading || queueLength > 0 ? "none" : "pulse 2s infinite",
            }}
          />
        </div>
        <button
          type="button"
          onClick={handleClose}
          className="p-1.5 rounded-lg transition-colors duration-200 text-zinc-400 hover:text-white hover:bg-zinc-700"
          aria-label="Close chat"
          data-ocid="ai-chat-close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Area */}
      <div
        className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3 min-h-0"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#3f3f46 transparent",
        }}
      >
        {messages.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-2">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center"
              style={{
                background: "rgba(229,9,20,0.12)",
                border: "1px solid rgba(229,9,20,0.3)",
              }}
            >
              <MessageCircle className="w-7 h-7" style={{ color: "#E50914" }} />
            </div>
            <div>
              <p className="text-white font-semibold text-base mb-1">
                Hi! How can I help? 👋
              </p>
              <p
                className="text-xs leading-relaxed"
                style={{ color: "#71717a" }}
              >
                I can help with video issues, login problems,
                <br />
                missing episodes, uploads, and more!
              </p>
            </div>
            {/* Quick reply buttons */}
            <div
              className="flex flex-wrap gap-2 justify-center mt-1 w-full"
              data-ocid="ai-quick-replies"
            >
              {QUICK_REPLIES.map((reply) => (
                <button
                  type="button"
                  key={reply.message}
                  onClick={() => handleQuickReply(reply.message)}
                  className="text-xs px-3 py-1.5 rounded-full transition-all duration-200 hover:opacity-90 active:scale-95 whitespace-nowrap"
                  style={{
                    background: "rgba(229,9,20,0.10)",
                    border: "1px solid rgba(229,9,20,0.30)",
                    color: "#fca5a5",
                  }}
                  data-ocid={`ai-quick-reply-${reply.message.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  {reply.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role === "assistant" && (
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mr-2 mt-1 self-start"
                style={{
                  background: "rgba(229,9,20,0.15)",
                  border: "1px solid rgba(229,9,20,0.3)",
                }}
              >
                <Bot className="w-3 h-3" style={{ color: "#E50914" }} />
              </div>
            )}
            <div className="max-w-[80%] flex flex-col gap-1 items-end">
              <div
                className="px-3 py-2.5 rounded-xl break-words w-full"
                style={
                  msg.role === "user"
                    ? {
                        background: msg.isQueued
                          ? "rgba(229,9,20,0.55)"
                          : "#E50914",
                        color: "#fff",
                        borderRadius: "16px 16px 4px 16px",
                        fontSize: "0.875rem",
                        lineHeight: "1.5",
                        opacity: msg.isQueued ? 0.75 : 1,
                      }
                    : {
                        background: msg.isError ? "#2a1a1a" : "#27272a",
                        color: "#e4e4e7",
                        borderRadius: "16px 16px 16px 4px",
                        border: msg.isError
                          ? "1px solid rgba(229,9,20,0.25)"
                          : "none",
                      }
                }
              >
                {msg.role === "assistant" ? (
                  <AssistantMessageContent content={msg.content} />
                ) : (
                  <span className="text-sm leading-relaxed">{msg.content}</span>
                )}
              </div>
              {/* Queued badge */}
              {msg.isQueued && (
                <span
                  className="text-xs px-2 py-0.5 rounded-full self-end"
                  style={{
                    background: "rgba(167,139,250,0.15)",
                    border: "1px solid rgba(167,139,250,0.3)",
                    color: "#a78bfa",
                  }}
                >
                  queued
                </span>
              )}
            </div>
          </div>
        ))}

        {/* Loading dots — shown while waiting for AI */}
        {isLoading && <LoadingDots label={loadingLabel} />}

        {/* Error banner — shown below last message when a network error occurred */}
        {!isLoading && error && (
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs"
            style={{
              background: "rgba(229,9,20,0.08)",
              border: "1px solid rgba(229,9,20,0.20)",
              color: "#fca5a5",
            }}
            data-ocid="ai-error-banner"
          >
            <span className="opacity-70">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Retry button — shown after a failed/fallback response */}
        {showRetryButton && lastUserMessage && (
          <div className="flex justify-center mt-1">
            <button
              type="button"
              onClick={() => void retryLastMessage()}
              className="flex items-center gap-1.5 text-xs px-4 py-1.5 rounded-full transition-all duration-200 hover:opacity-90 active:scale-95"
              style={{
                background: "rgba(229,9,20,0.15)",
                border: "1px solid rgba(229,9,20,0.40)",
                color: "#fca5a5",
              }}
              data-ocid="ai-retry-button"
            >
              <RefreshCw className="w-3 h-3" />
              Try Again
            </button>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div
        className="flex-shrink-0 px-3 py-2.5 flex gap-2 items-center"
        style={{ borderTop: "1px solid #27272a", background: "#111111" }}
      >
        <input
          ref={inputRef}
          type="text"
          inputMode="text"
          enterKeyHint="send"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            isLoading
              ? "Waiting for response…"
              : queueLength > 0
                ? "Message will be queued…"
                : "Describe your issue…"
          }
          className="flex-1 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 outline-none transition-all duration-200"
          style={{ background: "#27272a", border: "1px solid #3f3f46" }}
          data-ocid="ai-chat-input"
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={!inputValue.trim()}
          className="w-9 h-9 rounded-lg flex-shrink-0 flex items-center justify-center transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 hover:opacity-85"
          style={{ background: "#E50914" }}
          aria-label="Send message"
          data-ocid="ai-chat-send"
        >
          <Send className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* Hint text */}
      <div
        className="flex-shrink-0 flex items-center justify-center gap-1 py-1.5 px-3"
        style={{ background: "#0f0f0f", borderTop: "1px solid #1f1f1f" }}
      >
        {isFallbackMode ? (
          <>
            <Zap className="w-3 h-3" style={{ color: "#52525b" }} />
            <span className="text-xs" style={{ color: "#52525b" }}>
              Server busy — tap &quot;Try Again&quot; or use quick help above
            </span>
          </>
        ) : (
          <span className="text-xs" style={{ color: "#3f3f46" }}>
            💡 Tip: Type &quot;Add Naruto&quot; to request anime
          </span>
        )}
      </div>
    </div>
  );
}

// Lazy placeholder — the ChatPanel DOM is only mounted on first open
const LazyChatPanel = lazy(
  () =>
    new Promise<{ default: typeof ChatPanel }>((resolve) =>
      setTimeout(() => resolve({ default: ChatPanel }), 0),
    ),
);

export default function AiChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  // Once opened, keep mounted so messages aren't lost on toggle
  const [hasOpened, setHasOpened] = useState(false);

  const handleToggle = () => {
    if (!hasOpened) setHasOpened(true);
    setIsOpen((prev) => !prev);
  };

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3"
      data-ocid="ai-chat-widget"
    >
      {/* Chat Window — lazy-rendered, kept in DOM after first open */}
      {hasOpened && (
        <div
          style={{
            display: isOpen ? "flex" : "none",
            flexDirection: "column",
          }}
        >
          <Suspense fallback={null}>
            <LazyChatPanel />
          </Suspense>
        </div>
      )}

      {/* Toggle Button */}
      <button
        type="button"
        onClick={handleToggle}
        className="w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 active:scale-95 hover:opacity-90"
        style={{ background: "#E50914" }}
        aria-label={isOpen ? "Close AI support chat" : "Open AI support chat"}
        data-ocid="ai-chat-toggle"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <MessageCircle className="w-6 h-6 text-white" />
        )}
      </button>
    </div>
  );
}
