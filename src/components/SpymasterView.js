import React, { useState } from "react";
import PropTypes from "prop-types";
import compact from "lodash/compact";
import flatten from "lodash/flatten";
import {
  printScore,
  printSpyWaiting,
  printSpyWriting,
  printSpyWords,
  printWaitingMessage,
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

const SpymasterView = ({ playerID, room, onSubmitCode }) => {
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
  const teamNames = Object.values(room.players)
    .filter((p) => p.team === player.team && p.id !== player.id)
    .map((p) => p.name);

  const disabled = !isYourTurn || room.stage === "guessing" || confirmed;
  const gameEnded = !!room.result;

  return (
    <Box flex flexDirection="column" height="100vh">
      <GameDimensionsConsumer>
        {({ lineLength }) => (
          <Console
            lines={compact(
              flatten([
                printScore({
                  isYourTurn,
                  lineLength,
                  roomCode: room.roomCode,
                  words: room.words,
                  yourTeam: player.team,
                }),
                printSpyWords({
                  lineLength,
                  words: room.words,
                  yourTeam: player.team,
                }),
                !gameEnded &&
                  isYourTurn &&
                  room.stage === "writing" &&
                  printSpyWriting({
                    confirmation,
                    confirmed,
                    number,
                    numberDone,
                    numberError,
                    word,
                    wordDone,
                    wordError,
                  }),
                !gameEnded &&
                  isYourTurn &&
                  room.stage === "guessing" &&
                  printSpyWaiting({
                    codes: room.codes,
                    teamNames,
                    yourTeam: player.team,
                  }),
                !gameEnded &&
                  !isYourTurn &&
                  printWaitingMessage({
                    codes: room.codes,
                    stage: room.stage,
                  }),
                gameEnded &&
                  printResult({
                    result: room.result.winner === player.team ? "won" : "lost",
                    bomb: room.result.bomb,
                  }),
              ])
            )}
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

SpymasterView.propTypes = {
  room: roomPropType.isRequired,
  playerID: PropTypes.string.isRequired,
  onSubmitCode: PropTypes.func.isRequired,
};

export default SpymasterView;
