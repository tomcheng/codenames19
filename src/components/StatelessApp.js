import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import background from "../assets/so-white.png";
import AppHeader from "./AppHeader";
import DocumentWrapper from "./DocumentWrapper";
import Game from "./Game";
import Lobby from "./Lobby";
import SelectTeams from "./SelectTeams";
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
  onJoinRoom,
  onSetTeams,
  onSelectSpymaster,
  onSelectTeam,
  onSubmitCode,
}) => {
  const user = users.find((u) => u.id === userID);

  return (
    <AppContainer>
      <AppHeader roomCode={room?.roomCode} />
      {!room ? (
        <DocumentWrapper title="Enlistment/Re-Enlistment Document">
          <Lobby
            initialName={name}
            codeIsInvalid={codeIsInvalid}
            onCreateRoom={onCreateRoom}
            onJoinRoom={onJoinRoom}
          />
        </DocumentWrapper>
      ) : !room.teamsSet ? (
        <DocumentWrapper title="Declaration of Allegiances">
          <SelectTeams
            users={users}
            onSetTeams={onSetTeams}
            onSelectTeam={onSelectTeam}
          />
        </DocumentWrapper>
      ) : !room.spymasterA || !room.spymasterB ? (
        <DocumentWrapper title="Spy Master Nomination Form">
          <SelectSpymaster
            users={users}
            userID={userID}
            onSelectSpymaster={onSelectSpymaster}
          />
        </DocumentWrapper>
      ) : (
        <Game
          codes={room.codes}
          isYourTurn={user.team === room.turn}
          spymasterA={room.spymasterA}
          spymasterB={room.spymasterB}
          stage={room.stage}
          users={users}
          userID={userID}
          words={room.words}
          onSubmitCode={onSubmitCode}
        />
      )}
    </AppContainer>
  );
};

StatelessApp.propTypes = {
  codeIsInvalid: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  onCreateRoom: PropTypes.func.isRequired,
  onJoinRoom: PropTypes.func.isRequired,
  onSetTeams: PropTypes.func.isRequired,
  onSelectSpymaster: PropTypes.func.isRequired,
  onSelectTeam: PropTypes.func.isRequired,
  onSubmitCode: PropTypes.func.isRequired,
  room: PropTypes.shape({
    codes: PropTypes.array.isRequired,
    roomCode: PropTypes.string.isRequired,
    teamsSet: PropTypes.bool.isRequired,
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
