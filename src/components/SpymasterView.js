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
import { roomPropType } from "../utils";

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

const SpymasterView = ({ gameResult, playerID, room, onSubmitCode }) => {
  const [code, setCode] = useState("");
  const [codeDone, setCodeDone] = useState(false);
  const [codeError, setCodeError] = useState(null);
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

  return (
    <Box flex flexDirection="column" height="100vh">
      <GameDimensionsConsumer>
        {({ lineLength }) => (
          <Console
            lines={
              gameResult
                ? [gameResult]
                : compact([
                    ...printScore({
                      isYourTurn,
                      lineLength,
                      words: room.words,
                      yourTeam: player.team,
                    }),
                    ...printSpymasterWords({
                      lineLength,
                      words: room.words,
                      yourTeam: player.team,
                    }),
                    ...(isYourTurn && room.stage === "writing"
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
                    ...(isYourTurn && room.stage === "guessing"
                      ? printSpymasterGuessing({
                          codes: room.codes,
                          teamNames,
                          yourTeam: player.team,
                        })
                      : []),
                    ...(!isYourTurn
                      ? printWaitingMessage({
                          codes: room.codes,
                          stage: room.stage,
                        })
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
  room: roomPropType.isRequired,
  playerID: PropTypes.string.isRequired,
  onSubmitCode: PropTypes.func.isRequired,
  gameResult: PropTypes.string,
};

export default SpymasterView;
