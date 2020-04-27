import React, { useCallback, useEffect, useReducer, useState } from "react";
import styled from "styled-components";
import { useStoredState } from "../hooks";
import PropTypes from "prop-types";
import background from "../assets/so-white.png";
import AppHeader from "./AppHeader";
import DocumentWrapper from "./DocumentWrapper";
import Game from "./Game";
import Lobby from "./Lobby";
import SelectSpyMaster from "./SelectSpyMaster";
import SelectTeams from "./SelectTeams";

const AppContainer = styled.div`
  background-image: url(${background});
  background-repeat: repeat;
  height: 100vh;
  overflow: auto;
`;

const AppBody = styled.div`
  padding: 10px 20px;
`;

const USER_ID_KEY = "c19-user-id";
const ROOM_ID_KEY = "c19-room-id";
const NAME_KEY = "c19-name";

const reducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case "join-room":
      return {
        ...state,
        room: payload.room,
        users: payload.users,
      };
    case "update-room":
      return {
        ...state,
        room: payload.room,
      };
    case "update-users":
      return {
        ...state,
        users: payload.users,
      };
    default:
      throw new Error();
  }
};

const savedUserID = JSON.parse(localStorage.getItem(USER_ID_KEY));

// eslint-disable-next-line
const MOCK_STATE = {
  room: {
    id: "33ca06c2-2574-4919-80c0-1a8ce1bf6542",
    code: "OTZS",
    spymasters: {
      A: { userID: savedUserID, lockedIn: true },
      B: { userID: "06d5fcd5-4066-46de-aa34-12e89bcf2348", lockedIn: true },
    },
    teamsLockedIn: true,
    spymastersLockedIn: false,
    words: [
      { word: "River", type: "A", flipped: false },
      { word: "House", type: "B", flipped: false },
      { word: "Smuggler", type: "B", flipped: false },
      { word: "Iceland", type: "neutral", flipped: false },
      { word: "Center", type: "neutral", flipped: false },
      { word: "Tank", type: "B", flipped: false },
      { word: "Litter", type: "neutral", flipped: false },
      { word: "Astronaut", type: "A", flipped: false },
      { word: "Table", type: "neutral", flipped: false },
      { word: "Pan", type: "A", flipped: false },
      { word: "Pitch", type: "B", flipped: false },
      { word: "Banana", type: "neutral", flipped: false },
      { word: "Ranch", type: "A", flipped: false },
      { word: "Jellyfish", type: "B", flipped: false },
      { word: "Tail", type: "A", flipped: false },
      { word: "Homer", type: "B", flipped: false },
      { word: "String", type: "B", flipped: false },
      { word: "Bear", type: "neutral", flipped: false },
      { word: "Crab", type: "A", flipped: false },
      { word: "Avalanche", type: "neutral", flipped: false },
      { word: "Smoothie", type: "A", flipped: false },
      { word: "Saw", type: "A", flipped: false },
      { word: "Guitar", type: "bomb", flipped: false },
      { word: "Comic", type: "B", flipped: false },
      { word: "Cloak", type: "A", flipped: false },
    ],
  },
  users: [
    { id: savedUserID, name: "Thomas", team: "A" },
    { id: "06d5fcd5-4066-46de-aa34-12e89bcf2348", name: "Michelle", team: "B" },
    { id: "foo", name: "Avrum", team: "A" },
    { id: "bar", name: "Alda", team: "B" },
  ],
};

const INITIAL_STATE = {
  room: null,
  users: null,
};

const App = ({ socket }) => {
  const [name, setName] = useStoredState(NAME_KEY);
  const [userID, setUserID] = useStoredState(USER_ID_KEY);
  const [roomID, setRoomID] = useStoredState(ROOM_ID_KEY);
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const [invalidCode, setInvalidCode] = useState(false);

  /*** EFFECTS ***/

  useEffect(() => {
    socket.on("room joined", ({ room, users, userID }) => {
      dispatch({ type: "join-room", payload: { room, users } });
      setRoomID(room.id);
      setUserID(userID);
      setName(users.find((user) => user.id === userID).name);
    });

    socket.on("users updated", ({ users }) => {
      dispatch({ type: "update-users", payload: { users } });
    });

    socket.on("room updated", ({ room }) => {
      dispatch({ type: "update-room", payload: { room } });
    });

    socket.on("room not found", () => {
      setRoomID(null);
    });

    socket.on("user not found", () => {
      setUserID(null);
    });

    socket.on("room code not found", () => {
      setInvalidCode(true);
    });
  }, [socket, setName, setRoomID, setUserID]);

  useEffect(() => {
    if (roomID && !state.room) {
      socket.emit("rejoin room", { roomID, userID });
    }
  }, [socket, roomID, userID, state.room]);

  /*** CALLBACKS ***/

  const handleCreateRoom = useCallback(
    ({ name }) => {
      socket.emit("create room", { name, userID });
    },
    [socket, userID]
  );

  const handleJoinRoom = useCallback(
    ({ code, name }) => {
      socket.emit("join room", { code, name, userID });
    },
    [socket, userID]
  );

  const handleSelectTeam = useCallback(
    ({ userID, team }) => {
      socket.emit("select team", { userID, team });
    },
    [socket]
  );

  const handleLockInTeams = useCallback(() => {
    socket.emit("lock in teams");
  }, [socket]);

  const handleSelectSpyMaster = useCallback(
    ({ userID }) => {
      socket.emit("select spymaster", { userID });
    },
    [socket]
  );

  const handleLockInSpyMaster = useCallback(() => {
    socket.emit("lock in spymaster");
  }, [socket]);

  return (
    <AppContainer>
      <AppHeader roomCode={state.room?.code} />
      <AppBody>
        {!state.room ? (
          <DocumentWrapper title="Enlistment/Re-Enlistment Document">
            <Lobby
              initialName={name || ""}
              invalidCode={invalidCode}
              onCreateRoom={handleCreateRoom}
              onJoinRoom={handleJoinRoom}
            />
          </DocumentWrapper>
        ) : !state.room.teamsLockedIn ? (
          <DocumentWrapper title="Declaration of Allegiances">
            <SelectTeams
              users={state.users}
              onLockInTeams={handleLockInTeams}
              onSelectTeam={handleSelectTeam}
            />
          </DocumentWrapper>
        ) : !state.room.spymasters.A.lockedIn ||
          !state.room.spymasters.B.lockedIn ? (
          <DocumentWrapper title="Spy Master Nomination Form">
            <SelectSpyMaster
              spymasters={state.room.spymasters}
              users={state.users}
              userID={userID}
              onLockInSpyMaster={handleLockInSpyMaster}
              onSelectSpyMaster={handleSelectSpyMaster}
            />
          </DocumentWrapper>
        ) : (
          <Game
            spymasters={state.room.spymasters}
            users={state.users}
            userID={userID}
            words={state.room.words}
          />
        )}
      </AppBody>
    </AppContainer>
  );
};

App.propTypes = {
  socket: PropTypes.shape({
    emit: PropTypes.func.isRequired,
    on: PropTypes.func.isRequired,
  }).isRequired,
};

export default App;
