import React from "react";
import PropTypes from "prop-types";
import Box from "./Box";
import Text from "./Text";

const Console = ({ lines, showPrompt }) => {
  return (
    <Box
      pad="tight"
      style={{
        backgroundColor: "#222",
        borderTop: "1px solid #888",
        color: "rgb(17, 212, 40)",
        textShadow: "0 0 3px rgb(17, 212, 40)",
      }}
    >
      <Text preset="code">
        {`   ${lines[0]}
   ${lines[1] || ""}
${showPrompt ? ">" : " "}  ${lines[2] || ""}`}
      </Text>
    </Box>
  );
};

Console.propTypes = {
  lines: PropTypes.arrayOf(PropTypes.string).isRequired,
  showPrompt: PropTypes.bool.isRequired,
};

export default Console;
