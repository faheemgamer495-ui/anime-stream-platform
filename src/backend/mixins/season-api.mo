import SeasonTypes "../types/season";
import EpisodeTypes "../types/episode";
import Common "../types/common";
import SeasonLib "../lib/season";
import EpisodeLib "../lib/episode";

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

  /// Returns episodes for the given season sorted by episodeNumber ascending.
  public query func getEpisodesBySeason(seasonId : Common.SeasonId) : async [EpisodeTypes.Episode] {
    EpisodeLib.getBySeason(episodes, seasonId);
  };

  /// Returns ALL episodes — intended for admin panel listing.
  public query func getAllEpisodes() : async [EpisodeTypes.Episode] {
    EpisodeLib.getAll(episodes);
  };
};
