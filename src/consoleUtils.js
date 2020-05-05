import React from "react";
import compact from "lodash/compact";
import countBy from "lodash/countBy";
import repeat from "lodash/repeat";
import last from "lodash/last";
import { humanizeList, plc } from "./utils";

export const parseMarkdown = (str) => {
  const text = str.replace(/(\*\*)(.*)\1/g, "$2");
  return {
    html: (
      <span
        dangerouslySetInnerHTML={{
          __html: str.replace(/(\*\*)(.*?)\1/g, "<strong>$2</strong>"),
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
    const postWord = isLast ? "" : ",";

    if (lines.length === 0) {
      lines.push(`  ${word}${postWord}`);
      return;
    }

    const candidateLine = `${lines[lines.length - 1]} ${word}${postWord}`;

    if (candidateLine.length <= lineLength) {
      lines[lines.length - 1] = candidateLine;
    } else {
      lines.push(`  ${word}${postWord}`);
    }
  });

  return [`**${title.toUpperCase()}**`, ...lines, " "];
};

export const printSpymasterWords = ({ words, yourTeam, lineLength }) => {
  const allianceWords = words.filter((w) => w.type === yourTeam);
  const enemyWords = words.filter(
    (w) => w.type === (yourTeam === "A" ? "B" : "A")
  );
  const neutralWords = words.filter((w) => w.type === "neutral");
  const bomb = words.find((w) => w.type === "bomb");

  return [
    ...printWordGroup({
      title: "Alliance Words",
      words: allianceWords.map((w) => w.word),
      lineLength,
    }),
    ...printWordGroup({
      title: "Enemy Words",
      words: enemyWords.map((w) => w.word),
      lineLength,
    }),
    ...printWordGroup({
      title: "Neutral Words",
      words: neutralWords.map((w) => w.word),
      lineLength,
    }),
    ...printWordGroup({
      title: "Bomb",
      words: [bomb.word],
      lineLength,
    }),
    repeat("─", lineLength),
  ];
};

const padLeft = (str, numChars, char) => {
  const length = str.toString().length;
  return repeat(char, Math.max(numChars - length, 0)) + str.toString();
};

const padRight = (str, numChars, char) => {
  const length = str.toString().length;
  return str.toString() + repeat(char, Math.max(numChars - length, 0));
};

export const printGuesserWords = ({ words, yourTeam, lineLength }) => {
  const half = Math.ceil(words.length / 2);
  const halfLineLength = Math.floor(lineLength / 2);
  const firstHalf = words.slice(0, half);
  const secondHalf = words.slice(half, words.length);
  return [
    ...firstHalf.map(
      ({ word }, index) =>
        padRight(
          `${padLeft(index + 1, 2, " ")}. ${word}`,
          halfLineLength,
          " "
        ) +
        (secondHalf[index]
          ? `${padLeft(index + half + 1, 2, " ")}. ${secondHalf[index].word}`
          : "")
    ),
    " ",
    "99. End turn",
    " ",
    repeat("─", lineLength),
  ];
};

export const printGuesserGuessing = ({
  code,
  confirmation,
  confirmed,
  endTurn,
  error,
  guessesLeft,
  number,
  selected,
  words,
}) => {
  return [
    `**Transmission received: ${code.code} / ${code.number}**`,
    " ",
    error && `**${error}.**`,
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

export const printScore = ({ words, yourTeam, lineLength }) => {
  const counts = countBy(
    words.filter((word) => !word.flipped),
    "type"
  );
  const yourWordsLeft = counts[yourTeam] ?? 0;
  const enemyWordsLeft = counts[yourTeam === "A" ? "B" : "A"] ?? 0;
  const yourScore = `**Alliance:** ${yourWordsLeft} left`;
  const theirScore = `**Enemy:** ${enemyWordsLeft} left`;

  return [
    `${yourScore}${repeat(
      " ",
      lineLength -
        parseMarkdown(yourScore).length -
        parseMarkdown(theirScore).length
    )}${theirScore}`,
    repeat("─", lineLength),
    " ",
  ];
};

export const printSpymasterWriting = ({
  code,
  codeDone,
  codeError,
  confirmation,
  confirmed,
  number,
  numberDone,
  numberError,
}) => {
  return compact([
    (numberError || codeError) && `**${numberError || codeError}.**`,
    `Enter code word: **${codeDone ? code : ""}**`,
    codeDone && `Enter number:    **${numberDone ? number : ""}**`,
    numberDone &&
      `Send code and number? (Y/N) **${confirmed ? confirmation : ""}**`,
    confirmed && " ",
    confirmed && `**Sending Transmission: ${code.trim()} / ${number}...**`,
  ]);
};

export const printSpymasterGuessing = ({ codes, teamNames, yourTeam }) => {
  const yourLastCode = last(codes.filter((code) => code.team === yourTeam));

  return [
    `**Transmission sent: ${yourLastCode.code} / ${yourLastCode.number}**`,
    " ",
    `Awaiting response from ${humanizeList(teamNames)}...`,
  ];
};
