import RequestTypes "../types/request";
import RequestLib "../lib/request";
import Runtime "mo:core/Runtime";

/// Anime request mixin — exposes public endpoints for submitting and managing anime requests.
mixin (animeRequests : [RequestTypes.AnimeRequest]) {

  /// Submit a new anime request. Returns the generated request id.
  public shared func submitAnimeRequest(requestText : Text, username : Text) : async Text {
    let (req, newRequests) = RequestLib.createRequest(animeRequests, requestText, username);
    animeRequests := newRequests;
    req.id;
  };

  /// Get all anime requests. Admin only — requires valid adminToken.
  public query func getAnimeRequests(adminToken : Text) : async [RequestTypes.AnimeRequest] {
    if (adminToken != "adminfaheem123") Runtime.trap("Unauthorized");
    RequestLib.getAllRequests(animeRequests);
  };

  /// Mark a request as completed. Admin only — requires valid adminToken.
  public shared func markRequestComplete(id : Text, adminToken : Text) : async Bool {
    if (adminToken != "adminfaheem123") Runtime.trap("Unauthorized");
    let (found, newRequests) = RequestLib.completeRequest(animeRequests, id);
    animeRequests := newRequests;
    found;
  };

  /// Delete a request. Admin only — requires valid adminToken.
  public shared func deleteAnimeRequest(id : Text, adminToken : Text) : async Bool {
    if (adminToken != "adminfaheem123") Runtime.trap("Unauthorized");
    let (deleted, newRequests) = RequestLib.deleteRequest(animeRequests, id);
    animeRequests := newRequests;
    deleted;
  };
};
