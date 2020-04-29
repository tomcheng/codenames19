import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import chunk from "lodash/chunk";
import last from "lodash/last";
import Box from "./Box";
import { Grid, GridItem } from "./Grid";
import Word from "./Word";
import Text from "./Text";

const GuesserView = ({ codes, stage, words, yourTeam }) => {
  const [numCols, setNumCols] = useState(5);
  const [mode, setMode] = useState("highlight");
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
                  word={word}
                  type={type}
                  flipped={flipped}
                  yourTeam={yourTeam}
                />
              </GridItem>
            ))}
          </Grid>
        ))}
      </Box>
      <Box>
        <Box flex borderTop style={{ backgroundColor: "#fff" }}>
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
        </Box>
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
  stage: PropTypes.oneOf(["guessing", "writing"]).isRequired,
  words: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.oneOf(["A", "B", "neutral", "bomb"]).isRequired,
      word: PropTypes.string.isRequired,
    })
  ).isRequired,
  yourTeam: PropTypes.oneOf(["A", "B"]).isRequired,
};

export default GuesserView;
