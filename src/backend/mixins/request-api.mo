import Runtime "mo:core/Runtime";
import RequestTypes "../types/request";

/// Anime request API contract — array-based, matches main.mo stable-var pattern.
/// NOTE: Not included in main.mo; methods are inline there. Reference only.
mixin (animeRequests : [RequestTypes.AnimeRequest]) {
  /// Submit a new anime request. Returns the generated request id.
  public shared func submitAnimeRequest(requestText : Text, username : Text) : async Text {
    Runtime.trap("not implemented");
  };

  /// Get all anime requests. Admin only — requires valid adminToken.
  public query func getAnimeRequests(adminToken : Text) : async [RequestTypes.AnimeRequest] {
    Runtime.trap("not implemented");
  };

  /// Mark a request as completed. Admin only — requires valid adminToken.
  public shared func markRequestComplete(id : Text, adminToken : Text) : async Bool {
    Runtime.trap("not implemented");
  };

  /// Delete a request. Admin only — requires valid adminToken.
  public shared func deleteAnimeRequest(id : Text, adminToken : Text) : async Bool {
    Runtime.trap("not implemented");
  };
};
