import React from "react";
import PropTypes from "prop-types";
import GuesserView from "./GuesserView";
import SpymasterView from "./SpymasterView";

const Game = ({ spymasterA, spymasterB, users, userID, words }) => {
  const you = users.find((u) => u.id === userID);
  const isSpymaster = you.id === spymasterA || you.id === spymasterB;

  return isSpymaster ? (
    <SpymasterView words={words} yourTeam={you.team} />
  ) : (
    <GuesserView words={words} yourTeam={you.team} />
  );
};

Game.propTypes = {
  spymasterA: PropTypes.string.isRequired,
  spymasterB: PropTypes.string.isRequired,
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
};

export default Game;
