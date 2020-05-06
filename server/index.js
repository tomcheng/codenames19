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
const RoomDB = require("./roomDB");

const Rooms = new RoomDB();

const joinRoom = ({ room, player }, socket) => {
  socket.playerID = player.id;
  socket.roomID = room.id;

  socket.join(room.id, () => {
    socket.emit("room joined", {
      room,
      playerID: player.id,
    });
    socket.to(room.id).emit("room updated", { room });
  });
};

io.on("connection", (socket) => {
  socket.on("create room", ({ name, playerID }) => {
    const room = Rooms.createRoom();
    const player = room.addPlayer({ name, playerID });

    joinRoom({ room, player }, socket);
  });

  socket.on("join room", ({ code, name, playerID }) => {
    const room = Rooms.getRoomByCode(code);

    if (!room) {
      socket.emit("room code not found");
      return;
    }

    const player = room.addPlayer({ name, playerID });

    joinRoom({ room, player }, socket);
  });

  socket.on("rejoin room", ({ roomID, playerID }) => {
    const room = Rooms.getRoom(roomID);

    if (!room) {
      socket.emit("room not found");
      return;
    }

    const player = room.getPlayer(playerID);

    if (!player) {
      socket.emit("user not found");
      return;
    }

    joinRoom({ room, player }, socket);
  });

  socket.on("set team", ({ playerID, team }) => {
    const room = Rooms.getRoom(socket.roomID);

    if (!room) return;

    room.setTeam({ playerID, team });

    io.in(room.id).emit("room updated", { room });
  });

  socket.on("lock teams", () => {
    const room = Rooms.getRoom(socket.roomID);

    if (!room || room.teamsLocked) return;

    try {
      room.lockTeams();

      io.in(room.id).emit("room updated", { room });
    } catch (e) {
      socket.emit("team error", { message: e.message });
    }
  });

  socket.on("set spymaster", ({ playerID }) => {
    const room = Rooms.getRoom(socket.roomID);

    if (!room) return;

    room.setSpymaster({ playerID });

    io.in(room.id).emit("room updated", { room });
  });

  socket.on("submit code", ({ code, number }) => {
    const room = Rooms.getRoom(socket.roomID);

    if (!room) return;

    room.submitCode({ code, number, playerID: socket.playerID });

    io.in(room.id).emit("room updated", { room });
  });

  socket.on("select word", ({ word }) => {
    const room = Rooms.getRoom(socket.roomID);

    if (!room) return;

    room.selectWord({ word, playerID: socket.playerID });

    io.in(room.id).emit("room updated", { room });
  });

  socket.on("end turn", () => {
    const room = Rooms.getRoom(socket.roomID);

    if (!room) return;

    room.endTurn({ playerID: socket.playerID });

    io.in(room.id).emit("room updated", { room });
  });

  socket.on("disconnect", () => {
    if (!socket.roomID) return;

    const room = Rooms.getRoom(socket.roomID);

    if (!room) return;

    room.removePlayer(socket.playerID);

    if (Object.values(room.players).filter((player) => player.online).length) {
      socket.to(socket.roomID).emit("room updated", { room });
    } else {
      Rooms.removeRoom(socket.roomID);
    }
  });
});
