import { R as useAdminAuth, D as useNavigate, f as useAllAnime, _ as useCreateAnime, $ as useUpdateAnime, a0 as useDeleteAnime, r as reactExports, a1 as loadData, j as jsxRuntimeExports, a2 as Search, W as Input, X, U as Label, B as Button, h as ue } from "./index-DnVaqzJ1.js";
import { A as AlertDialog, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, T as TriangleAlert, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction } from "./alert-dialog-BrPKe8hj.js";
import { B as Badge } from "./badge-CO852Axe.js";
import { P as Pen, D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, S as Select, d as SelectTrigger, e as SelectValue, f as SelectContent, g as SelectItem } from "./select-BtaL5xpl.js";
import { S as Switch } from "./switch-BwU9M2yh.js";
import { T as Textarea } from "./textarea-8Dx1P-nT.js";
import { A as AdminLayout, F as Film } from "./AdminDashboardPage-B0v_yyfl.js";
import { L as LoaderCircle } from "./loader-circle-i9Bo2C9F.js";
import { S as Star } from "./star-D8XNwk1f.js";
import { C as Check } from "./check-BkIFvmcv.js";
import { T as Trash2 } from "./trash-2-yHn8UtUi.js";
import { P as Plus } from "./plus-DHvAjDJW.js";
import "./index-CHeZpbfP.js";
import "./chevron-down-CIvrwsTE.js";
import "./chevron-up-EschEVc0.js";
import "./useAds-BXyexzn5.js";
import "./tv-CIfmeAcW.js";
const EMPTY_FORM = {
  title: "",
  description: "",
  genre: [],
  rating: 4,
  thumbnailUrl: "",
  coverImageUrl: "",
  isFeatured: false,
  releaseYear: (/* @__PURE__ */ new Date()).getFullYear(),
  status: "ongoing"
};
const ALL_GENRES = [
  "Action",
  "Adventure",
  "Comedy",
  "Drama",
  "Fantasy",
  "Horror",
  "Romance",
  "School",
  "Sci-Fi",
  "Supernatural",
  "Thriller",
  "Mystery",
  "Sports",
  "Slice of Life"
];
function StatusBadge({ status }) {
  const cls = status === "ongoing" ? "bg-green-500/15 text-green-400" : status === "completed" ? "bg-blue-500/15 text-blue-400" : "bg-amber-500/15 text-amber-400";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: `text-[10px] px-2 py-0.5 rounded-full font-semibold capitalize ${cls}`,
      children: status
    }
  );
}
function AnimeCardMobile({
  a,
  onEdit,
  onDelete
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex items-center gap-3 px-4 py-3.5 hover:bg-white/3 transition-colors",
      "data-ocid": `anime-row-${a.id}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: a.thumbnailUrl,
            alt: a.title,
            className: "w-10 h-14 object-cover rounded shrink-0"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground truncate text-sm", children: a.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-white/40 mt-0.5", children: [
            a.releaseYear,
            " · ",
            a.episodeCount,
            " eps"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: a.status }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-0.5 text-[10px] text-amber-400", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "w-2.5 h-2.5 fill-current" }),
              a.rating
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: onEdit,
              "data-ocid": `edit-anime-${a.id}`,
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
              "data-ocid": `delete-anime-${a.id}`,
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
function AdminAnimePage() {
  const { isAdminLoggedIn } = useAdminAuth();
  const navigate = useNavigate();
  const { data: anime = [], isLoading } = useAllAnime();
  const createAnime = useCreateAnime();
  const updateAnime = useUpdateAnime();
  const deleteAnime = useDeleteAnime();
  const [showForm, setShowForm] = reactExports.useState(false);
  const [editingAnime, setEditingAnime] = reactExports.useState(null);
  const [form, setForm] = reactExports.useState(EMPTY_FORM);
  const [deleteTarget, setDeleteTarget] = reactExports.useState(null);
  const [search, setSearch] = reactExports.useState("");
  reactExports.useEffect(() => {
    loadData("anime_cache");
  }, []);
  if (!isAdminLoggedIn) {
    navigate({ to: "/admin/login" });
    return null;
  }
  const filtered = anime.filter(
    (a) => !search || a.title.toLowerCase().includes(search.toLowerCase()) || a.genre.some((g) => g.toLowerCase().includes(search.toLowerCase()))
  );
  const openCreate = () => {
    setEditingAnime(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };
  const openEdit = (a) => {
    setEditingAnime(a);
    setForm({
      title: a.title,
      description: a.description,
      genre: a.genre,
      rating: a.rating,
      thumbnailUrl: a.thumbnailUrl,
      coverImageUrl: a.coverImageUrl,
      isFeatured: a.isFeatured,
      releaseYear: a.releaseYear,
      status: a.status
    });
    setShowForm(true);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.thumbnailUrl) {
      ue.error("Title and thumbnail URL are required");
      return;
    }
    try {
      if (editingAnime) {
        await updateAnime.mutateAsync({ id: editingAnime.id, data: form });
        ue.success(`"${form.title}" updated`);
      } else {
        await createAnime.mutateAsync(form);
        ue.success(`"${form.title}" added to library`);
      }
      setShowForm(false);
    } catch {
      ue.error("Failed to save anime");
    }
  };
  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteAnime.mutateAsync(deleteTarget.id);
      ue.success(`"${deleteTarget.title}" deleted`);
      setDeleteTarget(null);
    } catch {
      ue.error("Failed to delete anime");
    }
  };
  const toggleGenre = (g) => {
    setForm((f) => ({
      ...f,
      genre: f.genre.includes(g) ? f.genre.filter((x) => x !== g) : [...f.genre, g]
    }));
  };
  const isSaving = createAnime.isPending || updateAnime.isPending;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    AdminLayout,
    {
      title: "Anime Management",
      subtitle: `${anime.length} titles in library`,
      action: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          onClick: openCreate,
          className: "bg-primary hover:bg-primary/90 gap-2 h-9 md:h-10 text-xs md:text-sm",
          "data-ocid": "add-anime-btn",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "Add Anime" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sm:hidden", children: "Add" })
          ]
        }
      ),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 md:space-y-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: search,
                onChange: (e) => setSearch(e.target.value),
                placeholder: "Search by title or genre...",
                className: "pl-9 bg-card border-white/10 w-full md:max-w-sm",
                "data-ocid": "anime-search-input"
              }
            ),
            search && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => setSearch(""),
                "aria-label": "Clear search",
                className: "absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-foreground p-1",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3.5 h-3.5" })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card border border-white/10 rounded-xl overflow-hidden", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center py-16", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-6 h-6 animate-spin text-primary" }) }) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "py-16 text-center text-white/40",
              "data-ocid": "anime-empty-state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Film, { className: "w-12 h-12 mx-auto mb-3 opacity-30" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: search ? `No results for "${search}"` : "No anime yet. Add your first title!" })
              ]
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "table",
              {
                className: "w-full text-sm hidden md:table",
                "data-ocid": "anime-table",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-white/3 border-b border-white/10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-5 py-3 text-[10px] font-semibold text-white/40 uppercase tracking-widest", children: "Anime" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 text-[10px] font-semibold text-white/40 uppercase tracking-widest hidden lg:table-cell", children: "Genre" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-center px-4 py-3 text-[10px] font-semibold text-white/40 uppercase tracking-widest", children: "Rating" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-center px-4 py-3 text-[10px] font-semibold text-white/40 uppercase tracking-widest hidden lg:table-cell", children: "Status" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-center px-4 py-3 text-[10px] font-semibold text-white/40 uppercase tracking-widest hidden xl:table-cell", children: "Featured" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-5 py-3 text-[10px] font-semibold text-white/40 uppercase tracking-widest", children: "Actions" })
                  ] }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-white/5", children: filtered.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "tr",
                    {
                      className: "hover:bg-white/3 transition-colors",
                      "data-ocid": `anime-row-${a.id}`,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "img",
                            {
                              src: a.thumbnailUrl,
                              alt: a.title,
                              className: "w-9 object-cover rounded shrink-0",
                              style: { height: "3.25rem" }
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground truncate max-w-[160px] text-sm", children: a.title }),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-white/40", children: [
                              a.releaseYear,
                              " · ",
                              a.episodeCount,
                              " eps"
                            ] })
                          ] })
                        ] }) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 hidden lg:table-cell", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1", children: [
                          a.genre.slice(0, 2).map((g) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                            Badge,
                            {
                              variant: "secondary",
                              className: "text-[10px] px-1.5 py-0 bg-white/8 text-white/60 border-0",
                              children: g
                            },
                            g
                          )),
                          a.genre.length > 2 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-white/30", children: [
                            "+",
                            a.genre.length - 2
                          ] })
                        ] }) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 text-amber-400", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "w-3 h-3 fill-current" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-foreground", children: a.rating })
                        ] }) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-center hidden lg:table-cell", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: a.status }) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-center hidden xl:table-cell", children: a.isFeatured ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-4 h-4 text-green-400 mx-auto" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4 text-white/20 mx-auto" }) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-1", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "button",
                            {
                              type: "button",
                              onClick: () => openEdit(a),
                              "data-ocid": `edit-anime-${a.id}`,
                              "aria-label": "Edit",
                              className: "p-2 rounded-lg text-white/40 hover:text-foreground hover:bg-white/10 transition-colors min-h-[36px]",
                              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { className: "w-3.5 h-3.5" })
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "button",
                            {
                              type: "button",
                              onClick: () => setDeleteTarget(a),
                              "data-ocid": `delete-anime-${a.id}`,
                              "aria-label": "Delete",
                              className: "p-2 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors min-h-[36px]",
                              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5" })
                            }
                          )
                        ] }) })
                      ]
                    },
                    a.id
                  )) })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "md:hidden divide-y divide-white/5", children: filtered.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              AnimeCardMobile,
              {
                a,
                onEdit: () => openEdit(a),
                onDelete: () => setDeleteTarget(a)
              },
              a.id
            )) })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: showForm, onOpenChange: setShowForm, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          DialogContent,
          {
            className: "bg-card border-white/15 w-full max-w-lg md:max-w-2xl max-h-[90vh] overflow-y-auto mx-4",
            "data-ocid": "anime-form-dialog",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display font-bold text-foreground text-lg", children: editingAnime ? "Edit Anime" : "Add New Anime" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4 mt-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sm:col-span-2 space-y-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Label,
                      {
                        htmlFor: "title",
                        className: "text-white/70 text-xs font-semibold uppercase tracking-wider",
                        children: "Title *"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        id: "title",
                        value: form.title,
                        onChange: (e) => setForm((f) => ({ ...f, title: e.target.value })),
                        placeholder: "Jujutsu Kaisen",
                        className: "bg-white/5 border-white/10 h-11",
                        "data-ocid": "anime-title-input"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Label,
                      {
                        htmlFor: "rating",
                        className: "text-white/70 text-xs font-semibold uppercase tracking-wider",
                        children: "Rating (0–10)"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        id: "rating",
                        type: "number",
                        min: "0",
                        max: "10",
                        step: "0.1",
                        value: form.rating,
                        onChange: (e) => setForm((f) => ({
                          ...f,
                          rating: Number.parseFloat(e.target.value) || 0
                        })),
                        className: "bg-white/5 border-white/10 h-11",
                        "data-ocid": "anime-rating-input"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Label,
                      {
                        htmlFor: "releaseYear",
                        className: "text-white/70 text-xs font-semibold uppercase tracking-wider",
                        children: "Release Year"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        id: "releaseYear",
                        type: "number",
                        min: "1960",
                        max: "2030",
                        value: form.releaseYear,
                        onChange: (e) => setForm((f) => ({
                          ...f,
                          releaseYear: Number.parseInt(e.target.value) || 2024
                        })),
                        className: "bg-white/5 border-white/10 h-11"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-white/70 text-xs font-semibold uppercase tracking-wider", children: "Status" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Select,
                      {
                        value: form.status,
                        onValueChange: (v) => setForm((f) => ({ ...f, status: v })),
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            SelectTrigger,
                            {
                              className: "bg-white/5 border-white/10 h-11",
                              "data-ocid": "anime-status-select",
                              children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { className: "bg-card border-white/15", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "ongoing", children: "Ongoing" }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "completed", children: "Completed" }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "upcoming", children: "Upcoming" })
                          ] })
                        ]
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sm:col-span-2 flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/8", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Switch,
                      {
                        id: "featured",
                        checked: form.isFeatured,
                        onCheckedChange: (v) => setForm((f) => ({ ...f, isFeatured: v })),
                        "data-ocid": "anime-featured-toggle"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Label,
                        {
                          htmlFor: "featured",
                          className: "cursor-pointer text-sm font-medium",
                          children: "Feature on homepage"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-white/40", children: "Will appear in the hero banner" })
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Label,
                    {
                      htmlFor: "thumbnailUrl",
                      className: "text-white/70 text-xs font-semibold uppercase tracking-wider",
                      children: "Thumbnail URL *"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      id: "thumbnailUrl",
                      value: form.thumbnailUrl,
                      onChange: (e) => setForm((f) => ({ ...f, thumbnailUrl: e.target.value })),
                      placeholder: "https://example.com/thumbnail.jpg",
                      className: "bg-white/5 border-white/10 h-11",
                      "data-ocid": "anime-thumbnail-input"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Label,
                    {
                      htmlFor: "coverImageUrl",
                      className: "text-white/70 text-xs font-semibold uppercase tracking-wider",
                      children: "Cover Image URL"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      id: "coverImageUrl",
                      value: form.coverImageUrl,
                      onChange: (e) => setForm((f) => ({ ...f, coverImageUrl: e.target.value })),
                      placeholder: "https://example.com/cover.jpg",
                      className: "bg-white/5 border-white/10 h-11"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Label,
                    {
                      htmlFor: "description",
                      className: "text-white/70 text-xs font-semibold uppercase tracking-wider",
                      children: "Description"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Textarea,
                    {
                      id: "description",
                      value: form.description,
                      onChange: (e) => setForm((f) => ({ ...f, description: e.target.value })),
                      placeholder: "A brief synopsis of the anime...",
                      rows: 3,
                      className: "bg-white/5 border-white/10 resize-none",
                      "data-ocid": "anime-description-input"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-white/70 text-xs font-semibold uppercase tracking-wider", children: "Genres" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5", children: ALL_GENRES.map((g) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => toggleGenre(g),
                      className: `px-3 py-1.5 rounded-full text-xs font-medium transition-all min-h-[32px] ${form.genre.includes(g) ? "bg-primary text-primary-foreground shadow-sm" : "bg-white/8 text-white/50 hover:bg-white/15 hover:text-foreground"}`,
                      children: g
                    },
                    g
                  )) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 pt-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      type: "submit",
                      disabled: isSaving,
                      className: "flex-1 bg-primary hover:bg-primary/90 h-11 gap-2",
                      "data-ocid": "anime-form-submit",
                      children: isSaving ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin" }),
                        "Saving..."
                      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: editingAnime ? "Update Anime" : "Add Anime" })
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
                  "Delete Anime"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogDescription, { className: "text-white/50", children: [
                  "Delete",
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-foreground font-semibold", children: [
                    '"',
                    deleteTarget == null ? void 0 : deleteTarget.title,
                    '"'
                  ] }),
                  "? All associated episodes will also be removed. This cannot be undone."
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
                    "data-ocid": "anime-delete-confirm",
                    className: "bg-destructive hover:bg-destructive/90 text-destructive-foreground",
                    children: deleteAnime.isPending ? "Deleting..." : "Delete"
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
  AdminAnimePage as default
};
