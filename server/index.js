require("dotenv").config();
const path = require("path");
const uuid = require("uuid");
const _ = require("lodash");

const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
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

const getRoomCode = () => {
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

const sanitizeRoom = (room) => ({
  ...room,
  users: [...room.users].map((id) => users[id]),
});

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

io.on("connection", (socket) => {
  socket.on("create room", ({ name, userID: existingUserID }) => {
    const user = {
      id: existingUserID || uuid.v4(),
      name,
    };
    const room = {
      id: uuid.v4(),
      code: getRoomCode(),
      users: new Set([user.id]),
    };
    users[user.id] = user;
    rooms[room.id] = room;
    socket.userID = user.id;
    socket.roomID = room.id;

    socket.emit("room joined", { room: sanitizeRoom(room), user });
  });

  socket.on("join room", ({ code, name, userID: existingUserID }) => {
    const user = { id: existingUserID || uuid.v4(), name };

    users[user.id] = user;

    const room = getRoomByCode(code);

    if (!room) {
      socket.emit("room code not found");
      return;
    }

    room.users.add(user.id);

    socket.emit("room joined", { room: sanitizeRoom(room), user });
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

    room.users.add(user.id);

    socket.emit("room joined", { room: sanitizeRoom(room), user });
  });

  socket.on("disconnect", () => {
    if (!socket.userID) {
      return;
    }

    rooms[socket.roomID].users.delete(socket.userID);

    if (rooms[socket.roomID].users.size === 0) {
      rooms = _.omit(rooms, socket.roomID);
    }
  });
});

http.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
