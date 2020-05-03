import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Key from "./Key";

const Container = styled.div`
  background: linear-gradient(to bottom, #e5e2e1, #f5f3f1, #e5e2e1);
  padding: 8px 0 45px;
  display: flex;
  justify-content: center;
`;

const KeysContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const Row = styled.div`
  border-radius: 4px;
  background-color: #4c4b47;
  display: flex;
  padding: 1px;
  & + & {
    margin-top: -2px;
  }
`;

const Keyboard = ({ keyWidth }) => {
  return (
    <Container>
      <KeysContainer>
        <Row flex>
          {"QWERTYUIOP".split("").map((letter) => (
            <Key key={letter} letter={letter} size={keyWidth} />
          ))}
        </Row>
        <Row flex style={{ marginLeft: 0.5 * keyWidth }}>
          {"ASDFGHJKL".split("").map((letter) => (
            <Key key={letter} letter={letter} size={keyWidth} />
          ))}
        </Row>
        <Row flex style={{ marginLeft: keyWidth }}>
          {"ZXCVBNM".split("").map((letter) => (
            <Key key={letter} letter={letter} size={keyWidth} />
          ))}
          <Key letter="Delete" size={keyWidth} widthMultiplier={1.75} />
        </Row>
      </KeysContainer>
    </Container>
  );
};

Keyboard.propTypes = {
  keyWidth: PropTypes.number.isRequired,
};

export default Keyboard;
