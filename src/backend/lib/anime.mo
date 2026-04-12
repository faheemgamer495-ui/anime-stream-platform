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

  public func getAll(animes : [Types.Anime]) : [Types.AnimePublic] {
    animes.map<Types.Anime, Types.AnimePublic>(toPublic);
  };

  public func getById(animes : [Types.Anime], id : Common.AnimeId) : ?Types.AnimePublic {
    switch (animes.find(func(a : Types.Anime) : Bool { a.id == id })) {
      case (?a) ?toPublic(a);
      case null null;
    };
  };

  public func getFeatured(animes : [Types.Anime]) : [Types.AnimePublic] {
    animes.filter(func(a : Types.Anime) : Bool { a.isFeatured })
      .map<Types.Anime, Types.AnimePublic>(toPublic);
  };

  public func search(animes : [Types.Anime], term : Text) : [Types.AnimePublic] {
    let lower = term.toLower();
    animes.filter(func(a : Types.Anime) : Bool {
      a.title.toLower().contains(#text lower)
    }).map<Types.Anime, Types.AnimePublic>(toPublic);
  };

  public func filterByGenre(animes : [Types.Anime], genre : Text) : [Types.AnimePublic] {
    let lower = genre.toLower();
    animes.filter(func(a : Types.Anime) : Bool {
      a.genres.any(func(g : Text) : Bool { g.toLower() == lower })
    }).map<Types.Anime, Types.AnimePublic>(toPublic);
  };

  // Returns (result, newAnimes) — caller must reassign the stable var
  public func create(animes : [Types.Anime], nextId : Nat, input : Types.AnimeInput, createdAt : Common.Timestamp) : (Types.AnimePublic, [Types.Anime]) {
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

  // Returns (newAnimes, nextId) — caller must reassign stable vars
  public func seedSampleData(animes : [Types.Anime], nextId : Nat, createdAt : Common.Timestamp) : ([Types.Anime], Nat) {
    // Guard: if data already exists, never overwrite it
    if (animes.size() > 0) { return (animes, nextId) };
    let samples : [Types.AnimeInput] = [
      {
        title = "Attack on Titan";
        description = "Humanity lives inside cities surrounded by enormous walls due to Titans, gigantic humanoid beings who devour humans. A young boy vows to exterminate them after his hometown is destroyed.";
        genres = ["Action", "Drama", "Fantasy"];
        rating = 9.0;
        coverImageUrl = "https://picsum.photos/seed/aot/400/600";
        isFeatured = true;
      },
      {
        title = "Your Lie in April";
        description = "A piano prodigy who lost the ability to hear his own playing meets a free-spirited violinist who helps him return to the music world.";
        genres = ["Romance", "Drama", "Music"];
        rating = 8.7;
        coverImageUrl = "https://picsum.photos/seed/ylia/400/600";
        isFeatured = false;
      },
      {
        title = "Sword Art Online";
        description = "Ten thousand players are trapped inside the virtual reality MMORPG Sword Art Online with no way to log out.";
        genres = ["Action", "Fantasy", "Sci-Fi"];
        rating = 7.8;
        coverImageUrl = "https://picsum.photos/seed/sao/400/600";
        isFeatured = true;
      },
      {
        title = "Steins;Gate";
        description = "A self-proclaimed mad scientist accidentally discovers a method of sending messages to the past, leading to far-reaching and dangerous consequences.";
        genres = ["Sci-Fi", "Thriller", "Drama"];
        rating = 9.1;
        coverImageUrl = "https://picsum.photos/seed/sg/400/600";
        isFeatured = false;
      },
      {
        title = "Re:Zero";
        description = "Subaru is summoned to a fantasy world with no powers except the ability to return to a specific point in time after dying.";
        genres = ["Fantasy", "Thriller", "Drama"];
        rating = 8.3;
        coverImageUrl = "https://picsum.photos/seed/rezero/400/600";
        isFeatured = false;
      },
      {
        title = "Konosuba";
        description = "After dying a laughable death, a teen is sent to a fantasy world with the useless goddess Aqua and forms an eccentric party of adventurers.";
        genres = ["Comedy", "Fantasy", "Adventure"];
        rating = 8.2;
        coverImageUrl = "https://picsum.photos/seed/konosuba/400/600";
        isFeatured = false;
      },
      {
        title = "Fullmetal Alchemist: Brotherhood";
        description = "Two brothers search for a Philosopher's Stone after an attempt to revive their deceased mother goes wrong, leaving them in damaged physical forms.";
        genres = ["Action", "Adventure", "Fantasy"];
        rating = 9.1;
        coverImageUrl = "https://picsum.photos/seed/fmab/400/600";
        isFeatured = true;
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
