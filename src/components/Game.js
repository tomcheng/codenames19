import React from "react";
import PropTypes from "prop-types";
import GuesserView from "./GuesserView";
import SpymasterView from "./SpymasterView";

const Game = ({
  codes,
  isYourTurn,
  spymasterA,
  spymasterB,
  stage,
  users,
  userID,
  words,
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
    <GuesserView words={words} yourTeam={you.team} />
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
  onSubmitCode: PropTypes.func.isRequired,
};

export default Game;
