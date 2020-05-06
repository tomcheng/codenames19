import React from "react";
import PropTypes from "prop-types";
import { roomPropType } from "../utils";
import GuesserView from "./GuesserView";
import SpymasterView from "./SpymasterView";
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
  console.log("you", you);
  console.log("room.players", room.players);
  console.log("playerID", playerID);
  const yourWordsLeft = room.words.filter(
    (w) => w.type === you.team && !w.flipped
  ).length;
  const enemyWordsLeft = room.words.filter(
    (w) => w.type === (you.team === "A" ? "B" : "A") && !w.flipped
  ).length;
  const gameResult =
    yourWordsLeft === 0 ? "You won!" : enemyWordsLeft === 0 ? "You ded." : null;
  console.log("room.words", room.words);

  return (
    <GameDimensionsProvider>
      {you.spymaster ? (
        <SpymasterView
          gameResult={gameResult}
          playerID={playerID}
          room={room}
          onSubmitCode={onSubmitCode}
        />
      ) : (
        <GuesserView
          key={room.guessesLeft}
          gameResult={gameResult}
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
