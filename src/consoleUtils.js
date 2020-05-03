import React from "react";
import repeat from "lodash/repeat";

export const parseMarkdown = (str) => {
  const text = str.replace(/(\*\*)(.*)\1/g, "$2");
  return {
    html: (
      <span
        dangerouslySetInnerHTML={{
          __html: str.replace(/(\*\*)(.*)\1/g, "<strong>$2</strong>"),
        }}
      />
    ),
    text,
  };
};

export const displayWordGroup = ({ title, words, lineLength }) => {
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

  return [`**${title.toUpperCase()}**`, ...lines, ""];
};

export const addBox = ({ lines, lineLength }) => {
  const newLines = [`┌${repeat("─", lineLength - 2)}┐`];

  lines.forEach((line) => {
    newLines.push(`│ ${line}${repeat(" ", lineLength - (line.length + 4))} │`);
  });

  newLines.push(`└${repeat("─", lineLength - 2)}┘`);

  return newLines;
};