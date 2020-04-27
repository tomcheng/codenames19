import React from "react";
import PropTypes from "prop-types";
import GuesserView from "./GuesserView";
import SpymasterView from "./SpymasterView";

const Game = ({ spymasters, users, userID, words }) => {
  const you = users.find((u) => u.id === userID);
  const isSpymaster = spymasters[you.team].userID === userID;

  return isSpymaster ? (
    <SpymasterView words={words} yourTeam={you.team} />
  ) : (
    <GuesserView words={words} yourTeam={you.team} />
  );
};

Game.propTypes = {
  spymasters: PropTypes.shape({
    A: PropTypes.shape({
      userID: PropTypes.string.isRequired,
    }).isRequired,
    B: PropTypes.shape({
      userID: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
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
