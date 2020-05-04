import React, { useState } from "react";
import PropTypes from "prop-types";
import compact from "lodash/compact";
import Box from "./Box";
import Console from "./Console";
import { GameDimensionsConsumer } from "./GameDimensions";
import {
  printGuesserGuessing,
  printGuesserWords,
  printScore,
} from "../consoleUtils";
import NumericKeyboard from "./NumericKeyboard";
import AlphabetKeyboard from "./AlphabetKeyboard";

const validateNumber = ({ selectedWord }) => {
  if (!selectedWord) {
    return "Number must correspond to a word";
  }

  if (selectedWord.flipped) {
    return "Word has already been chosen";
  }

  return null;
};
const GuesserView = ({
  gameResult,
  isYourTurn,
  stage,
  words,
  yourTeam,
  onSelectWord,
}) => {
  const [number, setNumber] = useState("");
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(false);
  const [confirmation, setConfirmation] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const selectedWord = number ? words[parseInt(number) - 1] : null;
  const disabled = !isYourTurn || stage === "writing" || confirmed;

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
                    ...printGuesserWords({ words, yourTeam, lineLength }),
                    ...(isYourTurn && stage === "guessing"
                      ? printGuesserGuessing({
                          confirmation,
                          confirmed,
                          error,
                          number,
                          selected,
                          words,
                        })
                      : []),
                  ])
            }
            showPrompt={!disabled}
            typed={selected ? confirmation : number}
          />
        )}
      </GameDimensionsConsumer>
      {selected ? (
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
              onSelectWord({ word: selectedWord.word });
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
  codes: PropTypes.arrayOf(
    PropTypes.shape({
      code: PropTypes.string.isRequired,
      number: PropTypes.number.isRequired,
    })
  ).isRequired,
  isYourTurn: PropTypes.bool.isRequired,
  stage: PropTypes.oneOf(["guessing", "writing"]).isRequired,
  words: PropTypes.arrayOf(
    PropTypes.shape({
      flipped: PropTypes.bool.isRequired,
      type: PropTypes.oneOf(["A", "B", "neutral", "bomb"]).isRequired,
      word: PropTypes.string.isRequired,
    })
  ).isRequired,
  yourTeam: PropTypes.oneOf(["A", "B"]).isRequired,
  onEndTurn: PropTypes.func.isRequired,
  onSelectWord: PropTypes.func.isRequired,
  gameResult: PropTypes.string,
  guessesLeft: PropTypes.number,
  yourSpymasterName: PropTypes.string,
};

export default GuesserView;
