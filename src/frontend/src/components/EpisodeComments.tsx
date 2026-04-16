import { formatDistanceToNow } from "date-fns";
import {
  Check,
  MessageCircle,
  Pencil,
  Reply,
  Send,
  Star,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../hooks/useAuth";
import {
  useAddComment,
  useAddRating,
  useCommentsByEpisode,
  useDeleteComment,
  useEditComment,
  useRatingsInfo,
} from "../hooks/useComments";
import type { Comment } from "../types";

const MAX_CHARS = 500;

// ── Star Rating ────────────────────────────────────────────────────────────

interface StarRatingProps {
  episodeId: string;
  isLoggedIn: boolean;
}

function StarRating({ episodeId, isLoggedIn }: StarRatingProps) {
  const { data: ratingsInfo } = useRatingsInfo(episodeId);
  const { mutate: addRating, isPending } = useAddRating();
  const [hovered, setHovered] = useState<number | null>(null);

  const userRating = ratingsInfo?.userRating ?? 0;
  const displayRating = hovered ?? userRating;
  const average = ratingsInfo?.average ?? 0;
  const total = ratingsInfo?.total ?? 0;

  const handleRate = (stars: number) => {
    if (!isLoggedIn) {
      toast.error("Please login to rate this episode");
      return;
    }
    addRating(
      { episodeId, stars },
      {
        onSuccess: () =>
          toast.success(
            `You rated this episode ${stars} star${stars !== 1 ? "s" : ""}!`,
          ),
        onError: () => toast.error("Failed to submit rating"),
      },
    );
  };

  return (
    <div
      className="flex flex-col sm:flex-row sm:items-center gap-3"
      data-ocid="episode-rating"
    >
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={isPending || !isLoggedIn}
            aria-label={`Rate ${star} star${star !== 1 ? "s" : ""}`}
            onClick={() => handleRate(star)}
            onMouseEnter={() => isLoggedIn && setHovered(star)}
            onMouseLeave={() => setHovered(null)}
            className="transition-transform duration-100 hover:scale-110 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 rounded"
          >
            <Star
              className={[
                "w-7 h-7 transition-colors duration-150",
                displayRating >= star
                  ? "fill-yellow-400 text-yellow-400"
                  : "fill-transparent text-muted-foreground",
              ].join(" ")}
            />
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 text-sm">
        {total > 0 ? (
          <>
            <span className="text-yellow-400 font-bold">
              {average.toFixed(1)}
            </span>
            <span className="text-muted-foreground">/ 5</span>
            <span className="text-muted-foreground">
              ({total} rating{total !== 1 ? "s" : ""})
            </span>
          </>
        ) : (
          <span className="text-muted-foreground">No ratings yet</span>
        )}
        {!isLoggedIn && (
          <span className="text-muted-foreground text-xs ml-1">
            — Login to rate
          </span>
        )}
      </div>
    </div>
  );
}

// ── Comment Form ────────────────────────────────────────────────────────────

interface CommentFormProps {
  episodeId: string;
  parentId?: string;
  onCancel?: () => void;
  autoFocus?: boolean;
}

function CommentForm({
  episodeId,
  parentId,
  onCancel,
  autoFocus,
}: CommentFormProps) {
  const [text, setText] = useState("");
  const { mutate: addComment, isPending } = useAddComment();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (autoFocus) {
      textareaRef.current?.focus();
    }
  }, [autoFocus]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    addComment(
      { episodeId, text: trimmed, parentId },
      {
        onSuccess: () => {
          setText("");
          onCancel?.();
          toast.success("Comment posted!");
        },
        onError: () => toast.error("Failed to post comment"),
      },
    );
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      {!parentId && (
        <label
          htmlFor="comment-input"
          className="text-sm font-medium text-foreground"
        >
          Write a comment
        </label>
      )}
      <div className="relative">
        <textarea
          ref={textareaRef}
          id={parentId ? "reply-input" : "comment-input"}
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, MAX_CHARS))}
          placeholder={parentId ? "Write a reply…" : "Write a comment…"}
          rows={3}
          className="w-full bg-card border border-border focus:border-primary text-foreground placeholder:text-muted-foreground rounded-lg px-3 pt-2 pb-7 text-sm resize-none outline-none transition-colors duration-200"
          data-ocid={parentId ? "reply-input" : "comment-input"}
        />
        <span
          className={[
            "absolute bottom-2 right-3 text-xs pointer-events-none",
            text.length >= MAX_CHARS
              ? "text-destructive"
              : "text-muted-foreground",
          ].join(" ")}
        >
          {text.length}/{MAX_CHARS}
        </span>
      </div>
      <div className="flex gap-2 justify-end">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-1.5 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-card transition-colors duration-150"
            data-ocid="cancel-reply-btn"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={!text.trim() || isPending}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-md text-sm font-semibold bg-primary hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground text-primary-foreground transition-colors duration-150"
          data-ocid="submit-comment-btn"
        >
          <Send className="w-3.5 h-3.5" />
          {isPending ? "Posting…" : parentId ? "Reply" : "Post"}
        </button>
      </div>
    </form>
  );
}

