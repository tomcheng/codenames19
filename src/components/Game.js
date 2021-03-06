import React from "react";
import PropTypes from "prop-types";
import { roomPropType } from "../utils";
import GuesserView from "./GuesserView";
import SpyView from "./SpyView";
import { GameDimensionsProvider } from "./GameDimensions";

const Game = ({
  playerID,
  room,
  onConfirmWord,
  onEndTurn,
  onRejectWord,
  onSelectWord,
  onSubmitCode,
}) => {
  const you = room.players[playerID];

  return (
    <GameDimensionsProvider>
      {you.spymaster ? (
        <SpyView
          playerID={playerID}
          room={room}
          onSubmitCode={onSubmitCode}
        />
      ) : (
        <GuesserView
          key={room.guessesLeft}
          playerID={playerID}
          room={room}
          onConfirmWord={onConfirmWord}
          onEndTurn={onEndTurn}
          onRejectWord={onRejectWord}
          onSelectWord={onSelectWord}
        />
      )}
    </GameDimensionsProvider>
  );
};

Game.propTypes = {
  playerID: PropTypes.string.isRequired,
  room: roomPropType,
  onConfirmWord: PropTypes.func.isRequired,
  onEndTurn: PropTypes.func.isRequired,
  onRejectWord: PropTypes.func.isRequired,
  onSelectWord: PropTypes.func.isRequired,
  onSubmitCode: PropTypes.func.isRequired,
  guessesLeft: PropTypes.number,
};

export default Game;
