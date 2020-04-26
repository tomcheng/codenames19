import React, { useCallback, useEffect, useReducer, useState } from "react";
import styled from "styled-components";
import { useStoredState } from "../hooks";
import PropTypes from "prop-types";
import background from "../assets/so-white.png";
import AppHeader from "./AppHeader";
import DocumentWrapper from "./DocumentWrapper";
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

// const INITIAL_STATE = {
//   room: { code: "AAAA", teamsLockedIn: true },
//   users: [
//     { name: "Thomas", id: "30a9e007-e86d-4cc9-9743-9b2e7dfd1316", team: "A" },
//     { name: "Michelle", id: "skjdfh", team: "A" },
//     { name: "Avrum", id: "ldkg", team: "B" },
//     { name: "Alda", id: "fdkjbg", team: "B" },
//   ],
// };

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
          <div>Game goes here.</div>
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
