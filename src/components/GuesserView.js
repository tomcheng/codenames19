import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import compact from "lodash/compact";
import flatten from "lodash/flatten";
import last from "lodash/last";
import Box from "./Box";
import Console from "./Console";
import { GameDimensionsConsumer } from "./GameDimensions";
import {
  printConfirming,
  printGuessing,
  printGuesserWords,
  printResult,
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
  playerID,
  room,
  onConfirmWord,
  onEndTurn,
  onRejectWord,
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
  const yourSpymaster = Object.values(room.players).find(
    (p) => p.team === player.team && p.spymaster
  );
  const needsConfirmation = !!room.candidateWord;
  const disabled =
    !isYourTurn ||
    room.stage === "writing" ||
    confirmed ||
    (needsConfirmation && !room.awaitingConfirmation.includes(playerID));
  const gameEnded = !!room.result;

  useEffect(() => {
    setNumber("");
    setEndTurn(false);
    setError(null);
    setSelected(false);
    setConfirmation("");
    setConfirmed(false);
  }, [room.candidateWord]);

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
                printGuesserWords({
                  lineLength,
                  words: room.words,
                  yourTeam: player.team,
                }),
                !gameEnded &&
                  !isYourTurn &&
                  printWaitingMessage({
                    codes: room.codes,
                    stage: room.stage,
                  }),
                !gameEnded &&
                  isYourTurn &&
                  room.stage === "writing" &&
                  `Awaiting transmission from ${yourSpymaster.name}...`,
                !gameEnded &&
                  isYourTurn &&
                  room.stage === "guessing" &&
                  !needsConfirmation &&
                  printGuessing({
                    code: last(room.codes),
                    confirmation,
                    confirmed,
                    endTurn,
                    error,
                    guessesLeft: room.guessesLeft,
                    number,
                    players: room.players,
                    rejection: room.rejection,
                    selected,
                    words: room.words,
                  }),
                !gameEnded &&
                  isYourTurn &&
                  needsConfirmation &&
                  printConfirming({
                    awaiting: room.awaitingConfirmation.map(
                      (id) => room.players[id]
                    ),
                    candidateWord: room.candidateWord,
                    confirmation,
                    confirmed,
                    code: last(room.codes),
                    nominator: room.players[room.nominator],
                    youNominated: room.nominator === playerID,
                  }),
                gameEnded &&
                  printResult({
                    result: room.result.winner === player.team ? "won" : "lost",
                    bomb: room.result.bomb,
                  }),
              ])
            )}
            showPrompt={!disabled}
            typed={
              selected || endTurn || needsConfirmation ? confirmation : number
            }
          />
        )}
      </GameDimensionsConsumer>
      {selected || endTurn || needsConfirmation ? (
        <AlphabetKeyboard
          disabled={disabled}
          onType={(letter) => {
            setConfirmation(letter);
          }}
          onDelete={() => {
            setConfirmation("");
          }}
          onSubmit={() => {
            if (needsConfirmation) {
              setConfirmed(true);
              if (confirmation === "Y") {
                onConfirmWord();
              } else {
                onRejectWord();
              }
              return;
            }
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
  onConfirmWord: PropTypes.func.isRequired,
  onEndTurn: PropTypes.func.isRequired,
  onRejectWord: PropTypes.func.isRequired,
  onSelectWord: PropTypes.func.isRequired,
};

export default GuesserView;
