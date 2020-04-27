import React from "react";
import PropTypes from "prop-types";
import chunk from "lodash/chunk";
import { Grid, GridItem } from "./Grid";
import SpymasterView from "./SpymasterView";
import Word from "./Word";

const Game = ({ spymasters, users, userID, words }) => {
  const rows = chunk(words, 3);
  const you = users.find((u) => u.id === userID);
  const isSpymaster = spymasters[you.team].userID === userID;

  if (isSpymaster) {
      return (
          <SpymasterView words={words} yourTeam={you.team} />
      );
  }

  return (
    <div>
      {rows.map((wrds, index) => (
        <Grid key={index} spacing="normal">
          {wrds.map(({ word, type, isFlipped }) => (
            <GridItem key={word} flexible>
              <Word
                word={word}
                type={type}
                isFlipped={isFlipped}
                yourTeam={you.team}
                isSpymaster={isSpymaster}
              />
            </GridItem>
          ))}
        </Grid>
      ))}
    </div>
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
      isFlipped: PropTypes.bool.isRequired,
      type: PropTypes.oneOf(["A", "B", "bomb", "neutral"]).isRequired,
      word: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default Game;
