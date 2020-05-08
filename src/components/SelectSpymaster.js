import React, { useState } from "react";
import PropTypes from "prop-types";
import Box from "./Box";
import Checkbox from "./Checkbox";
import DocumentWrapper from "./DocumentWrapper";
import Text from "./Text";
import DocumentSubmit from "./DocumentSubmit";

const SelectSpymaster = ({ playerID, players, onSelectSpymaster }) => {
  const [error, setError] = useState(null);
  const [selectedUserID, setSelectedUserID] = useState(null);
  const player = players[playerID];
  const myTeam = Object.values(players).filter((p) => p.team === player.team);
  const yourSpymaster = Object.values(players).find(
    (p) => p.spymaster && p.team === player.team
  );

  return (
    <div>
      <DocumentWrapper title="Spy Nomination Form">
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
                  checked={id === (yourSpymaster?.id || selectedUserID)}
                  label={name}
                />
              </Box>
            ))}
          </Box>
        </Box>
      </DocumentWrapper>
      <DocumentSubmit
        disabled={!!yourSpymaster}
        error={yourSpymaster ? null : error}
        message={yourSpymaster ? "Awaiting the enemy's decision..." : null}
        onSubmit={() => {
          if (!selectedUserID) {
            setError("A selection is required");
            return;
          }
          setError(null);
          onSelectSpymaster({ playerID: selectedUserID });
        }}
      />
    </div>
  );
};

SelectSpymaster.propTypes = {
  playerID: PropTypes.string.isRequired,
  players: PropTypes.objectOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      spymaster: PropTypes.bool.isRequired,
    })
  ).isRequired,
  onSelectSpymaster: PropTypes.func.isRequired,
};

export default SelectSpymaster;
