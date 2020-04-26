import React from "react";
import PropTypes from "prop-types";
import Box from "./Box";
import Text from "./Text";
import Button from "./Button";
import Checkbox from "./Checkbox";

const SelectSpyMaster = ({
  spymasters,
  users,
  userID,
  onLockInSpyMaster,
  onSelectSpyMaster,
}) => {
  const user = users.find((u) => u.id === userID);
  const myTeam = users.filter((u) => u.team === user.team);

  return (
    <Box border>
      <Box borderBottom pad="tight" padY="normal">
        <Text preset="label">Agent</Text>
      </Box>
      <Box padY="tight" borderBottom>
        {myTeam.map(({ id, name }) => (
          <Box
            key={id}
            pad="tight"
            onClick={() => {
              if (spymasters[user.team].userID === id) {
                return;
              }
              onSelectSpyMaster({ userID: id });
            }}
          >
            <Checkbox
              checked={spymasters[user.team].userID === id}
              label={name}
            />
          </Box>
        ))}
      </Box>
      <Box alignItems="center" flex pad="tight" padY="normal">
        <Box flexible />
        <Button onClick={onLockInSpyMaster}>SUBMIT</Button>
      </Box>
    </Box>
  );
};

SelectSpyMaster.propTypes = {
  spymasters: PropTypes.shape({
    A: PropTypes.shape({
      lockedIn: PropTypes.bool.isRequired,
      userID: PropTypes.string,
    }).isRequired,
    B: PropTypes.shape({
      lockedIn: PropTypes.bool.isRequired,
      userID: PropTypes.string,
    }).isRequired,
  }).isRequired,
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
