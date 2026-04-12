import Nat "mo:core/Nat";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Types "../types/season";
import Common "../types/common";

module {
  // ── Helpers ─────────────────────────────────────────────────────────────────

  /// Count existing seasons for a given animeId
  func countForAnime(seasons : [Types.Season], animeId : Common.AnimeId) : Nat {
    seasons.filter(func(s : Types.Season) : Bool { s.animeId == animeId }).size();
  };

  /// If seasonNumber is 0, auto-assign next sequential number for this anime.
  /// Otherwise keep the provided value.
  func resolveSeasonNumber(seasons : [Types.Season], animeId : Common.AnimeId, requested : Nat) : Nat {
    if (requested >= 1) {
      requested;
    } else {
      // 0 or invalid — assign count + 1
      countForAnime(seasons, animeId) + 1;
    };
  };

  // ── Core constructors ────────────────────────────────────────────────────────

  public func new(id : Common.SeasonId, input : Types.SeasonInput, createdAt : Common.Timestamp) : Types.Season {
    {
      id;
      animeId = input.animeId;
      seasonNumber = input.seasonNumber;
      name = input.name;
      createdAt;
    };
  };

  public func toPublic(season : Types.Season) : Types.SeasonPublic {
    {
      id = season.id;
      animeId = season.animeId;
      seasonNumber = season.seasonNumber;
      name = season.name;
      createdAt = season.createdAt;
    };
  };

  // ── Queries ──────────────────────────────────────────────────────────────────

  public func getById(seasons : [Types.Season], id : Common.SeasonId) : ?Types.SeasonPublic {
    switch (seasons.find(func(s : Types.Season) : Bool { s.id == id })) {
      case (?s) ?toPublic(s);
      case null null;
    };
  };

  /// Returns all seasons for an anime sorted by seasonNumber ascending.
  public func getByAnime(seasons : [Types.Season], animeId : Common.AnimeId) : [Types.SeasonPublic] {
    let filtered = seasons.filter(func(s : Types.Season) : Bool { s.animeId == animeId });
    let sorted = filtered.sort(func(a : Types.Season, b : Types.Season) : Order.Order {
      Nat.compare(a.seasonNumber, b.seasonNumber);
    });
    sorted.map<Types.Season, Types.SeasonPublic>(func(s) { toPublic(s) });
  };

  // ── Mutations ────────────────────────────────────────────────────────────────

  /// Creates a new season. If seasonNumber == 0, auto-assigns the next sequential
  /// number for the anime. Enforces seasonNumber >= 1.
  public func create(seasons : [Types.Season], nextId : Nat, input : Types.SeasonInput, createdAt : Common.Timestamp) : (Types.SeasonPublic, [Types.Season]) {
    let resolvedNumber = resolveSeasonNumber(seasons, input.animeId, input.seasonNumber);
    let resolvedInput : Types.SeasonInput = {
      input with seasonNumber = resolvedNumber;
    };
    let id = nextId.toText();
    let season = new(id, resolvedInput, createdAt);
    let updated = seasons.concat([season]);
    (toPublic(season), updated);
  };

  /// Updates an existing season. If the new seasonNumber == 0, auto-assigns
  /// the next sequential number for the anime (excluding the current entry).
  public func update(seasons : [Types.Season], id : Common.SeasonId, input : Types.SeasonInput) : (?Types.SeasonPublic, [Types.Season]) {
    // When resolving auto-assign for an update, exclude the current season from count
    // so we don't inflate the count by including itself.
    let otherSeasons = seasons.filter(func(s : Types.Season) : Bool { s.id != id });
    let resolvedNumber = resolveSeasonNumber(otherSeasons, input.animeId, input.seasonNumber);

    var found : ?Types.Season = null;
    let updated = seasons.map(func(s : Types.Season) : Types.Season {
      if (s.id == id) {
        let u = { s with seasonNumber = resolvedNumber; name = input.name; animeId = input.animeId };
        found := ?u;
        u;
      } else {
        s;
      };
    });
    switch (found) {
      case (?s) (?toPublic(s), updated);
      case null (null, seasons);
    };
  };

  public func delete(seasons : [Types.Season], id : Common.SeasonId) : (Bool, [Types.Season]) {
    let before = seasons.size();
    let updated = seasons.filter(func(s : Types.Season) : Bool { s.id != id });
    let deleted = updated.size() < before;
    (deleted, updated);
  };

  // ── Data migration ───────────────────────────────────────────────────────────

  /// Fix any seasons where seasonNumber == 0. Groups by animeId and reassigns
  /// sequential numbers starting from 1, preserving the existing createdAt order.
  /// Seasons that already have seasonNumber >= 1 are not touched.
  public func migrateSeasonNumbers(seasons : [Types.Season]) : [Types.Season] {
    // Collect all distinct animeIds that have bad seasons
    var hasZero = false;
    for (s in seasons.values()) {
      if (s.seasonNumber == 0) { hasZero := true };
    };
    if (not hasZero) { return seasons };

    // Sort entire list by (animeId, createdAt) so we assign numbers in creation order
    let sorted = seasons.sort(func(a : Types.Season, b : Types.Season) : Order.Order {
      if (a.animeId < b.animeId) { #less }
      else if (a.animeId > b.animeId) { #greater }
      else {
        // same anime — sort by createdAt ascending (Int compare)
        if (a.createdAt < b.createdAt) { #less }
        else if (a.createdAt > b.createdAt) { #greater }
        else { #equal };
      };
    });

    // Walk through; for each anime, track the next number to assign to zero-seasons
    // We keep per-anime counters using a simple scan approach
    var result : [Types.Season] = [];
    for (s in sorted.values()) {
      if (s.seasonNumber == 0) {
        // Count how many seasons for this anime are already in result (fixed or original >= 1)
        let alreadyCount = result.filter(func(r : Types.Season) : Bool { r.animeId == s.animeId }).size();
        let fixedNumber = alreadyCount + 1;
        let fixed : Types.Season = { s with seasonNumber = fixedNumber };
        result := result.concat([fixed]);
      } else {
        result := result.concat([s]);
      };
    };
    result;
  };
};
