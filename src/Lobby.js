import React, { useState } from "react";
import PropTypes from "prop-types";

const Lobby = ({ initialName, invalidCode, onCreateRoom, onJoinRoom }) => {
  const [name, setName] = useState(initialName);
  const [code, setCode] = useState("");

  return (
    <div>
      <div>
        <label htmlFor="name">Name:</label>
      </div>
      <div>
        <input
          id="name"
          name="name"
          value={name}
          onChange={(evt) => {
            setName(evt.target.value);
          }}
        />
      </div>
      <div>
        <div>
          <input
            placeholder="CODE"
            id="code"
            name="code"
            value={code}
            onChange={(evt) => {
              setCode(evt.target.value);
            }}
          />
          <button
            onClick={() => {
              onJoinRoom({ code, name });
            }}
          >
            Join
          </button>
          <button
            onClick={() => {
              onCreateRoom({ name });
            }}
          >
            Start New Game
          </button>
        </div>
        {invalidCode && <div>Code not found</div>}
      </div>
    </div>
  );
};

Lobby.propTypes = {
  initialName: PropTypes.string.isRequired,
  invalidCode: PropTypes.bool.isRequired,
  onCreateRoom: PropTypes.func.isRequired,
  onJoinRoom: PropTypes.func.isRequired,
};

export default Lobby;
