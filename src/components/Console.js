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

const dot1 = keyframes`
    0% { opacity: 0.0; }
    11.1% { opacity: 1.0; }
    100% { opacity: 0.0; }
`;

const dot2 = keyframes`
    0% { opacity: 0.0; }
    22.2% { opacity: 1.0; }
    100% { opacity: 0.0; }
`;

const dot3 = keyframes`
    0% { opacity: 0.0; }
    33.3% { opacity: 1.0; }
    100% { opacity: 0.0; }
`;

const Blink = styled.span`
  animation: ${blink} 1s step-end infinite;
`;

const Content = styled.div`
  .faded {
    opacity: 0.5;
  }
  .strike-through {
    text-decoration: line-through;
  }
  .red {
    color: red;
  }
  .dot-1 {
    animation: ${dot1} 3s step-end infinite;
  }
  .dot-2 {
    animation: ${dot2} 3s step-end infinite;
  }
  .dot-3 {
    animation: ${dot3} 3s step-end infinite;
  }
  .blink {
    animation: ${blink} 1s step-end 3;
  }
`;

const Console = ({ lines, showPrompt, typed }) => {
  return (
    <Box
      pad="tight"
      padLeft="normal"
      flexible
      style={{
        backgroundColor: "#000",
        color: "rgb(17, 212, 40)",
        textShadow: "0 0 3px rgb(17, 212, 40)",
      }}
    >
      <Text preset="code">
        {lines.map((str, index) => (
          <Content key={index}>
            {parseMarkdown(str).html}
            {index === lines.length - 1 && (
              <>
                {showPrompt && typed}
                {showPrompt && <Blink>_</Blink>}
              </>
            )}
          </Content>
        ))}
      </Text>
    </Box>
  );
};

Console.propTypes = {
  lines: PropTypes.arrayOf(PropTypes.string).isRequired,
  showPrompt: PropTypes.bool,
  typed: PropTypes.string,
};

export default Console;
