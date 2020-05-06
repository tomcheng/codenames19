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
  codes: PropTypes.array.isRequired,
  players: PropTypes.objectOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      spymaster: PropTypes.bool.isRequired,
      team: PropTypes.oneOf(["A", "B"]),
    })
  ).isRequired,
  stage: PropTypes.string.isRequired,
  words: PropTypes.arrayOf(
    PropTypes.shape({
      flipped: PropTypes.bool.isRequired,
      type: PropTypes.oneOf(["A", "B", "bomb", "neutral"]).isRequired,
      word: PropTypes.string.isRequired,
    })
  ).isRequired,
});
