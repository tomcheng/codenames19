import React, { useState } from "react";
import PropTypes from "prop-types";
import last from "lodash/last";
import Box from "./Box";
import Button from "./Button";
import DocumentWrapper from "./DocumentWrapper";
import Text from "./Text";
import Input from "./Input";

const SpymasterView = ({ codes, stage, words, yourTeam, onSubmitCode }) => {
  const [code, setCode] = useState("");
  const [number, setNumber] = useState("");

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
    <div>
      <DocumentWrapper title="For Your Eyes Only">
        <Box flexible padX="loose" padY="normal">
          <Box padBottom="normal">
            <div>
              <Text preset="label">Your Words:</Text>
            </div>
            <div>{yourWords.join(", ")}</div>
          </Box>
          <Box padBottom="normal">
            <div>
              <Text preset="label">Enemy's Words:</Text>
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
          <Box border style={{ margin: "8px -16px -32px" }}>
            {stage === "writing" ? (
              <Box flex>
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
                <Box pad="tight" padTop="x-tight" width={120}>
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
              </Box>
            ) : (
              <Box
                flex
                alignItems="center"
                justifyContent="center"
                height="100%"
              >
                <Box textAlign="center">
                  <Text preset="label">
                    Transmission sent. Awaiting response.
                  </Text>
                  <div>
                    {lastCode.code} - {lastCode.number}
                  </div>
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </DocumentWrapper>
      <Box flex justifyContent="center">
        <Button
          onClick={() => {
            if (!code || !number) return;
            onSubmitCode({ code, number: parseInt(number) });
          }}
        >
          Submit
        </Button>
      </Box>
    </div>
  );
};

SpymasterView.propTypes = {
  codes: PropTypes.arrayOf(
    PropTypes.shape({
      code: PropTypes.string.isRequired,
      number: PropTypes.number.isRequired,
    })
  ).isRequired,
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
