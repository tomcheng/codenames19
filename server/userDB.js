const uuid = require("uuid");

class UserDB {
  constructor() {
    this.users = {};
  }

  getUsers() {
    return this.users;
  }

  getUser(userID) {
    return this.users[userID];
  }

  createUser({ name, userID }) {
    const user = { id: userID || uuid.v4(), name, team: null };
    this.users[user.id] = user;
    return user;
  }

  updateTeam({ userID, team }) {
    if (!this.users[userID]) return null;

    this.users[userID] = {
      ...this.users[userID],
      team,
    };

    return this.users[userID];
  }
}

module.exports = UserDB;
