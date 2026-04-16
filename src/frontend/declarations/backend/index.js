// Canister actor factory — loaded at runtime from index.html
// Falls back gracefully if canister is unavailable.
export const canisterId = "undefined";

export function createActor(_canisterId, _options) {
  // Returns null — the inline script in index.html catches this and falls back to localStorage.
  return null;
}
