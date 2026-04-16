import Runtime "mo:core/Runtime";
import CommentTypes "../types/comment";

/// Comment and rating API contract — array-based, matches main.mo stable-var pattern.
/// NOTE: Not included in main.mo; methods are inline there. Reference only.
mixin (
  comments : [CommentTypes.Comment],
  ratings : [CommentTypes.Rating],
  nextCommentId : Nat,
) {
  public shared ({ caller }) func addComment(
    episodeId : Text,
    text : Text,
    parentId : ?Text,
  ) : async CommentTypes.Comment {
    Runtime.trap("not implemented");
  };

  public query func getCommentsByEpisode(episodeId : Text) : async [CommentTypes.Comment] {
    Runtime.trap("not implemented");
  };

  public shared ({ caller }) func editComment(
    commentId : Text,
    newText : Text,
  ) : async ?CommentTypes.Comment {
    Runtime.trap("not implemented");
  };

  public shared ({ caller }) func deleteComment(commentId : Text) : async Bool {
    Runtime.trap("not implemented");
  };

  public shared ({ caller }) func addRating(episodeId : Text, stars : Nat) : async ?Text {
    Runtime.trap("not implemented");
  };

  public query ({ caller }) func getRatingsInfo(
    episodeId : Text,
  ) : async { average : Float; total : Nat; userRating : ?Nat } {
    Runtime.trap("not implemented");
  };
};
