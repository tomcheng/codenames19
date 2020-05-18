import React from "react";
import compact from "lodash/compact";
import countBy from "lodash/countBy";
import repeat from "lodash/repeat";
import takeWhile from "lodash/takeWhile";
import { humanizeList, plc } from "./utils";

export const parseMarkdown = (str) => {
  const text = str
    .replace(/(\*\*)(.*?)\1/g, "$2")
    .replace(/(==)(.*?)\1/g, "$2")
    .replace(/(__)(.*?)\1/g, "$2")
    .replace(/(~~)(.*?)\1/g, "$2")
    .replace(/(\^\^)(.*?)\1/g, "$2");
  return {
    html: (
      <span
        dangerouslySetInnerHTML={{
          __html: str
            .replace(/(\*\*)(.*?)\1/g, "<strong>$2</strong>")
            .replace(/(==)(.*?)\1/g, "<span class='strike-through'>$2</span>")
            .replace(/(__)(.*?)\1/g, "<span class='faded'>$2</span>")
            .replace(/(~~)(.*?)\1/g, "<span class='red'>$2</span>")
            .replace(/(\^\^)(.*?)\1/g, "<span class='blink'>$2</span>")
            .replace(
              /\.\.\./g,
              "<span class='dot-1'>.</span><span class='dot-2'>.</span><span class='dot-3'>.</span>"
            ),
        }}
      />
    ),
    length: text.length,
  };
};

const printWordGroup = ({ title, words, lineLength }) => {
  const lines = [];

  words.forEach((word, index) => {
    const isLast = index === words.length - 1;
    const wordPlus =
      (word.flipped ? "__==" : "") +
      word.word +
      (word.flipped ? "==" : "") +
      (isLast ? "" : ",") +
      (word.flipped ? "__" : "");

    if (lines.length === 0) {
      lines.push(`  ${wordPlus}`);
      return;
    }

    const candidateLine = `${lines[lines.length - 1]} ${wordPlus}`;

    if (parseMarkdown(candidateLine).length <= lineLength) {
      lines[lines.length - 1] = candidateLine;
    } else {
      lines.push(`  ${wordPlus}`);
    }
  });

  return [`**${title.toUpperCase()}**`, ...lines, " "];
};

const printSpyWords = ({ words, yourTeam, lineLength }) => {
  const allianceWords = words.filter((w) => w.type === yourTeam);
  const enemyWords = words.filter(
    (w) => w.type === (yourTeam === "A" ? "B" : "A")
  );
  const neutralWords = words.filter((w) => w.type === "neutral");
  const bomb = words.find((w) => w.type === "bomb");

  return [
    ...printWordGroup({
      title: "Alliance Words",
      words: allianceWords,
      lineLength,
    }),
    ...printWordGroup({
      title: "Enemy Words",
      words: enemyWords,
      lineLength,
    }),
    ...printWordGroup({
      title: "Neutral Words",
      words: neutralWords,
      lineLength,
    }),
    ...printWordGroup({
      title: "Bomb",
      words: [bomb],
      lineLength,
    }),
    repeat("-", lineLength),
  ];
};

const padLeft = (str, numChars, char) => {
  const length = str.toString().length;
  return repeat(char, Math.max(numChars - length, 0)) + str.toString();
};

const printGuesserWord = ({ word, number, yourTeam }) => {
  const indicator =
    !word.flipped || word.type === "neutral"
      ? " "
      : word.type === yourTeam
      ? "■"
      : "~~■~~";
  return ` ${indicator} ${word.flipped ? "__" : ""}${padLeft(
    number,
    2,
    " "
  )}. ${word.flipped ? "==" : ""}${word.word}${word.flipped ? "==__" : ""}`;
};

