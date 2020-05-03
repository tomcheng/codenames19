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
  room,
  userID,
  users,
  onCreateRoom,
  onEndTurn,
  onJoinRoom,
  onSetTeams,
  onSelectSpymaster,
  onSelectTeam,
  onSelectWord,
  onSubmitCode,
}) => {
  const user = users?.find((u) => u.id === userID);
  const gameStarted = !!room?.turn;

  if (gameStarted) {
    return (
      <Game
        key={room.round}
        codes={room.codes}
        isYourTurn={user?.team === room.turn}
        guessesLeft={room.guessesLeft}
        spymasterA={room.spymasterA}
        spymasterB={room.spymasterB}
        stage={room.stage}
        users={users}
        userID={userID}
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
      ) : !room.teamsSet ? (
        <SelectTeams
          users={users}
          onSetTeams={onSetTeams}
          onSelectTeam={onSelectTeam}
        />
      ) : !user.team ? (
        <SelectTeamToJoin
          userID={userID}
          users={users}
          onSelectTeam={onSelectTeam}
        />
      ) : (
        <SelectSpymaster
          chosenSpymaster={
            user.team === "A" ? room.spymasterA : room.spymasterB
          }
          users={users}
          userID={userID}
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
  onSetTeams: PropTypes.func.isRequired,
  onSelectSpymaster: PropTypes.func.isRequired,
  onSelectTeam: PropTypes.func.isRequired,
  onSubmitCode: PropTypes.func.isRequired,
  room: PropTypes.shape({
    codes: PropTypes.array.isRequired,
    roomCode: PropTypes.string.isRequired,
    teamsSet: PropTypes.bool.isRequired,
    guessesLeft: PropTypes.number,
    spymasterA: PropTypes.string,
    spymasterB: PropTypes.string,
    stage: PropTypes.string,
    turn: PropTypes.string,
    words: PropTypes.array,
  }),
  userID: PropTypes.string,
  users: PropTypes.array,
};

let ReactDvrApp;

if (process.env.NODE_ENV === "development") {
  const reactDvr = require("react-dvr").default;
  ReactDvrApp = reactDvr()(StatelessApp);
}

export default ReactDvrApp || StatelessApp;
