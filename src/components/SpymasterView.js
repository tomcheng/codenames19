import React from "react";
import PropTypes from "prop-types";
import Box from "./Box";
import Input from "./Input";
import Text from "./Text";
import Button from "./Button";

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
    <>
      <Box flexible padX="loose" padY="normal">
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
      <Box
        borderTop
        flex
        style={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
      >
        <Box borderRight pad="tight" padTop="x-tight" flexible>
          <Text as="label" htmlFor="foo" preset="label">
            Code Word
          </Text>
          <div>
            <Input autoFocus id="foo" name="foo" />
          </div>
        </Box>
        <Box pad="tight" padTop="x-tight" borderRight width={120}>
          <Text as="label" htmlFor="foo" preset="label">
            Number
          </Text>
          <div>
            <Input id="foo" name="foo" type="number" />
          </div>
        </Box>
        <Box pad="tight" flex alignItems="center">
          <Button>Submit</Button>
        </Box>
      </Box>
    </>
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
