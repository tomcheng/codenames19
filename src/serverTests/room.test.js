import Room from "../../server/room";

describe("room", () => {
  it("plays a game", () => {
    const room = new Room({ usedCodes: [] });

    room.setTeams();

    expect(room.teamsSet).toEqual(true);

    room.setSpymaster({ userID: "foo", team: "A" });

    expect(room.spymasterA).toEqual("foo");

    room.setSpymaster({ userID: "bar", team: "B" });

    expect(room.spymasterB).toEqual("bar");

    room.startGame();

    expect(room.round).toEqual(1);
    expect(room.turn).toEqual("A");
    expect(room.stage).toEqual("writing");

    room.submitCode({ code: "baz", number: 2 });

    expect(room.round).toEqual(1);
    expect(room.turn).toEqual("A");
    expect(room.stage).toEqual("guessing");
    expect(room.codes).toEqual([{ code: "baz", number: 2, team: "A" }]);
    expect(room.guessesLeft).toEqual(2);

    const [first, second, third] = room.words
      .filter((w) => w.type !== "bomb")
      .map((w) => w.word);

    room.highlightWord({ word: first });

    expect(room.highlights).toEqual({
      A: [first],
      B: [],
    });

    room.highlightWord({ word: first });

    expect(room.highlights).toEqual({
      A: [],
      B: [],
    });

    room.selectWord({ word: first });

    expect(room.words.find((w) => w.word === first).flipped).toEqual(true);
    expect(room.guessesLeft).toEqual(1);

    room.selectWord({ word: second });

    expect(room.words.find((w) => w.word === second).flipped).toEqual(true);
    expect(room.round).toEqual(1);
    expect(room.turn).toEqual("B");
    expect(room.stage).toEqual("writing");

    room.submitCode({ code: "qux", number: 1 });

    expect(room.round).toEqual(1);
    expect(room.turn).toEqual("B");
    expect(room.stage).toEqual("guessing");

    room.selectWord({ word: third });

    expect(room.round).toEqual(2);
    expect(room.turn).toEqual("A");
    expect(room.stage).toEqual("writing");
  });
});
