import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import background from "../assets/so-white.png";
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
  codeIsInvalid,
  name,
  playerID,
  room,
  teamError,
  onCreateRoom,
  onEndTurn,
  onJoinRoom,
  onLockTeams,
  onSelectSpymaster,
  onSetTeam,
  onSelectWord,
  onSubmitCode,
}) => {
  const player = room?.players[playerID];
  const gameStarted = !!room?.turn;

  if (gameStarted) {
    return (
      <Game
        key={room.round}
        codes={room.codes}
        isYourTurn={player?.team === room.turn}
        guessesLeft={room.guessesLeft}
        spymasterA={room.spymasterA}
        spymasterB={room.spymasterB}
        stage={room.stage}
        players={room.players}
        playerID={playerID}
        words={room.words}
        onEndTurn={onEndTurn}
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
          initialName={name}
          codeIsInvalid={codeIsInvalid}
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
          players={room.players}
          playerID={playerID}
          onSelectSpymaster={onSelectSpymaster}
        />
      )}
    </AppContainer>
  );
};

StatelessApp.propTypes = {
  codeIsInvalid: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  onCreateRoom: PropTypes.func.isRequired,
  onEndTurn: PropTypes.func.isRequired,
  onJoinRoom: PropTypes.func.isRequired,
  onLockTeams: PropTypes.func.isRequired,
  onSelectSpymaster: PropTypes.func.isRequired,
  onSetTeam: PropTypes.func.isRequired,
  onSubmitCode: PropTypes.func.isRequired,
  room: PropTypes.shape({
    codes: PropTypes.array.isRequired,
    players: PropTypes.object.isRequired,
    roomCode: PropTypes.string.isRequired,
    teamsLocked: PropTypes.bool.isRequired,
    guessesLeft: PropTypes.number,
    stage: PropTypes.string,
    turn: PropTypes.string,
    words: PropTypes.array,
  }),
  playerID: PropTypes.string,
  teamError: PropTypes.string,
};

let ReactDvrApp;

if (process.env.NODE_ENV === "development") {
  const reactDvr = require("react-dvr").default;
  ReactDvrApp = reactDvr()(StatelessApp);
}

export default ReactDvrApp || StatelessApp;
