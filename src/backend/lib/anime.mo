import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Types "../types/anime";
import Common "../types/common";

module {
  public func toPublic(self : Types.Anime) : Types.AnimePublic {
    {
      id = self.id;
      title = self.title;
      description = self.description;
      genres = self.genres;
      rating = self.rating;
      coverImageUrl = self.coverImageUrl;
      isFeatured = self.isFeatured;
      createdAt = self.createdAt;
      viewCount = self.viewCount;
    };
  };

  public func new(id : Common.AnimeId, input : Types.AnimeInput, createdAt : Common.Timestamp) : Types.Anime {
    {
      id;
      title = input.title;
      description = input.description;
      genres = input.genres;
      rating = input.rating;
      coverImageUrl = input.coverImageUrl;
      isFeatured = input.isFeatured;
      createdAt;
      viewCount = 0;
    };
  };

  /// Returns all anime sorted by createdAt descending (newest first)
  public func getAll(animes : [Types.Anime]) : [Types.AnimePublic] {
    let sorted = animes.sort(func(a : Types.Anime, b : Types.Anime) : Order.Order {
      if (a.createdAt > b.createdAt) { #less }
      else if (a.createdAt < b.createdAt) { #greater }
      else { #equal };
    });
    sorted.map<Types.Anime, Types.AnimePublic>(toPublic);
  };

  public func getById(animes : [Types.Anime], id : Common.AnimeId) : ?Types.AnimePublic {
    switch (animes.find(func(a : Types.Anime) : Bool { a.id == id })) {
      case (?a) ?toPublic(a);
      case null null;
    };
  };

  /// Returns top 5 featured anime sorted by viewCount descending
  public func getFeatured(animes : [Types.Anime]) : [Types.AnimePublic] {
    let featured = animes.filter(func(a : Types.Anime) : Bool { a.isFeatured });
    let sorted = featured.sort(func(a : Types.Anime, b : Types.Anime) : Order.Order {
      if (a.viewCount > b.viewCount) { #less }
      else if (a.viewCount < b.viewCount) { #greater }
      else { #equal };
    });
    let top5 = if (sorted.size() > 5) {
      sorted.sliceToArray(0, 5);
    } else {
      sorted;
    };
    top5.map<Types.Anime, Types.AnimePublic>(toPublic);
  };

  /// Case-insensitive search across title, description, and genres
  public func search(animes : [Types.Anime], term : Text) : [Types.AnimePublic] {
    let lower = term.toLower();
    animes.filter(func(a : Types.Anime) : Bool {
      a.title.toLower().contains(#text lower)
      or a.description.toLower().contains(#text lower)
      or a.genres.any(func(g : Text) : Bool { g.toLower().contains(#text lower) })
    }).map<Types.Anime, Types.AnimePublic>(toPublic);
  };

  public func filterByGenre(animes : [Types.Anime], genre : Text) : [Types.AnimePublic] {
    let lower = genre.toLower();
    animes.filter(func(a : Types.Anime) : Bool {
      a.genres.any(func(g : Text) : Bool { g.toLower() == lower })
    }).map<Types.Anime, Types.AnimePublic>(toPublic);
  };

  /// Returns (result, newAnimes) — caller must reassign the stable var.
  /// Validates: title must not be empty.
  public func create(animes : [Types.Anime], nextId : Nat, input : Types.AnimeInput, createdAt : Common.Timestamp) : (Types.AnimePublic, [Types.Anime]) {
    if (input.title.size() == 0) {
      Runtime.trap("Anime title must not be empty");
    };
    let id = "anime-" # nextId.toText();
    let anime = new(id, input, createdAt);
    let newAnimes = animes.concat([anime]);
    (toPublic(anime), newAnimes);
  };

  public func update(animes : [Types.Anime], id : Common.AnimeId, input : Types.AnimeInput) : (?Types.AnimePublic, [Types.Anime]) {
    var result : ?Types.AnimePublic = null;
    let newAnimes = animes.map(func(a : Types.Anime) : Types.Anime {
      if (a.id == id) {
        let updated : Types.Anime = {
          a with
          title = input.title;
          description = input.description;
          genres = input.genres;
          rating = input.rating;
          coverImageUrl = input.coverImageUrl;
          isFeatured = input.isFeatured;
        };
        result := ?toPublic(updated);
        updated;
      } else { a };
    });
    (result, newAnimes);
  };

  public func delete(animes : [Types.Anime], id : Common.AnimeId) : (Bool, [Types.Anime]) {
    let newAnimes = animes.filter(func(a : Types.Anime) : Bool { a.id != id });
    (newAnimes.size() < animes.size(), newAnimes);
  };

  public func incrementViewCount(animes : [Types.Anime], id : Common.AnimeId) : [Types.Anime] {
    animes.map<Types.Anime, Types.Anime>(func(a : Types.Anime) : Types.Anime {
      if (a.id == id) { { a with viewCount = a.viewCount + 1 } } else { a };
    });
  };

  // Returns (newAnimes, nextId) — caller must reassign stable vars.
  // Guard: if data already exists (size > 0), returns unchanged.
  public func seedSampleData(animes : [Types.Anime], nextId : Nat, createdAt : Common.Timestamp) : ([Types.Anime], Nat) {
    if (animes.size() > 0) { return (animes, nextId) };

    let samples : [Types.AnimeInput] = [
      // anime-0
      {
        title = "Naruto";
        description = "Naruto Uzumaki is a young ninja with a powerful fox spirit sealed inside him. Shunned by his village, he dreams of becoming Hokage, the greatest ninja, and protector of his people.";
        genres = ["Action", "Adventure", "Comedy", "Fantasy"];
        rating = 8.3;
        coverImageUrl = "https://cdn.myanimelist.net/images/anime/13/17405.jpg";
        isFeatured = true;
      },
      // anime-1
      {
        title = "Attack on Titan";
        description = "Humanity lives inside cities surrounded by enormous walls due to Titans, gigantic humanoid beings who devour humans. A young boy vows to exterminate them after his hometown is destroyed.";
        genres = ["Action", "Drama", "Fantasy", "Horror"];
        rating = 9.0;
        coverImageUrl = "https://cdn.myanimelist.net/images/anime/10/47347.jpg";
        isFeatured = true;
      },
      // anime-2
      {
        title = "One Piece";
        description = "Monkey D. Luffy sets out to find the legendary treasure One Piece and become the Pirate King. He recruits a crew of diverse nakama and battles the Grand Line's most fearsome pirates and marines.";
        genres = ["Action", "Adventure", "Comedy", "Fantasy"];
        rating = 8.7;
        coverImageUrl = "https://cdn.myanimelist.net/images/anime/6/73245.jpg";
        isFeatured = true;
      },
      // anime-3
      {
        title = "Dragon Ball Z";
        description = "Goku and his allies defend Earth against an ever-escalating series of villains including Saiyans, Frieza, and the androids. Each arc pushes the heroes to surpass their limits.";
        genres = ["Action", "Adventure", "Sci-Fi", "Fantasy"];
        rating = 8.2;
        coverImageUrl = "https://cdn.myanimelist.net/images/anime/1277/142061.jpg";
        isFeatured = true;
      },
      // anime-4
      {
        title = "Death Note";
        description = "Light Yagami discovers a supernatural notebook that kills anyone whose name is written in it. He uses it to create a crime-free world as Kira, but genius detective L is on his trail.";
        genres = ["Mystery", "Psychological", "Thriller", "Supernatural"];
        rating = 8.6;
        coverImageUrl = "https://cdn.myanimelist.net/images/anime/9/9453.jpg";
        isFeatured = true;
      },
      // anime-5
      {
        title = "Demon Slayer";
        description = "Tanjiro Kamado joins the Demon Slayer Corps after his family is slaughtered and his sister Nezuko is turned into a demon. He trains relentlessly to find a cure and avenge his family.";
        genres = ["Action", "Fantasy", "Historical", "Drama"];
        rating = 8.7;
        coverImageUrl = "https://cdn.myanimelist.net/images/anime/1286/99889.jpg";
        isFeatured = true;
      },
      // anime-6
      {
        title = "My Hero Academia";
        description = "In a world where 80% of people have superpowers called Quirks, Izuku Midoriya is born without one. He inherits the greatest power from the world's top hero and enrols in a prestigious hero school.";
        genres = ["Action", "School", "Sci-Fi", "Super Power"];
        rating = 8.0;
        coverImageUrl = "https://cdn.myanimelist.net/images/anime/10/78745.jpg";
        isFeatured = false;
      },
      // anime-7
      {
        title = "Sword Art Online";
        description = "Ten thousand players are trapped inside the virtual reality MMORPG Sword Art Online with no way to log out. Death in the game means death in the real world.";
        genres = ["Action", "Fantasy", "Romance", "Sci-Fi"];
        rating = 7.8;
        coverImageUrl = "https://cdn.myanimelist.net/images/anime/11/39717.jpg";
        isFeatured = false;
      },
    ];

    var idCounter = nextId;
    var result = animes;
    for (input in samples.values()) {
      let id = "anime-" # idCounter.toText();
      result := result.concat([new(id, input, createdAt)]);
      idCounter += 1;
    };
    (result, idCounter);
  };
};
