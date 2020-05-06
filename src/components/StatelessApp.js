import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import background from "../assets/so-white.png";
import { roomPropType } from "../utils";
import AppHeader from "./AppHeader";
import Game from "./Game";
import Lobby from "./Lobby";
import SelectTeams from "./SelectTeams";
import SelectTeamToJoin from "./SelectTeamToJoin";
import SelectSpymaster from "./SelectSpymaster";

const AppContainer = styled.div`
  background-color: #fff;
  background-image: url(${background});
  background-repeat: repeat;
  height: 100vh;
  overflow: auto;
`;

const StatelessApp = ({
  hasInvalidCode,
  name,
  playerID,
  room,
  teamError,
  onConfirmWord,
  onCreateRoom,
  onEndTurn,
  onJoinRoom,
  onLockTeams,
  onRejectWord,
  onSelectSpymaster,
  onSetTeam,
  onSelectWord,
  onSubmitCode,
}) => {
  const player = room?.players[playerID];
  const gameStarted = !!room?.turn;

  if (gameStarted && player.team) {
    return (
      <Game
        key={room.round}
        playerID={playerID}
        room={room}
        onConfirmWord={onConfirmWord}
        onEndTurn={onEndTurn}
        onRejectWord={onRejectWord}
        onSelectWord={onSelectWord}
        onSubmitCode={onSubmitCode}
      />
    );
  }

  return (
    <AppContainer>
      <AppHeader roomCode={room?.roomCode} />
      {!room ? (
        <Lobby
          hasInvalidCode={hasInvalidCode}
          initialName={name}
          onCreateRoom={onCreateRoom}
          onJoinRoom={onJoinRoom}
        />
      ) : !room.teamsLocked ? (
        <SelectTeams
          players={room.players}
          teamError={teamError}
          onSetTeam={onSetTeam}
          onLockTeams={onLockTeams}
        />
      ) : !player.team ? (
        <SelectTeamToJoin
          playerID={playerID}
          players={room.players}
          onSetTeam={onSetTeam}
        />
      ) : (
        <SelectSpymaster
          playerID={playerID}
          players={room.players}
          onSelectSpymaster={onSelectSpymaster}
        />
      )}
    </AppContainer>
  );
};

StatelessApp.propTypes = {
  hasInvalidCode: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  onConfirmWord: PropTypes.func.isRequired,
  onCreateRoom: PropTypes.func.isRequired,
  onEndTurn: PropTypes.func.isRequired,
  onJoinRoom: PropTypes.func.isRequired,
  onLockTeams: PropTypes.func.isRequired,
  onRejectWord: PropTypes.func.isRequired,
  onSelectSpymaster: PropTypes.func.isRequired,
  onSetTeam: PropTypes.func.isRequired,
  onSubmitCode: PropTypes.func.isRequired,
  room: roomPropType,
  playerID: PropTypes.string,
  teamError: PropTypes.string,
};

let ReactDvrApp;

if (process.env.NODE_ENV === "development") {
  const reactDvr = require("react-dvr").default;
  ReactDvrApp = reactDvr()(StatelessApp);
}

export default ReactDvrApp || StatelessApp;
