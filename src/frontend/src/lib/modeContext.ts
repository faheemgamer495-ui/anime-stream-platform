/**
 * modeContext — pure URL-based mode detection utility.
 * No React context, no state — just functions.
 *
 * Preview mode: /preview/* paths (admin editing environment)
 * Live mode: all other paths (public-facing site)
 */

export function isPreviewMode(): boolean {
  if (typeof window === "undefined") return false;
  return window.location.pathname.startsWith("/preview");
}

export function getCurrentMode(): "preview" | "live" {
  return isPreviewMode() ? "preview" : "live";
}
