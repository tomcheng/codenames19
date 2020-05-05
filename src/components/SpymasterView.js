import React, { useState } from "react";
import PropTypes from "prop-types";
import compact from "lodash/compact";
import {
  printScore,
  printSpymasterGuessing,
  printSpymasterWriting,
  printSpymasterWords,
  printWaitingMessage,
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

  if (parseInt(number) < 1) {
    return "The number has to be at least 1";
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
  const [confirmation, setConfirmation] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const disabled = !isYourTurn || stage === "guessing" || confirmed;

  return (
    <Box flex flexDirection="column" height="100vh">
      <GameDimensionsConsumer>
        {({ lineLength }) => (
          <Console
            lines={
              gameResult
                ? [gameResult]
                : compact([
                    ...printScore({ isYourTurn, lineLength, words, yourTeam }),
                    ...printSpymasterWords({ words, yourTeam, lineLength }),
                    ...(isYourTurn && stage === "writing"
                      ? printSpymasterWriting({
                          code,
                          codeDone,
                          codeError,
                          confirmation,
                          confirmed,
                          number,
                          numberDone,
                          numberError,
                        })
                      : []),
                    ...(isYourTurn && stage === "guessing"
                      ? printSpymasterGuessing({ codes, teamNames, yourTeam })
                      : []),
                    ...(!isYourTurn
                      ? printWaitingMessage({ codes, stage })
                      : []),
                  ])
            }
            showPrompt={!disabled}
            typed={numberDone ? confirmation : codeDone ? number : code}
          />
        )}
      </GameDimensionsConsumer>
      {numberDone ? (
        <AlphabetKeyboard
          disabled={disabled}
          onDelete={() => {
            setConfirmation(
              confirmation.length > 0
                ? confirmation.slice(0, confirmation.length - 1)
                : confirmation
            );
          }}
          onType={(letter) => {
            setConfirmation(letter);
          }}
          onSubmit={() => {
            if (confirmation === "Y") {
              setConfirmed(true);
              onSubmitCode({ code: code.trim(), number: parseInt(number) });
            } else {
              setCode("");
              setCodeError(null);
              setCodeDone(false);
              setNumber("");
              setNumberError(null);
              setNumberDone(false);
              setConfirmation("");
            }
          }}
        />
      ) : codeDone ? (
        <NumericKeyboard
          disabled={disabled}
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
          disabled={disabled}
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
