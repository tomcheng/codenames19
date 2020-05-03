import React from "react";
import styled, { keyframes } from "styled-components";
import PropTypes from "prop-types";
import { parseMarkdown } from "../consoleUtils";
import Box from "./Box";
import Text from "./Text";

const blink = keyframes`
    0% { opacity: 1.0; }
    50% { opacity: 0.0; }
    100% { opacity: 1.0; }
`;

const Blink = styled.span`
  animation: ${blink} 1s step-end infinite;
`;

const Console = ({ lines, showPrompt }) => {
  return (
    <Box
      pad="tight"
      flexible
      style={{
        backgroundColor: "#000",
        color: "rgb(17, 212, 40)",
        textShadow: "0 0 3px rgb(17, 212, 40)",
      }}
    >
      <Text preset="code">
        {lines.map((str, index) => (
          <div key={index}>
            {`  `}
            {parseMarkdown(str).html}
          </div>
        ))}
        {`> `}
        {showPrompt && <Blink>_</Blink>}
      </Text>
    </Box>
  );
};

Console.propTypes = {
  lines: PropTypes.arrayOf(PropTypes.string).isRequired,
  showPrompt: PropTypes.bool,
};

export default Console;
