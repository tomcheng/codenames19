import React from "react";
import PropTypes from "prop-types";

const Word = ({ word, yourTeam, type, flipped }) => {
  return (
    <div
      style={{
        padding: "20px 0",
        textAlign: "center",
      }}
    >
      <span>{word}</span>
    </div>
  );
};

Word.propTypes = {
  flipped: PropTypes.bool.isRequired,
  type: PropTypes.oneOf(["A", "B", "bomb", "neutral"]).isRequired,
  word: PropTypes.string.isRequired,
  yourTeam: PropTypes.oneOf(["A", "B"]).isRequired,
};

export default Word;
