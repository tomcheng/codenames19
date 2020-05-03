import React, { useState } from "react";
import PropTypes from "prop-types";
import clamp from "lodash/clamp";
import last from "lodash/last";
import { humanizeList } from "../utils";
import { displayWordGroup } from "../consoleUtils";
import Box from "./Box";
import Console from "./Console";
import Keyboard from "./Keyboard";

const SpymasterView = ({
  codes,
  gameResult,
  humanizedScore,
  isYourTurn,
  stage,
  teamNames,
  words,
  yourTeam,
  onSubmitCode,
}) => {
  const [code, setCode] = useState("");
  const [number, setNumber] = useState("");
  const [error, setError] = useState(null);

  const allianceWords = words.filter((w) => w.type === yourTeam);
  const enemyWords = words.filter(
    (w) => w.type === (yourTeam === "A" ? "B" : "A")
  );
  const neutralWords = words.filter((w) => w.type === "neutral");
  const bomb = words.find((w) => w.type === "bomb");
  const isDisabled = !isYourTurn || stage === "guessing";
  const yourLastCode = last(codes.filter((code) => code.team === yourTeam));

  const width = window.innerWidth;
  const lineLength = width / 8 - 3;
  const keyWidth = clamp(Math.floor((width - 6) / 10), 36, 56);

  return (
    <Box flex flexDirection="column" height="100vh">
      <Console
        lines={
          gameResult
            ? [gameResult]
            : !isYourTurn
            ? ["Awaiting the enemy's turn...", humanizedScore]
            : stage === "guessing"
            ? yourLastCode
              ? [
                  `Transmission sent: ${yourLastCode.code} / ${yourLastCode.number}`,
                  `Awaiting interpretation by ${humanizeList(teamNames)}`,
                ]
              : []
            : [
                ...displayWordGroup({
                  title: "Alliance Words",
                  words: allianceWords.map((w) => w.word),
                  lineLength: lineLength - 4,
                }),
                ...displayWordGroup({
                  title: "Enemy Words",
                  words: enemyWords.map((w) => w.word),
                  lineLength: lineLength - 4,
                }),
                ...displayWordGroup({
                  title: "Neutral Words",
                  words: neutralWords.map((w) => w.word),
                  lineLength: lineLength - 4,
                }),
                ...displayWordGroup({
                  title: "Bomb",
                  words: [bomb.word],
                  lineLength: lineLength - 4,
                }),
                "Send one word and one number",
                "May God have mercy on your soul",
              ]
        }
        showPrompt={!isDisabled}
        typed={code}
      />
      <Keyboard
        keyWidth={keyWidth}
        onDelete={() => {
          setCode(code.length > 0 ? code.slice(0, code.length - 1) : code);
        }}
        onType={(letter) => {
          setCode(code + letter);
        }}
      />
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
  humanizedScore: PropTypes.string.isRequired,
  stage: PropTypes.oneOf(["writing", "guessing"]).isRequired,
  teamNames: PropTypes.arrayOf(PropTypes.string).isRequired,
  words: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.oneOf(["A", "B", "neutral", "bomb"]).isRequired,
      word: PropTypes.string.isRequired,
    })
  ).isRequired,
  yourTeam: PropTypes.oneOf(["A", "B"]).isRequired,
  onSubmitCode: PropTypes.func.isRequired,
  gameResult: PropTypes.string,
};

export default SpymasterView;
