module {
  public type Timestamp = Int;

  public type AnimeRequest = {
    id : Text;
    requestText : Text;
    username : Text;
    status : Text; // "pending" | "completed"
    createdAt : Timestamp;
  };
};
