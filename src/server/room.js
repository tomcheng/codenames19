const uuid = require("uuid");
const _ = require("lodash");
const utils = require("./utils");
const { getWords } = require("./words");

class Room {
  constructor({ usedCodes }) {
    this.id = uuid.v4();
    this.roomCode = this._getUniqueRoomCode({ usedCodes });
    this.teamsLocked = false;
    this.words = this._getInitialWords();
    this.round = null;
    this.turn = null;
    this.stage = null;
    this.codes = [];
    this.guessesLeft = null;
    this.candidateWord = null;
    this.nominator = null;
    this.awaitingConfirmation = null;
    this.rejection = null;
    this.players = {};
    this.result = null;
  }

  addPlayer({ name, playerID: existingID }) {
    const playerID = existingID || uuid.v4();

    if (this.players[playerID]) {
      this.players[playerID].online = true;
    } else {
      this.players[playerID] = {
        id: playerID || uuid.v4(),
        name,
        online: true,
        spymaster: false,
        team: null,
      };
    }

    return this.players[playerID];
  }

  getPlayer(playerID) {
    return this.players[playerID] || null;
  }

  removePlayer(playerID) {
    if (!this.players[playerID]) return;

    this.players[playerID].online = false;
  }

  setTeam({ playerID, team }) {
    if (!this.players[playerID]) return;

    this.players[playerID].team = team;
  }

  lockTeams() {
    if (Object.values(this.players).length < 4) {
      throw new Error("At least four players are required.");
    }

    if (Object.values(this.players).some((player) => !player.team)) {
      throw new Error("Every player needs to be assigned a group.");
    }

    if (
      Object.values(this.players).filter((player) => player.team === "A")
        .length < 2
    ) {
      throw new Error("Group A needs at least 2 players.");
    }

    if (
      Object.values(this.players).filter((player) => player.team === "B")
        .length < 2
    ) {
      throw new Error("Group B needs at least 2 players.");
    }

    this.teamsLocked = true;
  }

  setSpymaster({ playerID }) {
    const player = this.players[playerID];

    if (!player || !this.teamsLocked) return;

    if (
      Object.values(this.players).some(
        (p) => p.team === player.team && p.spymaster
      )
    ) {
      throw new Error("This group already has a spymaster");
    }

    this.players[playerID].spymaster = true;

    if (Object.values(this.players).filter((p) => p.spymaster).length === 2) {
      this._startGame();
    }
  }

  submitCode({ word, number, playerID }) {
    const player = this.players[playerID];

    if (
      !player ||
      player.team !== this.turn ||
      !player.spymaster ||
      this.stage === "guessing"
    ) {
      return;
    }

    this.stage = "guessing";
    this.codes.push({ word, number, team: player.team });
    this.guessesLeft = this.round === 1 ? number : number + 1;
  }

  selectWord({ word, playerID }) {
    const player = this.players[playerID];

    if (
      !player ||
      player.team !== this.turn ||
      player.spymaster ||
      this.stage === "writing"
    ) {
      return;
    }

    this.rejection = null;

    const otherGuessers = Object.values(this.players).filter(
      (p) => p.team === player.team && !p.spymaster && p.id !== player.id
    );

    if (otherGuessers.length) {
      this.candidateWord = word;
      this.nominator = player.id;
      this.awaitingConfirmation = otherGuessers.map((p) => p.id);
    } else {
      this._flipWord({ word, playerID });
    }
  }

  confirmWord({ playerID }) {
    const player = this.players[playerID];

    if (
      !player ||
      player.team !== this.turn ||
      player.spymaster ||
      !this.awaitingConfirmation.includes(player.id) ||
      this.stage === "writing"
    ) {
      return;
    }

    this.awaitingConfirmation = this.awaitingConfirmation.filter(
      (id) => id !== playerID
    );

    if (this.awaitingConfirmation.length === 0) {
      this._flipWord({ word: this.candidateWord, playerID });
      this.candidateWord = null;
      this.nominator = null;
      this.awaitingConfirmation = null;
    }
  }

  rejectWord({ playerID }) {
    this.rejection = { playerID, word: this.candidateWord };
    this.candidateWord = null;
    this.nominator = null;
    this.awaitingConfirmation = null;
  }

  endTurn({ playerID }) {
    const player = this.players[playerID];

    if (
      !player ||
      player.team !== this.turn ||
      player.spymaster ||
      this.stage === "writing"
    ) {
      return;
    }

    this.guessesLeft = null;
    if (this.turn === "B") {
      this.round += 1;
    }
    this.turn = this.turn === "A" ? "B" : "A";
    this.stage = "writing";
  }

  _startGame() {
    this.round = 1;
    this.turn = "A";
    this.stage = "writing";
  }

  _flipWord({ word, playerID }) {
    this.words = this.words.map((w) =>
      w.word === word ? { ...w, flipped: true } : w
    );

    if (this.words.some((w) => w.flipped && w.type === "bomb")) {
      this.result = { winner: this.turn === "A" ? "B" : "A", bomb: true };
    }

    if (this.guessesLeft === 1) {
      this.endTurn({ playerID });
    } else {
      this.guessesLeft -= 1;
    }
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
