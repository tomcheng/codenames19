import React from "react";
import PropTypes from "prop-types";
import GuesserView from "./GuesserView";
import SpymasterView from "./SpymasterView";
import { GameDimensionsProvider } from "./GameDimensions";

const Game = ({
  codes,
  guessesLeft,
  isYourTurn,
  players,
  playerID,
  stage,
  words,
  onEndTurn,
  onSelectWord,
  onSubmitCode,
}) => {
  const you = players[playerID];
  const teamNames = Object.values(players)
    .filter((player) => player.team === you.team && player.id !== playerID)
    .map((player) => player.name);
  const yourWordsLeft = words.filter((w) => w.type === you.team && !w.flipped)
    .length;
  const enemyWordsLeft = words.filter(
    (w) => w.type === (you.team === "A" ? "B" : "A") && !w.flipped
  ).length;
  const gameResult =
    yourWordsLeft === 0 ? "You won!" : enemyWordsLeft === 0 ? "You ded." : null;

  return (
    <GameDimensionsProvider>
      {you.spymaster ? (
        <SpymasterView
          codes={codes}
          gameResult={gameResult}
          isYourTurn={isYourTurn}
          stage={stage}
          teamNames={teamNames}
          words={words}
          yourTeam={you.team}
          onSubmitCode={onSubmitCode}
        />
      ) : (
        <GuesserView
          key={guessesLeft}
          codes={codes}
          gameResult={gameResult}
          guessesLeft={guessesLeft}
          isYourTurn={isYourTurn}
          stage={stage}
          words={words}
          yourSpymasterName={
            Object.values(players).find(
              (p) => p.team === you.team && p.spymaster
            )?.name
          }
          yourTeam={you.team}
          onEndTurn={onEndTurn}
          onSelectWord={onSelectWord}
        />
      )}
    </GameDimensionsProvider>
  );
};

Game.propTypes = {
  codes: PropTypes.array.isRequired,
  isYourTurn: PropTypes.bool.isRequired,
  players: PropTypes.objectOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      spymaster: PropTypes.bool.isRequired,
      team: PropTypes.oneOf(["A", "B"]),
    })
  ).isRequired,
  playerID: PropTypes.string.isRequired,
  stage: PropTypes.string.isRequired,
  words: PropTypes.arrayOf(
    PropTypes.shape({
      flipped: PropTypes.bool.isRequired,
      type: PropTypes.oneOf(["A", "B", "bomb", "neutral"]).isRequired,
      word: PropTypes.string.isRequired,
    })
  ).isRequired,
  onEndTurn: PropTypes.func.isRequired,
  onSelectWord: PropTypes.func.isRequired,
  onSubmitCode: PropTypes.func.isRequired,
  guessesLeft: PropTypes.number,
};

export default Game;
