import CommonTypes "common";

module {
  public type Timestamp = CommonTypes.Timestamp;

  public type Comment = {
    id : Text;
    episodeId : Text;
    authorId : Principal;
    authorUsername : Text;
    text : Text;
    createdAt : Timestamp;
    updatedAt : ?Timestamp;
    parentId : ?Text;
    isDeleted : Bool;
  };

  public type Rating = {
    episodeId : Text;
    userId : Principal;
    stars : Nat;
  };

  public type CommentInput = {
    episodeId : Text;
    text : Text;
    parentId : ?Text;
  };
};
