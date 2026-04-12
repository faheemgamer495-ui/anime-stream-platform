import { c as createLucideIcon, R as useAdminAuth, D as useNavigate, r as reactExports, j as jsxRuntimeExports, B as Button, U as Label, W as Input, h as ue } from "./index-EgDyTYGb.js";
import { A as AlertDialog, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, T as TriangleAlert, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction } from "./alert-dialog-CTBOrQlX.js";
import { B as Badge } from "./badge-DoY1tOCt.js";
import { P as Pen, D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, S as Select, d as SelectTrigger, e as SelectValue, f as SelectContent, g as SelectItem } from "./select-DmEclI_k.js";
import { S as Switch } from "./switch-BadIqKMR.js";
import { a as useAllAds, b as useCreateAd, c as useUpdateAd, d as useDeleteAd } from "./useAds-BrDSk_pZ.js";
import { A as AdminLayout, M as Megaphone } from "./AdminDashboardPage-Bh4uuf3a.js";
import { L as LoaderCircle } from "./loader-circle-CVDrokuk.js";
import { P as Plus } from "./plus-CCOzFWtb.js";
import { T as Trash2 } from "./trash-2-CmuSVtds.js";
import "./index-RDfOIdd_.js";
import "./chevron-down-w1cgg2bK.js";
import "./check-CqKCVtSR.js";
import "./chevron-up-h77nSeZm.js";
import "./star-Dex4ctD4.js";
import "./tv-YOY82xAF.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", ry: "2", key: "1m3agn" }],
  ["circle", { cx: "9", cy: "9", r: "2", key: "af1f0g" }],
  ["path", { d: "m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21", key: "1xmnt7" }]
];
const Image = createLucideIcon("image", __iconNode$1);
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
      d: "m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5",
      key: "ftymec"
    }
  ],
  ["rect", { x: "2", y: "6", width: "14", height: "12", rx: "2", key: "158x01" }]
];
const Video = createLucideIcon("video", __iconNode);
const EMPTY_FORM = {
  placement: "homepage_banner",
  title: "",
  imageUrl: "",
  targetUrl: "",
  videoUrl: "",
  isEnabled: true
};
const PLACEMENT_LABELS = {
  homepage_banner: "Homepage Banner",
  video_pre_roll: "Video Pre-roll",
  video_mid_roll: "Video Mid-roll",
  sidebar: "Sidebar"
};
const PLACEMENT_COLORS = {
  homepage_banner: "bg-blue-500/15 text-blue-400",
  video_pre_roll: "bg-purple-500/15 text-purple-400",
  video_mid_roll: "bg-amber-500/15 text-amber-400",
  sidebar: "bg-green-500/15 text-green-400"
};
const PLACEMENT_DOT = {
  homepage_banner: "bg-blue-400",
  video_pre_roll: "bg-purple-400",
  video_mid_roll: "bg-amber-400",
  sidebar: "bg-green-400"
};
function AdCardMobile({
  ad,
  onEdit,
  onDelete,
  onToggle
}) {
  const isVideo = !!ad.videoUrl;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex items-start gap-3 px-4 py-3.5 hover:bg-white/3 transition-colors",
      "data-ocid": `ad-row-${ad.id}`,
      children: [
        ad.imageUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: ad.imageUrl,
            alt: ad.title,
            className: "w-14 h-8 object-cover rounded shrink-0 mt-0.5"
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-8 bg-white/5 rounded flex items-center justify-center shrink-0 mt-0.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Megaphone, { className: "w-3.5 h-3.5 text-white/30" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground truncate text-sm", children: ad.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-1 flex-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                className: `text-[10px] px-1.5 py-0.5 rounded-full font-semibold inline-flex items-center gap-1 ${PLACEMENT_COLORS[ad.placement]}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: `w-1.5 h-1.5 rounded-full ${PLACEMENT_DOT[ad.placement]}`
                    }
                  ),
                  PLACEMENT_LABELS[ad.placement]
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-0.5 text-[10px] text-white/40", children: [
              isVideo ? /* @__PURE__ */ jsxRuntimeExports.jsx(Video, { className: "w-2.5 h-2.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { className: "w-2.5 h-2.5" }),
              isVideo ? "Video" : "Banner"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Switch,
            {
              checked: ad.isEnabled,
              onCheckedChange: onToggle,
              "aria-label": `Toggle "${ad.title}"`,
              "data-ocid": `ad-toggle-${ad.id}`
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: onEdit,
              "data-ocid": `edit-ad-${ad.id}`,
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
              "data-ocid": `delete-ad-${ad.id}`,
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
function AdminAdsPage() {
  const { isAdminLoggedIn } = useAdminAuth();
  const navigate = useNavigate();
  const { data: ads = [], isLoading } = useAllAds();
  const createAd = useCreateAd();
  const updateAd = useUpdateAd();
  const deleteAd = useDeleteAd();
  const [showForm, setShowForm] = reactExports.useState(false);
  const [editingAd, setEditingAd] = reactExports.useState(null);
  const [form, setForm] = reactExports.useState(EMPTY_FORM);
  const [deleteTarget, setDeleteTarget] = reactExports.useState(null);
  if (!isAdminLoggedIn) {
    navigate({ to: "/admin/login" });
    return null;
  }
  const openCreate = () => {
    setEditingAd(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };
  const openEdit = (ad) => {
    setEditingAd(ad);
    setForm({
      placement: ad.placement,
      title: ad.title,
      imageUrl: ad.imageUrl,
      targetUrl: ad.targetUrl,
      videoUrl: ad.videoUrl ?? "",
      isEnabled: ad.isEnabled
    });
    setShowForm(true);
  };
  const handleToggle = async (ad) => {
    try {
      await updateAd.mutateAsync({
        id: ad.id,
        data: { isEnabled: !ad.isEnabled }
      });
      ue.success(
        `Ad "${ad.title}" ${!ad.isEnabled ? "enabled" : "disabled"}`
      );
    } catch {
      ue.error("Failed to update ad");
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.imageUrl) {
      ue.error("Title and image URL are required");
      return;
    }
    try {
      if (editingAd) {
        await updateAd.mutateAsync({ id: editingAd.id, data: form });
        ue.success(`Ad "${form.title}" updated`);
      } else {
        await createAd.mutateAsync(form);
        ue.success(`Ad "${form.title}" created`);
      }
      setShowForm(false);
    } catch {
      ue.error("Failed to save ad");
    }
  };
  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteAd.mutateAsync(deleteTarget.id);
      ue.success(`Ad "${deleteTarget.title}" deleted`);
      setDeleteTarget(null);
    } catch {
      ue.error("Failed to delete ad");
    }
  };
  const isSaving = createAd.isPending || updateAd.isPending;
  const enabledCount = ads.filter((a) => a.isEnabled).length;
  const placementStats = Object.keys(PLACEMENT_LABELS).map((p) => ({
    placement: p,
    total: ads.filter((a) => a.placement === p).length,
    enabled: ads.filter((a) => a.placement === p && a.isEnabled).length
  }));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    AdminLayout,
    {
      title: "Ad Management",
      subtitle: `${ads.length} ads configured · ${enabledCount} enabled`,
      action: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          onClick: openCreate,
          className: "bg-primary hover:bg-primary/90 gap-2 h-9 md:h-10 text-xs md:text-sm",
          "data-ocid": "add-ad-btn",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "Add Ad" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sm:hidden", children: "Add" })
          ]
        }
      ),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 md:space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-3", children: placementStats.map(({ placement, total, enabled }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "bg-card border border-white/10 rounded-xl p-3.5 md:p-4 hover:border-white/20 transition-colors",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 mb-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: `w-2 h-2 rounded-full ${PLACEMENT_DOT[placement]}`
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-white/40 font-medium truncate", children: PLACEMENT_LABELS[placement] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl md:text-2xl font-display font-black text-foreground", children: total }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-white/30 mt-0.5", children: [
                  enabled,
                  " active"
                ] })
              ]
            },
            placement
          )) }),
          isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center py-16", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-6 h-6 animate-spin text-primary" }) }) : ads.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "bg-card border border-white/10 rounded-xl py-16 text-center space-y-3",
              "data-ocid": "empty-ads",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Megaphone, { className: "w-12 h-12 text-white/20 mx-auto" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/40 text-sm", children: "No ads configured yet" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    onClick: openCreate,
                    size: "sm",
                    className: "bg-primary hover:bg-primary/90 gap-2",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
                      "Add First Ad"
                    ]
                  }
                )
              ]
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-white/10 rounded-xl overflow-hidden", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "table",
              {
                className: "w-full text-sm hidden md:table",
                "data-ocid": "ads-table",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-white/3 border-b border-white/10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-5 py-3 text-[10px] font-semibold text-white/40 uppercase tracking-widest", children: "Ad" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 text-[10px] font-semibold text-white/40 uppercase tracking-widest hidden md:table-cell", children: "Placement" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 text-[10px] font-semibold text-white/40 uppercase tracking-widest hidden lg:table-cell", children: "Type" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-center px-4 py-3 text-[10px] font-semibold text-white/40 uppercase tracking-widest", children: "Enabled" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-5 py-3 text-[10px] font-semibold text-white/40 uppercase tracking-widest", children: "Actions" })
                  ] }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-white/5", children: ads.map((ad) => {
                    const isVideoAd = !!ad.videoUrl;
                    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "tr",
                      {
                        className: "hover:bg-white/3 transition-colors",
                        "data-ocid": `ad-row-${ad.id}`,
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                            ad.imageUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "img",
                              {
                                src: ad.imageUrl,
                                alt: ad.title,
                                className: "w-20 h-11 object-cover rounded shrink-0"
                              }
                            ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-11 bg-white/5 rounded flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Megaphone, { className: "w-4 h-4 text-white/20" }) }),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground truncate max-w-[180px] text-sm", children: ad.title }),
                              ad.targetUrl && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-white/40 font-mono truncate max-w-[180px]", children: ad.targetUrl })
                            ] })
                          ] }) }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 hidden md:table-cell", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            "span",
                            {
                              className: `text-[10px] px-2 py-0.5 rounded-full font-semibold inline-flex items-center gap-1.5 ${PLACEMENT_COLORS[ad.placement]}`,
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx(
                                  "span",
                                  {
                                    className: `w-1.5 h-1.5 rounded-full ${PLACEMENT_DOT[ad.placement]}`
                                  }
                                ),
                                PLACEMENT_LABELS[ad.placement]
                              ]
                            }
                          ) }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 hidden lg:table-cell", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            Badge,
                            {
                              variant: "secondary",
                              className: "gap-1 text-[10px] bg-white/8 text-white/50 border-0",
                              children: [
                                isVideoAd ? /* @__PURE__ */ jsxRuntimeExports.jsx(Video, { className: "w-3 h-3" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { className: "w-3 h-3" }),
                                isVideoAd ? "Video" : "Banner"
                              ]
                            }
                          ) }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                            Switch,
                            {
                              checked: ad.isEnabled,
                              onCheckedChange: () => handleToggle(ad),
                              "aria-label": `Toggle "${ad.title}"`,
                              "data-ocid": `ad-toggle-${ad.id}`
                            }
                          ) }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-1", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "button",
                              {
                                type: "button",
                                onClick: () => openEdit(ad),
                                "data-ocid": `edit-ad-${ad.id}`,
                                "aria-label": "Edit",
                                className: "p-2 rounded-lg text-white/40 hover:text-foreground hover:bg-white/10 transition-colors min-h-[36px]",
                                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { className: "w-3.5 h-3.5" })
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "button",
                              {
                                type: "button",
                                onClick: () => setDeleteTarget(ad),
                                "data-ocid": `delete-ad-${ad.id}`,
                                "aria-label": "Delete",
                                className: "p-2 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors min-h-[36px]",
                                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5" })
                              }
                            )
                          ] }) })
                        ]
                      },
                      ad.id
                    );
                  }) })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "md:hidden divide-y divide-white/5", children: ads.map((ad) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              AdCardMobile,
              {
                ad,
                onEdit: () => openEdit(ad),
                onDelete: () => setDeleteTarget(ad),
                onToggle: () => handleToggle(ad)
              },
              ad.id
            )) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: showForm, onOpenChange: setShowForm, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          DialogContent,
          {
            className: "bg-card border-white/15 w-[calc(100vw-2rem)] max-w-lg",
            "data-ocid": "ad-form-dialog",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display font-bold text-foreground text-lg", children: editingAd ? "Edit Ad" : "Add New Ad" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4 mt-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-white/70 text-xs font-semibold uppercase tracking-wider", children: "Placement" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Select,
                    {
                      value: form.placement,
                      onValueChange: (v) => setForm((f) => ({ ...f, placement: v })),
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          SelectTrigger,
                          {
                            className: "bg-white/5 border-white/10 h-11",
                            "data-ocid": "ad-placement-select",
                            children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { className: "bg-card border-white/15", children: Object.keys(PLACEMENT_LABELS).map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: p, children: PLACEMENT_LABELS[p] }, p)) })
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Label,
                    {
                      htmlFor: "adTitle",
                      className: "text-white/70 text-xs font-semibold uppercase tracking-wider",
                      children: "Ad Name *"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      id: "adTitle",
                      value: form.title,
                      onChange: (e) => setForm((f) => ({ ...f, title: e.target.value })),
                      placeholder: "Summer Anime Promotion",
                      className: "bg-white/5 border-white/10 h-11",
                      "data-ocid": "ad-title-input"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Label,
                    {
                      htmlFor: "adImage",
                      className: "text-white/70 text-xs font-semibold uppercase tracking-wider",
                      children: "Image URL *"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      id: "adImage",
                      value: form.imageUrl,
                      onChange: (e) => setForm((f) => ({ ...f, imageUrl: e.target.value })),
                      placeholder: "https://example.com/ad-banner.jpg",
                      className: "bg-white/5 border-white/10 h-11",
                      "data-ocid": "ad-image-input"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Label,
                    {
                      htmlFor: "adTarget",
                      className: "text-white/70 text-xs font-semibold uppercase tracking-wider",
                      children: "Target URL"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      id: "adTarget",
                      value: form.targetUrl,
                      onChange: (e) => setForm((f) => ({ ...f, targetUrl: e.target.value })),
                      placeholder: "https://example.com/landing",
                      className: "bg-white/5 border-white/10 h-11"
                    }
                  )
                ] }),
                (form.placement === "video_pre_roll" || form.placement === "video_mid_roll") && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Label,
                    {
                      htmlFor: "adVideo",
                      className: "text-white/70 text-xs font-semibold uppercase tracking-wider",
                      children: "Video URL"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      id: "adVideo",
                      value: form.videoUrl,
                      onChange: (e) => setForm((f) => ({ ...f, videoUrl: e.target.value })),
                      placeholder: "https://example.com/video-ad.mp4",
                      className: "bg-white/5 border-white/10 h-11",
                      "data-ocid": "ad-video-input"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/8", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Switch,
                    {
                      id: "adEnabled",
                      checked: form.isEnabled,
                      onCheckedChange: (v) => setForm((f) => ({ ...f, isEnabled: v })),
                      "data-ocid": "ad-enabled-toggle"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Label,
                    {
                      htmlFor: "adEnabled",
                      className: "cursor-pointer text-sm font-medium",
                      children: "Enable this ad"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 pt-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      type: "submit",
                      disabled: isSaving,
                      className: "flex-1 bg-primary hover:bg-primary/90 h-11 gap-2",
                      "data-ocid": "ad-form-submit",
                      children: isSaving ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin" }),
                        "Saving..."
                      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: editingAd ? "Update Ad" : "Add Ad" })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      type: "button",
                      variant: "outline",
                      onClick: () => setShowForm(false),
                      className: "border-white/15 text-foreground hover:bg-white/10 h-11 px-6",
                      children: "Cancel"
                    }
                  )
                ] })
              ] })
            ]
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          AlertDialog,
          {
            open: !!deleteTarget,
            onOpenChange: (open) => !open && setDeleteTarget(null),
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { className: "bg-card border-white/15 text-foreground w-[calc(100vw-2rem)] max-w-md mx-auto", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogTitle, { className: "flex items-center gap-2 font-display", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-5 h-5 text-destructive" }),
                  "Delete Ad"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogDescription, { className: "text-white/50", children: [
                  "Delete ad",
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-foreground font-semibold", children: [
                    '"',
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
                    "data-ocid": "ad-delete-confirm",
                    className: "bg-destructive hover:bg-destructive/90 text-destructive-foreground",
                    children: deleteAd.isPending ? "Deleting..." : "Delete"
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
  AdminAdsPage as default
};
