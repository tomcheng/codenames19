import React, { useState } from "react";
import PropTypes from "prop-types";
import clamp from "lodash/clamp";
import compact from "lodash/compact";
import last from "lodash/last";
import repeat from "lodash/repeat";
import { humanizeList } from "../utils";
import { displayWordGroup } from "../consoleUtils";
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
  humanizedScore,
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

  const allianceWords = words.filter((w) => w.type === yourTeam);
  const enemyWords = words.filter(
    (w) => w.type === (yourTeam === "A" ? "B" : "A")
  );
  const neutralWords = words.filter((w) => w.type === "neutral");
  const bomb = words.find((w) => w.type === "bomb");
  const isDisabled = !isYourTurn || stage === "guessing";
  const yourLastCode = last(codes.filter((code) => code.team === yourTeam));

  const width = window.innerWidth;
  const lineLength = width / 8 - 2;
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
            : compact([
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
                repeat("─", lineLength),
                " ",
                (numberError || codeError) &&
                  `**${numberError || codeError}.**`,
                (numberError || codeError) && " ",
                `Enter code word: **${codeDone ? code : ""}**`,
                codeDone && `Enter number:    **${numberDone ? number : ""}**`,
                numberDone &&
                  `Send code and number? (Y/N) **${confirmed ? confirm : ""}**`,
                confirmed && " ",
                confirmed && `**Sending: ${code.trim()} / ${number}...**`,
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
