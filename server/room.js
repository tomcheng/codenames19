const uuid = require("uuid");
const _ = require("lodash");
const utils = require("./utils");
const { getWords } = require("./words");

class Room {
  constructor({ usedCodes }) {
    this.id = uuid.v4();
    this.roomCode = this._getUniqueRoomCode({ usedCodes });
    this.teamsSet = false;
    this.spymasterA = null;
    this.spymasterB = null;
    this.words = this._getInitialWords();
    this.round = null;
    this.turn = null;
    this.stage = null;
    this.codes = [];
    this.guesses = [];
    this.guessesLeft = null;
    this.highlights = {
      A: [],
      B: [],
    };
  }

  setTeams() {
    this.teamsSet = true;
  }

  setSpymaster({ userID, team }) {
    if (team === "A") {
      this.spymasterA = userID;
    } else {
      this.spymasterB = userID;
    }
  }

  startGame() {
    this.round = 1;
    this.turn = "A";
    this.stage = "writing";
  }

  submitCode({ code, number }) {
    this.stage = "guessing";
    this.codes.push({ code, number, team: this.turn });
    this.guessesLeft = this.round === 1 ? number : number + 1;
  }

  highlightWord({ word }) {
    this.highlights[this.turn] = this.highlights[this.turn].includes(word)
      ? this.highlights[this.turn].filter((w) => w !== word)
      : this.highlights[this.turn].concat(word);
  }

  selectWord({ word }) {
    this.words = this.words.map((w) =>
      w.word === word ? { ...w, flipped: true } : w
    );
  }

  _getUniqueRoomCode({ usedCodes }) {
    let code = utils.generateRoomCode();

    while (usedCodes.includes(code)) {
      code = utils.generateRoomCode();
    }

    return code;
  }

  _getInitialWords() {
    const words = getWords();
    const shuffledWords = _.shuffle(words);
    const teamAWords = shuffledWords.slice(0, 9);
    const teamBWords = shuffledWords.slice(9, 17);
    const bomb = shuffledWords[17];

    return words.map((word) => ({
      word,
      type: teamAWords.includes(word)
        ? "A"
        : teamBWords.includes(word)
        ? "B"
        : word === bomb
        ? "bomb"
        : "neutral",
      flipped: false,
    }));
  }
}

module.exports = Room;
