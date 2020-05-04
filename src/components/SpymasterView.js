import React, { useState } from "react";
import PropTypes from "prop-types";
import compact from "lodash/compact";
import {
  printScore,
  printSpymasterGuessing,
  printSpymasterWriting,
  printSpymasterWords,
} from "../consoleUtils";
import Box from "./Box";
import { GameDimensionsConsumer } from "./GameDimensions";
import Console from "./Console";
import AlphabetKeyboard from "./AlphabetKeyboard";
import NumericKeyboard from "./NumericKeyboard";

const validateCode = (code) => {
  if (code.trim().length === 0) {
    return "A code is required";
  }
  if (code.trim().includes(" ")) {
    return "Only one word is permitted";
  }
  return null;
};

const validateNumber = (number) => {
  if (number.length === 0) {
    return "A number is required";
  }
  if (parseInt(number) > 9) {
    return "The number has to be less than 9";
  }

  return null;
};

const SpymasterView = ({
  codes,
  gameResult,
  isYourTurn,
  stage,
  teamNames,
  words,
  yourTeam,
  onSubmitCode,
}) => {
  const [code, setCode] = useState("");
  const [codeDone, setCodeDone] = useState(false);
  const [codeError, setCodeError] = useState(null);
  const [number, setNumber] = useState("");
  const [numberError, setNumberError] = useState(null);
  const [numberDone, setNumberDone] = useState(false);
  const [confirm, setConfirm] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const isDisabled = !isYourTurn || stage === "guessing";

  return (
    <Box flex flexDirection="column" height="100vh">
      <GameDimensionsConsumer>
        {({ lineLength }) => (
          <Console
            lines={
              gameResult
                ? [gameResult]
                : compact([
                    ...printScore({ words, yourTeam, lineLength }),
                    ...printSpymasterWords({ words, yourTeam, lineLength }),
                    ...(isYourTurn && stage === "writing"
                      ? printSpymasterWriting({
                          code,
                          codeDone,
                          codeError,
                          confirm,
                          confirmed,
                          number,
                          numberDone,
                          numberError,
                        })
                      : []),
                    ...(isYourTurn && stage === "guessing"
                      ? printSpymasterGuessing({ codes, teamNames, yourTeam })
                      : []),
                    !isYourTurn && "**Awaiting enemy's turn...**",
                  ])
            }
            showPrompt={!isDisabled && !confirmed}
            typed={numberDone ? confirm : codeDone ? number : code}
          />
        )}
      </GameDimensionsConsumer>
      {numberDone ? (
        <AlphabetKeyboard
          onDelete={() => {
            setConfirm(
              confirm.length > 0
                ? confirm.slice(0, confirm.length - 1)
                : confirm
            );
          }}
          onType={(letter) => {
            setConfirm(letter);
          }}
          onSubmit={() => {
            if (confirm === "Y") {
              setConfirmed(true);
              onSubmitCode({ code: code.trim(), number: parseInt(number) });
            } else {
              setCode("");
              setCodeError(null);
              setCodeDone(false);
              setNumber("");
              setNumberError(null);
              setNumberDone(false);
              setConfirm("");
            }
          }}
        />
      ) : codeDone ? (
        <NumericKeyboard
          onCancel={() => {
            setCode("");
            setCodeError(null);
            setCodeDone(false);
            setNumber("");
            setNumberError(null);
          }}
          onDelete={() => {
            setNumber(
              number.length > 0 ? number.slice(0, number.length - 1) : number
            );
          }}
          onType={(num) => {
            setNumber(number + num);
          }}
          onSubmit={() => {
            const e = validateNumber(number);
            if (e) {
              setNumberError(e);
              setNumber("");
              return;
            }
            setNumberDone(true);
          }}
        />
      ) : (
        <AlphabetKeyboard
          onDelete={() => {
            setCode(code.length > 0 ? code.slice(0, code.length - 1) : code);
          }}
          onType={(letter) => {
            setCode(code + letter);
          }}
          onSubmit={() => {
            const e = validateCode(code);
            if (e) {
              setCodeError(e);
              setCode("");
              return;
            }
            setCodeDone(true);
          }}
        />
      )}
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
  isYourTurn: PropTypes.bool.isRequired,
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
