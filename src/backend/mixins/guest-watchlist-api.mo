import Runtime "mo:core/Runtime";

/// Guest-friendly watchlist that uses a plain Text userId (no Internet Identity).
/// The frontend can pass any stable identifier (device fingerprint, UUID, etc.)
/// without requiring the user to authenticate.
///
/// State: guestWatchlist : [(userId: Text, animeId: Text, addedAt: Int)]
/// Injected as a flat array to keep the stable var simple.
mixin (guestWatchlist : [(Text, Text, Int)]) {

  /// Add an anime to a guest watchlist keyed by a text userId.
  /// Silently ignores duplicates.
  public shared func addToWatchlistGuest(_userId : Text, _animeId : Text) : async () {
    Runtime.trap("not implemented");
  };

  /// Remove an anime from a guest watchlist.
  /// Returns true if an entry was removed.
  public shared func removeFromWatchlistGuest(_userId : Text, _animeId : Text) : async Bool {
    Runtime.trap("not implemented");
  };

  /// Returns all animeIds in the guest's watchlist.
  public query func getGuestWatchlist(_userId : Text) : async [Text] {
    Runtime.trap("not implemented");
  };

  /// Returns true if the anime is already in the guest's watchlist.
  public query func isInWatchlistGuest(_userId : Text, _animeId : Text) : async Bool {
    Runtime.trap("not implemented");
  };
};
