import React, { useState } from "react";
import PropTypes from "prop-types";
import countBy from "lodash/countBy";
import range from "lodash/range";
import size from "lodash/size";
import Box from "./Box";
import Checkbox from "./Checkbox";
import DocumentWrapper from "./DocumentWrapper";
import Text from "./Text";
import DocumentSubmit from "./DocumentSubmit";

const SelectTeams = ({ players, onLockTeams, onSetTeam }) => {
  const [error, setError] = useState(null);
  const playersNeeded = Math.max(4 - size(players), 0);
  const counts = countBy(players, "team");
  const usersWithNoTeams = Object.values(players).filter(
    (player) => !player.team
  );

  return (
    <div>
      <DocumentWrapper title="Declaration of Allegiances">
        <Box border>
          <Box borderBottom flex>
            <Box flexible pad="tight">
              <Text preset="label">Agent</Text>
            </Box>
            <Box pad="tight" textAlign="center" width={70}>
              <Text preset="label">Group A</Text>
            </Box>
            <Box pad="tight" textAlign="center" width={70}>
              <Text preset="label">Group B</Text>
            </Box>
          </Box>
          <Box padY="x-tight">
            {Object.values(players).map(({ id, name, team }) => (
              <Box key={id} flex>
                <Box flexible padX="tight" padY="x-tight">
                  <Text preset="label">{name}</Text>
                </Box>
                <Box
                  padX="tight"
                  padY="x-tight"
                  textAlign="center"
                  width={70}
                  onClick={() => {
                    if (team !== "A") {
                      onSetTeam({ playerID: id, team: "A" });
                    }
                  }}
                >
                  <Checkbox checked={team === "A"} />
                </Box>
                <Box
                  padX="tight"
                  padY="x-tight"
                  textAlign="center"
                  width={70}
                  onClick={() => {
                    if (team !== "B") {
                      onSetTeam({ playerID: id, team: "B" });
                    }
                  }}
                >
                  <Checkbox checked={team === "B"} />
                </Box>
              </Box>
            ))}
            {range(playersNeeded).map((num) => (
              <Box key={num} flex>
                <Box flexible padX="tight" padY="x-tight">
                  <Text preset="label" faded>
                    Awaiting...
                  </Text>
                </Box>
                <Box
                  faded
                  padX="tight"
                  padY="x-tight"
                  textAlign="center"
                  width={70}
                >
                  <Checkbox />
                </Box>
                <Box
                  faded
                  padX="tight"
                  padY="x-tight"
                  textAlign="center"
                  width={70}
                >
                  <Checkbox />
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </DocumentWrapper>
      <DocumentSubmit
        error={error}
        disabled={playersNeeded > 0}
        onSubmit={() => {
          if ((counts.A || 0) < 2) {
            setError("Insufficient numbers in Group A");
            return;
          }
          if ((counts.B || 0) < 2) {
            setError("Insufficient numbers in Group B");
            return;
          }
          if (usersWithNoTeams.length) {
            setError(
              `${usersWithNoTeams[0].name} has not been assigned a group`
            );
            return;
          }

          onLockTeams();
        }}
      />
    </div>
  );
};

SelectTeams.propTypes = {
  players: PropTypes.objectOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      team: PropTypes.string,
    })
  ).isRequired,
  onLockTeams: PropTypes.func.isRequired,
  onSetTeam: PropTypes.func.isRequired,
};

export default SelectTeams;
