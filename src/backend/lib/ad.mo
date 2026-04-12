import Types "../types/ad";
import Common "../types/common";

module {
  public func toPublic(self : Types.AdConfig) : Types.AdConfigPublic {
    {
      id = self.id;
      name = self.name;
      adType = self.adType;
      imageUrl = self.imageUrl;
      targetUrl = self.targetUrl;
      videoUrl = self.videoUrl;
      placement = self.placement;
      isEnabled = self.isEnabled;
    };
  };

  public func new(id : Common.AdId, input : Types.AdConfigInput) : Types.AdConfig {
    {
      id;
      name = input.name;
      adType = input.adType;
      imageUrl = input.imageUrl;
      targetUrl = input.targetUrl;
      videoUrl = input.videoUrl;
      placement = input.placement;
      isEnabled = input.isEnabled;
    };
  };

  public func getAll(ads : [Types.AdConfig]) : [Types.AdConfigPublic] {
    ads.map<Types.AdConfig, Types.AdConfigPublic>(toPublic);
  };

  public func getEnabled(ads : [Types.AdConfig]) : [Types.AdConfigPublic] {
    ads.filter(func(a : Types.AdConfig) : Bool { a.isEnabled })
      .map<Types.AdConfig, Types.AdConfigPublic>(toPublic);
  };

  public func getByPlacement(ads : [Types.AdConfig], placement : Types.AdPlacement) : [Types.AdConfigPublic] {
    ads.filter(func(a : Types.AdConfig) : Bool {
      switch (a.placement, placement) {
        case (#homepage, #homepage) true;
        case (#preRoll, #preRoll) true;
        case (#midRoll, #midRoll) true;
        case (#postRoll, #postRoll) true;
        case _ false;
      };
    }).map<Types.AdConfig, Types.AdConfigPublic>(toPublic);
  };

  // Returns (result, newAds)
  public func create(ads : [Types.AdConfig], nextId : Nat, input : Types.AdConfigInput) : (Types.AdConfigPublic, [Types.AdConfig]) {
    let id = "ad-" # nextId.toText();
    let ad = new(id, input);
    let newAds = ads.concat([ad]);
    (toPublic(ad), newAds);
  };

  // Returns (?result, newAds)
  public func update(ads : [Types.AdConfig], id : Common.AdId, input : Types.AdConfigInput) : (?Types.AdConfigPublic, [Types.AdConfig]) {
    var result : ?Types.AdConfigPublic = null;
    let newAds = ads.map(func(a : Types.AdConfig) : Types.AdConfig {
      if (a.id == id) {
        let updated : Types.AdConfig = {
          a with
          name = input.name;
          adType = input.adType;
          imageUrl = input.imageUrl;
          targetUrl = input.targetUrl;
          videoUrl = input.videoUrl;
          placement = input.placement;
          isEnabled = input.isEnabled;
        };
        result := ?toPublic(updated);
        updated;
      } else { a };
    });
    (result, newAds);
  };

  // Returns (deleted, newAds)
  public func delete(ads : [Types.AdConfig], id : Common.AdId) : (Bool, [Types.AdConfig]) {
    let newAds = ads.filter(func(a : Types.AdConfig) : Bool { a.id != id });
    (newAds.size() < ads.size(), newAds);
  };

  // Returns (newAds, nextId)
  public func seedSampleData(ads : [Types.AdConfig], nextId : Nat) : ([Types.AdConfig], Nat) {
    // Guard: if data already exists, never overwrite it
    if (ads.size() > 0) { return (ads, nextId) };
    let samples : [Types.AdConfigInput] = [
      {
        name = "Homepage Banner - Anime Stream";
        adType = #banner;
        imageUrl = ?"https://picsum.photos/seed/ad-banner1/1200/200";
        targetUrl = ?"#";
        videoUrl = null;
        placement = #homepage;
        isEnabled = true;
      },
      {
        name = "Pre-Roll Video Ad";
        adType = #video;
        imageUrl = null;
        targetUrl = null;
        videoUrl = ?"https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4";
        placement = #preRoll;
        isEnabled = false;
      },
      {
        name = "Mid-Roll Banner Ad";
        adType = #banner;
        imageUrl = ?"https://picsum.photos/seed/ad-mid1/728/90";
        targetUrl = ?"#";
        videoUrl = null;
        placement = #midRoll;
        isEnabled = true;
      },
    ];

    var idCounter = nextId;
    var result = ads;
    for (input in samples.values()) {
      let id = "ad-" # idCounter.toText();
      result := result.concat([new(id, input)]);
      idCounter += 1;
    };
    (result, idCounter);
  };
};
