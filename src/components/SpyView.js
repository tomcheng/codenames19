import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  printCommonLines,
  printSpyWriting,
  printResult,
} from "../consoleUtils";
import Box from "./Box";
import { GameDimensionsConsumer } from "./GameDimensions";
import Console from "./Console";
import AlphabetKeyboard from "./AlphabetKeyboard";
import NumericKeyboard from "./NumericKeyboard";
import { roomPropType } from "../utils";

const validateCode = (code) => {
  if (code.trim().length === 0) {
    return "A word is required";
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

const SpyView = ({ playerID, room, onSubmitCode }) => {
  const [word, setWord] = useState("");
  const [wordDone, setWordDone] = useState(false);
  const [wordError, setWordError] = useState(null);
  const [number, setNumber] = useState("");
  const [numberError, setNumberError] = useState(null);
  const [numberDone, setNumberDone] = useState(false);
  const [confirmation, setConfirmation] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const player = room.players[playerID];
  const isYourTurn = player.team === room.turn;

  const disabled = !isYourTurn || room.stage === "guessing" || confirmed;

  const getConsoleLines = ({ lineLength }) => {
    let lines = printCommonLines({ lineLength, player, room });

    if (room.result) {
      lines = lines.concat(
        printResult({
          result: room.result.winner === player.team ? "won" : "lost",
          bomb: room.result.bomb,
        })
      );

      return lines;
    }

    if (isYourTurn && room.stage === "writing") {
      lines = lines.concat(
        printSpyWriting({
          confirmation,
          confirmed,
          number,
          numberDone,
          numberError,
          word,
          wordDone,
          wordError,
        })
      );
    }

    return lines;
  };

  return (
    <Box flex flexDirection="column" height="100vh">
      <GameDimensionsConsumer>
        {({ lineLength }) => (
          <Console
            lines={getConsoleLines({ lineLength })}
            showPrompt={!disabled}
            typed={numberDone ? confirmation : wordDone ? number : word}
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
              onSubmitCode({ word: word.trim(), number: parseInt(number) });
            } else {
              setWord("");
              setWordError(null);
              setWordDone(false);
              setNumber("");
              setNumberError(null);
              setNumberDone(false);
              setConfirmation("");
            }
          }}
        />
      ) : wordDone ? (
        <NumericKeyboard
          disabled={disabled}
          onCancel={() => {
            setWord("");
            setWordError(null);
            setWordDone(false);
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
            setWord(word.length > 0 ? word.slice(0, word.length - 1) : word);
          }}
          onType={(letter) => {
            setWord(word + letter);
          }}
          onSubmit={() => {
            const e = validateCode(word);
            if (e) {
              setWordError(e);
              setWord("");
              return;
            }
            setWordDone(true);
          }}
        />
      )}
    </Box>
  );
};

SpyView.propTypes = {
  room: roomPropType.isRequired,
  playerID: PropTypes.string.isRequired,
  onSubmitCode: PropTypes.func.isRequired,
};

export default SpyView;
