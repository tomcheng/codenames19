import React, { useState } from "react";
import PropTypes from "prop-types";
import countBy from "lodash/countBy";
import range from "lodash/range";
import Box from "./Box";
import Checkbox from "./Checkbox";
import DocumentWrapper from "./DocumentWrapper";
import Text from "./Text";
import DocumentSubmit from "./DocumentSubmit";

const SelectTeams = ({ users, onSelectTeam, onSetTeams }) => {
  const [error, setError] = useState(null);
  const playersNeeded = Math.max(4 - users.length);
  const counts = countBy(users, "team");

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
            {users.map(({ id, name, team }) => (
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
                      onSelectTeam({ userID: id, team: "A" });
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
                      onSelectTeam({ userID: id, team: "B" });
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
          onSetTeams();
        }}
      />
    </div>
  );
};

SelectTeams.propTypes = {
  users: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      team: PropTypes.string,
    })
  ).isRequired,
  onSelectTeam: PropTypes.func.isRequired,
  onSetTeams: PropTypes.func.isRequired,
};

export default SelectTeams;
