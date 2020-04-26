import React, { useRef, useState } from "react";
import { v4 } from "uuid";
import styled from "styled-components";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckSquare, faSquare } from "@fortawesome/free-regular-svg-icons";
import Box from "./Box";
import Text from "./Text";

const Container = styled.div`
  max-width: 400px;
  padding-top: 50px;
  margin: 0 auto;
`;

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

const Button = styled.button`
  padding: 8px 16px;
  background-color: #222;
  color: #fff;
  font-family: "Roboto", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-weight: bold;
  font-size: 13px;
`;

const randomNameName = v4();
const randomCodeName = v4();

const Lobby = ({ initialName, invalidCode, onCreateRoom, onJoinRoom }) => {
  const [name, setName] = useState(initialName);
  const [isNew, setIsNew] = useState(true);
  const [isMissingName, setIsMissingName] = useState(false);
  const [code, setCode] = useState("");
  const codeInputRef = useRef(null);

  return (
    <Container>
      <Box textAlign="center" padBottom="normal">
        <Text preset="document-title">Enlistment/Re-Enlistment Document</Text>
      </Box>
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
          <InputContainer borderBottom pad="tight">
            <div>
              <Text as="label" htmlFor={randomNameName} preset="label">
                First Name
              </Text>
            </div>
            <div>
              <Input
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
              pad="tight"
              style={{
                flexGrow: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Text
                preset="label"
                onClick={() => {
                  setIsNew(true);
                }}
              >
                <span style={{ marginRight: 5 }}>
                  <FontAwesomeIcon icon={isNew ? faCheckSquare : faSquare} />
                </span>
                Start New Mission
              </Text>
              <Text
                preset="label"
                onClick={() => {
                  setIsNew(false);
                  codeInputRef.current.focus();
                }}
              >
                <span style={{ marginRight: 5 }}>
                  <FontAwesomeIcon icon={isNew ? faSquare : faCheckSquare} />
                </span>
                Join Mission
              </Text>
            </Box>
            <InputContainer pad="tight" width={120} opacity={isNew ? 0.5 : 1}>
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
          <Box style={{ display: "flex" }}>
            <Box
              pad="tight"
              style={{ flexGrow: 1, display: "flex", alignItems: "center" }}
            >
              {isMissingName ? (
                <Text color="danger" preset="label">
                  Error: First Name is required
                </Text>
              ) : invalidCode ? (
                <Text color="danger" preset="label">
                  Error: Invalid mission code
                </Text>
              ) : null}
            </Box>
            <Box pad="tight" padY="normal">
              <Button type="submit">SUBMIT</Button>
            </Box>
          </Box>
        </Box>
      </form>
    </Container>
  );
};

Lobby.propTypes = {
  initialName: PropTypes.string.isRequired,
  invalidCode: PropTypes.bool.isRequired,
  onCreateRoom: PropTypes.func.isRequired,
  onJoinRoom: PropTypes.func.isRequired,
};

export default Lobby;
