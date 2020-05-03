import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

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

const Key = ({ letter, size, widthMultiplier, onClick }) => {
  return (
    <KeyContainer
      size={size}
      onClick={onClick}
      style={widthMultiplier ? { width: size * widthMultiplier } : null}
    >
      <KeyWrapper>
        <KeyCap>{letter}</KeyCap>
      </KeyWrapper>
    </KeyContainer>
  );
};

Key.propTypes = {
  letter: PropTypes.string.isRequired,
  size: PropTypes.number.isRequired,
  widthMultiplier: PropTypes.number,
  onClick: PropTypes.func,
};

export default Key;
