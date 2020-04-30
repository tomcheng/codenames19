import React from "react";
import PropTypes from "prop-types";
import GuesserView from "./GuesserView";
import SpymasterView from "./SpymasterView";

const Game = ({
  codes,
  guessesLeft,
  highlights,
  isYourTurn,
  spymasterA,
  spymasterB,
  stage,
  users,
  userID,
  words,
  onHighlightWord,
  onSelectWord,
  onSubmitCode,
}) => {
  const you = users.find((u) => u.id === userID);
  const isSpymaster = you.id === spymasterA || you.id === spymasterB;

  return isSpymaster ? (
    <SpymasterView
      codes={codes}
      isYourTurn={isYourTurn}
      stage={stage}
      words={words}
      yourTeam={you.team}
      onSubmitCode={onSubmitCode}
    />
  ) : (
    <GuesserView
      codes={codes}
      guessesLeft={guessesLeft}
      highlights={highlights[you.team]}
      stage={stage}
      words={words}
      yourTeam={you.team}
      onHighlightWord={onHighlightWord}
      onSelectWord={onSelectWord}
    />
  );
};

Game.propTypes = {
  codes: PropTypes.array.isRequired,
  guessesLeft: PropTypes.number.isRequired,
  highlights: PropTypes.shape({
    A: PropTypes.array.isRequired,
    B: PropTypes.array.isRequired,
  }).isRequired,
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
  onHighlightWord: PropTypes.func.isRequired,
  onSelectWord: PropTypes.func.isRequired,
  onSubmitCode: PropTypes.func.isRequired,
};

export default Game;
