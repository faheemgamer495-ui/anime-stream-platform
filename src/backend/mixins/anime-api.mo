import List "mo:core/List";
import Time "mo:core/Time";
import AnimeTypes "../types/anime";
import Common "../types/common";
import AnimeLib "../lib/anime";

mixin (
  animes : List.List<AnimeTypes.Anime>,
  nextAnimeId : List.List<Nat>
) {
  public query func getAllAnime() : async [AnimeTypes.AnimePublic] {
    AnimeLib.getAll(animes);
  };

  public query func getAnime(id : Common.AnimeId) : async ?AnimeTypes.AnimePublic {
    AnimeLib.getById(animes, id);
  };

  public query func getFeaturedAnime() : async [AnimeTypes.AnimePublic] {
    AnimeLib.getFeatured(animes);
  };

  public query func searchAnime(term : Text) : async [AnimeTypes.AnimePublic] {
    AnimeLib.search(animes, term);
  };

  public query func filterAnimeByGenre(genre : Text) : async [AnimeTypes.AnimePublic] {
    AnimeLib.filterByGenre(animes, genre);
  };

  public shared func createAnime(input : AnimeTypes.AnimeInput) : async AnimeTypes.AnimePublic {
    let currentId = nextAnimeId.at(0);
    let result = AnimeLib.create(animes, currentId, input, Time.now());
    nextAnimeId.put(0, currentId + 1);
    result;
  };

  public shared func updateAnime(id : Common.AnimeId, input : AnimeTypes.AnimeInput) : async ?AnimeTypes.AnimePublic {
    AnimeLib.update(animes, id, input);
  };

  public shared func deleteAnime(id : Common.AnimeId) : async Bool {
    AnimeLib.delete(animes, id);
  };

  public shared func incrementAnimeViewCount(id : Common.AnimeId) : async () {
    AnimeLib.incrementViewCount(animes, id);
  };
};
