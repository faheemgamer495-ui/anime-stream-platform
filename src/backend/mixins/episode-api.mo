import List "mo:core/List";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import EpisodeTypes "../types/episode";
import Common "../types/common";
import EpisodeLib "../lib/episode";

mixin (
  episodes : List.List<EpisodeTypes.Episode>,
  nextEpisodeId : List.List<Nat>
) {
  public query func getEpisodesByAnime(animeId : Common.AnimeId) : async [EpisodeTypes.Episode] {
    EpisodeLib.getByAnime(episodes, animeId);
  };

  public query func getEpisode(id : Common.EpisodeId) : async ?EpisodeTypes.Episode {
    EpisodeLib.getById(episodes, id);
  };

  public shared func createEpisode(adminToken : Text, input : EpisodeTypes.EpisodeInput) : async EpisodeTypes.Episode {
    if (adminToken != "adminfaheem123") Runtime.trap("Unauthorized");
    let currentId = nextEpisodeId.at(0);
    let result = EpisodeLib.create(episodes, currentId, input, Time.now());
    nextEpisodeId.put(0, currentId + 1);
    result;
  };

  public shared func updateEpisode(adminToken : Text, id : Common.EpisodeId, input : EpisodeTypes.EpisodeInput) : async ?EpisodeTypes.Episode {
    if (adminToken != "adminfaheem123") Runtime.trap("Unauthorized");
    EpisodeLib.update(episodes, id, input);
  };

  public shared func deleteEpisode(adminToken : Text, id : Common.EpisodeId) : async Bool {
    if (adminToken != "adminfaheem123") Runtime.trap("Unauthorized");
    EpisodeLib.delete(episodes, id);
  };
};
