import { printLog } from "./consoleUtils";

const players = {
  "76714c37-4c0f-4bf0-8733-788fe96a285e": {
    id: "76714c37-4c0f-4bf0-8733-788fe96a285e",
    name: "Thomas",
    online: true,
    spymaster: false,
    team: "A",
  },
  "d06efad0-8d95-4938-9445-2cf44cb11bb8": {
    id: "d06efad0-8d95-4938-9445-2cf44cb11bb8",
    name: "Michelle",
    online: true,
    spymaster: true,
    team: "A",
  },
  "6a8f23a9-1e6a-4be6-8745-6d6664de0614": {
    id: "6a8f23a9-1e6a-4be6-8745-6d6664de0614",
    name: "Avrum",
    online: true,
    spymaster: true,
    team: "B",
  },
  "378c641c-0087-4fdf-a16d-10b554598d43": {
    id: "378c641c-0087-4fdf-a16d-10b554598d43",
    name: "Alda",
    online: true,
    spymaster: false,
    team: "B",
  },
};

const words = [
  { word: "Octopus", type: "neutral", flipped: false },
  { word: "Locust", type: "A", flipped: true },
  { word: "Frost", type: "B", flipped: true },
  { word: "Soap", type: "A", flipped: false },
  { word: "Club", type: "B", flipped: false },
  { word: "Crash", type: "B", flipped: false },
  { word: "Nail", type: "neutral", flipped: false },
  { word: "Greece", type: "A", flipped: false },
  { word: "Table", type: "neutral", flipped: false },
  { word: "Fire", type: "A", flipped: false },
  { word: "Ranch", type: "A", flipped: false },
  { word: "Swing", type: "A", flipped: false },
  { word: "Temple", type: "B", flipped: false },
  { word: "Rail", type: "A", flipped: false },
  { word: "Banana", type: "B", flipped: false },
  { word: "Brass", type: "B", flipped: false },
  { word: "Lip", type: "bomb", flipped: false },
  { word: "Steel", type: "neutral", flipped: false },
  { word: "Bat", type: "neutral", flipped: false },
  { word: "Gear", type: "A", flipped: false },
  { word: "Bikini", type: "neutral", flipped: false },
  { word: "Concert", type: "B", flipped: false },
  { word: "Deck", type: "A", flipped: false },
  { word: "Viking", type: "neutral", flipped: false },
  { word: "Fighter", type: "B", flipped: false },
];

const playerID = "76714c37-4c0f-4bf0-8733-788fe96a285e";

describe("printLog", () => {
  it("prints log for guesser when teammate is writing", () => {
    const log = [];

    expect(
      printLog({
        room: { log, players, words, turn: "A", stage: "writing" },
        playerID,
      })
    ).toEqual(["Awaiting transmission from Michelle..."]);
  });

  it("prints log for guesser guessing", () => {
    const log = [
      {
        action: "submit-code",
        playerID: "d06efad0-8d95-4938-9445-2cf44cb11bb8",
        team: "A",
        payload: { word: "FLY", number: 2 },
      },
    ];

    expect(
      printLog({
        room: { log, players, words, turn: "A", stage: "guessing" },
        playerID,
      })
    ).toEqual(["**Transmission received: FLY / 2**"]);
  });

  it("prints log for guesser when enemy is writing", () => {
    const log = [
      {
        action: "submit-code",
        playerID: "d06efad0-8d95-4938-9445-2cf44cb11bb8",
        team: "A",
        payload: { word: "FLY", number: 2 },
      },
      {
        action: "select-word",
        playerID: "76714c37-4c0f-4bf0-8733-788fe96a285e",
        team: "A",
        payload: { word: "Locust", needsConfirmation: false },
      },
      {
        action: "select-word",
        playerID: "76714c37-4c0f-4bf0-8733-788fe96a285e",
        team: "A",
        payload: { word: "Frost", needsConfirmation: false },
      },
    ];

    expect(
      printLog({
        room: { log, players, words, turn: "B", stage: "writing" },
        playerID,
      })
    ).toEqual([
      "Michelle transmitted FLY / 2.",
      "You selected Locust. Correct.",
      "You selected Frost. Wrong.",
      "Monitoring enemy transmission...",
    ]);
  });

  it("prints log for guesser when enemy is guessing (again)", () => {
    const log = [
      {
        action: "submit-code",
        playerID: "d06efad0-8d95-4938-9445-2cf44cb11bb8",
        team: "A",
        payload: { word: "FLY", number: 2 },
      },
      {
        action: "select-word",
        playerID: "76714c37-4c0f-4bf0-8733-788fe96a285e",
        team: "A",
        payload: { word: "Locust", needsConfirmation: false },
      },
      {
        action: "select-word",
        playerID: "76714c37-4c0f-4bf0-8733-788fe96a285e",
        team: "A",
        payload: { word: "Frost", needsConfirmation: false },
      },
      {
        action: "submit-code",
        playerID: "6a8f23a9-1e6a-4be6-8745-6d6664de0614",
        team: "B",
        payload: { word: "BAT", number: 2 },
      },
      {
        action: "select-word",
        playerID: "378c641c-0087-4fdf-a16d-10b554598d43",
        team: "B",
        payload: { word: "Club", needsConfirmation: false },
      },
    ];

    expect(
      printLog({
        room: { log, players, words, turn: "B", stage: "guessing" },
        playerID,
      })
    ).toEqual(["Avrum transmitted BAT / 2.", "Alda selected Club. Correct."]);
  });
});
