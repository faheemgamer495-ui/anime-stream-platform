import Order "mo:core/Order";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";
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

  /// Returns ALL episodes (for admin panel listing).
  public func getAll(episodes : [Types.Episode]) : [Types.Episode] {
    episodes;
  };

  /// Returns episodes for a season sorted by episodeNumber ascending
  public func getBySeason(episodes : [Types.Episode], seasonId : Common.SeasonId) : [Types.Episode] {
    let filtered = episodes.filter(func(e : Types.Episode) : Bool {
      switch (e.seasonId) {
        case (?sid) sid == seasonId;
        case null false;
      };
    });
    filtered.sort(func(a : Types.Episode, b : Types.Episode) : Order.Order {
      Nat.compare(a.episodeNumber, b.episodeNumber);
    });
  };

  /// Returns (episode, newEpisodes).
  /// Validates: title and videoUrl must not be empty.
  public func create(episodes : [Types.Episode], nextId : Nat, input : Types.EpisodeInput, createdAt : Common.Timestamp) : (Types.Episode, [Types.Episode]) {
    if (input.title.size() == 0) Runtime.trap("Episode title must not be empty");
    if (input.videoUrl.size() == 0) Runtime.trap("Episode videoUrl must not be empty");
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

  /// Idempotent migration: ensure Naruto Season 1 Episode 1 uses the Google Drive embed URL.
  /// - If ep already has the correct URL → returns episodes unchanged.
  /// - If ep exists with a different URL → updates videoUrl and description.
  /// - If ep does not exist → creates it (using nextId; caller must post-increment nextEpisodeId).
  /// Returns { episodes; nextEpisodeId } record to avoid tuple destructuring at actor top level.
  public func migrateNarutoEp1(
    episodes : [Types.Episode],
    nextId : Nat,
    createdAt : Common.Timestamp,
  ) : { episodes : [Types.Episode]; nextEpisodeId : Nat } {
    let targetUrl = "https://drive.google.com/file/d/1nZ4OkqULiKpkCe-aGzMeawrCUciWKOU6/preview";

    // Check if the correct episode already exists
    let alreadyOk = episodes.find(func(e : Types.Episode) : Bool {
      e.animeId == "anime-0" and e.episodeNumber == 1
      and (switch (e.seasonId) { case (?"season-0") true; case _ false })
      and e.videoUrl == targetUrl
    });
    switch (alreadyOk) {
      case (?_) { return { episodes; nextEpisodeId = nextId } }; // nothing to do
      case null {};
    };

    // Check if ep exists with wrong URL
    let wrongUrl = episodes.find(func(e : Types.Episode) : Bool {
      e.animeId == "anime-0" and e.episodeNumber == 1
      and (switch (e.seasonId) { case (?"season-0") true; case _ false })
    });
    switch (wrongUrl) {
      case (?ep) {
        // Patch the URL in place
        let epId = ep.id;
        let patched = episodes.map(func(e : Types.Episode) : Types.Episode {
          if (e.id == epId) {
            { e with videoUrl = targetUrl; description = "Naruto Season 1 Episode 1" }
          } else { e }
        });
        return { episodes = patched; nextEpisodeId = nextId };
      };
      case null {};
    };

    // Episode doesn't exist at all — create it
    let id = "ep-" # nextId.toText();
    let ep : Types.Episode = {
      id;
      animeId = "anime-0";
      seasonId = ?"season-0";
      episodeNumber = 1;
      title = "Enter: Naruto Uzumaki!";
      description = "Naruto Season 1 Episode 1";
      videoUrl = targetUrl;
      thumbnailUrl = ?"https://cdn.myanimelist.net/images/anime/13/17405.jpg";
      duration = ?"23:00";
      createdAt;
    };
    { episodes = episodes.concat([ep]); nextEpisodeId = nextId + 1 };
  };

  // Returns (newEpisodes, nextId)
  // Season ID mapping: anime-N has S1="season-{N*2}", S2="season-{N*2+1}"
  public func seedSampleData(episodes : [Types.Episode], nextId : Nat, createdAt : Common.Timestamp) : ([Types.Episode], Nat) {
    if (episodes.size() > 0) { return (episodes, nextId) };

    let bbb = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
    let ed  = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4";
    let fw  = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4";
    let fbb = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4";
    let sub = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4";
    let ts  = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4";

    // Helper: season-{animeIdx * 2 + offset}
    // Season 1 offset = 0, Season 2 offset = 1

    let samples : [Types.EpisodeInput] = [
      // ── Naruto (anime-0) ────────────────────────────────────────────────────
      // Season 1 (season-0)
      { animeId = "anime-0"; seasonId = ?"season-0"; episodeNumber = 1; title = "Enter: Naruto Uzumaki!"; description = "Naruto Season 1 Episode 1"; videoUrl = "https://drive.google.com/file/d/1nZ4OkqULiKpkCe-aGzMeawrCUciWKOU6/preview"; thumbnailUrl = ?"https://cdn.myanimelist.net/images/anime/13/17405.jpg"; duration = ?"23:00" },
      { animeId = "anime-0"; seasonId = ?"season-0"; episodeNumber = 2; title = "My Name is Konohamaru!"; description = "Naruto meets the Hokage's grandson who asks to be his student."; videoUrl = ed; thumbnailUrl = ?"https://cdn.myanimelist.net/images/anime/13/17405.jpg"; duration = ?"23:00" },
      { animeId = "anime-0"; seasonId = ?"season-0"; episodeNumber = 3; title = "Sasuke and Sakura: Friends or Foes?"; description = "Naruto, Sasuke, and Sakura are placed on Team 7 under Kakashi-sensei."; videoUrl = fw; thumbnailUrl = ?"https://cdn.myanimelist.net/images/anime/13/17405.jpg"; duration = ?"23:00" },
      // Season 2 (season-1)
      { animeId = "anime-0"; seasonId = ?"season-1"; episodeNumber = 1; title = "The Chunin Exams Begin!"; description = "Naruto and his team enter the Chunin Selection Exams, facing the intimidating Gaara."; videoUrl = fbb; thumbnailUrl = ?"https://cdn.myanimelist.net/images/anime/13/17405.jpg"; duration = ?"23:00" },
      { animeId = "anime-0"; seasonId = ?"season-1"; episodeNumber = 2; title = "Rivals"; description = "Team 7 faces rivals from other villages in the intense Forest of Death."; videoUrl = sub; thumbnailUrl = ?"https://cdn.myanimelist.net/images/anime/13/17405.jpg"; duration = ?"23:00" },
      { animeId = "anime-0"; seasonId = ?"season-1"; episodeNumber = 3; title = "The Scroll's Secret"; description = "Naruto and Sasuke decipher the scroll and unlock new ninjutsu."; videoUrl = ts; thumbnailUrl = ?"https://cdn.myanimelist.net/images/anime/13/17405.jpg"; duration = ?"23:00" },

      // ── Attack on Titan (anime-1) ───────────────────────────────────────────
      // Season 1 (season-2)
      { animeId = "anime-1"; seasonId = ?"season-2"; episodeNumber = 1; title = "To You, 2000 Years From Now"; description = "The Titans break through Wall Maria. Eren witnesses the horror of their attack on his hometown."; videoUrl = bbb; thumbnailUrl = ?"https://cdn.myanimelist.net/images/anime/10/47347.jpg"; duration = ?"24:00" },
      { animeId = "anime-1"; seasonId = ?"season-2"; episodeNumber = 2; title = "That Day"; description = "Eren and Mikasa enlist in the military to fight back against the Titans."; videoUrl = ed; thumbnailUrl = ?"https://cdn.myanimelist.net/images/anime/10/47347.jpg"; duration = ?"24:00" },
      { animeId = "anime-1"; seasonId = ?"season-2"; episodeNumber = 3; title = "A Dim Light Amid Despair"; description = "The recruits face gruelling training as they master the vertical maneuvering equipment."; videoUrl = fw; thumbnailUrl = ?"https://cdn.myanimelist.net/images/anime/10/47347.jpg"; duration = ?"24:00" },
      // Season 2 (season-3)
      { animeId = "anime-1"; seasonId = ?"season-3"; episodeNumber = 1; title = "Beast Titan"; description = "A mysterious Titan appears on top of Wall Rose. The Survey Corps mobilises."; videoUrl = fbb; thumbnailUrl = ?"https://cdn.myanimelist.net/images/anime/10/47347.jpg"; duration = ?"24:00" },
      { animeId = "anime-1"; seasonId = ?"season-3"; episodeNumber = 2; title = "I'm Home"; description = "Connie discovers a shocking secret in his village. Ymir reveals her Titan form."; videoUrl = sub; thumbnailUrl = ?"https://cdn.myanimelist.net/images/anime/10/47347.jpg"; duration = ?"24:00" },
      { animeId = "anime-1"; seasonId = ?"season-3"; episodeNumber = 3; title = "Warrior"; description = "Reiner and Bertholdt reveal their true identities as the Armored and Colossal Titans."; videoUrl = ts; thumbnailUrl = ?"https://cdn.myanimelist.net/images/anime/10/47347.jpg"; duration = ?"24:00" },

      // ── One Piece (anime-2) ────────────────────────────────────────────────
      // Season 1 (season-4)
      { animeId = "anime-2"; seasonId = ?"season-4"; episodeNumber = 1; title = "I'm Luffy! The Man Who's Gonna Be King of the Pirates!"; description = "A young Luffy meets pirate Red-Haired Shanks and eats the Gum-Gum Devil Fruit."; videoUrl = bbb; thumbnailUrl = ?"https://cdn.myanimelist.net/images/anime/6/73245.jpg"; duration = ?"24:00" },
      { animeId = "anime-2"; seasonId = ?"season-4"; episodeNumber = 2; title = "The Great Swordsman Appears! Pirate Hunter Roronoa Zoro!"; description = "Luffy sets out and rescues the legendary swordsman Zoro, who joins the crew."; videoUrl = ed; thumbnailUrl = ?"https://cdn.myanimelist.net/images/anime/6/73245.jpg"; duration = ?"24:00" },
      { animeId = "anime-2"; seasonId = ?"season-4"; episodeNumber = 3; title = "Morgan versus Luffy! Who's This Beautiful Young Girl?"; description = "Luffy and Zoro confront the corrupt Marine Captain Morgan and meet Nami."; videoUrl = fw; thumbnailUrl = ?"https://cdn.myanimelist.net/images/anime/6/73245.jpg"; duration = ?"24:00" },
      // Season 2 (season-5)
      { animeId = "anime-2"; seasonId = ?"season-5"; episodeNumber = 1; title = "Enter the Great Swordsman! Pirate Hunter Zoro Reborn"; description = "The Straw Hats sail toward the Grand Line and face the Marines."; videoUrl = fbb; thumbnailUrl = ?"https://cdn.myanimelist.net/images/anime/6/73245.jpg"; duration = ?"24:00" },
      { animeId = "anime-2"; seasonId = ?"season-5"; episodeNumber = 2; title = "Baroque Works"; description = "The crew encounters agents of the secret organisation Baroque Works."; videoUrl = sub; thumbnailUrl = ?"https://cdn.myanimelist.net/images/anime/6/73245.jpg"; duration = ?"24:00" },
      { animeId = "anime-2"; seasonId = ?"season-5"; episodeNumber = 3; title = "The Town of the Beginning and the End"; description = "In Whisky Peak the crew discovers the town hides deadly bounty hunters."; videoUrl = ts; thumbnailUrl = ?"https://cdn.myanimelist.net/images/anime/6/73245.jpg"; duration = ?"24:00" },

      // ── Dragon Ball Z (anime-3) ────────────────────────────────────────────
      // Season 1 (season-6)
      { animeId = "anime-3"; seasonId = ?"season-6"; episodeNumber = 1; title = "The New Threat"; description = "Raditz arrives on Earth and reveals Goku's Saiyan heritage, kidnapping Gohan."; videoUrl = bbb; thumbnailUrl = ?"https://cdn.myanimelist.net/images/anime/1277/142061.jpg"; duration = ?"23:00" },
      { animeId = "anime-3"; seasonId = ?"season-6"; episodeNumber = 2; title = "Reunions"; description = "Goku reunites with Piccolo to fight Raditz in a desperate alliance."; videoUrl = ed; thumbnailUrl = ?"https://cdn.myanimelist.net/images/anime/1277/142061.jpg"; duration = ?"23:00" },
      { animeId = "anime-3"; seasonId = ?"season-6"; episodeNumber = 3; title = "Unlikely Alliance"; description = "Goku and Piccolo sacrifice everything to defeat Raditz."; videoUrl = fw; thumbnailUrl = ?"https://cdn.myanimelist.net/images/anime/1277/142061.jpg"; duration = ?"23:00" },
      // Season 2 (season-7)
      { animeId = "anime-3"; seasonId = ?"season-7"; episodeNumber = 1; title = "Goku's Ordeal"; description = "Frieza arrives on Namek. Goku trains at 100× gravity aboard his ship."; videoUrl = fbb; thumbnailUrl = ?"https://cdn.myanimelist.net/images/anime/1277/142061.jpg"; duration = ?"23:00" },
      { animeId = "anime-3"; seasonId = ?"season-7"; episodeNumber = 2; title = "The Eldest Namek"; description = "Krillin and Gohan seek the Eldest Namek to unlock their hidden power."; videoUrl = sub; thumbnailUrl = ?"https://cdn.myanimelist.net/images/anime/1277/142061.jpg"; duration = ?"23:00" },
      { animeId = "anime-3"; seasonId = ?"season-7"; episodeNumber = 3; title = "Super Saiyan!"; description = "In a furious battle, Goku's grief over Krillin's death awakens the Super Saiyan transformation."; videoUrl = ts; thumbnailUrl = ?"https://cdn.myanimelist.net/images/anime/1277/142061.jpg"; duration = ?"23:00" },

      // ── Death Note (anime-4) ───────────────────────────────────────────────
      // Season 1 (season-8)
      { animeId = "anime-4"; seasonId = ?"season-8"; episodeNumber = 1; title = "Rebirth"; description = "Light Yagami finds the Death Note and tests it on a criminal. Ryuk, the Shinigami, appears to explain the rules."; videoUrl = bbb; thumbnailUrl = ?"https://cdn.myanimelist.net/images/anime/9/9453.jpg"; duration = ?"23:00" },
      { animeId = "anime-4"; seasonId = ?"season-8"; episodeNumber = 2; title = "Confrontation"; description = "The mysterious detective L broadcasts a challenge to Kira. Light accepts."; videoUrl = ed; thumbnailUrl = ?"https://cdn.myanimelist.net/images/anime/9/9453.jpg"; duration = ?"23:00" },
      { animeId = "anime-4"; seasonId = ?"season-8"; episodeNumber = 3; title = "Dealings"; description = "Light joins the Kira investigation task force to misdirect L from his identity."; videoUrl = fw; thumbnailUrl = ?"https://cdn.myanimelist.net/images/anime/9/9453.jpg"; duration = ?"23:00" },
      // Season 2 (season-9)
      { animeId = "anime-4"; seasonId = ?"season-9"; episodeNumber = 1; title = "Silence"; description = "New Kira successors Near and Mello emerge after L's death. The battle of wits restarts."; videoUrl = fbb; thumbnailUrl = ?"https://cdn.myanimelist.net/images/anime/9/9453.jpg"; duration = ?"23:00" },
      { animeId = "anime-4"; seasonId = ?"season-9"; episodeNumber = 2; title = "Pursuit"; description = "Mello kidnaps the Chief's daughter, forcing the task force to act."; videoUrl = sub; thumbnailUrl = ?"https://cdn.myanimelist.net/images/anime/9/9453.jpg"; duration = ?"23:00" },
      { animeId = "anime-4"; seasonId = ?"season-9"; episodeNumber = 3; title = "Unravelling"; description = "Near corners Light as their final confrontation approaches."; videoUrl = ts; thumbnailUrl = ?"https://cdn.myanimelist.net/images/anime/9/9453.jpg"; duration = ?"23:00" },

      // ── Demon Slayer (anime-5) ─────────────────────────────────────────────
      // Season 1 (season-10)
      { animeId = "anime-5"; seasonId = ?"season-10"; episodeNumber = 1; title = "Cruelty"; description = "Tanjiro returns home to find his family slaughtered by a demon. His sister Nezuko has been transformed."; videoUrl = bbb; thumbnailUrl = ?"https://cdn.myanimelist.net/images/anime/1286/99889.jpg"; duration = ?"23:00" },
      { animeId = "anime-5"; seasonId = ?"season-10"; episodeNumber = 2; title = "Trainer Sakonji Urokodaki"; description = "Tanjiro trains under the former Water Hashira, mastering Total Concentration Breathing."; videoUrl = ed; thumbnailUrl = ?"https://cdn.myanimelist.net/images/anime/1286/99889.jpg"; duration = ?"23:00" },
      { animeId = "anime-5"; seasonId = ?"season-10"; episodeNumber = 3; title = "Sabito and Makomo"; description = "The Final Selection tests Tanjiro against demons trapped on Fujikasane Mountain."; videoUrl = fw; thumbnailUrl = ?"https://cdn.myanimelist.net/images/anime/1286/99889.jpg"; duration = ?"23:00" },
      // Season 2 (season-11)
      { animeId = "anime-5"; seasonId = ?"season-11"; episodeNumber = 1; title = "Flame Hashira Kyojuro Rengoku"; description = "Tanjiro boards the Mugen Train and meets the flamboyant Flame Hashira Rengoku."; videoUrl = fbb; thumbnailUrl = ?"https://cdn.myanimelist.net/images/anime/1286/99889.jpg"; duration = ?"23:00" },
      { animeId = "anime-5"; seasonId = ?"season-11"; episodeNumber = 2; title = "Akaza"; description = "The demon Akaza attacks. Rengoku faces his toughest challenge in an unforgettable clash."; videoUrl = sub; thumbnailUrl = ?"https://cdn.myanimelist.net/images/anime/1286/99889.jpg"; duration = ?"23:00" },
      { animeId = "anime-5"; seasonId = ?"season-11"; episodeNumber = 3; title = "Deep within the Entertainment District"; description = "Tanjiro and Inosuke enter the Entertainment District to hunt the demon hidden inside."; videoUrl = ts; thumbnailUrl = ?"https://cdn.myanimelist.net/images/anime/1286/99889.jpg"; duration = ?"23:00" },

      // ── My Hero Academia (anime-6) ─────────────────────────────────────────
      // Season 1 (season-12)
      { animeId = "anime-6"; seasonId = ?"season-12"; episodeNumber = 1; title = "Izuku Midoriya: Origin"; description = "Izuku, born without a Quirk in a world of superpowers, meets his idol All Might and discovers hope."; videoUrl = bbb; thumbnailUrl = ?"https://cdn.myanimelist.net/images/anime/10/78745.jpg"; duration = ?"24:00" },
      { animeId = "anime-6"; seasonId = ?"season-12"; episodeNumber = 2; title = "What It Takes to Be a Hero"; description = "All Might reveals the truth about One For All and offers Izuku the chance to inherit it."; videoUrl = ed; thumbnailUrl = ?"https://cdn.myanimelist.net/images/anime/10/78745.jpg"; duration = ?"24:00" },
      { animeId = "anime-6"; seasonId = ?"season-12"; episodeNumber = 3; title = "Roaring Muscles"; description = "Izuku trains for 10 months to prepare his body for One For All's incredible power."; videoUrl = fw; thumbnailUrl = ?"https://cdn.myanimelist.net/images/anime/10/78745.jpg"; duration = ?"24:00" },
      // Season 2 (season-13)
      { animeId = "anime-6"; seasonId = ?"season-13"; episodeNumber = 1; title = "That's the Idea, Ochaco"; description = "The UA Sports Festival begins. Class 1-A prepares to compete against rival classes."; videoUrl = fbb; thumbnailUrl = ?"https://cdn.myanimelist.net/images/anime/10/78745.jpg"; duration = ?"24:00" },
      { animeId = "anime-6"; seasonId = ?"season-13"; episodeNumber = 2; title = "Cavalry Battle Finale"; description = "Izuku teams with Mei Hatsume for the cavalry battle with all eyes on them."; videoUrl = sub; thumbnailUrl = ?"https://cdn.myanimelist.net/images/anime/10/78745.jpg"; duration = ?"24:00" },
      { animeId = "anime-6"; seasonId = ?"season-13"; episodeNumber = 3; title = "Tournament Begins!"; description = "The one-on-one tournament begins. Izuku faces Hitoshi Shinso."; videoUrl = ts; thumbnailUrl = ?"https://cdn.myanimelist.net/images/anime/10/78745.jpg"; duration = ?"24:00" },

      // ── Sword Art Online (anime-7) ─────────────────────────────────────────
      // Season 1 (season-14)
      { animeId = "anime-7"; seasonId = ?"season-14"; episodeNumber = 1; title = "The World of Swords"; description = "Ten thousand players are trapped inside Sword Art Online. Death in the game means death in real life."; videoUrl = bbb; thumbnailUrl = ?"https://cdn.myanimelist.net/images/anime/11/39717.jpg"; duration = ?"24:00" },
      { animeId = "anime-7"; seasonId = ?"season-14"; episodeNumber = 2; title = "Beater"; description = "Kirito earns the nickname 'Beater' after defeating the first floor boss solo."; videoUrl = ed; thumbnailUrl = ?"https://cdn.myanimelist.net/images/anime/11/39717.jpg"; duration = ?"24:00" },
      { animeId = "anime-7"; seasonId = ?"season-14"; episodeNumber = 3; title = "Red-Nosed Reindeer"; description = "Kirito joins Sachi's guild and experiences a devastating loss that shapes his solo journey."; videoUrl = fw; thumbnailUrl = ?"https://cdn.myanimelist.net/images/anime/11/39717.jpg"; duration = ?"24:00" },
      // Season 2 (season-15)
      { animeId = "anime-7"; seasonId = ?"season-15"; episodeNumber = 1; title = "Fairy Dance"; description = "Kirito enters ALfheim Online to rescue Asuna trapped inside."; videoUrl = fbb; thumbnailUrl = ?"https://cdn.myanimelist.net/images/anime/11/39717.jpg"; duration = ?"24:00" },
      { animeId = "anime-7"; seasonId = ?"season-15"; episodeNumber = 2; title = "In the Land of Fairies"; description = "Kirito meets Leafa and together they fly towards the World Tree."; videoUrl = sub; thumbnailUrl = ?"https://cdn.myanimelist.net/images/anime/11/39717.jpg"; duration = ?"24:00" },
      { animeId = "anime-7"; seasonId = ?"season-15"; episodeNumber = 3; title = "Swordsman's Memorial"; description = "Kirito and Leafa battle their way through the Grand Quest dungeon."; videoUrl = ts; thumbnailUrl = ?"https://cdn.myanimelist.net/images/anime/11/39717.jpg"; duration = ?"24:00" },
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
