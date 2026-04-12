import List "mo:core/List";
import AdTypes "../types/ad";
import Common "../types/common";
import AdLib "../lib/ad";

mixin (
  ads : List.List<AdTypes.AdConfig>,
  nextAdId : List.List<Nat>
) {
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
    let currentId = nextAdId.at(0);
    let result = AdLib.create(ads, currentId, input);
    nextAdId.put(0, currentId + 1);
    result;
  };

  public shared func updateAdConfig(id : Common.AdId, input : AdTypes.AdConfigInput) : async ?AdTypes.AdConfigPublic {
    AdLib.update(ads, id, input);
  };

  public shared func deleteAdConfig(id : Common.AdId) : async Bool {
    AdLib.delete(ads, id);
  };
};
