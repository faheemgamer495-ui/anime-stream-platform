import Common "common";

module {
  public type Episode = {
    id : Common.EpisodeId;
    animeId : Common.AnimeId;
    seasonId : ?Common.SeasonId;
    episodeNumber : Nat;
    title : Text;
    description : Text;
    videoUrl : Text;
    thumbnailUrl : ?Text;
    duration : ?Text;
    createdAt : Common.Timestamp;
  };

  public type EpisodeInput = {
    animeId : Common.AnimeId;
    seasonId : ?Common.SeasonId;
    episodeNumber : Nat;
    title : Text;
    description : Text;
    videoUrl : Text;
    thumbnailUrl : ?Text;
    duration : ?Text;
  };
};
