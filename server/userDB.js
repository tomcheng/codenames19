const uuid = require("uuid");

class UserDB {
  constructor() {
    this.users = {};
  }

  createUser({ name, userID }) {
    const user = { id: userID || uuid.v4(), name, team: null };
    this.users[user.id] = user;
    return user;
  }

  removeUser(userID) {
    delete this.users[userID];
  }

  getUser(userID) {
    return this.users[userID];
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
