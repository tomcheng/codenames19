import React from "react";
import PropTypes from "prop-types";
import { Key, KeyboardBackground, KeysRow } from "./Keyboard";
import Box from "./Box";

const NumericKeyboard = ({ keyWidth }) => {
  return (
    <KeyboardBackground keyWidth={keyWidth}>
      <KeysRow offset={3.5}>
        {"789".split("").map((num) => (
          <Key key={num} letter={num} />
        ))}
      </KeysRow>
      <KeysRow offset={3.5}>
        {"456".split("").map((num) => (
          <Key key={num} letter={num} />
        ))}
      </KeysRow>
      <KeysRow offset={3.5}>
        {"123".split("").map((num) => (
          <Key key={num} letter={num} />
        ))}
      </KeysRow>
      <Box flex>
        <KeysRow offset={3.5}>
          <Key letter="0" widthMultiplier={2} />
          <Key letter="." />
        </KeysRow>
        <KeysRow offset={1.75}>
          <Key letter="Enter" widthMultiplier={1.75} />
        </KeysRow>
      </Box>
    </KeyboardBackground>
  );
};

NumericKeyboard.propTypes = {
  keyWidth: PropTypes.number.isRequired,
};

export default NumericKeyboard;
