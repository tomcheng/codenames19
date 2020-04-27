import React from "react";
import PropTypes from "prop-types";

const Word = ({ word, yourTeam, type, isSpymaster, isFlipped }) => {
  const isYours = isSpymaster && type === yourTeam;
  const otherTeam = yourTeam === "A" ? "B" : "A";
  const isOtherTeam = isSpymaster && type === otherTeam;
  return (
    <div
      style={{
        padding: "20px 0",
        textAlign: "center",
        opacity: isYours ? 1 : 0.5,
      }}
    >
      <span style={{ backgroundColor: isYours ? "yellow" : isOtherTeam ? "pink" : null }}>{word}</span>
    </div>
  );
};

Word.propTypes = {
  isFlipped: PropTypes.bool.isRequired,
  isSpymaster: PropTypes.bool.isRequired,
  type: PropTypes.oneOf(["A", "B", "bomb", "neutral"]).isRequired,
  word: PropTypes.string.isRequired,
  yourTeam: PropTypes.oneOf(["A", "B"]).isRequired,
};

export default Word;
