import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import chunk from "lodash/chunk";
import last from "lodash/last";
import { plc } from "../utils";
import Box from "./Box";
import Console from "./Console";
import { Grid, GridItem } from "./Grid";
import Word from "./Word";
import Text from "./Text";

const GuesserView = ({
  codes,
  guessesLeft,
  isYourTurn,
  stage,
  words,
  yourTeam,
  onSelectWord,
}) => {
  const [numCols, setNumCols] = useState(5);
  const [selectedWord, setSelectedWord] = useState(null);
  const containerRef = useRef(null);
  const rows = chunk(words, numCols);
  const lastCode = last(codes);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current.offsetWidth < 640) {
        setNumCols(3);
      } else {
        setNumCols(5);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [setNumCols]);

  useEffect(() => {
    setSelectedWord(null);
  }, [guessesLeft, setSelectedWord]);

  useLayoutEffect(() => {
    if (containerRef.current.offsetWidth < 640) {
      setNumCols(3);
    }
  }, []);

  const selectedStyle = {
    backgroundColor: "#222",
    color: "#fff",
  };

  return (
    <Box ref={containerRef} style={{ paddingTop: 72 }}>
      <Console
        lines={
          !isYourTurn
            ? ["Awaiting the enemy's turn..."]
            : stage === "writing"
            ? ["Awaiting transmission..."]
            : [
                `* Code Received: ${lastCode.code.toUpperCase()} / ${
                  lastCode.number
                }`,
                `* You have ${plc(guessesLeft, "guess", "guesses")} remaining`,
              ]
        }
        showPrompt={isYourTurn && stage === "guessing"}
      />
      <Box
        flexible
        overflow="auto"
        padBottom="loose"
        padTop="normal"
        padX="normal"
      >
        {rows.map((wrds, index) => (
          <Grid key={index} spacing="normal">
            {wrds.map(({ word, type, flipped }) => (
              <GridItem key={word} flexible>
                <Word
                  flipped={flipped}
                  selected={isYourTurn && word === selectedWord}
                  type={type}
                  word={word}
                  yourTeam={yourTeam}
                  onClick={() => {
                    if (flipped || !isYourTurn) return;

                    setSelectedWord(selectedWord === word ? null : word);
                  }}
                />
              </GridItem>
            ))}
          </Grid>
        ))}
      </Box>
      {stage === "guessing" && isYourTurn && (
        <Box flex style={{ backgroundColor: "#fff" }}>
          {selectedWord && (
            <Box
              flexible
              pad="normal"
              style={selectedStyle}
              textAlign="center"
              onClick={() => {
                onSelectWord({ word: selectedWord });
              }}
            >
              <Text preset="button">Confirm Code: {selectedWord}</Text>
            </Box>
          )}
        </Box>
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
  guessesLeft: PropTypes.number.isRequired,
  isYourTurn: PropTypes.bool.isRequired,
  stage: PropTypes.oneOf(["guessing", "writing"]).isRequired,
  words: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.oneOf(["A", "B", "neutral", "bomb"]).isRequired,
      word: PropTypes.string.isRequired,
    })
  ).isRequired,
  yourTeam: PropTypes.oneOf(["A", "B"]).isRequired,
  onSelectWord: PropTypes.func.isRequired,
};

export default GuesserView;