// ── Single Comment ──────────────────────────────────────────────────────────

interface CommentItemProps {
  comment: Comment;
  episodeId: string;
  currentUserId: string | null;
  isReply?: boolean;
}

function CommentItem({
  comment,
  episodeId,
  currentUserId,
  isReply,
}: CommentItemProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.text);
  const editTextareaRef = useRef<HTMLTextAreaElement>(null);
  const { mutate: editComment, isPending: isEditPending } = useEditComment();
  const { mutate: deleteComment, isPending: isDeletePending } =
    useDeleteComment();

  useEffect(() => {
    if (isEditing) {
      editTextareaRef.current?.focus();
    }
  }, [isEditing]);

  const isOwner = !!currentUserId && currentUserId === comment.authorId;
  const avatarLetter = comment.authorUsername?.[0]?.toUpperCase() ?? "?";
  const timeAgo = formatDistanceToNow(new Date(comment.createdAt), {
    addSuffix: true,
  });

  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = editText.trim();
    if (!trimmed) return;
    editComment(
      { commentId: comment.id, newText: trimmed, episodeId },
      {
        onSuccess: () => {
          setIsEditing(false);
          toast.success("Comment updated");
        },
        onError: () => toast.error("Failed to update comment"),
      },
    );
  };

  const handleDelete = () => {
    if (!window.confirm("Delete this comment?")) return;
    deleteComment(
      { commentId: comment.id, episodeId },
      {
        onSuccess: () => toast.success("Comment deleted"),
        onError: () => toast.error("Failed to delete comment"),
      },
    );
  };

  if (comment.isDeleted) {
    return (
      <div className={["py-2", isReply ? "" : ""].join(" ")}>
        <p className="text-muted-foreground text-sm italic">
          [Comment deleted]
        </p>
      </div>
    );
  }

  return (
    <div className="group" data-ocid={`comment-${comment.id}`}>
      <div className="flex gap-3">
        {/* Avatar */}
        <div
          className="w-8 h-8 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center flex-shrink-0 mt-0.5"
          aria-hidden="true"
        >
          <span className="text-primary text-xs font-bold">{avatarLetter}</span>
        </div>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-foreground font-semibold text-sm">
              {comment.authorUsername}
            </span>
            <span className="text-muted-foreground text-xs">{timeAgo}</span>
            {comment.updatedAt && comment.updatedAt !== comment.createdAt && (
              <span className="text-muted-foreground text-xs">(edited)</span>
            )}
          </div>

          {/* Text or edit form */}
          {isEditing ? (
            <form onSubmit={handleEdit} className="mt-2 flex flex-col gap-2">
              <div className="relative">
                <textarea
                  ref={editTextareaRef}
                  value={editText}
                  onChange={(e) =>
                    setEditText(e.target.value.slice(0, MAX_CHARS))
                  }
                  rows={2}
                  className="w-full bg-card border border-border focus:border-primary text-foreground rounded-lg px-3 pt-2 pb-6 text-sm resize-none outline-none transition-colors duration-200"
                  data-ocid="edit-comment-input"
                />
                <span className="absolute bottom-1.5 right-2 text-[11px] text-muted-foreground pointer-events-none">
                  {editText.length}/{MAX_CHARS}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={!editText.trim() || isEditPending}
                  className="flex items-center gap-1 px-3 py-1 rounded text-xs font-semibold bg-primary hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground text-primary-foreground transition-colors"
                  data-ocid="save-edit-btn"
                >
                  <Check className="w-3 h-3" />
                  {isEditPending ? "Saving…" : "Save"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setEditText(comment.text);
                  }}
                  className="flex items-center gap-1 px-3 py-1 rounded text-xs text-muted-foreground hover:text-foreground hover:bg-card transition-colors"
                  data-ocid="cancel-edit-btn"
                >
                  <X className="w-3 h-3" /> Cancel
                </button>
              </div>
            </form>
          ) : (
            <p className="text-foreground text-sm mt-1 break-words">
              {comment.text}
            </p>
          )}

          {/* Action row */}
          {!isEditing && (
            <div className="flex items-center gap-3 mt-2">
              {!isReply && (
                <button
                  type="button"
                  onClick={() => setShowReplyForm((v) => !v)}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors duration-150"
                  data-ocid="reply-btn"
                >
                  <Reply className="w-3.5 h-3.5" />
                  Reply
                </button>
              )}
              {isOwner && (
                <>
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors duration-150 opacity-0 group-hover:opacity-100"
                    data-ocid="edit-comment-btn"
                  >
                    <Pencil className="w-3 h-3" />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={isDeletePending}
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors duration-150 opacity-0 group-hover:opacity-100"
                    data-ocid="delete-comment-btn"
                  >
                    <Trash2 className="w-3 h-3" />
                    {isDeletePending ? "Deleting…" : "Delete"}
                  </button>
                </>
              )}
            </div>
          )}

          {/* Inline reply form */}
          {showReplyForm && (
            <div className="mt-3">
              <CommentForm
                episodeId={episodeId}
                parentId={comment.id}
                onCancel={() => setShowReplyForm(false)}
                autoFocus
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main EpisodeComments component ─────────────────────────────────────────

interface EpisodeCommentsProps {
  episodeId: string;
  animeId: string;
}

const TOP_LEVEL_PAGE_SIZE = 10;

export function EpisodeComments({
  episodeId,
  animeId: _animeId,
}: EpisodeCommentsProps) {
  void _animeId;
  const { isLoggedIn, principalId } = useAuth();
  const { data: comments = [], isLoading } = useCommentsByEpisode(episodeId);
  const [showCount, setShowCount] = useState(TOP_LEVEL_PAGE_SIZE);

  // Organize: top-level vs replies
  const topLevel = comments
    .filter((c) => !c.parentId && !c.isDeleted)
    .sort((a, b) => b.createdAt - a.createdAt);

  const repliesFor = (parentId: string) =>
    comments
      .filter((c) => c.parentId === parentId)
      .sort((a, b) => a.createdAt - b.createdAt);

  const visibleTopLevel = topLevel.slice(0, showCount);
  const hasMore = topLevel.length > showCount;
  const totalVisible = comments.filter((c) => !c.isDeleted).length;

  return (
    <div
      className="bg-background border-t border-border"
      data-ocid="episode-comments"
    >
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* ── Rating Section ── */}
        <div className="space-y-2">
          <h3 className="text-foreground font-semibold text-base flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-400" />
            Rate This Episode
          </h3>
          <StarRating episodeId={episodeId} isLoggedIn={isLoggedIn} />
        </div>

        <div className="border-t border-border" />

        {/* ── Comments Section ── */}
        <div className="space-y-4">
          <h3 className="text-foreground font-semibold text-base flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-primary" />
            Comments
            {totalVisible > 0 && (
              <span className="text-muted-foreground text-sm font-normal">
                ({totalVisible})
              </span>
            )}
          </h3>

          {/* Comment form or login prompt */}
          {isLoggedIn ? (
            <CommentForm episodeId={episodeId} />
          ) : (
            <div
              className="rounded-lg border border-border bg-card px-4 py-3 text-sm text-muted-foreground text-center"
              data-ocid="login-to-comment"
            >
              <span>Login with Internet Identity to leave a comment</span>
            </div>
          )}

          {/* Comments list */}
          {isLoading ? (
            <div className="space-y-4" data-ocid="comments-loading">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-3 animate-pulse">
                  <div className="w-8 h-8 rounded-full bg-muted flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-muted rounded w-32" />
                    <div className="h-3 bg-muted rounded w-full" />
                    <div className="h-3 bg-muted rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : topLevel.length === 0 ? (
            <div
              className="text-center py-8 text-muted-foreground text-sm"
              data-ocid="comments-empty"
            >
              No comments yet. Be the first to share your thoughts!
            </div>
          ) : (
            <div className="space-y-5" data-ocid="comments-list">
              {visibleTopLevel.map((comment) => {
                const replies = repliesFor(comment.id);
                return (
                  <div key={comment.id}>
                    <CommentItem
                      comment={comment}
                      episodeId={episodeId}
                      currentUserId={principalId}
                    />
                    {/* Replies */}
                    {replies.length > 0 && (
                      <div className="ml-11 mt-3 pl-3 border-l-2 border-border space-y-4">
                        {replies.map((reply) => (
                          <CommentItem
                            key={reply.id}
                            comment={reply}
                            episodeId={episodeId}
                            currentUserId={principalId}
                            isReply
                          />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              {hasMore && (
                <button
                  type="button"
                  onClick={() => setShowCount((n) => n + TOP_LEVEL_PAGE_SIZE)}
                  className="w-full py-2.5 text-sm text-muted-foreground hover:text-foreground border border-border hover:border-input rounded-lg transition-colors duration-150"
                  data-ocid="load-more-comments"
                >
                  Load more comments ({topLevel.length - showCount} remaining)
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
