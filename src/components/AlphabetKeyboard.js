import React from "react";
import PropTypes from "prop-types";
import Box from "./Box";
import { Key, KeyboardBackground, KeysRow } from "./Keyboard";

const AlphabetKeyboard = ({ disabled, onDelete, onType, onSubmit }) => {
  return (
    <KeyboardBackground disabled={disabled}>
      <KeysRow>
        {"QWERTYUIOP".split("").map((letter) => (
          <Key key={letter} letter={letter} onClick={onType} />
        ))}
      </KeysRow>
      <KeysRow offset={0.5} round="bottom-left">
        {"ASDFGHJKL".split("").map((letter) => (
          <Key key={letter} letter={letter} onClick={onType} />
        ))}
      </KeysRow>
      <KeysRow offset={1} round="top-right-bottom-left">
        {"ZXCVBNM".split("").map((letter) => (
          <Key key={letter} letter={letter} onClick={onType} />
        ))}
        <Key letter="Delete" widthMultiplier={1.75} onClick={onDelete} />
      </KeysRow>
      <Box flex>
        <KeysRow offset={2.5} round="bottom">
          <Key letter=" " widthMultiplier={5} onClick={onType} />
        </KeysRow>
        <KeysRow offset={0.75} round="x-top-left">
          <Key letter="Enter" widthMultiplier={1.75} onClick={onSubmit} />
        </KeysRow>
      </Box>
    </KeyboardBackground>
  );
};

AlphabetKeyboard.propTypes = {
  onDelete: PropTypes.func.isRequired,
  onType: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

export default AlphabetKeyboard;
