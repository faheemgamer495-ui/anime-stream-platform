import Common "common";

module {
  public type AdType = { #banner; #video };

  public type AdPlacement = { #homepage; #preRoll; #midRoll; #postRoll };

  public type AdConfig = {
    id : Common.AdId;
    name : Text;
    adType : AdType;
    imageUrl : ?Text;
    targetUrl : ?Text;
    videoUrl : ?Text;
    placement : AdPlacement;
    isEnabled : Bool;
  };

  // Shared/public version (identical — no var fields)
  public type AdConfigPublic = {
    id : Common.AdId;
    name : Text;
    adType : AdType;
    imageUrl : ?Text;
    targetUrl : ?Text;
    videoUrl : ?Text;
    placement : AdPlacement;
    isEnabled : Bool;
  };

  public type AdConfigInput = {
    name : Text;
    adType : AdType;
    imageUrl : ?Text;
    targetUrl : ?Text;
    videoUrl : ?Text;
    placement : AdPlacement;
    isEnabled : Bool;
  };
};
