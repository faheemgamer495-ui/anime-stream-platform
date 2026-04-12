import Types "../types/user";
import Common "../types/common";

module {
  public func toPublic(self : Types.User) : Types.UserPublic {
    {
      id = self.id;
      username = self.username;
      email = self.email;
      isAdmin = self.isAdmin;
      createdAt = self.createdAt;
    };
  };

  public func new(id : Principal, input : Types.UserInput, isAdmin : Bool, createdAt : Common.Timestamp) : Types.User {
    {
      id;
      username = input.username;
      email = input.email;
      isAdmin;
      createdAt;
    };
  };

  public func getById(users : [Types.User], id : Principal) : ?Types.UserPublic {
    switch (users.find(func(u : Types.User) : Bool { u.id == id })) {
      case (?u) ?toPublic(u);
      case null null;
    };
  };

  // Returns (userPublic, newUsers)
  public func register(users : [Types.User], caller : Principal, input : Types.UserInput, createdAt : Common.Timestamp) : (Types.UserPublic, [Types.User]) {
    // If already registered, return existing without modifying array
    switch (users.find(func(u : Types.User) : Bool { u.id == caller })) {
      case (?u) { return (toPublic(u), users) };
      case null {};
    };
    let isFirstUser = users.size() == 0;
    let user = new(caller, input, isFirstUser, createdAt);
    let newUsers = users.concat([user]);
    (toPublic(user), newUsers);
  };

  // Returns (?userPublic, newUsers)
  public func update(users : [Types.User], caller : Principal, input : Types.UserInput) : (?Types.UserPublic, [Types.User]) {
    var result : ?Types.UserPublic = null;
    let newUsers = users.map(func(u : Types.User) : Types.User {
      if (u.id == caller) {
        let updated : Types.User = { u with username = input.username; email = input.email };
        result := ?toPublic(updated);
        updated;
      } else { u };
    });
    (result, newUsers);
  };

  public func isAdmin(users : [Types.User], caller : Principal) : Bool {
    switch (users.find(func(u : Types.User) : Bool { u.id == caller })) {
      case (?u) u.isAdmin;
      case null false;
    };
  };

  public func listAll(users : [Types.User]) : [Types.UserPublic] {
    users.map<Types.User, Types.UserPublic>(toPublic);
  };
};
