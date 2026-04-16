import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import AnimeTypes "types/anime";
import EpisodeTypes "types/episode";
import UserTypes "types/user";
import WatchlistTypes "types/watchlist";
import AdTypes "types/ad";
import CommentTypes "types/comment";
import RequestTypes "types/request";
import AnimeLib "lib/anime";
import EpisodeLib "lib/episode";
import UserLib "lib/user";
import WatchlistLib "lib/watchlist";
import AdLib "lib/ad";
import CommentLib "lib/comment";
import AiMixin "mixins/ai-api";
import RequestLib "lib/request";
import SeasonTypes "types/season";
import SeasonLib "lib/season";
import Common "types/common";
import SeasonMixin "mixins/season-api";
import GuestWatchlistMixin "mixins/guest-watchlist-api";




actor {
  // Stable vars — survive every canister upgrade and redeployment
  stable var seasons : [SeasonTypes.Season] = [];
  stable var nextSeasonId : Nat = 0;
  stable var animes : [AnimeTypes.Anime] = [];
  stable var episodes : [EpisodeTypes.Episode] = [];
  stable var users : [UserTypes.User] = [];
  stable var watchlist : [WatchlistTypes.WatchlistEntry] = [];
  stable var ads : [AdTypes.AdConfig] = [];
  stable var comments : [CommentTypes.Comment] = [];
  stable var ratings : [CommentTypes.Rating] = [];
  stable var animeRequests : [RequestTypes.AnimeRequest] = [];

  // Guest watchlist — text userId, no Principal/auth required
  stable var guestWatchlist : [(Text, Text, Int)] = [];

  // ID counters — stable so they survive upgrades
  stable var nextAnimeId : Nat = 0;
  stable var nextEpisodeId : Nat = 0;
  stable var nextAdId : Nat = 0;
  stable var nextCommentId : Nat = 0;

  // Data version: bump this to trigger a re-seed of sample data.
  // Version 0 = never seeded. Version 1 = first seed run.
  // Keep legacy seeded flag for backward compatibility (ignored in logic).
  stable var dataVersion : Nat = 0;
  stable var seeded : Bool = false; // kept for upgrade compatibility only

  // Seed once on first deployment (dataVersion == 0).
  // Existing user-added data is never deleted — guards inside each seedSampleData
  // check array sizes so they only populate truly empty stores.
  if (dataVersion == 0) {
    let now = Time.now();
    let (newAnimes, animeCount) = AnimeLib.seedSampleData(animes, nextAnimeId, now);
    animes := newAnimes;
    nextAnimeId := animeCount;
    // Seed seasons before episodes so season IDs are consistent
    let (newSeasons, seasonCount) = SeasonLib.seedSampleData(seasons, nextSeasonId, now);
    seasons := newSeasons;
    nextSeasonId := seasonCount;
    let (newEpisodes, episodeCount) = EpisodeLib.seedSampleData(episodes, nextEpisodeId, now);
    episodes := newEpisodes;
    nextEpisodeId := episodeCount;
    let (newAds, adCount) = AdLib.seedSampleData(ads, nextAdId);
    ads := newAds;
    nextAdId := adCount;
    dataVersion := 1;
    seeded := true;
  };

  // One-time migration: fix any seasons where seasonNumber == 0
  seasons := SeasonLib.migrateSeasonNumbers(seasons);

  // Migration: ensure Naruto Season 1 Episode 1 uses the Google Drive embed URL.
  // Delegated to EpisodeLib to avoid compiler codegen bug with nested closures in actor body.
  // Runs on every canister init/upgrade — idempotent.
  // Returns a record to allow field access without tuple-destructuring let at actor top level
  // (tuple-destructuring let triggers M0133 in --default-persistent-actors mode).
  let narutoMig = EpisodeLib.migrateNarutoEp1(episodes, nextEpisodeId, Time.now());
  episodes := narutoMig.episodes;
  nextEpisodeId := narutoMig.nextEpisodeId;

  include AiMixin();
  include SeasonMixin(seasons, episodes);
  include GuestWatchlistMixin(guestWatchlist);

  // ── Seasons ────────────────────────────────────────────────────────────────

  public shared func createSeason(adminToken : Text, input : SeasonTypes.SeasonInput) : async SeasonTypes.SeasonPublic {
    if (adminToken != "adminfaheem123") Runtime.trap("Unauthorized");
    let (result, newSeasons) = SeasonLib.create(seasons, nextSeasonId, input, Time.now());
    seasons := newSeasons;
    nextSeasonId += 1;
    result;
  };

  public shared func updateSeason(adminToken : Text, id : Common.SeasonId, input : SeasonTypes.SeasonInput) : async ?SeasonTypes.SeasonPublic {
    if (adminToken != "adminfaheem123") Runtime.trap("Unauthorized");
    let (result, newSeasons) = SeasonLib.update(seasons, id, input);
    seasons := newSeasons;
    result;
  };

  public shared func deleteSeason(adminToken : Text, id : Common.SeasonId) : async Bool {
    if (adminToken != "adminfaheem123") Runtime.trap("Unauthorized");
    let (deleted, newSeasons) = SeasonLib.delete(seasons, id);
    if (deleted) {
      seasons := newSeasons;
      episodes := EpisodeLib.unlinkBySeason(episodes, id);
    };
    deleted;
  };

  // ── Anime Requests ─────────────────────────────────────────────────────────

  public shared func submitAnimeRequest(requestText : Text, username : Text) : async Text {
    let (req, newRequests) = RequestLib.createRequest(animeRequests, requestText, username);
    animeRequests := newRequests;
    req.id;
  };

  public query func getAnimeRequests(adminToken : Text) : async [RequestTypes.AnimeRequest] {
    if (adminToken != "adminfaheem123") Runtime.trap("Unauthorized");
    RequestLib.getAllRequests(animeRequests);
  };

  public shared func markRequestComplete(id : Text, adminToken : Text) : async Bool {
    if (adminToken != "adminfaheem123") Runtime.trap("Unauthorized");
    let (found, newRequests) = RequestLib.completeRequest(animeRequests, id);
    animeRequests := newRequests;
    found;
  };

  public shared func deleteAnimeRequest(id : Text, adminToken : Text) : async Bool {
    if (adminToken != "adminfaheem123") Runtime.trap("Unauthorized");
    let (deleted, newRequests) = RequestLib.deleteRequest(animeRequests, id);
    animeRequests := newRequests;
    deleted;
  };

  // ── Anime ──────────────────────────────────────────────────────────────────

  public query func getAllAnime() : async [AnimeTypes.AnimePublic] {
    AnimeLib.getAll(animes);
  };

  public query func getAnime(id : Text) : async ?AnimeTypes.AnimePublic {
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

  public shared func createAnime(adminToken : Text, input : AnimeTypes.AnimeInput) : async AnimeTypes.AnimePublic {
    if (adminToken != "adminfaheem123") Runtime.trap("Unauthorized");
    let (result, newAnimes) = AnimeLib.create(animes, nextAnimeId, input, Time.now());
    animes := newAnimes;
    nextAnimeId += 1;
    result;
  };

  public shared func updateAnime(adminToken : Text, id : Text, input : AnimeTypes.AnimeInput) : async ?AnimeTypes.AnimePublic {
    if (adminToken != "adminfaheem123") Runtime.trap("Unauthorized");
    let (result, newAnimes) = AnimeLib.update(animes, id, input);
    animes := newAnimes;
    result;
  };

  public shared func deleteAnime(adminToken : Text, id : Text) : async Bool {
    if (adminToken != "adminfaheem123") Runtime.trap("Unauthorized");
    let (result, newAnimes) = AnimeLib.delete(animes, id);
    animes := newAnimes;
    result;
  };

  public shared func incrementAnimeViewCount(id : Text) : async () {
    animes := AnimeLib.incrementViewCount(animes, id);
  };

  // ── Episodes ───────────────────────────────────────────────────────────────

  public query func getEpisodesByAnime(animeId : Text) : async [EpisodeTypes.Episode] {
    EpisodeLib.getByAnime(episodes, animeId);
  };

  public query func getEpisode(id : Text) : async ?EpisodeTypes.Episode {
    EpisodeLib.getById(episodes, id);
  };

  public shared func createEpisode(adminToken : Text, input : EpisodeTypes.EpisodeInput) : async EpisodeTypes.Episode {
    if (adminToken != "adminfaheem123") Runtime.trap("Unauthorized");
    let (result, newEpisodes) = EpisodeLib.create(episodes, nextEpisodeId, input, Time.now());
    episodes := newEpisodes;
    nextEpisodeId += 1;
    result;
  };

  public shared func updateEpisode(adminToken : Text, id : Text, input : EpisodeTypes.EpisodeInput) : async ?EpisodeTypes.Episode {
    if (adminToken != "adminfaheem123") Runtime.trap("Unauthorized");
    let (result, newEpisodes) = EpisodeLib.update(episodes, id, input);
    episodes := newEpisodes;
    result;
  };

  public shared func deleteEpisode(adminToken : Text, id : Text) : async Bool {
    if (adminToken != "adminfaheem123") Runtime.trap("Unauthorized");
    let (result, newEpisodes) = EpisodeLib.delete(episodes, id);
    episodes := newEpisodes;
    result;
  };

  // ── Users ──────────────────────────────────────────────────────────────────

  public shared ({ caller }) func registerUser(input : UserTypes.UserInput) : async UserTypes.UserPublic {
    let (result, newUsers) = UserLib.register(users, caller, input, Time.now());
    users := newUsers;
    result;
  };

  public query ({ caller }) func getUser() : async ?UserTypes.UserPublic {
    UserLib.getById(users, caller);
  };

  public shared ({ caller }) func updateUser(input : UserTypes.UserInput) : async ?UserTypes.UserPublic {
    let (result, newUsers) = UserLib.update(users, caller, input);
    users := newUsers;
    result;
  };

  public query ({ caller }) func isAdminUser() : async Bool {
    UserLib.isAdmin(users, caller);
  };

  public query ({ caller }) func listAllUsers() : async [UserTypes.UserPublic] {
    if (not UserLib.isAdmin(users, caller)) Runtime.trap("Unauthorized: admin only");
    UserLib.listAll(users);
  };

  // ── Watchlist ──────────────────────────────────────────────────────────────

  public shared ({ caller }) func addToWatchlist(animeId : Text) : async () {
    watchlist := WatchlistLib.add(watchlist, caller, animeId, Time.now());
  };

  public shared ({ caller }) func removeFromWatchlist(animeId : Text) : async Bool {
    let (result, newWatchlist) = WatchlistLib.remove(watchlist, caller, animeId);
    watchlist := newWatchlist;
    result;
  };

  public query ({ caller }) func getUserWatchlist() : async [WatchlistTypes.WatchlistEntry] {
    WatchlistLib.getByUser(watchlist, caller);
  };

  public query ({ caller }) func isInWatchlist(animeId : Text) : async Bool {
    WatchlistLib.isInWatchlist(watchlist, caller, animeId);
  };

  // ── Ads ────────────────────────────────────────────────────────────────────

  public query func getAllAds() : async [AdTypes.AdConfigPublic] {
    AdLib.getAll(ads);
  };

  public query func getEnabledAds() : async [AdTypes.AdConfigPublic] {
    AdLib.getEnabled(ads);
  };

  public query func getAdsByPlacement(placement : AdTypes.AdPlacement) : async [AdTypes.AdConfigPublic] {
    AdLib.getByPlacement(ads, placement);
  };

  public shared func createAdConfig(input : AdTypes.AdConfigInput) : async AdTypes.AdConfigPublic {
    let (result, newAds) = AdLib.create(ads, nextAdId, input);
    ads := newAds;
    nextAdId += 1;
    result;
  };

  public shared func updateAdConfig(id : Text, input : AdTypes.AdConfigInput) : async ?AdTypes.AdConfigPublic {
    let (result, newAds) = AdLib.update(ads, id, input);
    ads := newAds;
    result;
  };

  public shared func deleteAdConfig(id : Text) : async Bool {
    let (result, newAds) = AdLib.delete(ads, id);
    ads := newAds;
    result;
  };

  // ── Comments & Ratings ─────────────────────────────────────────────────────

  public shared ({ caller }) func addComment(
    episodeId : Text,
    text : Text,
    parentId : ?Text,
  ) : async CommentTypes.Comment {
    let username = switch (UserLib.getById(users, caller)) {
      case (?u) u.username;
      case null Runtime.trap("Must be registered to comment");
    };
    let (comment, newComments) = CommentLib.addComment(comments, nextCommentId, episodeId, caller, username, text, parentId, Time.now());
    comments := newComments;
    nextCommentId += 1;
    comment;
  };

  public query func getCommentsByEpisode(episodeId : Text) : async [CommentTypes.Comment] {
    CommentLib.getCommentsByEpisode(comments, episodeId);
  };

  public shared ({ caller }) func editComment(commentId : Text, newText : Text) : async ?CommentTypes.Comment {
    let (result, newComments) = CommentLib.editComment(comments, commentId, caller, newText, Time.now());
    comments := newComments;
    result;
  };

  public shared ({ caller }) func deleteComment(commentId : Text) : async Bool {
    let (result, newComments) = CommentLib.deleteComment(comments, commentId, caller);
    comments := newComments;
    result;
  };

  public shared ({ caller }) func addRating(episodeId : Text, stars : Nat) : async ?Text {
    if (stars < 1 or stars > 5) Runtime.trap("Stars must be between 1 and 5");
    ratings := CommentLib.addRating(ratings, episodeId, caller, stars);
    ?episodeId;
  };

  public query ({ caller }) func getRatingsInfo(episodeId : Text) : async { average : Float; total : Nat; userRating : ?Nat } {
    let episodeRatings = CommentLib.getRatingsByEpisode(ratings, episodeId);
    let total = episodeRatings.size();
    let average : Float = if (total == 0) {
      0.0;
    } else {
      var sum = 0;
      for (r in episodeRatings.values()) { sum += r.stars };
      sum.toFloat() / total.toFloat();
    };
    let userStars = switch (episodeRatings.find(func(r : CommentTypes.Rating) : Bool { r.userId == caller })) {
      case (?r) ?r.stars;
      case null null;
    };
    { average; total; userRating = userStars };
  };
};
