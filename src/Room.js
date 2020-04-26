import React from "react";
import PropTypes from "prop-types";

const Room = ({ code, users }) => {
  return (
    <div>
      <div>Code: {code}</div>
      <div>
        {users.map(({ id, name }) => (
          <div key={id}>{name}</div>
        ))}
      </div>
    </div>
  );
};

Room.propTypes = {
  code: PropTypes.string.isRequired,
  users: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default Room;
