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

  return (
    <div ref={containerRef}>
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
      <Box
        pad="tight"
        style={{
          color: "#00c202",
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "black",
        }}
      >
        <Text preset="code">
          {stage === "writing"
            ? "Awaiting Transmission..."
            : `Received: ${lastCode.code} - ${lastCode.number}`}
        </Text>
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
