import React, { useState } from "react";
import PropTypes from "prop-types";
import compact from "lodash/compact";
import last from "lodash/last";
import Box from "./Box";
import Console from "./Console";
import { GameDimensionsConsumer } from "./GameDimensions";
import {
  printGuesserGuessing,
  printGuesserWords,
  printScore,
  printWaitingMessage,
} from "../consoleUtils";
import NumericKeyboard from "./NumericKeyboard";
import AlphabetKeyboard from "./AlphabetKeyboard";
import { roomPropType } from "../utils";

const validateNumber = ({ selectedWord }) => {
  if (!selectedWord) {
    return "Number must correspond to a word";
  }

  if (selectedWord.flipped) {
    return `"${selectedWord.word}" has already been chosen`;
  }

  return null;
};
const GuesserView = ({
  gameResult,
  playerID,
  room,
  onEndTurn,
  onSelectWord,
}) => {
  const [number, setNumber] = useState("");
  const [endTurn, setEndTurn] = useState(false);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(false);
  const [confirmation, setConfirmation] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const selectedWord = number ? room.words[parseInt(number) - 1] : null;

  const player = room.players[playerID];
  const isYourTurn = player.team === room.turn;
  const disabled = !isYourTurn || room.stage === "writing" || confirmed;

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
                    ...printGuesserWords({
                      lineLength,
                      words: room.words,
                      yourTeam: player.team,
                    }),
                    isYourTurn &&
                      room.stage === "writing" &&
                      "**Awaiting transmission...**",
                    ...(isYourTurn && room.stage === "guessing"
                      ? printGuesserGuessing({
                          code: last(room.codes),
                          confirmation,
                          confirmed,
                          endTurn,
                          error,
                          guessesLeft: room.guessesLeft,
                          number,
                          selected,
                          words: room.words,
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
            typed={selected || endTurn ? confirmation : number}
          />
        )}
      </GameDimensionsConsumer>
      {selected || endTurn ? (
        <AlphabetKeyboard
          disabled={disabled}
          onType={(letter) => {
            setConfirmation(letter);
          }}
          onDelete={() => {
            setConfirmation("");
          }}
          onSubmit={() => {
            if (confirmation === "Y") {
              setConfirmed(true);
              if (endTurn) {
                onEndTurn();
              } else {
                onSelectWord({ word: selectedWord.word });
              }
            } else {
              setNumber("");
              setError(null);
              setSelected(false);
              setConfirmation("");
            }
          }}
        />
      ) : (
        <NumericKeyboard
          disabled={disabled}
          onDelete={() => {
            setNumber(
              number.length > 0 ? number.slice(0, number.length - 1) : ""
            );
          }}
          onType={(num) => {
            setNumber(number + num);
          }}
          onSubmit={() => {
            if (number === "99") {
              setEndTurn(true);
              return;
            }

            const e = validateNumber({ selectedWord });

            if (e) {
              setError(e);
              setNumber("");
              return;
            }

            setSelected(true);
          }}
        />
      )}
    </Box>
  );
};

GuesserView.propTypes = {
  room: roomPropType.isRequired,
  onEndTurn: PropTypes.func.isRequired,
  onSelectWord: PropTypes.func.isRequired,
  gameResult: PropTypes.string,
};

export default GuesserView;
