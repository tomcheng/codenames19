import React from "react";
import PropTypes from "prop-types";
import keyBy from "lodash/keyBy";
import GuesserView from "./GuesserView";
import SpymasterView from "./SpymasterView";

const Game = ({
  codes,
  guessesLeft,
  isYourTurn,
  spymasterA,
  spymasterB,
  stage,
  users,
  userID,
  words,
  onEndTurn,
  onSelectWord,
  onSubmitCode,
}) => {
  const usersByID = keyBy(users, "id");
  const you = usersByID[userID];
  const isSpymaster = you.id === spymasterA || you.id === spymasterB;
  const teamNames = users
    .filter((u) => u.team === you.team && u.id !== userID)
    .map((u) => u.name);
  const yourWordsLeft = words.filter((w) => w.type === you.team && !w.flipped)
    .length;
  const enemyWordsLeft = words.filter(
    (w) => w.type === (you.team === "A" ? "B" : "A") && !w.flipped
  ).length;
  const humanizedScore = `Alliance: ${yourWordsLeft} left - The Enemy: ${enemyWordsLeft} left`;
  const gameResult =
    yourWordsLeft === 0 ? "You won!" : enemyWordsLeft === 0 ? "You ded." : null;

  return isSpymaster ? (
    <SpymasterView
      codes={codes}
      gameResult={gameResult}
      humanizedScore={humanizedScore}
      isYourTurn={isYourTurn}
      stage={stage}
      teamNames={teamNames}
      words={words}
      yourTeam={you.team}
      onSubmitCode={onSubmitCode}
    />
  ) : (
    <GuesserView
      codes={codes}
      gameResult={gameResult}
      guessesLeft={guessesLeft}
      humanizedScore={humanizedScore}
      isYourTurn={isYourTurn}
      stage={stage}
      words={words}
      yourSpymasterName={
        usersByID[you.team === "A" ? spymasterA : spymasterB]?.name
      }
      yourTeam={you.team}
      onEndTurn={onEndTurn}
      onSelectWord={onSelectWord}
    />
  );
};

Game.propTypes = {
  codes: PropTypes.array.isRequired,
  isYourTurn: PropTypes.bool.isRequired,
  spymasterA: PropTypes.string.isRequired,
  spymasterB: PropTypes.string.isRequired,
  stage: PropTypes.string.isRequired,
  users: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      team: PropTypes.oneOf(["A", "B"]),
    })
  ).isRequired,
  userID: PropTypes.string.isRequired,
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
