import React, { useState } from "react";
import PropTypes from "prop-types";
import compact from "lodash/compact";
import last from "lodash/last";
import { humanizeList } from "../utils";
import { printSpymasterList } from "../consoleUtils";
import Box from "./Box";
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
  keyWidth,
  lineLength,
  scoreLines,
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
  const yourLastCode = last(codes.filter((code) => code.team === yourTeam));

  const listLines = printSpymasterList({ words, yourTeam, lineLength });

  return (
    <Box flex flexDirection="column" height="100vh">
      <Console
        lines={
          gameResult
            ? [gameResult]
            : !isYourTurn
            ? [...scoreLines, ...listLines, "**Awaiting enemy's turn...**"]
            : stage === "guessing"
            ? yourLastCode
              ? [
                  ...scoreLines,
                  ...listLines,
                  `**Transmission sent: ${yourLastCode.code} / ${yourLastCode.number}**`,
                  " ",
                  `Awaiting response from ${humanizeList(teamNames)}...`,
                ]
              : []
            : compact([
                ...scoreLines,
                ...listLines,
                (numberError || codeError) &&
                  `**${numberError || codeError}.**`,
                `Enter code word: **${codeDone ? code : ""}**`,
                codeDone && `Enter number:    **${numberDone ? number : ""}**`,
                numberDone &&
                  `Send code and number? (Y/N) **${confirmed ? confirm : ""}**`,
                confirmed && " ",
                confirmed &&
                  `**Sending Transmission: ${code.trim()} / ${number}...**`,
              ])
        }
        showPrompt={!isDisabled && !confirmed}
        typed={numberDone ? confirm : codeDone ? number : code}
      />
      {numberDone ? (
        <AlphabetKeyboard
          keyWidth={keyWidth}
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
          keyWidth={keyWidth}
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
          keyWidth={keyWidth}
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
  keyWidth: PropTypes.number.isRequired,
  lineLength: PropTypes.number.isRequired,
  scoreLines: PropTypes.arrayOf(PropTypes.string).isRequired,
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
