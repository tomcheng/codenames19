require("dotenv").config();
const path = require("path");

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
const UserDB = require("./userDB");
const RoomDB = require("./roomDB");

const Users = new UserDB();
const Rooms = new RoomDB();

const getUsersInRoom = (roomID) => {
  if (!io.sockets.adapter.rooms[roomID]) {
    return [];
  }

  return _.compact(
    _.uniq(
      Object.keys(io.sockets.adapter.rooms[roomID].sockets).map(
        (id) => io.sockets.connected[id].userID
      )
    ).map((userID) => Users.getUser(userID))
  );
};

const joinRoom = ({ room, user }, socket) => {
  socket.userID = user.id;
  socket.roomID = room.id;

  socket.join(room.id, () => {
    const usersInRoom = getUsersInRoom(room.id);
    socket.emit("room joined", {
      room,
      users: usersInRoom,
      userID: user.id,
    });
    socket.to(room.id).emit("users updated", { users: usersInRoom });
  });
};

io.on("connection", (socket) => {
  socket.on("create room", ({ name, userID }) => {
    const user = Users.createUser({ name, userID });
    const room = Rooms.createRoom();

    joinRoom({ room, user }, socket);
  });

  socket.on("join room", ({ code, name, userID }) => {
    const user = Users.createUser({ name, userID });
    const room = Rooms.getRoomByCode(code);

    if (!room) {
      socket.emit("room code not found");
      return;
    }

    joinRoom({ room, user }, socket);
  });

  socket.on("rejoin room", ({ roomID, userID }) => {
    const user = Users.getUser(userID);
    const room = Rooms.getRoom(roomID);

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

  socket.on("select team", ({ userID, team }) => {
    const user = Users.updateTeam({ userID, team });
    const room = Rooms.getRoom(socket.roomID);

    if (!user || !room) return;

    io.in(room.id).emit("users updated", { users: getUsersInRoom(room.id) });
  });

  socket.on("set teams", () => {
    const room = Rooms.getRoom(socket.roomID);

    if (!room) return;

    room.setTeams();

    io.in(room.id).emit("room updated", { room });
  });

  socket.on("set spymaster", ({ userID }) => {
    const user = Users.getUser(userID);
    const room = Rooms.getRoom(socket.roomID);

    if (!user || !room) return;

    room.setSpymaster({ userID: user.id, team: user.team });

    if (room.spymasterA && room.spymasterB) {
      room.startGame();
    }

    io.in(room.id).emit("room updated", { room });
  });

  socket.on("submit code", ({ code, number }) => {
    const user = Users.getUser(socket.userID);
    const room = Rooms.getRoom(socket.roomID);

    if (!room || user.team !== room.turn) return;

    room.submitCode({ code, number });

    io.in(room.id).emit("room updated", { room });
  });

  socket.on("select word", ({ word }) => {
    const user = Users.getUser(socket.userID);
    const room = Rooms.getRoom(socket.roomID);

    if (!room || user.team !== room.turn) return;

    room.selectWord({ word });

    io.in(room.id).emit("room updated", { room });
  });

  socket.on("disconnect", () => {
    if (!socket.roomID) return;

    const usersLeft = getUsersInRoom(socket.roomID);

    if (usersLeft.length) {
      socket.to(socket.roomID).emit("users updated", { users: usersLeft });
    } else {
      Rooms.removeRoom(socket.roomID);
      Users.removeUser(socket.userID);
    }
  });
});