const printGuesserWords = ({ words, yourTeam, lineLength }) => {
  const half = Math.ceil(words.length / 2);
  const halfLineLength = Math.floor(lineLength / 2);
  const firstHalf = words.slice(0, half);
  const secondHalf = words.slice(half, words.length);

  const lines = [
    ...firstHalf.map((word, index) => {
      return printGuesserWord({ word, number: index + 1, yourTeam });
    }),
    " ",
    "   99. End turn",
    " ",
    repeat("-", lineLength),
  ];

  secondHalf.forEach((word, index) => {
    lines[index] += `${repeat(
      " ",
      halfLineLength - parseMarkdown(lines[index]).length
    )}${printGuesserWord({ word, number: index + 1 + half, yourTeam })}`;
  });

  return lines;
};

export const printConfirming = ({
  awaiting,
  candidateWord,
  confirmation,
  confirmed,
  nominator,
  youNominated,
}) => {
  return [
    `${
      youNominated ? "You have" : nominator.name + " has"
    } selected "${candidateWord}".`,
    !youNominated &&
      `Do you agree with this selection? (Y/N) ${
        confirmed ? `**${confirmation}**` : ""
      }`,
    (youNominated || confirmed) && " ",
    (youNominated || confirmed) &&
      `Awaiting confirmation from ${humanizeList(
        awaiting.map((p) => p.name)
      )}...`,
  ];
};

export const printGuessing = ({
  confirmation,
  confirmed,
  endTurn,
  error,
  guessesLeft,
  number,
  players,
  rejection,
  selected,
  words,
}) => {
  return [
    error && `**${error}.**`,
    rejection &&
      `**"${rejection.word}" was rejected by ${
        players[rejection.playerID].name
      }**.`,
    `You have ${plc(guessesLeft, "guess", "guesses")} remaining.`,
    `Enter selection: ${
      selected || endTurn
        ? `**${number}** - ${
            endTurn ? "End turn" : words[parseInt(number) - 1].word
          }`
        : ""
    }`,
    (selected || endTurn) &&
      `Are you sure? (Y/N) ${confirmed ? `**${confirmation}**` : ""}`,
    confirmed && " ",
    confirmed && "**Transmitting selection...**",
  ];
};

const printScore = ({ lineLength, player, room }) => {
  const isYourTurn = player.team === room.turn;
  const counts = countBy(
    room.words.filter((word) => !word.flipped),
    "type"
  );
  const yourWordsLeft = counts[player.team] ?? 0;
  const enemyWordsLeft = counts[player.team === "A" ? "B" : "A"] ?? 0;
  const yourScore = `${
    isYourTurn ? "" : "__"
  }**Alliance: ${yourWordsLeft} left**${isYourTurn ? "" : "__"}`;
  const theirScore = `${
    isYourTurn ? "__" : ""
  }**Enemy: ${enemyWordsLeft} left**${isYourTurn ? "__" : ""}`;
  const scores = `${yourScore}  ${theirScore}`;

  return [
    `${scores}${repeat(
      " ",
      lineLength -
        parseMarkdown(scores).length -
        parseMarkdown(room.roomCode).length
    )}${room.roomCode}`,
    repeat("-", lineLength),
    " ",
  ];
};

export const printSpyWriting = ({
  confirmation,
  confirmed,
  number,
  numberDone,
  numberError,
  word,
  wordDone,
  wordError,
}) => {
  return compact([
    (numberError || wordError) && `**${numberError || wordError}.**`,
    `Enter word:   **${wordDone ? word : ""}**`,
    wordDone && `Enter number: **${numberDone ? number : ""}**`,
    numberDone &&
      `Send word and number? (Y/N) **${confirmed ? confirmation : ""}**`,
    confirmed && " ",
    confirmed && `**Sending Transmission: ${word.trim()} / ${number}...**`,
  ]);
};

export const printResult = ({ result, bomb }) => {
  const message =
    result === "won"
      ? bomb
        ? "^^**The Enemy has selected the bomb. You win!**^^"
        : "^^**You have uncovered all the codes. You win!**^^"
      : bomb
      ? "^^**You have selected the bomb. You ded.**^^"
      : "^^**The Enemy has uncovered all the codes. You ded.**^^";

  return [message];
};

