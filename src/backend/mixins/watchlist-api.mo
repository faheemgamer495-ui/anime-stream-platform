import List "mo:core/List";
import Time "mo:core/Time";
import WatchlistTypes "../types/watchlist";
import Common "../types/common";
import WatchlistLib "../lib/watchlist";

mixin (watchlist : List.List<WatchlistTypes.WatchlistEntry>) {
  public shared ({ caller }) func addToWatchlist(animeId : Common.AnimeId) : async () {
    WatchlistLib.add(watchlist, caller, animeId, Time.now());
  };

  public shared ({ caller }) func removeFromWatchlist(animeId : Common.AnimeId) : async Bool {
    WatchlistLib.remove(watchlist, caller, animeId);
  };

  public query ({ caller }) func getUserWatchlist() : async [WatchlistTypes.WatchlistEntry] {
    WatchlistLib.getByUser(watchlist, caller);
  };

  public query ({ caller }) func isInWatchlist(animeId : Common.AnimeId) : async Bool {
    WatchlistLib.isInWatchlist(watchlist, caller, animeId);
  };
};
