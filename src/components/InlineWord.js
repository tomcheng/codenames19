import React from "react";
import PropTypes from "prop-types";

const InlineWord = ({ flipped, isLast, result, word }) => {
  return (
    <>
      <span
        style={{
          position: "relative",
        }}
      >
        {word}
        {flipped && (
          <div
            style={{
              display: "inline-block",
              backgroundColor:
                result === "neutral"
                  ? "black"
                  : result === "yours"
                  ? "rgb(18, 175, 37)"
                  : "red",
              height: 4,
              position: "absolute",
              left: -2,
              right: -2,
              top: 11,
              opacity: 0.6,
            }}
          />
        )}
      </span>
      {!isLast && ", "}
    </>
  );
};

InlineWord.propTypes = {
  word: PropTypes.string.isRequired,
  flipped: PropTypes.bool,
  isLast: PropTypes.bool,
  result: PropTypes.oneOf(["yours", "theirs", "neutral"]),
};

InlineWord.defaultProps = {
  result: "neutral",
};

export default InlineWord;