export const printLog = ({ room, playerID }) => {
  const result = [];
  const player = room.players[playerID];
  let shortLog = room.log;
  const currentSpy = Object.values(room.players).find(
    (p) => p.spymaster && p.team === room.turn
  );

  if (
    room.turn === player.team &&
    room.stage === "writing" &&
    player.spymaster
  ) {
    return [];
  }

  if (room.stage === "guessing") {
    shortLog = takeWhile(
      room.log.slice().reverse(),
      (entry) => entry.team === room.turn
    ).reverse();
  } else {
    shortLog = takeWhile(
      room.log.slice().reverse(),
      (entry) => entry.team !== room.turn
    ).reverse();
  }

  shortLog.forEach(
    ({ action, playerID: logPlayerID, team, payload }, index) => {
      const actor = room.players[logPlayerID];
      switch (action) {
        case "submit-code":
          if (!player.spymaster && player.team === team) {
            result.push(
              `Transmission received: **${payload.word} / ${payload.number}**`
            );
          } else {
            const name = player.id === logPlayerID ? "You" : actor.name;
            result.push(
              `${name} transmitted **${payload.word} / ${payload.number}**`
            );
          }
          break;
        case "select-word": {
          if (payload.needsConfirmation) {
            break;
          }

          const wordObj = room.words.find((w) => w.word === payload.word);
          const isCorrect = wordObj.type === actor.team;
          const name =
            team === player.team && !player.spymaster ? "You" : actor.name;
          result.push(
            `${name} selected **${payload.word}** - ${
              isCorrect ? "correct" : "incorrect"
            }`
          );
          break;
        }
        case "confirm-word": {
          const confirmationsNeeded =
            Object.values(room.players).filter((p) => p.team === team).length -
            2;
          const actionsTilNow = shortLog.slice(0, index + 1);
          const confirms = takeWhile(
            actionsTilNow.slice().reverse(),
            (e) => e.action === "confirm-word"
          );
          if (confirms.length < confirmationsNeeded) {
            break;
          }
          const wordSelected = actionsTilNow
            .slice()
            .reverse()
            .find((e) => e.action === "select-word");

          const wordObj = room.words.find(
            (w) => w.word === wordSelected.payload.word
          );
          const isCorrect = wordObj.type === actor.team;
          const name =
            team === player.team && !player.spymaster ? "You" : actor.name;
          result.push(
            `${name} selected **${wordSelected.payload.word}** - ${
              isCorrect ? "correct" : "incorrect"
            }`
          );
          break;
        }
        case "end-turn":
          result.push(
            team === player.team
              ? "You ended your turn."
              : "The enemy ended their turn."
          );
          break;
        default:
          break;
      }
      if (index === shortLog.length - 1) {
        result.push(" ");
      }
    }
  );

  if (room.turn !== player.team) {
    result.push(
      room.stage === "writing"
        ? "Monitoring enemy transmission..."
        : "Awaiting enemy's selection..."
    );
  }

  if (
    room.turn === player.team &&
    room.stage === "writing" &&
    !player.spymaster
  ) {
    result.push(`Awaiting transmission from ${currentSpy.name}...`);
  }

  if (
    room.turn === player.team &&
    room.stage === "guessing" &&
    player.spymaster
  ) {
    result.push(`Awaiting your team's selection...`);
  }

  return result;
};

export const printCommonLines = ({ lineLength, player, room }) => {
  let lines = printScore({
    lineLength,
    player,
    room,
  });

  lines = lines.concat(
    player.spymaster
      ? printSpyWords({
          lineLength,
          words: room.words,
          yourTeam: player.team,
        })
      : printGuesserWords({
          lineLength,
          words: room.words,
          yourTeam: player.team,
        })
  );

  lines = lines.concat(printLog({ room, playerID: player.id }));

  return lines;
};
