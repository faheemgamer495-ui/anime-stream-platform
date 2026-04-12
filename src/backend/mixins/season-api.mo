import SeasonTypes "../types/season";
import EpisodeTypes "../types/episode";
import Common "../types/common";
import SeasonLib "../lib/season";

mixin (
  seasons : [SeasonTypes.Season],
  episodes : [EpisodeTypes.Episode],
) {
  public query func getSeason(id : Common.SeasonId) : async ?SeasonTypes.SeasonPublic {
    SeasonLib.getById(seasons, id);
  };

  /// Returns all seasons for the given anime sorted by seasonNumber ascending.
  /// Never returns a season with seasonNumber == 0 — migration handles that at startup.
  public query func getSeasonsByAnime(animeId : Common.AnimeId) : async [SeasonTypes.SeasonPublic] {
    SeasonLib.getByAnime(seasons, animeId);
  };

  public query func getEpisodesBySeason(seasonId : Common.SeasonId) : async [EpisodeTypes.Episode] {
    episodes.filter(func(e : EpisodeTypes.Episode) : Bool {
      switch (e.seasonId) {
        case (?sid) sid == seasonId;
        case null false;
      };
    });
  };
};
