import React from "react";
import compact from "lodash/compact";
import countBy from "lodash/countBy";
import repeat from "lodash/repeat";
import last from "lodash/last";
import { humanizeList, plc } from "./utils";

export const parseMarkdown = (str) => {
  const text = str
    .replace(/(\*\*)(.*?)\1/g, "$2")
    .replace(/(--)(.*?)\1/g, "$2")
    .replace(/(__)(.*?)\1/g, "$2")
    .replace(/(~~)(.*?)\1/g, "$2");
  return {
    html: (
      <span
        dangerouslySetInnerHTML={{
          __html: str
            .replace(/(\*\*)(.*?)\1/g, "<strong>$2</strong>")
            .replace(/(--)(.*?)\1/g, "<span class='strike-through'>$2</span>")
            .replace(/(__)(.*?)\1/g, "<span class='faded'>$2</span>")
            .replace(/(~~)(.*?)\1/g, "<span class='red'>$2</span>"),
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
      (word.flipped ? "__--" : "") +
      word.word +
      (word.flipped ? "--" : "") +
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
    repeat("─", lineLength),
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
  )}. ${word.flipped ? "--" : ""}${word.word}${word.flipped ? "--__" : ""}`;
};

export const printGuesserWords = ({ words, yourTeam, lineLength }) => {
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
    repeat("─", lineLength),
  ];

  secondHalf.forEach((word, index) => {
    lines[index] += `${repeat(
      " ",
      halfLineLength - parseMarkdown(lines[index]).length
    )}${printGuesserWord({ word, number: index + 1 + half, yourTeam })}`;
  });

  return lines;
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
    `**Transmission received: ${code.word} / ${code.number}**`,
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

export const printScore = ({ isYourTurn, lineLength, words, yourTeam }) => {
  const halfLine = Math.floor(lineLength / 2);
  const counts = countBy(
    words.filter((word) => !word.flipped),
    "type"
  );
  const yourWordsLeft = counts[yourTeam] ?? 0;
  const enemyWordsLeft = counts[yourTeam === "A" ? "B" : "A"] ?? 0;
  const yourScore = `**Alliance:** ${yourWordsLeft} left`;
  const turnIndicator = isYourTurn ? "**<<**" : "**>>**";
  const yourScorePlus = `${yourScore}${repeat(
    " ",
    halfLine - parseMarkdown(yourScore).length - 1
  )}${turnIndicator}`;
  const theirScore = `**Enemy:** ${enemyWordsLeft} left`;
  return [
    `${yourScorePlus}${repeat(
      " ",
      lineLength -
        parseMarkdown(yourScorePlus).length -
        parseMarkdown(theirScore).length
    )}${theirScore}`,
    repeat("─", lineLength),
    " ",
  ];
};

export const printSpymasterWriting = ({
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

export const printSpymasterGuessing = ({ codes, teamNames, yourTeam }) => {
  const yourLastCode = last(codes.filter((code) => code.team === yourTeam));

  return [
    `**Transmission sent: ${yourLastCode.word} / ${yourLastCode.number}**`,
    " ",
    `Awaiting response from ${humanizeList(teamNames)}...`,
  ];
};

export const printWaitingMessage = ({ stage, codes }) => {
  const lastCode = last(codes);
  return [
    stage === "writing"
      ? "**Monitoring enemy communication...**"
      : `**Enemy transmission intercepted: ${lastCode.word} / ${lastCode.number}**`,
  ];
};
