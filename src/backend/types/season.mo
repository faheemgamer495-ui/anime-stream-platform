import Common "common";

module {
  public type Season = {
    id : Common.SeasonId;
    animeId : Common.AnimeId;
    seasonNumber : Nat;
    name : Text;
    createdAt : Common.Timestamp;
  };

  public type SeasonInput = {
    animeId : Common.AnimeId;
    seasonNumber : Nat;
    name : Text;
  };

  public type SeasonPublic = {
    id : Common.SeasonId;
    animeId : Common.AnimeId;
    seasonNumber : Nat;
    name : Text;
    createdAt : Common.Timestamp;
  };
};
