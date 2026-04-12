import Common "common";

module {
  public type Anime = {
    id : Common.AnimeId;
    title : Text;
    description : Text;
    genres : [Text];
    rating : Float;
    coverImageUrl : Text;
    isFeatured : Bool;
    createdAt : Common.Timestamp;
    viewCount : Nat;
  };

  // Shared/public version of Anime (identical — no var fields)
  public type AnimePublic = {
    id : Common.AnimeId;
    title : Text;
    description : Text;
    genres : [Text];
    rating : Float;
    coverImageUrl : Text;
    isFeatured : Bool;
    createdAt : Common.Timestamp;
    viewCount : Nat;
  };

  public type AnimeInput = {
    title : Text;
    description : Text;
    genres : [Text];
    rating : Float;
    coverImageUrl : Text;
    isFeatured : Bool;
  };
};
