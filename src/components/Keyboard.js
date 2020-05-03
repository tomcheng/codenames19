import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const KeyboardContext = React.createContext();

const Container = styled.div`
  background: linear-gradient(to bottom, #e5e2e1, #f5f3f1, #e5e2e1);
  padding: 10px 0 8px;
  display: flex;
  justify-content: center;
`;

const KeysWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

export const KeyboardBackground = ({ children, keyWidth }) => (
  <KeyboardContext.Provider value={keyWidth}>
    <Container>
      <KeysWrapper>{children}</KeysWrapper>
    </Container>
  </KeyboardContext.Provider>
);

const StyledRow = styled.div`
  border-radius: 4px;
  background-color: #4c4b47;
  display: flex;
  padding: 1px;
  margin: -2px -1px 0;
`;

export const KeysRow = ({ children, offset }) => {
  return (
    <KeyboardContext.Consumer>
      {(value) => (
        <StyledRow style={offset ? { marginLeft: offset * value } : null}>
          {children}
        </StyledRow>
      )}
    </KeyboardContext.Consumer>
  );
};

const KeyContainer = styled.div`
  padding: 1px;
  width: ${(props) => props.size}px;
  height: ${(props) => props.size - 2}px;
  display: flex;
  align-items: stretch;
`;
const KeyWrapper = styled.div`
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
  font-size: 12px;
  font-family: Roboto, sans-serif;
  font-weight: 400;
  line-height: 1;
  background: linear-gradient(to right, #e5e2e1, #eaeaea, #e5e2e1);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
  border-radius: 3px;
  position: relative;
`;

export const Key = ({ letter, widthMultiplier, onClick }) => {
  return (
    <KeyboardContext.Consumer>
      {(value) => (
        <KeyContainer
          size={value}
          onClick={() => {
            onClick(letter);
          }}
          style={widthMultiplier ? { width: value * widthMultiplier } : null}
        >
          <KeyWrapper>
            <KeyCap>{letter}</KeyCap>
          </KeyWrapper>
        </KeyContainer>
      )}
    </KeyboardContext.Consumer>
  );
};

Key.propTypes = {
  letter: PropTypes.string.isRequired,
  widthMultiplier: PropTypes.number,
  onClick: PropTypes.func,
};
