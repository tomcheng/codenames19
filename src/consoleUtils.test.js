import { printLog } from "./consoleUtils";

describe("printLog for guesser", () => {
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

  const playerID = "76714c37-4c0f-4bf0-8733-788fe96a285e";

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
    ).toEqual(["Transmission received: **FLY / 2**", " "]);
  });

  it("prints log for guesser guessing again", () => {
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
    ];

    expect(
      printLog({
        room: { log, players, words, turn: "A", stage: "guessing" },
        playerID,
      })
    ).toEqual([
      "Transmission received: **FLY / 2**",
      "You selected **Locust** - correct",
      " ",
    ]);
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
      "Transmission received: **FLY / 2**",
      "You selected **Locust** - correct",
      "You selected **Frost** - incorrect",
      " ",
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
    ).toEqual([
      "Avrum transmitted **BAT / 2**",
      "Alda selected **Club** - correct",
      " ",
      "Awaiting enemy's selection...",
    ]);
  });
});

describe("printLog for spy", () => {
  const players = {
    "76714c37-4c0f-4bf0-8733-788fe96a285e": {
      id: "76714c37-4c0f-4bf0-8733-788fe96a285e",
      name: "Thomas",
      online: true,
      spymaster: true,
      team: "A",
    },
    "d06efad0-8d95-4938-9445-2cf44cb11bb8": {
      id: "d06efad0-8d95-4938-9445-2cf44cb11bb8",
      name: "Michelle",
      online: true,
      spymaster: false,
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

  const playerID = "76714c37-4c0f-4bf0-8733-788fe96a285e";

  const words = [
    { word: "Change", type: "neutral", flipped: false },
    { word: "Pepper", type: "A", flipped: false },
    { word: "Capital", type: "neutral", flipped: false },
    { word: "Chair", type: "B", flipped: false },
    { word: "Soup", type: "A", flipped: false },
    { word: "Washington", type: "A", flipped: false },
    { word: "Ranch", type: "A", flipped: false },
    { word: "Step", type: "A", flipped: false },
    { word: "Grass", type: "A", flipped: false },
    { word: "Figure", type: "B", flipped: false },
    { word: "Phoenix", type: "neutral", flipped: false },
    { word: "Quarter", type: "B", flipped: false },
    { word: "Shoe", type: "B", flipped: false },
    { word: "Loch Ness", type: "B", flipped: false },
    { word: "Drill", type: "B", flipped: false },
    { word: "Back", type: "B", flipped: false },
    { word: "Chest", type: "A", flipped: false },
    { word: "Play", type: "B", flipped: false },
    { word: "Racket", type: "neutral", flipped: false },
    { word: "Arm", type: "neutral", flipped: false },
    { word: "Train", type: "A", flipped: false },
    { word: "Bench", type: "neutral", flipped: false },
    { word: "Fighter", type: "bomb", flipped: false },
    { word: "Chalk", type: "neutral", flipped: false },
    { word: "Cell", type: "A", flipped: false },
  ];

  it("prints log for spy when writing", () => {
    const log = [];

    expect(
      printLog({
        room: { log, players, words, turn: "A", stage: "writing" },
        playerID,
      })
    ).toEqual([]);
  });

  it("prints log for spy when teammate is guessing", () => {
    const log = [
      {
        action: "submit-code",
        playerID: "76714c37-4c0f-4bf0-8733-788fe96a285e",
        team: "A",
        payload: { word: "SALT", number: 2 },
      },
      {
        action: "select-word",
        playerID: "d06efad0-8d95-4938-9445-2cf44cb11bb8",
        team: "A",
        payload: { word: "Pepper", needsConfirmation: false },
      },
    ];

    expect(
      printLog({
        room: { log, players, words, turn: "A", stage: "guessing" },
        playerID,
      })
    ).toEqual([
      "You transmitted **SALT / 2**",
      "Michelle selected **Pepper** - correct",
      " ",
      "Awaiting your team's selection...",
    ]);
  });
});
