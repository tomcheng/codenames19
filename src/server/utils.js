const _ = require("lodash");
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
// prettier-ignore
const offensiveWords = ["ANAL","ANUS","ARSE","CLIT","COCK","CRAP","CUMS","CUNT","DICK","DUMB","DYKE","FAGS","FUCK","GOOK","HOMO","JERK","JEWS","JISM","JUGS","KIKE","KILL","PAKI","PISS","PUSS","SCUM","SHAG","SHIT","SLAG","SLUT","SPIC","SUCK","TITS","TURD","TWAT","WANK"];

const getCode = () => {
  return (
    _.sample(ALPHABET) +
    _.sample(ALPHABET) +
    _.sample(ALPHABET) +
    _.sample(ALPHABET)
  );
};

const generateRoomCode = () => {
  let code = getCode();

  while (offensiveWords.includes(code)) {
    code = getCode();
  }

  return code;
};

module.exports = {
  generateRoomCode,
};
