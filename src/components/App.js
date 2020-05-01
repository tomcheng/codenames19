import React, { useCallback, useEffect, useReducer, useState } from "react";
import { useStoredState } from "../hooks";
import PropTypes from "prop-types";
import StatelessApp from "./StatelessApp";

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

const INITIAL_STATE = {
  room: null,
  users: null,
};

const App = ({ socket }) => {
  const [name, setName] = useStoredState(NAME_KEY, "");
  const [userID, setUserID] = useStoredState(USER_ID_KEY);
  const [roomID, setRoomID] = useStoredState(ROOM_ID_KEY);
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const [codeIsInvalid, setCodeIsInvalid] = useState(false);

  /*** EFFECTS ***/

  useEffect(() => {
    socket.on("room joined", ({ room, users, userID }) => {
      setUserID(userID);
      setName(users.find((user) => user.id === userID).name);
      setRoomID(room.id);
      dispatch({ type: "join-room", payload: { room, users } });
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
      setCodeIsInvalid(true);
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

  const handleEndTurn = useCallback(() => {
    socket.emit("end turn");
  }, [socket]);

  const handleJoinRoom = useCallback(
    ({ code, name }) => {
      socket.emit("join room", { code, name, userID });
    },
    [socket, userID]
  );

  const handleSetTeams = useCallback(() => {
    socket.emit("set teams");
  }, [socket]);

  const handleSelectSpymaster = useCallback(
    ({ userID }) => {
      socket.emit("set spymaster", { userID });
    },
    [socket]
  );

  const handleSelectTeam = useCallback(
    ({ userID, team }) => {
      socket.emit("select team", { userID, team });
    },
    [socket]
  );

  const handleSelectWord = useCallback(
    ({ word }) => {
      socket.emit("select word", { word });
    },
    [socket]
  );

  const handleSubmitCode = useCallback(
    ({ code, number }) => {
      socket.emit("submit code", { code, number });
    },
    [socket]
  );

  return (
    <StatelessApp
      codeIsInvalid={codeIsInvalid}
      name={name}
      room={state.room}
      userID={userID}
      users={state.users}
      onCreateRoom={handleCreateRoom}
      onEndTurn={handleEndTurn}
      onJoinRoom={handleJoinRoom}
      onSetTeams={handleSetTeams}
      onSelectSpymaster={handleSelectSpymaster}
      onSelectTeam={handleSelectTeam}
      onSelectWord={handleSelectWord}
      onSubmitCode={handleSubmitCode}
    />
  );
};

App.propTypes = {
  socket: PropTypes.shape({
    emit: PropTypes.func.isRequired,
    on: PropTypes.func.isRequired,
  }).isRequired,
};

export default App;
