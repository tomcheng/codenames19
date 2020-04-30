export const plc = (num, singular, plural) =>
  `${num} ${num === 1 ? singular : plural}`;
