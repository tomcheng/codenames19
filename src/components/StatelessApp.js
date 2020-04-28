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
  background-image: url(${background});
  background-repeat: repeat;
  height: 100vh;
  overflow: auto;
`;

const AppBody = styled.div`
  padding: 10px 20px;
`;

const StatelessApp = ({
  codeIsInvalid,
  name,
  room,
  userID,
  users,
  onCreateRoom,
  onJoinRoom,
  onLockInSpymaster,
  onLockInTeams,
  onSelectSpymaster,
  onSelectTeam,
}) => {
  return (
    <AppContainer>
      <AppHeader roomCode={room?.code} />
      <AppBody>
        {!room ? (
          <DocumentWrapper title="Enlistment/Re-Enlistment Document">
            <Lobby
              initialName={name}
              codeIsInvalid={codeIsInvalid}
              onCreateRoom={onCreateRoom}
              onJoinRoom={onJoinRoom}
            />
          </DocumentWrapper>
        ) : !room.teamsLockedIn ? (
          <DocumentWrapper title="Declaration of Allegiances">
            <SelectTeams
              users={users}
              onLockInTeams={onLockInTeams}
              onSelectTeam={onSelectTeam}
            />
          </DocumentWrapper>
        ) : !room.spymasters.A.lockedIn || !room.spymasters.B.lockedIn ? (
          <DocumentWrapper title="Spy Master Nomination Form">
            <SelectSpymaster
              spymasters={room.spymasters}
              users={users}
              userID={userID}
              onLockInSpymaster={onLockInSpymaster}
              onSelectSpymaster={onSelectSpymaster}
            />
          </DocumentWrapper>
        ) : (
          <Game
            spymasters={room.spymasters}
            users={users}
            userID={userID}
            words={room.words}
          />
        )}
      </AppBody>
    </AppContainer>
  );
};

StatelessApp.propTypes = {
  codeIsInvalid: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  onCreateRoom: PropTypes.func.isRequired,
  onJoinRoom: PropTypes.func.isRequired,
  onLockInSpymaster: PropTypes.func.isRequired,
  onLockInTeams: PropTypes.func.isRequired,
  onSelectSpymaster: PropTypes.func.isRequired,
  onSelectTeam: PropTypes.func.isRequired,
  room: PropTypes.shape({
    code: PropTypes.string.isRequired,
    spymasters: PropTypes.shape({
      A: PropTypes.shape({
        lockedIn: PropTypes.bool.isRequired,
      }).isRequired,
      B: PropTypes.shape({
        lockedIn: PropTypes.bool.isRequired,
      }).isRequired,
    }).isRequired,
    teamsLockedIn: PropTypes.bool.isRequired,
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
