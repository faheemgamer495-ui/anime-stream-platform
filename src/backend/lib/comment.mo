import CommentTypes "../types/comment";

module {
  public type Comment = CommentTypes.Comment;
  public type Rating = CommentTypes.Rating;

  // Returns (comment, newComments)
  public func addComment(
    comments : [Comment],
    nextCommentId : Nat,
    episodeId : Text,
    authorPrincipal : Principal,
    username : Text,
    text : Text,
    parentId : ?Text,
    now : CommentTypes.Timestamp,
  ) : (Comment, [Comment]) {
    let id = "cmt-" # nextCommentId.toText();
    let comment : Comment = {
      id;
      episodeId;
      authorId = authorPrincipal;
      authorUsername = username;
      text;
      createdAt = now;
      updatedAt = null;
      parentId;
      isDeleted = false;
    };
    let newComments = comments.concat([comment]);
    (comment, newComments);
  };

  public func getCommentsByEpisode(
    comments : [Comment],
    episodeId : Text,
  ) : [Comment] {
    comments.filter(func(c : Comment) : Bool {
      c.episodeId == episodeId and not c.isDeleted
    });
  };

  // Returns (?comment, newComments)
  public func editComment(
    comments : [Comment],
    commentId : Text,
    callerPrincipal : Principal,
    newText : Text,
    now : CommentTypes.Timestamp,
  ) : (?Comment, [Comment]) {
    var result : ?Comment = null;
    let newComments = comments.map(func(c : Comment) : Comment {
      if (c.id == commentId and c.authorId == callerPrincipal and not c.isDeleted) {
        let updated : Comment = { c with text = newText; updatedAt = ?now };
        result := ?updated;
        updated;
      } else { c };
    });
    (result, newComments);
  };

  // Returns (deleted, newComments)
  public func deleteComment(
    comments : [Comment],
    commentId : Text,
    callerPrincipal : Principal,
  ) : (Bool, [Comment]) {
    var deleted = false;
    let newComments = comments.map(func(c : Comment) : Comment {
      if (c.id == commentId and c.authorId == callerPrincipal and not c.isDeleted) {
        deleted := true;
        { c with isDeleted = true };
      } else { c };
    });
    (deleted, newComments);
  };

  // Returns newRatings — replaces existing or appends
  public func addRating(
    ratings : [Rating],
    episodeId : Text,
    userId : Principal,
    stars : Nat,
  ) : [Rating] {
    var found = false;
    let newRatings = ratings.map(func(r : Rating) : Rating {
      if (r.episodeId == episodeId and r.userId == userId) {
        found := true;
        { episodeId; userId; stars };
      } else { r };
    });
    if (not found) {
      newRatings.concat([{ episodeId; userId; stars }]);
    } else {
      newRatings;
    };
  };

  public func getRatingsByEpisode(
    ratings : [Rating],
    episodeId : Text,
  ) : [Rating] {
    ratings.filter(func(r : Rating) : Bool { r.episodeId == episodeId });
  };

  public func getAverageRating(
    ratings : [Rating],
    episodeId : Text,
  ) : ?Float {
    let filtered = ratings.filter(func(r : Rating) : Bool { r.episodeId == episodeId });
    let total = filtered.size();
    if (total == 0) { return null };
    let sum = filtered.foldLeft(0, func(acc : Nat, r : Rating) : Nat { acc + r.stars });
    ?(sum.toFloat() / total.toFloat());
  };
};
