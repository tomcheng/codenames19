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
  const joinRoom = ({ room, user }) => {
    socket.userID = user.id;
    socket.join(room.id, () => {
      const usersInRoom = _.compact(
        Object.keys(io.sockets.adapter.rooms[room.id].sockets).map((id) => {
          const socket = io.sockets.connected[id];
          return users[socket.userID];
        })
      );
      socket.emit("room joined", { room, users: usersInRoom, userID: user.id });
    });
  };
  socket.on("create room", ({ name, userID: existingUserID }) => {
    const user = {
      id: existingUserID || uuid.v4(),
      name,
    };
    const room = {
      id: uuid.v4(),
      code: getRoomCode(),
    };

    users[user.id] = user;
    rooms[room.id] = room;

    joinRoom({ room, user });
  });

  socket.on("join room", ({ code, name, userID: existingUserID }) => {
    const user = { id: existingUserID || uuid.v4(), name };

    users[user.id] = user;

    const room = getRoomByCode(code);

    if (!room) {
      socket.emit("room code not found");
      return;
    }

    joinRoom({ room, user });
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

    joinRoom({ room, user });
  });

  socket.on("disconnect", () => {});
});

http.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
