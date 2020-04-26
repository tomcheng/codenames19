import React, { useCallback, useEffect, useReducer, useState } from "react";
import styled from "styled-components";
import { useStoredState } from "../hooks";
import PropTypes from "prop-types";
import background from "../assets/so-white.png";
import AppHeader from "./AppHeader";
import Lobby from "./Lobby";
import Room from "./Room";

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
    case "update-users":
      return {
        ...state,
        users: payload.users,
      };
    default:
      throw new Error();
  }
};

const App = ({ socket }) => {
  const [name, setName] = useStoredState(NAME_KEY);
  const [userID, setUserID] = useStoredState(USER_ID_KEY);
  const [roomID, setRoomID] = useStoredState(ROOM_ID_KEY);
  const [state, dispatch] = useReducer(reducer, { room: null, users: null });
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

  return (
    <AppContainer>
      <AppHeader roomCode={state.room?.code} />
      <AppBody>
        {state.room ? (
          <Room
            key={state.room.code}
            code={state.room.code}
            users={state.users}
          />
        ) : (
          <Lobby
            initialName={name || ""}
            invalidCode={invalidCode}
            onCreateRoom={handleCreateRoom}
            onJoinRoom={handleJoinRoom}
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
