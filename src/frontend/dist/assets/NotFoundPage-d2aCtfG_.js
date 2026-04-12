import { c as createLucideIcon, j as jsxRuntimeExports, B as Button, L as Link, a2 as Search } from "./index-EgDyTYGb.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8", key: "5wwlr5" }],
  [
    "path",
    {
      d: "M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
      key: "1d0kgt"
    }
  ]
];
const House = createLucideIcon("house", __iconNode);
function NotFoundPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "min-h-[70vh] flex items-center justify-center px-4",
      "data-ocid": "not-found-page",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-6 max-w-md", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display font-black text-8xl text-primary/20 leading-none select-none", children: "404" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-bold text-3xl text-foreground", children: "Page Not Found" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "The page you're looking for doesn't exist or has been moved." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 justify-center flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              asChild: true,
              className: "bg-primary hover:bg-primary/90 gap-2",
              "data-ocid": "go-home-btn",
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(House, { className: "w-4 h-4" }),
                "Go Home"
              ] })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", asChild: true, className: "gap-2 border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "w-4 h-4" }),
            "Browse Anime"
          ] }) })
        ] })
      ] })
    }
  );
}
export {
  NotFoundPage as default
};
