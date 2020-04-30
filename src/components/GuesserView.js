import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import chunk from "lodash/chunk";
import last from "lodash/last";
import Box from "./Box";
import { Grid, GridItem } from "./Grid";
import Word from "./Word";
import Text from "./Text";

const GuesserView = ({
  codes,
  highlights,
  stage,
  words,
  yourTeam,
  onHighlightWord,
  onSelectWord,
}) => {
  const [numCols, setNumCols] = useState(5);
  const [mode, setMode] = useState("highlight");
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
    if (mode === "highlight") {
      setSelectedWord(null);
    }
  }, [mode, setSelectedWord]);

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
    <div
      ref={containerRef}
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
      }}
    >
      <Box flexible padBottom="loose" style={{ overflow: "auto", flexGrow: 1 }}>
        {rows.map((wrds, index) => (
          <Grid key={index} spacing="normal">
            {wrds.map(({ word, type, flipped }) => (
              <GridItem key={word} flexible>
                <Word
                  flipped={flipped}
                  highlighted={highlights.includes(word)}
                  selected={word === selectedWord}
                  type={type}
                  word={word}
                  yourTeam={yourTeam}
                  onClick={() => {
                    if (mode === "highlight") {
                      onHighlightWord({ word });
                    } else {
                      setSelectedWord(selectedWord === word ? null : word);
                    }
                  }}
                />
              </GridItem>
            ))}
          </Grid>
        ))}
      </Box>
      <Box>
        {stage === "guessing" && (
          <Box flex borderTop style={{ backgroundColor: "#fff" }}>
            {selectedWord ? (
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
            ) : (
              <>
                <Box
                  borderRight
                  flexible
                  pad="normal"
                  style={mode === "highlight" ? selectedStyle : null}
                  textAlign="center"
                  onClick={() => {
                    setMode("highlight");
                  }}
                >
                  <Text preset="button">Highlight</Text>
                </Box>
                <Box
                  flexible
                  pad="normal"
                  style={mode === "select" ? selectedStyle : null}
                  textAlign="center"
                  onClick={() => {
                    setMode("select");
                  }}
                >
                  <Text preset="button">Select</Text>
                </Box>
              </>
            )}
          </Box>
        )}
        <Box
          pad="tight"
          style={{
            backgroundColor: "#222",
            borderTop: "1px solid #888",
            color: "#00c202",
          }}
        >
          <Text preset="code">
            {stage === "writing"
              ? `   Awaiting Transmission...

 `
              : `   Received: ${lastCode.code} - ${lastCode.number}
   You have 1 guess left.
> `}
          </Text>
        </Box>
      </Box>
    </div>
  );
};

GuesserView.propTypes = {
  codes: PropTypes.arrayOf(
    PropTypes.shape({
      code: PropTypes.string.isRequired,
      number: PropTypes.number.isRequired,
    })
  ).isRequired,
  highlights: PropTypes.arrayOf(PropTypes.string).isRequired,
  stage: PropTypes.oneOf(["guessing", "writing"]).isRequired,
  words: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.oneOf(["A", "B", "neutral", "bomb"]).isRequired,
      word: PropTypes.string.isRequired,
    })
  ).isRequired,
  yourTeam: PropTypes.oneOf(["A", "B"]).isRequired,
  onHighlightWord: PropTypes.func.isRequired,
  onSelectWord: PropTypes.func.isRequired,
};

export default GuesserView;
