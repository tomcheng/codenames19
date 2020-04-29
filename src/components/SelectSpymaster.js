import React, { useState } from "react";
import PropTypes from "prop-types";
import Box from "./Box";
import Button from "./Button";
import Checkbox from "./Checkbox";
import DocumentWrapper from "./DocumentWrapper";
import Text from "./Text";

const SelectSpymaster = ({ users, userID, onSelectSpymaster }) => {
  const [selectedUserID, setSelectedUserID] = useState(null);
  const user = users.find((u) => u.id === userID);
  const myTeam = users.filter((u) => u.team === user.team);

  return (
    <div>
      <DocumentWrapper title="Spy Master Nomination Form">
        <Box border>
          <Box borderBottom pad="tight">
            <Text preset="label">Agents</Text>
          </Box>
          <Box padY="x-tight">
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
        </Box>
      </DocumentWrapper>
      <Box flex justifyContent="center">
        <Button
          onClick={() => {
            if (!selectedUserID) return;
            onSelectSpymaster({ userID: selectedUserID });
          }}
        >
          Submit
        </Button>
      </Box>
    </div>
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
