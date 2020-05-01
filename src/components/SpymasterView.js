import React, { useState } from "react";
import PropTypes from "prop-types";
import last from "lodash/last";
import Box from "./Box";
import Console from "./Console";
import DocumentSubmit from "./DocumentSubmit";
import DocumentWrapper from "./DocumentWrapper";
import InlineWord from "./InlineWord";
import Input from "./Input";
import Text from "./Text";

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

  const yourWords = words.filter((w) => w.type === yourTeam);
  const opponentsWords = words.filter(
    (w) => w.type === (yourTeam === "A" ? "B" : "A")
  );
  const neutralWords = words.filter((w) => w.type === "neutral");
  const bomb = words.find((w) => w.type === "bomb");
  const isDisabled = !isYourTurn || stage === "guessing";
  const yourLastCode = last(codes.filter((code) => code.team === yourTeam));

  return (
    <Box style={{ paddingTop: 64, position: "relative" }}>
      <Console
        lines={
          !isYourTurn
            ? ["Awaiting the enemy's turn..."]
            : stage === "guessing"
            ? yourLastCode
              ? [
                  `Transmission sent: ${yourLastCode.code} / ${yourLastCode.number}`,
                ]
              : []
            : ["* Send one word and one number.", "* Try not to fuck this up."]
        }
        showPrompt={!isDisabled}
      />
      <Box flexible overflow="auto">
        <DocumentWrapper title="Sensitive - Do Not Distribute">
          <Box flexible padX="loose" padY="normal">
            <Box padBottom="normal">
              <div>
                <Text preset="label">Alliance's Words:</Text>
              </div>
              <div>
                {yourWords.map((word, index) => (
                  <InlineWord
                    key={word.word}
                    {...word}
                    isLast={index === yourWords.length - 1}
                  />
                ))}
              </div>
            </Box>
            <Box padBottom="normal">
              <div>
                <Text preset="label">Enemy's Words:</Text>
              </div>
              <div>
                {opponentsWords.map((word, index) => (
                  <InlineWord
                    key={word.word}
                    {...word}
                    isLast={index === opponentsWords.length - 1}
                  />
                ))}
              </div>
            </Box>
            <Box padBottom="normal">
              <div>
                <Text preset="label">Neutral Words:</Text>
              </div>
              <div>
                {neutralWords.map((word, index) => (
                  <InlineWord
                    key={word.word}
                    {...word}
                    isLast={index === neutralWords.length - 1}
                  />
                ))}
              </div>
            </Box>
            <Box padBottom="normal">
              <div>
                <Text preset="label">Bomb:</Text>
              </div>
              <div>
                <InlineWord {...bomb} isLast />
              </div>
            </Box>
            <Box border style={{ margin: "8px -16px -16px" }}>
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
        <DocumentSubmit
          disabled={isDisabled}
          onSubmit={() => {
            if (!code || !number) return;
            onSubmitCode({ code, number: parseInt(number) });
          }}
        />
      </Box>
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
