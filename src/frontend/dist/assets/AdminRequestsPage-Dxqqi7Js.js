import { R as useAdminAuth, D as useNavigate, r as reactExports, j as jsxRuntimeExports, V as User, B as Button, a3 as RefreshCw, h as ue } from "./index-DnVaqzJ1.js";
import { A as AlertDialog, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, T as TriangleAlert, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction } from "./alert-dialog-BrPKe8hj.js";
import { u as useAnimeRequests, a as useMarkRequestComplete, b as useDeleteRequest, A as AdminLayout, I as Inbox, C as Clock } from "./AdminDashboardPage-B0v_yyfl.js";
import { L as LoaderCircle } from "./loader-circle-i9Bo2C9F.js";
import { C as CircleCheck } from "./circle-check-BTXy6LRG.js";
import { T as Trash2 } from "./trash-2-yHn8UtUi.js";
import "./useAds-BXyexzn5.js";
import "./star-D8XNwk1f.js";
import "./tv-CIfmeAcW.js";
const ADMIN_TOKEN = "adminfaheem123";
function formatDate(ts) {
  try {
    const ms = Number(ts) / 1e6;
    const d = new Date(ms);
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  } catch {
    return "—";
  }
}
function StatusBadge({ status }) {
  const isPending = status === "pending";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "span",
    {
      className: `inline-flex items-center gap-1.5 text-[10px] px-2 py-0.5 rounded-full font-semibold ${isPending ? "bg-amber-500/15 text-amber-400" : "bg-green-500/15 text-green-400"}`,
      children: [
        isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-2.5 h-2.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-2.5 h-2.5" }),
        isPending ? "Pending" : "Completed"
      ]
    }
  );
}
function RequestRowMobile({
  req,
  onComplete,
  onDelete
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "px-4 py-3.5 hover:bg-white/3 transition-colors",
      "data-ocid": `request-row-${req.id}`,
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center shrink-0 mt-0.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "w-3.5 h-3.5 text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground leading-snug break-words", children: req.requestText }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-1.5 flex-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-white/40 font-medium", children: req.username || "Anonymous" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white/20 text-[10px]", children: "•" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-white/30", children: formatDate(req.createdAt) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: req.status }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 shrink-0 ml-1", children: [
          req.status === "pending" && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: onComplete,
              "aria-label": "Mark complete",
              "data-ocid": `complete-request-${req.id}`,
              className: "p-2 rounded-lg text-white/40 hover:text-green-400 hover:bg-green-500/10 transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-3.5 h-3.5" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: onDelete,
              "aria-label": "Delete",
              "data-ocid": `delete-request-${req.id}`,
              className: "p-2 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5" })
            }
          )
        ] })
      ] })
    }
  );
}
function AdminRequestsPage() {
  const { isAdminLoggedIn } = useAdminAuth();
  const navigate = useNavigate();
  const {
    data: requests = [],
    isLoading,
    refetch,
    isRefetching
  } = useAnimeRequests(ADMIN_TOKEN);
  const markComplete = useMarkRequestComplete();
  const deleteRequest = useDeleteRequest();
  const [filter, setFilter] = reactExports.useState("all");
  const [deleteTarget, setDeleteTarget] = reactExports.useState(null);
  if (!isAdminLoggedIn) {
    navigate({ to: "/admin/login" });
    return null;
  }
  const pendingRequests = requests.filter((r) => r.status === "pending");
  const completedRequests = requests.filter((r) => r.status !== "pending");
  const filteredRequests = filter === "pending" ? pendingRequests : filter === "completed" ? completedRequests : requests;
  const handleComplete = async (req) => {
    try {
      await markComplete.mutateAsync({ id: req.id, adminToken: ADMIN_TOKEN });
      ue.success("Request marked as completed");
    } catch {
      ue.error("Failed to mark request as completed");
    }
  };
  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteRequest.mutateAsync({
        id: deleteTarget.id,
        adminToken: ADMIN_TOKEN
      });
      ue.success("Request deleted");
      setDeleteTarget(null);
    } catch {
      ue.error("Failed to delete request");
    }
  };
  const TABS = [
    { key: "all", label: "All", count: requests.length },
    { key: "pending", label: "Pending", count: pendingRequests.length },
    { key: "completed", label: "Completed", count: completedRequests.length }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    AdminLayout,
    {
      title: "Anime Requests",
      subtitle: pendingRequests.length === 0 ? "No pending requests" : `${pendingRequests.length} pending request${pendingRequests.length !== 1 ? "s" : ""}`,
      action: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          onClick: () => refetch(),
          disabled: isRefetching,
          variant: "outline",
          className: "border-white/15 text-foreground hover:bg-white/10 gap-2 h-9 md:h-10 text-xs md:text-sm",
          "data-ocid": "refresh-requests-btn",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              RefreshCw,
              {
                className: `w-4 h-4 ${isRefetching ? "animate-spin" : ""}`
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "Refresh" })
          ]
        }
      ),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 md:space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-3 gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-white/10 rounded-xl p-3.5 md:p-4 hover:border-white/20 transition-colors", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 mb-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 rounded-full bg-amber-400" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-white/40 font-medium", children: "Pending" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-display font-black text-foreground", children: pendingRequests.length }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-white/30 mt-0.5", children: "awaiting review" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-white/10 rounded-xl p-3.5 md:p-4 hover:border-white/20 transition-colors", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 mb-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 rounded-full bg-green-400" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-white/40 font-medium", children: "Completed" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-display font-black text-foreground", children: completedRequests.length }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-white/30 mt-0.5", children: "fulfilled" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-white/10 rounded-xl p-3.5 md:p-4 hover:border-white/20 transition-colors col-span-2 sm:col-span-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 mb-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 rounded-full bg-primary" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-white/40 font-medium", children: "Total" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-display font-black text-foreground", children: requests.length }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-white/30 mt-0.5", children: "all time" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "flex items-center gap-1 bg-card border border-white/10 rounded-xl p-1 w-fit",
              "data-ocid": "request-filter-tabs",
              children: TABS.map(({ key, label, count }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => setFilter(key),
                  "data-ocid": `filter-tab-${key}`,
                  className: `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === key ? "bg-primary/15 text-primary border border-primary/25 shadow-sm" : "text-white/50 hover:text-foreground hover:bg-white/8"}`,
                  children: [
                    label,
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: `text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${filter === key ? "bg-primary/20 text-primary" : "bg-white/10 text-white/40"}`,
                        children: count
                      }
                    )
                  ]
                },
                key
              ))
            }
          ),
          isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center py-20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-6 h-6 animate-spin text-primary" }) }) : filteredRequests.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "bg-card border border-white/10 rounded-xl py-20 text-center space-y-3",
              "data-ocid": "empty-requests",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Inbox, { className: "w-12 h-12 text-white/20 mx-auto" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/40 text-sm font-medium", children: filter === "all" ? "No anime requests yet" : filter === "pending" ? "No pending requests" : "No completed requests" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/25 text-xs", children: "Users can request anime via the AI chat assistant" })
              ]
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-white/10 rounded-xl overflow-hidden", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "table",
              {
                className: "w-full text-sm hidden md:table",
                "data-ocid": "requests-table",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-white/3 border-b border-white/10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-5 py-3 text-[10px] font-semibold text-white/40 uppercase tracking-widest", children: "Request" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 text-[10px] font-semibold text-white/40 uppercase tracking-widest w-32", children: "User" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 text-[10px] font-semibold text-white/40 uppercase tracking-widest w-28", children: "Status" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 text-[10px] font-semibold text-white/40 uppercase tracking-widest w-44 hidden lg:table-cell", children: "Date" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-5 py-3 text-[10px] font-semibold text-white/40 uppercase tracking-widest w-28", children: "Actions" })
                  ] }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-white/5", children: filteredRequests.map((req) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "tr",
                    {
                      className: "hover:bg-white/3 transition-colors",
                      "data-ocid": `request-row-${req.id}`,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground break-words max-w-xs lg:max-w-sm", children: req.requestText }) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3.5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-5 h-5 rounded-full bg-primary/15 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "w-2.5 h-2.5 text-primary" }) }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-white/60 truncate max-w-[100px]", children: req.username || "Anonymous" })
                        ] }) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: req.status }) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3.5 hidden lg:table-cell", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-white/40", children: formatDate(req.createdAt) }) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-1", children: [
                          req.status === "pending" && /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "button",
                            {
                              type: "button",
                              onClick: () => handleComplete(req),
                              "aria-label": "Mark complete",
                              "data-ocid": `complete-request-${req.id}`,
                              title: "Mark as completed",
                              className: "p-2 rounded-lg text-white/40 hover:text-green-400 hover:bg-green-500/10 transition-colors min-h-[36px]",
                              children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-3.5 h-3.5" })
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "button",
                            {
                              type: "button",
                              onClick: () => setDeleteTarget(req),
                              "aria-label": "Delete",
                              "data-ocid": `delete-request-${req.id}`,
                              title: "Delete request",
                              className: "p-2 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors min-h-[36px]",
                              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5" })
                            }
                          )
                        ] }) })
                      ]
                    },
                    req.id
                  )) })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "md:hidden divide-y divide-white/5", children: filteredRequests.map((req) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              RequestRowMobile,
              {
                req,
                onComplete: () => handleComplete(req),
                onDelete: () => setDeleteTarget(req)
              },
              req.id
            )) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          AlertDialog,
          {
            open: !!deleteTarget,
            onOpenChange: (open) => !open && setDeleteTarget(null),
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { className: "bg-card border-white/15 text-foreground w-[calc(100vw-2rem)] max-w-md mx-auto", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogTitle, { className: "flex items-center gap-2 font-display", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-5 h-5 text-destructive" }),
                  "Delete Request"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { className: "text-white/50", children: "Delete this request? This cannot be undone." })
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
                    "data-ocid": "request-delete-confirm",
                    className: "bg-destructive hover:bg-destructive/90 text-destructive-foreground",
                    children: deleteRequest.isPending ? "Deleting..." : "Delete"
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
  AdminRequestsPage as default
};
