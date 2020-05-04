import React from "react";
import PropTypes from "prop-types";
import Box from "./Box";
import { Key, KeyboardBackground, KeysRow } from "./Keyboard";

const AlphabetKeyboard = ({ onDelete, onType, onSubmit }) => {
  return (
    <KeyboardBackground>
      <KeysRow>
        {"QWERTYUIOP".split("").map((letter) => (
          <Key key={letter} letter={letter} onClick={onType} />
        ))}
      </KeysRow>
      <KeysRow offset={0.5}>
        {"ASDFGHJKL".split("").map((letter) => (
          <Key key={letter} letter={letter} onClick={onType} />
        ))}
      </KeysRow>
      <KeysRow offset={1}>
        {"ZXCVBNM".split("").map((letter) => (
          <Key key={letter} letter={letter} onClick={onType} />
        ))}
        <Key letter="Delete" widthMultiplier={1.75} onClick={onDelete} />
      </KeysRow>
      <Box flex>
        <KeysRow offset={2.5}>
          <Key letter=" " widthMultiplier={5} onClick={onType} />
        </KeysRow>
        <KeysRow offset={0.75}>
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
};

export default AlphabetKeyboard;
