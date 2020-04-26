import React, { useEffect, useReducer, useState } from "react";
import { useStoredState } from "./hooks";
import PropTypes from "prop-types";
import Room from "./Room";

const USER_ID_KEY = "c19-user-id";
const ROOM_ID_KEY = "c19-room-id";

const reducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case "join-room":
      return {
        ...state,
        room: {
          code: payload.code,
        },
        users: payload.users,
      };
    default:
      throw new Error();
  }
};

const App = ({ socket }) => {
  const [name, setName] = useState("");
  const [userID, setUserID] = useStoredState(USER_ID_KEY);
  const [roomID, setRoomID] = useStoredState(ROOM_ID_KEY);
  const [state, dispatch] = useReducer(reducer, { room: null, users: null });

  useEffect(() => {
    console.log("roomID", roomID);
    socket.on("user created", ({ userID: serverUserID }) => {
      setUserID(serverUserID);
    });

    socket.on("room joined", (room) => {
      dispatch({ type: "join-room", payload: room });
      setRoomID(room.id);
    });

    socket.on("room not found", () => {
      setRoomID(null);
    });

    if (roomID) {
      socket.emit("join room", { roomID });
    }
  }, []);

  if (state.room) {
    return (
      <Room key={state.room.code} code={state.room.code} users={state.users} />
    );
  }

  return (
    <div>
      <form
        onSubmit={(evt) => {
          evt.preventDefault();
          socket.emit("create room", { name, userID });
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
        <button type="submit">Create Room</button>
      </form>
    </div>
  );
};

App.propTypes = {
  socket: PropTypes.shape({
    emit: PropTypes.func.isRequired,
    on: PropTypes.func.isRequired,
  }).isRequired,
};

export default App;
