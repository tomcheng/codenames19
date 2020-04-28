import React, { useState } from "react";
import PropTypes from "prop-types";
import Box from "./Box";
import Text from "./Text";
import Button from "./Button";
import Checkbox from "./Checkbox";

const SelectSpymaster = ({ users, userID, onSelectSpymaster }) => {
  const [selectedUserID, setSelectedUserID] = useState(null);
  const user = users.find((u) => u.id === userID);
  const myTeam = users.filter((u) => u.team === user.team);

  return (
    <Box border>
      <Box borderBottom pad="tight">
        <Text preset="label">Agent</Text>
      </Box>
      <Box padY="x-tight" borderBottom>
        {myTeam.map(({ id, name }) => (
          <Box
            key={id}
            padX="tight"
            padY="x-tight"
            onClick={() => {
              setSelectedUserID(id);
            }}
          >
            <Checkbox checked={id === selectedUserID} label={name} />
          </Box>
        ))}
      </Box>
      <Box alignItems="center" flex pad="tight">
        <Box flexible />
        <Button
          onClick={() => {
            if (!selectedUserID) return;
            onSelectSpymaster({ userID: selectedUserID });
          }}
        >
          Submit
        </Button>
      </Box>
    </Box>
  );
};

SelectSpymaster.propTypes = {
  userID: PropTypes.string.isRequired,
  users: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  onSelectSpymaster: PropTypes.func.isRequired,
};

export default SelectSpymaster;
