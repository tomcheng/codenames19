import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Grid, GridItem } from "./Grid";
import Word from "./Word";
import PropTypes from "prop-types";
import chunk from "lodash/chunk";

const GuesserView = ({ words, yourTeam }) => {
  const [numCols, setNumCols] = useState(5);
  const containerRef = useRef(null);
  const rows = chunk(words, numCols);

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
    </div>
  );
};

GuesserView.propTypes = {
  words: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.oneOf(["A", "B", "neutral", "bomb"]).isRequired,
      word: PropTypes.string.isRequired,
    })
  ).isRequired,
  yourTeam: PropTypes.oneOf(["A", "B"]).isRequired,
};

export default GuesserView;
