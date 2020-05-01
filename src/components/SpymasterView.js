import React, { useState } from "react";
import PropTypes from "prop-types";
import last from "lodash/last";
import Box from "./Box";
import Button from "./Button";
import DocumentWrapper from "./DocumentWrapper";
import Text from "./Text";
import Input from "./Input";
import Console from "./Console";

const SpymasterView = ({
  codes,
  isYourTurn,
  stage,
  words,
  yourTeam,
  onSubmitCode,
}) => {
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
  const isDisabled = !isYourTurn || stage === "guessing";
  const yourLastCode = last(codes.filter((code) => code.team === yourTeam));

  return (
    <Box alignItems="stretch" flex flexDirection="column" height="100%">
      <Box flexible overflow="auto">
        <DocumentWrapper title="Sensitive - Do Not Distribute">
          <Box flexible padX="loose" padY="normal">
            <Box padBottom="normal">
              <div>
                <Text preset="label">Alliances Words:</Text>
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
              <Box flex>
                <Box borderRight pad="tight" padTop="x-tight" flexible>
                  <Text
                    as="label"
                    htmlFor="code"
                    preset="label"
                    faded={isDisabled}
                  >
                    Code Word
                  </Text>
                  <div>
                    <Input
                      autoFocus
                      disabled={isDisabled}
                      id="code"
                      name="code"
                      value={isDisabled ? yourLastCode?.code ?? "" : code}
                      onChange={(evt) => {
                        setCode(evt.target.value);
                      }}
                    />
                  </div>
                </Box>
                <Box pad="tight" padTop="x-tight" width={120}>
                  <Text
                    as="label"
                    htmlFor="number"
                    preset="label"
                    faded={isDisabled}
                  >
                    Number
                  </Text>
                  <div>
                    <Input
                      disabled={isDisabled}
                      id="number"
                      name="number"
                      type="number"
                      value={isDisabled ? yourLastCode?.number ?? "" : number}
                      onChange={(evt) => {
                        setNumber(evt.target.value);
                      }}
                    />
                  </div>
                </Box>
              </Box>
            </Box>
          </Box>
        </DocumentWrapper>
        <Box flex justifyContent="center" padBottom="x-loose">
          <Button
            disabled={isDisabled}
            onClick={() => {
              if (!code || !number) return;
              onSubmitCode({ code, number: parseInt(number) });
            }}
          >
            Submit
          </Button>
        </Box>
      </Box>
      <Console lines={[]} showPrompt />
    </Box>
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
