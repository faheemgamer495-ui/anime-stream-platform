import Types "../types/episode";
import Common "../types/common";

module {
  public func new(id : Common.EpisodeId, input : Types.EpisodeInput, createdAt : Common.Timestamp) : Types.Episode {
    {
      id;
      animeId = input.animeId;
      seasonId = input.seasonId;
      episodeNumber = input.episodeNumber;
      title = input.title;
      description = input.description;
      videoUrl = input.videoUrl;
      thumbnailUrl = input.thumbnailUrl;
      duration = input.duration;
      createdAt;
    };
  };

  public func getByAnime(episodes : [Types.Episode], animeId : Common.AnimeId) : [Types.Episode] {
    episodes.filter(func(e : Types.Episode) : Bool { e.animeId == animeId });
  };

  public func getById(episodes : [Types.Episode], id : Common.EpisodeId) : ?Types.Episode {
    episodes.find(func(e : Types.Episode) : Bool { e.id == id });
  };

  // Returns (episode, newEpisodes)
  public func create(episodes : [Types.Episode], nextId : Nat, input : Types.EpisodeInput, createdAt : Common.Timestamp) : (Types.Episode, [Types.Episode]) {
    let id = "ep-" # nextId.toText();
    let episode = new(id, input, createdAt);
    let newEpisodes = episodes.concat([episode]);
    (episode, newEpisodes);
  };

  // Returns (?episode, newEpisodes)
  public func update(episodes : [Types.Episode], id : Common.EpisodeId, input : Types.EpisodeInput) : (?Types.Episode, [Types.Episode]) {
    var result : ?Types.Episode = null;
    let newEpisodes = episodes.map(func(e : Types.Episode) : Types.Episode {
      if (e.id == id) {
        let updated : Types.Episode = {
          e with
          animeId = input.animeId;
          seasonId = input.seasonId;
          episodeNumber = input.episodeNumber;
          title = input.title;
          description = input.description;
          videoUrl = input.videoUrl;
          thumbnailUrl = input.thumbnailUrl;
          duration = input.duration;
        };
        result := ?updated;
        updated;
      } else { e };
    });
    (result, newEpisodes);
  };

  /// Sets seasonId to null for every episode linked to the given season.
  /// Episodes are preserved — only the season reference is cleared.
  public func unlinkBySeason(episodes : [Types.Episode], seasonId : Common.SeasonId) : [Types.Episode] {
    episodes.map(func(e : Types.Episode) : Types.Episode {
      switch (e.seasonId) {
        case (?sid) if (sid == seasonId) { { e with seasonId = null } } else { e };
        case null e;
      };
    });
  };

  // Returns (deleted, newEpisodes)
  public func delete(episodes : [Types.Episode], id : Common.EpisodeId) : (Bool, [Types.Episode]) {
    let newEpisodes = episodes.filter(func(e : Types.Episode) : Bool { e.id != id });
    (newEpisodes.size() < episodes.size(), newEpisodes);
  };

  // Returns (newEpisodes, nextId)
  public func seedSampleData(episodes : [Types.Episode], nextId : Nat, createdAt : Common.Timestamp) : ([Types.Episode], Nat) {
    // Guard: if data already exists, never overwrite it
    if (episodes.size() > 0) { return (episodes, nextId) };
    let bbb = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
    let ed = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4";
    let fw = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4";

    let samples : [Types.EpisodeInput] = [
      // Attack on Titan (anime-0)
      { animeId = "anime-0"; seasonId = null; episodeNumber = 1; title = "To You, 2000 Years From Now"; description = "The Titans break through the wall, and Eren witnesses the horror of their attack on his hometown."; videoUrl = bbb; thumbnailUrl = ?"https://picsum.photos/seed/aot-ep1/320/180"; duration = ?"24:00" },
      { animeId = "anime-0"; seasonId = null; episodeNumber = 2; title = "That Day"; description = "Eren and Mikasa join the military to fight back against the Titans."; videoUrl = ed; thumbnailUrl = ?"https://picsum.photos/seed/aot-ep2/320/180"; duration = ?"24:00" },
      { animeId = "anime-0"; seasonId = null; episodeNumber = 3; title = "A Dim Light Amid Despair"; description = "The new recruits face grueling training as they learn to use the vertical maneuvering equipment."; videoUrl = fw; thumbnailUrl = ?"https://picsum.photos/seed/aot-ep3/320/180"; duration = ?"24:00" },
      // Your Lie in April (anime-1)
      { animeId = "anime-1"; seasonId = null; episodeNumber = 1; title = "Monotone/Colorful"; description = "Kousei Arima, a former piano prodigy, meets the free-spirited violinist Kaori Miyazono."; videoUrl = bbb; thumbnailUrl = ?"https://picsum.photos/seed/ylia-ep1/320/180"; duration = ?"22:00" },
      { animeId = "anime-1"; seasonId = null; episodeNumber = 2; title = "Friend A"; description = "Kaori asks Kousei to be her accompanist for an upcoming competition."; videoUrl = ed; thumbnailUrl = ?"https://picsum.photos/seed/ylia-ep2/320/180"; duration = ?"22:00" },
      // Sword Art Online (anime-2)
      { animeId = "anime-2"; seasonId = null; episodeNumber = 1; title = "The World of Swords"; description = "Ten thousand players are trapped inside the virtual world of Sword Art Online."; videoUrl = bbb; thumbnailUrl = ?"https://picsum.photos/seed/sao-ep1/320/180"; duration = ?"24:00" },
      { animeId = "anime-2"; seasonId = null; episodeNumber = 2; title = "Beater"; description = "Kirito joins a party to fight the first floor boss."; videoUrl = ed; thumbnailUrl = ?"https://picsum.photos/seed/sao-ep2/320/180"; duration = ?"24:00" },
      { animeId = "anime-2"; seasonId = null; episodeNumber = 3; title = "Red-Nosed Reindeer"; description = "Kirito meets a girl named Sachi and joins her guild."; videoUrl = fw; thumbnailUrl = ?"https://picsum.photos/seed/sao-ep3/320/180"; duration = ?"24:00" },
      // Steins;Gate (anime-3)
      { animeId = "anime-3"; seasonId = null; episodeNumber = 1; title = "Prologue of the Beginning and End"; description = "Rintaro Okabe attends a conference and discovers a dead girl who later appears alive."; videoUrl = bbb; thumbnailUrl = ?"https://picsum.photos/seed/sg-ep1/320/180"; duration = ?"24:00" },
      { animeId = "anime-3"; seasonId = null; episodeNumber = 2; title = "Time Travel Paranoia"; description = "Okabe and his friends discover their Phone Microwave can send text messages to the past."; videoUrl = ed; thumbnailUrl = ?"https://picsum.photos/seed/sg-ep2/320/180"; duration = ?"24:00" },
      // Re:Zero (anime-4)
      { animeId = "anime-4"; seasonId = null; episodeNumber = 1; title = "The Land of Roswaal"; description = "Subaru is summoned to a fantasy world and meets the silver-haired half-elf Emilia."; videoUrl = bbb; thumbnailUrl = ?"https://picsum.photos/seed/rz-ep1/320/180"; duration = ?"48:00" },
      { animeId = "anime-4"; seasonId = null; episodeNumber = 2; title = "Reunion and Separation"; description = "Subaru discovers his power to Return by Death after a tragic encounter."; videoUrl = ed; thumbnailUrl = ?"https://picsum.photos/seed/rz-ep2/320/180"; duration = ?"24:00" },
      // Konosuba (anime-5)
      { animeId = "anime-5"; seasonId = null; episodeNumber = 1; title = "Give Me Deliverance from This Twisted World!"; description = "Kazuma Sato dies and is sent to a fantasy world with the useless goddess Aqua."; videoUrl = bbb; thumbnailUrl = ?"https://picsum.photos/seed/ks-ep1/320/180"; duration = ?"22:00" },
      { animeId = "anime-5"; seasonId = null; episodeNumber = 2; title = "An Explosion for This Chunibyo!"; description = "The party recruits the explosion-obsessed mage Megumin."; videoUrl = ed; thumbnailUrl = ?"https://picsum.photos/seed/ks-ep2/320/180"; duration = ?"22:00" },
      // Fullmetal Alchemist: Brotherhood (anime-6)
      { animeId = "anime-6"; seasonId = null; episodeNumber = 1; title = "Fullmetal Alchemist"; description = "Edward and Alphonse Elric arrive in Liore searching for the Philosopher's Stone."; videoUrl = bbb; thumbnailUrl = ?"https://picsum.photos/seed/fma-ep1/320/180"; duration = ?"24:00" },
      { animeId = "anime-6"; seasonId = null; episodeNumber = 2; title = "The First Day"; description = "A flashback reveals the brothers' childhood and their attempt to resurrect their mother."; videoUrl = ed; thumbnailUrl = ?"https://picsum.photos/seed/fma-ep2/320/180"; duration = ?"24:00" },
      { animeId = "anime-6"; seasonId = null; episodeNumber = 3; title = "City of Heresy"; description = "The Elrics investigate the military's connection to Father Cornello."; videoUrl = fw; thumbnailUrl = ?"https://picsum.photos/seed/fma-ep3/320/180"; duration = ?"24:00" },
    ];

    var idCounter = nextId;
    var result = episodes;
    for (input in samples.values()) {
      let id = "ep-" # idCounter.toText();
      result := result.concat([new(id, input, createdAt)]);
      idCounter += 1;
    };
    (result, idCounter);
  };
};
