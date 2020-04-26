import React from "react";
import PropTypes from "prop-types";
import Box from "./Box";

const SelectSpyMaster = ({
  users,
  userID,
  onLockInSpyMaster,
  onSelectSpyMaster,
}) => {
  const user = users.find((u) => u.id === userID);
  const myTeam = users.filter((u) => u.team === user.team);

  return (
    <Box border>
      {myTeam.map(({ id, name, isSpyMaster }) => (
        <div key={id}>{name}</div>
      ))}
    </Box>
  );
};

SelectSpyMaster.propTypes = {
  userID: PropTypes.string.isRequired,
  users: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  onLockInSpyMaster: PropTypes.func.isRequired,
  onSelectSpyMaster: PropTypes.func.isRequired,
};

export default SelectSpyMaster;
