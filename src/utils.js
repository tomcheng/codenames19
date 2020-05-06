import PropTypes from "prop-types";

export const plc = (num, singular, plural) =>
  `${num} ${num === 1 ? singular : plural}`;

export const humanizeList = (list) => {
  if (list.length === 0) {
    return "";
  }

  if (list.length === 1) {
    return list[0];
  }

  return `${list.slice(0, list.length - 1).join(", ")} and ${
    list[list.length - 1]
  }`;
};

export const roomPropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  codes: PropTypes.arrayOf(
    PropTypes.shape({
      word: PropTypes.string.isRequired,
      number: PropTypes.number.isRequired,

    })
  ).isRequired,
  players: PropTypes.objectOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      online: PropTypes.bool.isRequired,
      spymaster: PropTypes.bool.isRequired,
      team: PropTypes.oneOf(["A", "B"]),
    })
  ).isRequired,
  roomCode: PropTypes.string.isRequired,
  teamsLocked: PropTypes.bool.isRequired,
  words: PropTypes.arrayOf(
    PropTypes.shape({
      flipped: PropTypes.bool.isRequired,
      type: PropTypes.oneOf(["A", "B", "bomb", "neutral"]).isRequired,
      word: PropTypes.string.isRequired,
    })
  ).isRequired,
  awaitingConfirmation: PropTypes.arrayOf(PropTypes.string),
  candidateWord: PropTypes.string,
  guessesLeft: PropTypes.number,
  nominator: PropTypes.string,
  round: PropTypes.number,
  stage: PropTypes.oneOf(["guessing", "writing"]),
  turn: PropTypes.oneOf(["A", "B"]),
});
