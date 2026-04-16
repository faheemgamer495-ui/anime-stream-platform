/**
 * PreviewAdminRequestsPage — /preview/admin/requests
 * Anime requests management with filter tabs, using React Query hooks.
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
import { useNavigate } from "@tanstack/react-router";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Inbox,
  Loader2,
  RefreshCw,
  Trash2,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PreviewAdminLayout } from "../components/PreviewAdminLayout";
import { useAdminAuth } from "../hooks/useAdminAuth";
import {
  useAnimeRequests,
  useDeleteRequest,
  useMarkRequestComplete,
} from "../hooks/useRequests";
import type { AnimeRequest } from "../types";

type FilterTab = "all" | "pending" | "completed";

function formatDate(ts: bigint | number): string {
  try {
    const ms = typeof ts === "bigint" ? Number(ts) : ts;
    const d = new Date(ms > 1e15 ? ms / 1_000_000 : ms);
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "—";
  }
}

function StatusBadge({ status }: { status: string }) {
  const isPending = status === "pending";
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[10px] px-2 py-0.5 rounded-full font-semibold ${
        isPending
          ? "bg-amber-500/15 text-amber-400"
          : "bg-green-500/15 text-green-400"
      }`}
    >
      {isPending ? (
        <Clock className="w-2.5 h-2.5" />
      ) : (
        <CheckCircle2 className="w-2.5 h-2.5" />
      )}
      {isPending ? "Pending" : "Completed"}
    </span>
  );
}

export default function PreviewAdminRequestsPage() {
  const { isAdminLoggedIn } = useAdminAuth();
  const navigate = useNavigate();

  const { data: requests = [], isLoading, refetch } = useAnimeRequests();
  const markComplete = useMarkRequestComplete();
  const deleteRequest = useDeleteRequest();

  const [filter, setFilter] = useState<FilterTab>("all");
  const [deleteTarget, setDeleteTarget] = useState<AnimeRequest | null>(null);

  useEffect(() => {
    if (!isAdminLoggedIn) navigate({ to: "/preview/login" });
  }, [isAdminLoggedIn, navigate]);

  if (!isAdminLoggedIn) return null;

  const pendingRequests = requests.filter((r) => r.status === "pending");
  const completedRequests = requests.filter((r) => r.status !== "pending");

  const filteredRequests =
    filter === "pending"
      ? pendingRequests
      : filter === "completed"
        ? completedRequests
        : requests;

  const handleRefresh = () => {
    refetch().catch(console.error);
  };

  const handleComplete = async (req: AnimeRequest) => {
    try {
      await markComplete.mutateAsync({ id: req.id });
      toast.success("Request marked as completed");
    } catch {
      toast.error("Failed to update request");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteRequest.mutateAsync({ id: deleteTarget.id });
      toast.success("Request deleted");
      setDeleteTarget(null);
    } catch {
      toast.error("Failed to delete request");
    }
  };

  const TABS: { key: FilterTab; label: string; count: number }[] = [
    { key: "all", label: "All", count: requests.length },
    { key: "pending", label: "Pending", count: pendingRequests.length },
    { key: "completed", label: "Completed", count: completedRequests.length },
  ];

  return (
    <PreviewAdminLayout
      title="Anime Requests"
      subtitle={
        pendingRequests.length === 0
          ? "No pending requests"
          : `${pendingRequests.length} pending request${pendingRequests.length !== 1 ? "s" : ""}`
      }
      action={
        <Button
          onClick={handleRefresh}
          disabled={isLoading}
          variant="outline"
          className="border-white/15 text-foreground hover:bg-white/10 gap-2 h-9 md:h-10 text-xs md:text-sm"
          data-ocid="preview-refresh-requests-btn"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          <span className="hidden sm:inline">Refresh</span>
        </Button>
      }
    >
      <div className="space-y-4 md:space-y-6">
        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          {[
            {
              label: "Pending",
              value: pendingRequests.length,
              color: "text-amber-400",
              dot: "bg-amber-400",
              sub: "awaiting review",
            },
            {
              label: "Completed",
              value: completedRequests.length,
              color: "text-green-400",
              dot: "bg-green-400",
              sub: "fulfilled",
            },
            {
              label: "Total",
              value: requests.length,
              color: "text-primary",
              dot: "bg-primary",
              sub: "all time",
            },
          ].map(({ label, value, color, dot, sub }) => (
            <div
              key={label}
              className="bg-card border border-white/10 rounded-xl p-3.5 md:p-4 hover:border-white/20 transition-colors"
            >
              <div className="flex items-center gap-1.5 mb-2">
                <span className={`w-2 h-2 rounded-full ${dot}`} />
                <p className="text-[10px] text-white/40 font-medium">{label}</p>
              </div>
              <p className={`text-2xl font-display font-black ${color}`}>
                {value}
              </p>
              <p className="text-[10px] text-white/30 mt-0.5">{sub}</p>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div
          className="flex items-center gap-1 bg-card border border-white/10 rounded-xl p-1 w-fit"
          data-ocid="preview-request-filter-tabs"
        >
          {TABS.map(({ key, label, count }) => (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              data-ocid={`preview-filter-tab-${key}`}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filter === key
                  ? "bg-primary/15 text-primary border border-primary/25 shadow-sm"
                  : "text-white/50 hover:text-foreground hover:bg-white/8"
              }`}
            >
              {label}
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${filter === key ? "bg-primary/20 text-primary" : "bg-white/10 text-white/40"}`}
              >
                {count}
              </span>
            </button>
          ))}
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : filteredRequests.length === 0 ? (
          <div
            className="bg-card border border-white/10 rounded-xl py-20 text-center space-y-3"
            data-ocid="preview-empty-requests"
          >
            <Inbox className="w-12 h-12 text-white/20 mx-auto" />
            <p className="text-white/40 text-sm font-medium">
              {filter === "all"
                ? "No anime requests yet"
                : filter === "pending"
                  ? "No pending requests"
                  : "No completed requests"}
            </p>
            <p className="text-white/25 text-xs">
              Users can request anime via the AI chat assistant
            </p>
          </div>
        ) : (
          <div className="bg-card border border-white/10 rounded-xl overflow-hidden">
            {/* Desktop table */}
            <table
              className="w-full text-sm hidden md:table"
              data-ocid="preview-requests-table"
            >
              <thead className="bg-white/3 border-b border-white/10">
                <tr>
                  <th className="text-left px-5 py-3 text-[10px] font-semibold text-white/40 uppercase tracking-widest">
                    Request
                  </th>
                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/40 uppercase tracking-widest w-32">
                    User
                  </th>
                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/40 uppercase tracking-widest w-28">
                    Status
                  </th>
                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/40 uppercase tracking-widest w-44 hidden lg:table-cell">
                    Date
                  </th>
                  <th className="text-right px-5 py-3 text-[10px] font-semibold text-white/40 uppercase tracking-widest w-28">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredRequests.map((req, idx) => (
                  <tr
                    key={req.id}
                    className="hover:bg-white/3 transition-colors"
                    data-ocid={`preview-request-row.${idx + 1}`}
                  >
                    <td className="px-5 py-3.5">
                      <p className="text-sm font-medium text-foreground break-words max-w-xs lg:max-w-sm">
                        {req.requestText}
                      </p>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                          <User className="w-2.5 h-2.5 text-primary" />
                        </div>
                        <span className="text-xs text-white/60 truncate max-w-[100px]">
                          {req.username || "Anonymous"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={req.status} />
                    </td>
                    <td className="px-4 py-3.5 hidden lg:table-cell">
                      <span className="text-xs text-white/40">
                        {formatDate(req.createdAt)}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="inline-flex items-center gap-1">
                        {req.status === "pending" && (
                          <button
                            type="button"
                            onClick={() => handleComplete(req)}
                            aria-label="Mark complete"
                            data-ocid={`preview-complete-request.${idx + 1}`}
                            title="Mark as completed"
                            className="p-2 rounded-lg text-white/40 hover:text-green-400 hover:bg-green-500/10 transition-colors min-h-[36px]"
                            disabled={markComplete.isPending}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(req)}
                          aria-label="Delete"
                          data-ocid={`preview-delete-request.${idx + 1}`}
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
              {filteredRequests.map((req, idx) => (
                <div
                  key={req.id}
                  className="px-4 py-3.5 hover:bg-white/3 transition-colors"
                  data-ocid={`preview-request-row.${idx + 1}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center shrink-0 mt-0.5">
                      <User className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground leading-snug break-words">
                        {req.requestText}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <span className="text-[10px] text-white/40 font-medium">
                          {req.username || "Anonymous"}
                        </span>
                        <span className="text-white/20 text-[10px]">•</span>
                        <span className="text-[10px] text-white/30">
                          {formatDate(req.createdAt)}
                        </span>
                      </div>
                      <div className="mt-1.5">
                        <StatusBadge status={req.status} />
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0 ml-1">
                      {req.status === "pending" && (
                        <button
                          type="button"
                          onClick={() => handleComplete(req)}
                          aria-label="Mark complete"
                          data-ocid={`preview-complete-request-mobile.${idx + 1}`}
                          className="p-2 rounded-lg text-white/40 hover:text-green-400 hover:bg-green-500/10 transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
                          disabled={markComplete.isPending}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(req)}
                        aria-label="Delete"
                        data-ocid={`preview-delete-request-mobile.${idx + 1}`}
                        className="p-2 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Delete confirmation */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent className="bg-card border-white/15 text-foreground w-[calc(100vw-2rem)] max-w-md mx-auto">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 font-display">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              Delete Request
            </AlertDialogTitle>
            <AlertDialogDescription className="text-white/50">
              Delete this request? This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setDeleteTarget(null)}
              className="border-white/15 text-foreground hover:bg-white/10"
              data-ocid="preview-request-delete-cancel"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              data-ocid="preview-request-delete-confirm"
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              {deleteRequest.isPending ? (
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
