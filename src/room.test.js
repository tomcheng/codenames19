import Room from "./room";

describe("room", () => {
  it("adds an player id if one is not supplied", () => {
    const room = new Room({ usedCodes: [] });

    room.addPlayer({ name: "Alice", playerID: null });

    expect(Object.values(room.players).length).toEqual(1);
    expect(Object.values(room.players)[0].name).toEqual("Alice");
    expect(Object.values(room.players)[0].online).toEqual(true);
    expect(Object.values(room.players)[0].team).toEqual(null);
    expect(typeof Object.values(room.players)[0].id).toEqual("string");
  });

  it("sets the team for a player", () => {
    const room = new Room({ usedCodes: [] });

    room.addPlayer({ name: "Alice", playerID: "1000" });

    expect(room.getPlayer("1000")).toEqual({
      id: "1000",
      name: "Alice",
      online: true,
      spymaster: false,
      team: null,
    });

    room.setTeam({ playerID: "1000", team: "A" });

    expect(room.getPlayer("1000")).toEqual({
      id: "1000",
      name: "Alice",
      online: true,
      spymaster: false,
      team: "A",
    });
  });

  it("validates locking in a team", () => {
    const room = new Room({ usedCodes: [] });

    expect(room.teamsLocked).toEqual(false);

    room.addPlayer({ name: "Alice", playerID: "1000" });
    room.addPlayer({ name: "Alex", playerID: "1001" });
    room.addPlayer({ name: "Bob", playerID: "1002" });

    expect(() => {
      room.lockTeams();
    }).toThrow(/four players/i);

    room.addPlayer({ name: "Barb", playerID: "1003" });

    expect(() => {
      room.lockTeams();
    }).toThrow(/assigned/i);

    room.setTeam({ playerID: "1000", team: "A" });
    room.setTeam({ playerID: "1001", team: "B" });
    room.setTeam({ playerID: "1002", team: "B" });
    room.setTeam({ playerID: "1003", team: "B" });

    expect(() => {
      room.lockTeams();
    }).toThrow(/group a/i);

    room.setTeam({ playerID: "1001", team: "A" });
    room.setTeam({ playerID: "1002", team: "A" });

    expect(() => {
      room.lockTeams();
    }).toThrow(/group b/i);

    room.setTeam({ playerID: "1002", team: "B" });

    room.lockTeams();

    expect(room.teamsLocked).toEqual(true);
  });

  it("validates setting spymaster", () => {
    const room = new Room({ usedCodes: [] });

    room.addPlayer({ name: "Alice", playerID: "1000" });
    room.addPlayer({ name: "Alex", playerID: "1001" });
    room.addPlayer({ name: "Bob", playerID: "1002" });
    room.addPlayer({ name: "Barb", playerID: "1003" });

    room.setTeam({ playerID: "1000", team: "A" });
    room.setTeam({ playerID: "1001", team: "A" });
    room.setTeam({ playerID: "1002", team: "B" });
    room.setTeam({ playerID: "1003", team: "B" });

    room.lockTeams();
    room.setSpymaster({ playerID: "1000" });

    expect(room.players["1000"].spymaster).toEqual(true);

    expect(() => {
      room.setSpymaster({ playerID: "1001" });
    }).toThrow(/already/i);

    room.setSpymaster({ playerID: "1002" });

    expect(room.players["1002"].spymaster).toEqual(true);

    expect(room.round).toEqual(1);
    expect(room.turn).toEqual("A");
    expect(room.stage).toEqual("writing");
  });

  it("plays a game", () => {
    const room = new Room({ usedCodes: [] });

    room.addPlayer({ name: "Alice", playerID: "1000" });
    room.addPlayer({ name: "Alex", playerID: "1001" });
    room.addPlayer({ name: "Bob", playerID: "1002" });
    room.addPlayer({ name: "Barb", playerID: "1003" });

    room.setTeam({ playerID: "1000", team: "A" });
    room.setTeam({ playerID: "1001", team: "A" });
    room.setTeam({ playerID: "1002", team: "B" });
    room.setTeam({ playerID: "1003", team: "B" });

    room.lockTeams();

    room.setSpymaster({ playerID: "1000" });
    room.setSpymaster({ playerID: "1002" });

    room.submitCode({ code: "baz", number: 2, playerID: "1000" });

    expect(room.round).toEqual(1);
    expect(room.turn).toEqual("A");
    expect(room.stage).toEqual("guessing");
    expect(room.codes).toEqual([{ code: "baz", number: 2, team: "A" }]);
    expect(room.guessesLeft).toEqual(2);

    const [first, second, third] = room.words
      .filter((w) => w.type !== "bomb")
      .map((w) => w.word);

    room.selectWord({ word: first, playerID: "1001" });

    expect(room.words.find((w) => w.word === first).flipped).toEqual(true);
    expect(room.guessesLeft).toEqual(1);

    room.selectWord({ word: second, playerID: "1001" });

    expect(room.words.find((w) => w.word === second).flipped).toEqual(true);
    expect(room.round).toEqual(1);
    expect(room.turn).toEqual("B");
    expect(room.stage).toEqual("writing");

    room.submitCode({ code: "qux", number: 1, playerID: "1002" });

    expect(room.round).toEqual(1);
    expect(room.turn).toEqual("B");
    expect(room.stage).toEqual("guessing");

    room.selectWord({ word: third, playerID: "1003" });

    expect(room.round).toEqual(2);
    expect(room.turn).toEqual("A");
    expect(room.stage).toEqual("writing");

    room.submitCode({ code: "blah", number: 3, playerID: "1000" });

    expect(room.round).toEqual(2);
    expect(room.turn).toEqual("A");
    expect(room.stage).toEqual("guessing");

    room.endTurn({ playerID: "1001" });

    expect(room.round).toEqual(2);
    expect(room.turn).toEqual("B");
    expect(room.stage).toEqual("writing");
  });
});
