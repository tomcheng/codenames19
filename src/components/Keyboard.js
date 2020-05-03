import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const WIDTH = 40;

const Container = styled.div`
  background: linear-gradient(to bottom, #e5e2e1, #f5f3f1, #e5e2e1);
  padding: 8px 0 45px;
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

const KeyContainer = styled.div`
  padding: 1px;
  width: ${WIDTH}px;
  height: ${WIDTH - 2}px;
  display: flex;
  align-items: stretch;
`;
const Key = styled.div`
  align-items: stretch;
  background: #d3cfcc;
  border-color: #ece8e4 #dedad6 #c9c4c4;
  border-style: solid;
  border-width: 2px 5px 6px;
  border-radius: 3px;
  display: flex;
  flex-grow: 1;
`;

const KeyCap = styled.div`
  flex-grow: 1;
  padding: 4px 0 0 6px;
  font-size: 13px;
  font-family: Roboto, sans-serif;
  font-weight: 700;
  line-height: 1;
  background: linear-gradient(to right, #e5e2e1, #eaeaea, #e5e2e1);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
  border-radius: 3px;
  position: relative;
`;

const Keyboard = ({}) => {
  return (
    <Container>
      <Row flex>
        {"QWERTYUIOP".split("").map((letter) => (
          <KeyContainer key={letter}>
            <Key>
              <KeyCap>{letter}</KeyCap>
            </Key>
          </KeyContainer>
        ))}
      </Row>
      <Row flex>
        {"ASDFGHJKL".split("").map((letter) => (
          <KeyContainer key={letter}>
            <Key>
              <KeyCap>{letter}</KeyCap>
            </Key>
          </KeyContainer>
        ))}
      </Row>
      <Row flex>
        {"ZXCVBNM".split("").map((letter) => (
          <KeyContainer key={letter}>
            <Key>
              <KeyCap>{letter}</KeyCap>
            </Key>
          </KeyContainer>
        ))}
        <KeyContainer style={{ width: WIDTH * 1.5 + 2 }}>
          <Key>
            <KeyCap>Delete</KeyCap>
          </Key>
        </KeyContainer>
      </Row>
    </Container>
  );
};

Keyboard.propTypes = {};

export default Keyboard;
