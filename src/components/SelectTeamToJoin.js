import React, { useState } from "react";
import PropTypes from "prop-types";
import DocumentWrapper from "./DocumentWrapper";
import Box from "./Box";
import Text from "./Text";
import Checkbox from "./Checkbox";
import { Grid, GridItem } from "./Grid";
import DocumentSubmit from "./DocumentSubmit";

const SelectTeamToJoin = ({ playerID, players, onSetTeam }) => {
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [error, setError] = useState(null);

  return (
    <div>
      <DocumentWrapper title="Select Your Allegiance">
        <Box border flex>
          <Box
            pad="normal"
            flexible
            borderRight
            onClick={() => {
              setSelectedTeam("A");
            }}
          >
            <Grid spacing="tight">
              <GridItem>
                <Checkbox checked={selectedTeam === "A"} />
              </GridItem>
              <GridItem flexible>
                <Box>
                  <Text preset="label" bold>
                    Group A
                  </Text>
                  {Object.values(players)
                    .filter((u) => u.team === "A")
                    .map((user) => (
                      <Text key={user.id} preset="label">
                        {user.name}
                      </Text>
                    ))}
                </Box>
              </GridItem>
            </Grid>
          </Box>
          <Box
            pad="normal"
            flexible
            onClick={() => {
              setSelectedTeam("B");
            }}
          >
            <Grid spacing="tight">
              <GridItem>
                <Checkbox checked={selectedTeam === "B"} />
              </GridItem>
              <GridItem flexible>
                <Box>
                  <Text preset="label" bold>
                    Group B
                  </Text>
                  {Object.values(players)
                    .filter((u) => u.team === "B")
                    .map((user) => (
                      <Text key={user.id} preset="label">
                        {user.name}
                      </Text>
                    ))}
                </Box>
              </GridItem>
            </Grid>
          </Box>
        </Box>
      </DocumentWrapper>
      <DocumentSubmit
        error={error}
        onSubmit={() => {
          if (!selectedTeam) {
            setError("A selection is required");
            return;
          }
          onSetTeam({ playerID, team: selectedTeam });
        }}
      />
    </div>
  );
};

SelectTeamToJoin.propTypes = {
  playerID: PropTypes.string.isRequired,
  players: PropTypes.objectOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      team: PropTypes.string,
    })
  ).isRequired,
  onSetTeam: PropTypes.func.isRequired,
};

export default SelectTeamToJoin;
