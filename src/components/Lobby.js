import React, { useRef, useState } from "react";
import { v4 } from "uuid";
import styled from "styled-components";
import PropTypes from "prop-types";
import Box from "./Box";
import Button from "./Button";
import Checkbox from "./Checkbox";
import Text from "./Text";

const InputContainer = styled(Box)`
  transition: background-color 0.15s ease-in-out;
  :focus-within {
    background-color: #f5f5f5;
  }
`;

const Input = styled.input`
  width: 100%;
  background-color: transparent;
  font-size: inherit;
  font-family: inherit;
  border-radius: 2px;
  padding: 2px;
  margin-left: -2px;
  margin-right: -2px;
  outline: 0;
`;

const randomNameName = v4();
const randomCodeName = v4();

const Lobby = ({ codeIsInvalid, initialName, onCreateRoom, onJoinRoom }) => {
  const [name, setName] = useState(initialName);
  const [isNew, setIsNew] = useState(true);
  const [isMissingName, setIsMissingName] = useState(false);
  const [code, setCode] = useState("");
  const codeInputRef = useRef(null);

  return (
    <form
      onSubmit={(evt) => {
        evt.preventDefault();
        if (name.trim() === "") {
          setIsMissingName(true);
          return;
        }

        setIsMissingName(false);

        if (isNew) {
          onCreateRoom({ name });
        } else {
          onJoinRoom({ code, name });
        }
      }}
    >
      <Box border>
        <InputContainer borderBottom pad="tight" padY="x-tight">
          <Text as="label" htmlFor={randomNameName} preset="label">
            First Name
          </Text>
          <div>
            <Input
              autoFocus
              id="name"
              name={randomNameName}
              value={name}
              onChange={(evt) => {
                setName(evt.target.value);
              }}
            />
          </div>
        </InputContainer>
        <Box borderBottom style={{ display: "flex" }}>
          <Box
            borderRight
            flex
            flexDirection="column"
            flexible
            justifyContent="center"
            pad="tight"
          >
            <div
              onClick={() => {
                setIsNew(true);
              }}
            >
              <Checkbox checked={isNew} label="Start New Mission" />
            </div>
            <div
              onClick={() => {
                setIsNew(false);
                codeInputRef.current.focus();
              }}
            >
              <Checkbox checked={!isNew} label="Join Mission" />
            </div>
          </Box>
          <InputContainer
            pad="tight"
            padY="x-tight"
            width={120}
            opacity={isNew ? 0.5 : 1}
          >
            <Text as="label" htmlFor={randomCodeName} preset="label">
              Code
            </Text>
            <Input
              ref={codeInputRef}
              id="code"
              name={randomCodeName}
              value={code}
              onChange={(evt) => {
                if (isNew) {
                  setIsNew(false);
                }
                setCode(
                  evt.target.value
                    .toUpperCase()
                    .replace(/[^A-Z]/g, "")
                    .slice(0, 4)
                );
              }}
            />
          </InputContainer>
        </Box>
        <Box alignItems="center" flex pad="tight">
          <Box flexible>
            {isMissingName ? (
              <Text color="danger" preset="label">
                Error: First Name is required
              </Text>
            ) : codeIsInvalid ? (
              <Text color="danger" preset="label">
                Error: Invalid mission code
              </Text>
            ) : null}
          </Box>
          <Button type="submit">SUBMIT</Button>
        </Box>
      </Box>
    </form>
  );
};

Lobby.propTypes = {
  codeIsInvalid: PropTypes.bool.isRequired,
  initialName: PropTypes.string.isRequired,
  onCreateRoom: PropTypes.func.isRequired,
  onJoinRoom: PropTypes.func.isRequired,
};

export default Lobby;
