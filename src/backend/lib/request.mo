import RequestTypes "../types/request";
import Time "mo:core/Time";

module {
  public type AnimeRequest = RequestTypes.AnimeRequest;

  // Returns (newRequest, newRequests)
  public func createRequest(
    requests : [AnimeRequest],
    requestText : Text,
    username : Text,
  ) : (AnimeRequest, [AnimeRequest]) {
    let id = "req-" # Time.now().toText();
    let req : AnimeRequest = {
      id;
      requestText;
      username;
      status = "pending";
      createdAt = Time.now();
    };
    let newRequests = requests.concat([req]);
    (req, newRequests);
  };

  // Returns all requests
  public func getAllRequests(requests : [AnimeRequest]) : [AnimeRequest] {
    requests;
  };

  // Returns (found, newRequests) — marks matching request as "completed"
  public func completeRequest(
    requests : [AnimeRequest],
    id : Text,
  ) : (Bool, [AnimeRequest]) {
    var found = false;
    let newRequests = requests.map(func(r : AnimeRequest) : AnimeRequest {
      if (r.id == id and r.status == "pending") {
        found := true;
        { r with status = "completed" };
      } else { r };
    });
    (found, newRequests);
  };

  // Returns (deleted, newRequests) — removes matching request
  public func deleteRequest(
    requests : [AnimeRequest],
    id : Text,
  ) : (Bool, [AnimeRequest]) {
    var deleted = false;
    let newRequests = requests.filter(func(r : AnimeRequest) : Bool {
      if (r.id == id) {
        deleted := true;
        false;
      } else { true };
    });
    (deleted, newRequests);
  };
};
