import React from "react";
import PropTypes from "prop-types";
import { Key, KeyboardBackground, KeysRow } from "./Keyboard";
import Box from "./Box";

const NumericKeyboard = ({
  keyWidth,
  onCancel,
  onDelete,
  onSubmit,
  onType,
}) => {
  return (
    <KeyboardBackground keyWidth={keyWidth}>
      <Box flex>
        <KeysRow>
          <Key letter="Esc" widthMultiplier={1.25} onClick={onCancel} />
        </KeysRow>
        <KeysRow offset={2.25}>
          {"789".split("").map((num) => (
            <Key key={num} letter={num} onClick={onType} />
          ))}
        </KeysRow>
      </Box>
      <KeysRow offset={3.5}>
        {"456".split("").map((num) => (
          <Key key={num} letter={num} onClick={onType} />
        ))}
      </KeysRow>
      <KeysRow offset={3.5}>
        {"123".split("").map((num) => (
          <Key key={num} letter={num} onClick={onType} />
        ))}
      </KeysRow>
      <Box flex>
        <KeysRow offset={3.5}>
          <Key letter="0" widthMultiplier={2} onClick={onType} />
          <Key letter="⌫" onClick={onDelete} />
        </KeysRow>
        <KeysRow offset={1.75}>
          <Key letter="Enter" widthMultiplier={1.75} onClick={onSubmit} />
        </KeysRow>
      </Box>
    </KeyboardBackground>
  );
};

NumericKeyboard.propTypes = {
  keyWidth: PropTypes.number.isRequired,
  onCancel: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onType: PropTypes.func.isRequired,
};

export default NumericKeyboard;
