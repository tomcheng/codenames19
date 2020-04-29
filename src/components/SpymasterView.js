import React from "react";
import PropTypes from "prop-types";
import last from "lodash/last";
import Box from "./Box";
import Text from "./Text";
import SpymasterCodeForm from "./SpymasterCodeForm";

const SpymasterView = ({ codes, stage, words, yourTeam, onSubmitCode }) => {
  const yourWords = words.filter((w) => w.type === yourTeam).map((w) => w.word);
  const opponentsWords = words
    .filter((w) => w.type === (yourTeam === "A" ? "B" : "A"))
    .map((w) => w.word);
  const neutralWords = words
    .filter((w) => w.type === "neutral")
    .map((w) => w.word);
  const bomb = words.find((w) => w.type === "bomb").word;
  const lastCode = last(codes);

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
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          height: 65,
        }}
      >
        {stage === "writing" ? (
          <SpymasterCodeForm onSubmitCode={onSubmitCode} />
        ) : (
          <Box flex alignItems="center" justifyContent="center" height="100%">
            <Box textAlign="center">
              <Text preset="label">Transmission sent. Awaiting response.</Text>
              <div>
                {lastCode.code} - {lastCode.number}
              </div>
            </Box>
          </Box>
        )}
      </Box>
    </>
  );
};

SpymasterView.propTypes = {
  codes: PropTypes.array.isRequired,
  stage: PropTypes.oneOf(["writing", "guessing"]).isRequired,
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
