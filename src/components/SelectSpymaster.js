import React, { useState } from "react";
import PropTypes from "prop-types";
import Box from "./Box";
import Checkbox from "./Checkbox";
import DocumentWrapper from "./DocumentWrapper";
import Text from "./Text";
import DocumentSubmit from "./DocumentSubmit";

const SelectSpymaster = ({
  chosenSpymaster,
  users,
  userID,
  onSelectSpymaster,
}) => {
  const [error, setError] = useState(null);
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
                <Checkbox
                  checked={id === (chosenSpymaster || selectedUserID)}
                  label={name}
                />
              </Box>
            ))}
          </Box>
        </Box>
      </DocumentWrapper>
      <DocumentSubmit
        disabled={!!chosenSpymaster}
        error={error}
        message={chosenSpymaster ? "Awaiting the enemy's decision..." : null}
        onSubmit={() => {
          if (!selectedUserID) {
            setError("A selection is required");
            return;
          }
          setError(null);
          onSelectSpymaster({ userID: selectedUserID });
        }}
      />
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
  yourSpymasterChosen: PropTypes.bool.isRequired,
  onSelectSpymaster: PropTypes.func.isRequired,
  chosenSpymaster: PropTypes.string,
};

export default SelectSpymaster;
