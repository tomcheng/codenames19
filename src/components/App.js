import React, { useCallback, useEffect, useState } from "react";
import { useStoredState } from "../hooks";
import PropTypes from "prop-types";
import StatelessApp from "./StatelessApp";

const PLAYER_ID_KEY = "c19-user-id";
const ROOM_ID_KEY = "c19-room-id";
const NAME_KEY = "c19-name";

const App = ({ socket }) => {
  const [name, setName] = useStoredState(NAME_KEY, "");
  const [playerID, setPlayerID] = useStoredState(PLAYER_ID_KEY);
  const [roomID, setRoomID] = useStoredState(ROOM_ID_KEY);
  const [room, setRoom] = useState(null);
  const [codeIsInvalid, setCodeIsInvalid] = useState(false);
  const [teamError, setTeamError] = useState(null);

  /*** EFFECTS ***/

  useEffect(() => {
    socket.on("room joined", ({ room: serverRoom, playerID }) => {
      setPlayerID(playerID);
      setName(serverRoom.players[playerID].name);
      setRoomID(serverRoom.id);
      setRoom(serverRoom);
    });

    socket.on("room updated", ({ room: serverRoom }) => {
      setRoom(serverRoom);
    });

    socket.on("room not found", () => {
      setRoomID(null);
    });

    socket.on("user not found", () => {
      setPlayerID(null);
    });

    socket.on("room code not found", () => {
      setCodeIsInvalid(true);
    });

    socket.on("team error", ({ message }) => {
      setTeamError(message);
    });
  }, [socket, setName, setRoomID, setPlayerID, setTeamError]);

  useEffect(() => {
    if (roomID && !room) {
      socket.emit("rejoin room", { roomID, playerID });
    }
  }, [socket, roomID, playerID, room]);

  /*** CALLBACKS ***/

  const handleCreateRoom = useCallback(
    ({ name }) => {
      socket.emit("create room", { name, playerID });
    },
    [socket, playerID]
  );

  const handleEndTurn = useCallback(() => {
    socket.emit("end turn");
  }, [socket]);

  const handleJoinRoom = useCallback(
    ({ code, name }) => {
      socket.emit("join room", { code, name, playerID });
    },
    [socket, playerID]
  );

  const handleLockTeams = useCallback(() => {
    socket.emit("lock teams");
  }, [socket]);

  const handleSelectSpymaster = useCallback(
    ({ playerID }) => {
      socket.emit("set spymaster", { playerID });
    },
    [socket]
  );

  const handleSetTeam = useCallback(
    ({ playerID, team }) => {
      socket.emit("set team", { playerID, team });
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
      room={room}
      playerID={playerID}
      teamError={teamError}
      onCreateRoom={handleCreateRoom}
      onEndTurn={handleEndTurn}
      onJoinRoom={handleJoinRoom}
      onLockTeams={handleLockTeams}
      onSelectSpymaster={handleSelectSpymaster}
      onSelectWord={handleSelectWord}
      onSetTeam={handleSetTeam}
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
