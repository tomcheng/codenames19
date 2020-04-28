import React from "react";
import PropTypes from "prop-types";
import Box from "./Box";
import Button from "./Button";
import Checkbox from "./Checkbox";
import Text from "./Text";

const SelectTeams = ({ users, onSelectTeam, onSetTeams }) => {
  return (
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
      <Box borderBottom padY="x-tight">
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
      </Box>
      <Box alignItems="center" flex pad="tight">
        <Box flexible />
        <Button onClick={onSetTeams}>Submit</Button>
      </Box>
    </Box>
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
