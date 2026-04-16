import Runtime "mo:core/Runtime";
import EpisodeTypes "../types/episode";
import Common "../types/common";

/// Episode API contract — array-based, matches main.mo stable-var pattern.
/// NOTE: Not included in main.mo; methods are inline there. Reference only.
mixin (
  episodes : [EpisodeTypes.Episode],
  nextEpisodeId : Nat,
) {
  public query func getEpisodesByAnime(animeId : Common.AnimeId) : async [EpisodeTypes.Episode] {
    Runtime.trap("not implemented");
  };

  public query func getEpisode(id : Common.EpisodeId) : async ?EpisodeTypes.Episode {
    Runtime.trap("not implemented");
  };

  public shared func createEpisode(adminToken : Text, input : EpisodeTypes.EpisodeInput) : async EpisodeTypes.Episode {
    Runtime.trap("not implemented");
  };

  public shared func updateEpisode(adminToken : Text, id : Common.EpisodeId, input : EpisodeTypes.EpisodeInput) : async ?EpisodeTypes.Episode {
    Runtime.trap("not implemented");
  };

  public shared func deleteEpisode(adminToken : Text, id : Common.EpisodeId) : async Bool {
    Runtime.trap("not implemented");
  };
};
