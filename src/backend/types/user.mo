import Common "common";

module {
  public type User = {
    id : Principal;
    username : Text;
    email : ?Text;
    isAdmin : Bool;
    createdAt : Common.Timestamp;
  };

  // Shared/public version (identical — no var fields)
  public type UserPublic = {
    id : Principal;
    username : Text;
    email : ?Text;
    isAdmin : Bool;
    createdAt : Common.Timestamp;
  };

  public type UserInput = {
    username : Text;
    email : ?Text;
  };
};
