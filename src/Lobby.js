import React, { useState } from "react";
import PropTypes from "prop-types";

const Lobby = ({ initialName, invalidCode, onCreateRoom, onJoinRoom }) => {
  const [mode, setMode] = useState(null); // create or join
  const [name, setName] = useState(initialName);
  const [code, setCode] = useState("");

  if (!mode) {
    return (
      <div>
        <button
          onClick={() => {
            setMode("create");
          }}
        >
          Create
        </button>
        <button
          onClick={() => {
            setMode("join");
          }}
        >
          Join
        </button>
      </div>
    );
  }

  if (mode === "create") {
    return (
      <div>
        <form
          onSubmit={(evt) => {
            evt.preventDefault();
            onCreateRoom({ name });
          }}
        >
          <label htmlFor="name">Name:</label>
          <input
            id="name"
            name="name"
            value={name}
            onChange={(evt) => {
              setName(evt.target.value);
            }}
          />
          <button type="submit">Create Game</button>
        </form>
        <button
          onClick={() => {
            setMode(null);
          }}
        >
          Back
        </button>
      </div>
    );
  }

  if (mode === "join") {
    return (
      <div>
        <form
          onSubmit={(evt) => {
            evt.preventDefault();
            onJoinRoom({ code, name });
          }}
        >
          <div>
            <label htmlFor="code">Game Code:</label>
            <input
              id="code"
              name="code"
              value={code}
              onChange={(evt) => {
                setCode(evt.target.value);
              }}
            />
            {invalidCode && <span>Code not found</span>}
          </div>
          <div>
            <label htmlFor="name">Name:</label>
            <input
              id="name"
              name="name"
              value={name}
              onChange={(evt) => {
                setName(evt.target.value);
              }}
            />
          </div>
          <button type="submit">Join Game</button>
        </form>
        <button
          onClick={() => {
            setMode(null);
          }}
        >
          Back
        </button>
      </div>
    );
  }

  return null;
};

Lobby.propTypes = {
  initialName: PropTypes.string.isRequired,
  invalidCode: PropTypes.bool.isRequired,
  onCreateRoom: PropTypes.func.isRequired,
  onJoinRoom: PropTypes.func.isRequired,
};

export default Lobby;
