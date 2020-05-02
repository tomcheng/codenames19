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

const Bottom = ({ children }) => (
  <Box
    style={{
      bottom: 0,
      left: 0,
      position: "fixed",
      right: 0,
    }}
  >
    {children}
  </Box>
);

const FullButton = ({ children, isBlack, onClick }) => (
  <Box
    borderTop={!isBlack}
    flexible
    pad="normal"
    textAlign="center"
    style={{
      userSelect: "none",
      color: isBlack ? "#fff" : "#222",
      backgroundColor: isBlack ? "#222" : "#fff",
    }}
    onClick={onClick}
  >
    <Text preset="button">{children}</Text>
  </Box>
);

const GuesserView = ({
  codes,
  guessesLeft,
  humanizedScore,
  isYourTurn,
  stage,
  words,
  yourSpymasterName,
  yourTeam,
  onEndTurn,
  onSelectWord,
}) => {
  const [numCols, setNumCols] = useState(5);
  const [selectedWord, setSelectedWord] = useState(null);
  const [confirmEndTurn, setConfirmEndTurn] = useState(false);
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

  return (
    <Box ref={containerRef} style={{ paddingTop: 72, paddingBottom: 56 }}>
      <Console
        lines={
          !isYourTurn
            ? ["Awaiting The Enemy's turn...", humanizedScore, ``]
            : stage === "writing"
            ? [
                `Awaiting transmission${
                  yourSpymasterName ? ` from ${yourSpymasterName}` : ""
                }...`,
                humanizedScore,
              ]
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
            {numCols === 3 && wrds.length === 1 && (
              <>
                <GridItem flexible />
                <GridItem flexible />
              </>
            )}
          </Grid>
        ))}
      </Box>
      {!isYourTurn || stage === "writing" ? null : (
        <Bottom>
          {selectedWord ? (
            <FullButton
              isBlack
              style={{
                backgroundColor: "#222",
                color: "#fff",
              }}
              onClick={() => {
                onSelectWord({ word: selectedWord });
              }}
            >
              Confirm Code: {selectedWord}
            </FullButton>
          ) : confirmEndTurn ? (
            <Box flex width="100%">
              <FullButton
                onClick={() => {
                  setConfirmEndTurn(false);
                }}
              >
                <Text preset="button">Cancel</Text>
              </FullButton>
              <FullButton isBlack onClick={onEndTurn}>
                <Text preset="button">Confirm End Turn</Text>
              </FullButton>
            </Box>
          ) : (
            <FullButton
              onClick={() => {
                setConfirmEndTurn(true);
              }}
            >
              <Text preset="button">End Turn</Text>
            </FullButton>
          )}
        </Bottom>
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
  humanizedScore: PropTypes.string.isRequired,
  isYourTurn: PropTypes.bool.isRequired,
  stage: PropTypes.oneOf(["guessing", "writing"]).isRequired,
  words: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.oneOf(["A", "B", "neutral", "bomb"]).isRequired,
      word: PropTypes.string.isRequired,
    })
  ).isRequired,
  yourTeam: PropTypes.oneOf(["A", "B"]).isRequired,
  onEndTurn: PropTypes.func.isRequired,
  onSelectWord: PropTypes.func.isRequired,
  guessesLeft: PropTypes.number,
  yourSpymasterName: PropTypes.string,
};

export default GuesserView;
