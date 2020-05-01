import React, { useRef, useState } from "react";
import { v4 } from "uuid";
import styled from "styled-components";
import PropTypes from "prop-types";
import Box from "./Box";
import Checkbox from "./Checkbox";
import DocumentSubmit from "./DocumentSubmit";
import DocumentWrapper from "./DocumentWrapper";
import Input from "./Input";
import Text from "./Text";

const InputContainer = styled(Box)`
  transition: background-color 0.15s ease-in-out;
  :focus-within {
    background-color: #f5f5f5;
  }
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
      <DocumentWrapper title="Enlistment/Re-Enlistment Document">
        <Box border>
          <InputContainer borderBottom pad="tight" padY="x-tight">
            <Text as="label" htmlFor={randomNameName} preset="label">
              Applicant Name
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
          <Box style={{ display: "flex" }}>
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
            <InputContainer pad="tight" padY="x-tight" width={120}>
              <Text
                as="label"
                faded={isNew}
                htmlFor={randomCodeName}
                preset="label"
              >
                Mission Code
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
        </Box>
      </DocumentWrapper>
      <DocumentSubmit
        error={
          isMissingName
            ? "Name is required"
            : codeIsInvalid
            ? "Invalid mission code"
            : null
        }
      />
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
