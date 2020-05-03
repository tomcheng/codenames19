import React from "react";
import repeat from "lodash/repeat";

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

export const printSpymasterList = ({ words, yourTeam, lineLength }) => {
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

export const printScore = ({ yourWordsLeft, enemyWordsLeft, lineLength }) => {
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
