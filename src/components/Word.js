import React from "react";
import PropTypes from "prop-types";

const Word = ({
  highlighted,
  word,
  selected,
  yourTeam,
  type,
  flipped,
  onClick,
}) => {
  return (
    <div
      style={{
        padding: "20px 0",
        textAlign: "center",
        border: selected ? "1px solid #222" : "1px solid transparent",
      }}
      onClick={onClick}
    >
      <span
        style={{
          backgroundColor: highlighted ? "yellow" : null,
          padding: "0 5px",
        }}
      >
        {word}
      </span>
    </div>
  );
};

Word.propTypes = {
  flipped: PropTypes.bool.isRequired,
  highlighted: PropTypes.bool.isRequired,
  selected: PropTypes.bool.isRequired,
  type: PropTypes.oneOf(["A", "B", "bomb", "neutral"]).isRequired,
  word: PropTypes.string.isRequired,
  yourTeam: PropTypes.oneOf(["A", "B"]).isRequired,
  onClick: PropTypes.func.isRequired,
};

export default Word;
