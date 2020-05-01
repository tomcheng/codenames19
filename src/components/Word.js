import React from "react";
import PropTypes from "prop-types";
import InlineWord from "./InlineWord";

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
        border: selected ? "1px solid #222" : "1px solid transparent",
        padding: "20px 0",
        textAlign: "center",
        userSelect: "none",
      }}
      onClick={onClick}
    >
      <InlineWord
        word={word}
        flipped={flipped}
        highlighted={highlighted}
        isLast
        result={
          type === "neutral" || type === "bomb"
            ? "neutral"
            : type === yourTeam
            ? "yours"
            : "theirs"
        }
      />
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
