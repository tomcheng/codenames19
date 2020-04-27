import React from "react";
import PropTypes from "prop-types";
import Box from "./Box";
import Text from "./Text";

const SpymasterView = ({ words, yourTeam }) => {
  const yourWords = words
    .filter((w) => w.type === yourTeam)
    .map((w) => w.word)
    .sort();
  const opponentsWords = words
    .filter((w) => w.type === (yourTeam === "A" ? "B" : "A"))
    .map((w) => w.word)
    .sort();
  const neutralWords = words
    .filter((w) => w.type === "neutral")
    .map((w) => w.word)
    .sort();
  const bomb = words.find((w) => w.type === "bomb").word;
  return (
    <Box padTop="tight">
      <Box padBottom="normal">
        <div>
          <Text preset="label">Your Words:</Text>
        </div>
        <div>{yourWords.join(", ")}</div>
      </Box>
      <Box padBottom="normal">
        <div>
          <Text preset="label">Opponent's Words:</Text>
        </div>
        <div>{opponentsWords.join(", ")}</div>
      </Box>
      <Box padBottom="normal">
        <div>
          <Text preset="label">Neutral Words:</Text>
        </div>
        <div>{neutralWords.join(", ")}</div>
      </Box>

      <Box padBottom="normal">
        <div>
          <Text preset="label">Bomb:</Text>
        </div>
        <div>{bomb}</div>
      </Box>
    </Box>
  );
};

SpymasterView.propTypes = {
  words: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.oneOf(["A", "B", "neutral", "bomb"]).isRequired,
      word: PropTypes.string.isRequired,
    })
  ).isRequired,
  yourTeam: PropTypes.oneOf(["A", "B"]).isRequired,
};

export default SpymasterView;
