const Room = require("../src/room");

class RoomDB {
  constructor() {
    this.rooms = {};
  }

  createRoom() {
    const room = new Room({ usedCodes: this._getUsedCodes() });
    this.rooms[room.id] = room;
    return room;
  }

  removeRoom(roomID) {
    delete this.rooms[roomID];
  }

  getRoom(roomID) {
    return this.rooms[roomID];
  }

  getRoomByCode(code) {
    return (
      Object.values(this.rooms).find((room) => room.roomCode === code) || null
    );
  }

  _getUsedCodes() {
    return Object.values(this.rooms).map((room) => room.roomCode);
  }
}

module.exports = RoomDB;
