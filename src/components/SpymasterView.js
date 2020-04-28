import React, { useState } from "react";
import PropTypes from "prop-types";
import Box from "./Box";
import Input from "./Input";
import Text from "./Text";
import Button from "./Button";

const SpymasterView = ({ words, yourTeam, onSubmitCode }) => {
  const [code, setCode] = useState("");
  const [number, setNumber] = useState("");
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
        as="form"
        borderTop
        flex
        style={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
        onSubmit={(evt) => {
          evt.preventDefault();
          if (!code || !number) return;
          onSubmitCode({ code, number: parseInt(number) });
        }}
      >
        <Box borderRight pad="tight" padTop="x-tight" flexible>
          <Text as="label" htmlFor="code" preset="label">
            Code Word
          </Text>
          <div>
            <Input
              autoFocus
              id="code"
              name="code"
              value={code}
              onChange={(evt) => {
                setCode(evt.target.value);
              }}
            />
          </div>
        </Box>
        <Box pad="tight" padTop="x-tight" borderRight width={120}>
          <Text as="label" htmlFor="number" preset="label">
            Number
          </Text>
          <div>
            <Input
              id="number"
              name="number"
              type="number"
              value={number}
              onChange={(evt) => {
                setNumber(evt.target.value);
              }}
            />
          </div>
        </Box>
        <Box pad="tight" flex alignItems="center">
          <Button type="submit">Submit</Button>
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
  onSubmitCode: PropTypes.func.isRequired,
};

export default SpymasterView;
