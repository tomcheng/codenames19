import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { GameDimensionsConsumer } from "./GameDimensions";

const KeyboardContext = React.createContext();

const Container = styled.div`
  background: linear-gradient(to bottom, #e5e2e1, #f5f3f1, #e5e2e1);
  padding: 10px 0 8px;
  display: flex;
  justify-content: center;
  user-select: none;
`;

const KeysWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: ${(props) => props.keyWidth * 10}px;
`;

export const KeyboardBackground = ({ children, disabled }) => (
  <GameDimensionsConsumer>
    {({ keyWidth }) => (
      <KeyboardContext.Provider value={{ disabled }}>
        <Container>
          <KeysWrapper keyWidth={keyWidth}>{children}</KeysWrapper>
        </Container>
      </KeyboardContext.Provider>
    )}
  </GameDimensionsConsumer>
);

KeyboardBackground.propTypes = {
  children: PropTypes.node.isRequired,
};

const BORDER_RADII = {
  all: "4px",
  top: "4px 4px 0 0",
  bottom: "0 0 4px 4px",
  "bottom-left": "0 0 0 4px",
  "top-right-bottom-left": "0 4px 0 4px",
  "x-top-left": "0 4px 4px 4px",
  none: 0,
};

const StyledRow = styled.div`
  background-color: #4c4b47;
  border-radius: ${(props) => BORDER_RADII[props.round]};
  display: flex;
  margin: -2px -1px 0;
  transition: opacity 0.15s ease-in-out;
  opacity: ${(props) => (props.disabled ? 0.4 : null)};
  padding: 1px;
`;

export const KeysRow = ({ children, offset, round }) => {
  return (
    <GameDimensionsConsumer>
      {({ keyWidth }) => (
        <KeyboardContext.Consumer>
          {({ disabled }) => (
            <StyledRow
              disabled={disabled}
              round={round}
              style={offset ? { marginLeft: offset * keyWidth - 1 } : null}
            >
              {children}
            </StyledRow>
          )}
        </KeyboardContext.Consumer>
      )}
    </GameDimensionsConsumer>
  );
};

KeysRow.propTypes = {
  children: PropTypes.node.isRequired,
  offset: PropTypes.number,
  round: PropTypes.oneOf(Object.keys(BORDER_RADII)),
};

KeysRow.defaultProps = {
  round: "all",
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
    <GameDimensionsConsumer>
      {({ keyWidth }) => (
        <KeyboardContext.Consumer>
          {({ disabled }) => (
            <KeyContainer
              size={keyWidth}
              onClick={() => {
                if (disabled) return;
                onClick(letter);
              }}
              style={
                widthMultiplier ? { width: keyWidth * widthMultiplier } : null
              }
            >
              <KeyWrapper>
                <KeyCap>{letter}</KeyCap>
              </KeyWrapper>
            </KeyContainer>
          )}
        </KeyboardContext.Consumer>
      )}
    </GameDimensionsConsumer>
  );
};

Key.propTypes = {
  letter: PropTypes.string.isRequired,
  widthMultiplier: PropTypes.number,
  onClick: PropTypes.func.isRequired,
};
