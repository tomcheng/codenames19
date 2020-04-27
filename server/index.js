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
const utils = require("./utils");
const { getWords } = require("./words");

let rooms = {};
let users = {};

const getUniqueRoomCode = () => {
  let code = utils.generateRoomCode();

  while (
    Object.values(rooms)
      .map((room) => room.code)
      .includes(code)
  ) {
    code = utils.generateRoomCode();
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

const getInitialWords = () => {
  const words = getWords();
  const shuffledWords = _.shuffle(words);
  const teamAWords = shuffledWords.slice(0, 9);
  const teamBWords = shuffledWords.slice(9, 17);
  const bomb = shuffledWords[17];

  return words.map((word) => ({
    word,
    type: teamAWords.includes(word)
      ? "A"
      : teamBWords.includes(word)
      ? "B"
      : word === bomb
      ? "bomb"
      : "neutral",
    flipped: false,
  }));
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
    const user = { id: existingUserID || uuid.v4(), name, team: null };
    const room = {
      id: uuid.v4(),
      code: getUniqueRoomCode(),
      spymasters: {
        A: { userID: null, lockedIn: false },
        B: { userID: null, lockedIn: false },
      },
      teamsLockedIn: false,
      spymastersLockedIn: false,
      words: null,
    };

    users[user.id] = user;
    rooms[room.id] = room;

    joinRoom({ room, user }, socket);
  });

  socket.on("join room", ({ code, name, userID: existingUserID }) => {
    const user = { id: existingUserID || uuid.v4(), name, team: null };

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

  socket.on("select team", ({ userID, team }) => {
    users[userID].team = team;
    const room = rooms[socket.roomID];
    io.in(room.id).emit("users updated", { users: getUsersInRoom(room) });
  });

  socket.on("lock in teams", () => {
    const room = rooms[socket.roomID];
    room.teamsLockedIn = true;
    io.in(room.id).emit("room updated", { room });
  });

  socket.on("select spymaster", ({ userID }) => {
    const room = rooms[socket.roomID];
    const user = users[userID];

    room.spymasters = {
      ...room.spymasters,
      [user.team]: {
        ...room.spymasters[user.team],
        userID: user.id,
      },
    };

    io.in(room.id).emit("room updated", { room });
  });

  socket.on("lock in spymaster", () => {
    const room = rooms[socket.roomID];
    const user = users[socket.userID];

    room.spymasters = {
      ...room.spymasters,
      [user.team]: {
        ...room.spymasters[user.team],
        lockedIn: true,
      },
    };

    if (room.spymasters.A.lockedIn && room.spymasters.B.lockedIn) {
      room.words = getInitialWords();
    }

    io.in(room.id).emit("room updated", { room });
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
