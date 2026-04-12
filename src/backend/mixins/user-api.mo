import List "mo:core/List";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import UserTypes "../types/user";
import UserLib "../lib/user";

mixin (users : List.List<UserTypes.User>) {
  public shared ({ caller }) func registerUser(input : UserTypes.UserInput) : async UserTypes.UserPublic {
    UserLib.register(users, caller, input, Time.now());
  };

  public query ({ caller }) func getUser() : async ?UserTypes.UserPublic {
    UserLib.getById(users, caller);
  };

  public shared ({ caller }) func updateUser(input : UserTypes.UserInput) : async ?UserTypes.UserPublic {
    UserLib.update(users, caller, input);
  };

  public query ({ caller }) func isAdminUser() : async Bool {
    UserLib.isAdmin(users, caller);
  };

  public query ({ caller }) func listAllUsers() : async [UserTypes.UserPublic] {
    if (not UserLib.isAdmin(users, caller)) {
      Runtime.trap("Unauthorized: admin only");
    };
    UserLib.listAll(users);
  };
};
