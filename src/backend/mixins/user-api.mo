import Runtime "mo:core/Runtime";
import UserTypes "../types/user";

/// User API contract — array-based, matches main.mo stable-var pattern.
/// NOTE: Not included in main.mo; methods are inline there. Reference only.
mixin (users : [UserTypes.User]) {
  public shared ({ caller }) func registerUser(input : UserTypes.UserInput) : async UserTypes.UserPublic {
    Runtime.trap("not implemented");
  };

  public query ({ caller }) func getUser() : async ?UserTypes.UserPublic {
    Runtime.trap("not implemented");
  };

  public shared ({ caller }) func updateUser(input : UserTypes.UserInput) : async ?UserTypes.UserPublic {
    Runtime.trap("not implemented");
  };

  public query ({ caller }) func isAdminUser() : async Bool {
    Runtime.trap("not implemented");
  };

  public query ({ caller }) func listAllUsers() : async [UserTypes.UserPublic] {
    Runtime.trap("not implemented");
  };
};
