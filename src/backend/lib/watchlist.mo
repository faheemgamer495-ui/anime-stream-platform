import Types "../types/watchlist";
import Common "../types/common";

module {
  // Returns newWatchlist — caller must reassign stable var
  public func add(entries : [Types.WatchlistEntry], userId : Principal, animeId : Common.AnimeId, addedAt : Common.Timestamp) : [Types.WatchlistEntry] {
    // Avoid duplicates
    let exists = entries.any(func(e : Types.WatchlistEntry) : Bool {
      e.userId == userId and e.animeId == animeId
    });
    if (not exists) {
      entries.concat([{ userId; animeId; addedAt }]);
    } else {
      entries;
    };
  };

  // Returns (removed, newWatchlist)
  public func remove(entries : [Types.WatchlistEntry], userId : Principal, animeId : Common.AnimeId) : (Bool, [Types.WatchlistEntry]) {
    let newEntries = entries.filter(func(e : Types.WatchlistEntry) : Bool {
      not (e.userId == userId and e.animeId == animeId)
    });
    (newEntries.size() < entries.size(), newEntries);
  };

  public func getByUser(entries : [Types.WatchlistEntry], userId : Principal) : [Types.WatchlistEntry] {
    entries.filter(func(e : Types.WatchlistEntry) : Bool {
      e.userId == userId
    });
  };

  public func isInWatchlist(entries : [Types.WatchlistEntry], userId : Principal, animeId : Common.AnimeId) : Bool {
    entries.any(func(e : Types.WatchlistEntry) : Bool {
      e.userId == userId and e.animeId == animeId
    });
  };
};
