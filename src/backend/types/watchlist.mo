import Common "common";

module {
  public type WatchlistEntry = {
    userId : Principal;
    animeId : Common.AnimeId;
    addedAt : Common.Timestamp;
  };
};
