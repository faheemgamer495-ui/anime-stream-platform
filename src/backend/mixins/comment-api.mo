import List "mo:core/List";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";
import CommentTypes "../types/comment";
import CommentLib "../lib/comment";
import UserTypes "../types/user";
import UserLib "../lib/user";

mixin (
  comments : List.List<CommentTypes.Comment>,
  ratings : List.List<CommentTypes.Rating>,
  nextCommentId : List.List<Nat>,
  users : List.List<UserTypes.User>,
) {
  public shared ({ caller }) func addComment(
    episodeId : Text,
    text : Text,
    parentId : ?Text,
  ) : async CommentTypes.Comment {
    let username = switch (UserLib.getById(users, caller)) {
      case (?u) u.username;
      case null Runtime.trap("Must be registered to comment");
    };
    CommentLib.addComment(comments, nextCommentId, episodeId, caller, username, text, parentId, Time.now());
  };

  public query ({ caller }) func getCommentsByEpisode(
    episodeId : Text,
  ) : async [CommentTypes.Comment] {
    CommentLib.getCommentsByEpisode(comments, episodeId);
  };

  public shared ({ caller }) func editComment(
    commentId : Text,
    newText : Text,
  ) : async ?CommentTypes.Comment {
    CommentLib.editComment(comments, commentId, caller, newText, Time.now());
  };

  public shared ({ caller }) func deleteComment(
    commentId : Text,
  ) : async Bool {
    CommentLib.deleteComment(comments, commentId, caller);
  };

  public shared ({ caller }) func addRating(
    episodeId : Text,
    stars : Nat,
  ) : async ?Text {
    if (stars < 1 or stars > 5) Runtime.trap("Stars must be between 1 and 5");
    ignore CommentLib.addRating(ratings, episodeId, caller, stars);
    ?episodeId;
  };

  public query ({ caller }) func getRatingsInfo(
    episodeId : Text,
  ) : async { average : Float; total : Nat; userRating : ?Nat } {
    let episodeRatings = CommentLib.getRatingsByEpisode(ratings, episodeId);
    let total = episodeRatings.size();
    let average : Float = if (total == 0) {
      0.0;
    } else {
      var sum = 0;
      for (r in episodeRatings.values()) { sum += r.stars };
      sum.toFloat() / total.toFloat();
    };
    let userRating = switch (episodeRatings.find(func(r : CommentTypes.Rating) : Bool { r.userId == caller })) {
      case (?r) ?r.stars;
      case null null;
    };
    { average; total; userRating };
  };
};
