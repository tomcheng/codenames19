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

describe("printLog", () => {
  it("prints log for guesser guessing", () => {
    const log = [
      {
        action: "submit-code",
        playerID: "d06efad0-8d95-4938-9445-2cf44cb11bb8",
        team: "A",
        payload: { word: "FLY", number: 2 },
      },
    ];
    const playerID = "76714c37-4c0f-4bf0-8733-788fe96a285e";

    expect(printLog({ log, players, playerID })).toEqual([
      "Michelle submitted FLY / 2",
    ]);
  });
});
