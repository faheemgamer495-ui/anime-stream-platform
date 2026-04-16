import Runtime "mo:core/Runtime";
import WatchlistTypes "../types/watchlist";
import Common "../types/common";

/// Watchlist API contract — array-based, matches main.mo stable-var pattern.
/// NOTE: Not included in main.mo; methods are inline there. Reference only.
mixin (watchlist : [WatchlistTypes.WatchlistEntry]) {
  public shared ({ caller }) func addToWatchlist(animeId : Common.AnimeId) : async () {
    Runtime.trap("not implemented");
  };

  public shared ({ caller }) func removeFromWatchlist(animeId : Common.AnimeId) : async Bool {
    Runtime.trap("not implemented");
  };

  public query ({ caller }) func getUserWatchlist() : async [WatchlistTypes.WatchlistEntry] {
    Runtime.trap("not implemented");
  };

  public query ({ caller }) func isInWatchlist(animeId : Common.AnimeId) : async Bool {
    Runtime.trap("not implemented");
  };
};
