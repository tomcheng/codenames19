require("dotenv").config();
const path = require("path");
const uuid = require("uuid");

const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

/*** SERVE UP THE PAGE ***/

const isProduction = process.env.NODE_ENV === "production";

const PORT = process.env.PORT || 5000;

if (isProduction) {
  console.log("=== RUNNING PRODUCTION MODE ===");
  app.use(express.static(path.resolve(__dirname, "../build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../build"));
  });
} else {
  console.log("=== RUNNING DEVELOPMENT MODE ===");
}

http.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

/*** ROOM LOGIC ***/

const _ = require("lodash");
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

let rooms = {};
let users = {};

const getCode = () => {
  return (
    _.sample(ALPHABET) +
    _.sample(ALPHABET) +
    _.sample(ALPHABET) +
    _.sample(ALPHABET)
  );
};

const getUniqueRoomCode = () => {
  let code = getCode();

  while (
    Object.values(rooms)
      .map((room) => room.code)
      .includes(code)
  ) {
    code = getCode();
  }

  return code;
};

const getRoomByCode = (code) => {
  return Object.values(rooms).find((room) => room.code === code) || null;
};

const getUsersInRoom = (room) => {
  if (!io.sockets.adapter.rooms[room.id]) {
    return [];
  }

  return _.compact(
    _.uniq(
      Object.keys(io.sockets.adapter.rooms[room.id].sockets).map(
        (id) => io.sockets.connected[id].userID
      )
    ).map((userID) => users[userID])
  );
};

const joinRoom = ({ room, user }, socket) => {
  socket.userID = user.id;
  socket.roomID = room.id;

  socket.join(room.id, () => {
    const usersInRoom = getUsersInRoom(room);
    socket.emit("room joined", {
      room,
      users: usersInRoom,
      userID: user.id,
    });
    socket.to(room.id).emit("users updated", { users: usersInRoom });
  });
};

io.on("connection", (socket) => {
  socket.on("create room", ({ name, userID: existingUserID }) => {
    const user = { id: existingUserID || uuid.v4(), name };
    const room = {
      id: uuid.v4(),
      code: getUniqueRoomCode(),
      teamsPicked: false,
    };

    users[user.id] = user;
    rooms[room.id] = room;

    joinRoom({ room, user }, socket);
  });

  socket.on("join room", ({ code, name, userID: existingUserID }) => {
    const user = { id: existingUserID || uuid.v4(), name };

    users[user.id] = user;

    const room = getRoomByCode(code);

    if (!room) {
      socket.emit("room code not found");
      return;
    }

    joinRoom({ room, user }, socket);
  });

  socket.on("rejoin room", ({ roomID, userID }) => {
    const user = users[userID];
    const room = rooms[roomID];

    if (!user) {
      socket.emit("user not found");
      return;
    }

    if (!room) {
      socket.emit("room not found");
      return;
    }

    joinRoom({ room, user }, socket);
  });

  socket.on("disconnect", () => {
    if (!socket.roomID) return;

    const usersLeft = getUsersInRoom(rooms[socket.roomID]);

    if (usersLeft.length) {
      socket.to(socket.roomID).emit("users updated", { users: usersLeft });
    } else {
      rooms = _.omit(rooms, socket.roomID);
    }
  });
});
