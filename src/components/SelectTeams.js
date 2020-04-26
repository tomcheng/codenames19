import React from "react";
import PropTypes from "prop-types";

const SelectTeams = ({ users }) => {
  return (
    <div>
      <div>
        {users.map(({ id, name }) => (
          <div key={id}>{name}</div>
        ))}
      </div>
    </div>
  );
};

SelectTeams.propTypes = {
  users: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default SelectTeams;
