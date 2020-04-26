import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Box from "./Box";
import Button from "./Button";
import Checkbox from "./Checkbox";
import Text from "./Text";

const Container = styled.div`
  max-width: 400px;
  padding-top: 50px;
  margin: 0 auto;
`;

const SelectTeams = ({ users, onSelectTeam }) => {
  return (
    <Container>
      <Box padBottom="normal" textAlign="center">
        <Text preset="document-title">Declaration of Allegiances</Text>
      </Box>
      <Box border>
        <Box borderBottom flex>
          <Box flexible pad="tight" padY="normal">
            <Text preset="label">Agent</Text>
          </Box>
          <Box pad="tight" padY="normal" textAlign="center" width={70}>
            <Text preset="label">Group A</Text>
          </Box>
          <Box pad="tight" padY="normal" textAlign="center" width={70}>
            <Text preset="label">Group B</Text>
          </Box>
        </Box>
        <Box borderBottom padY="tight">
          {users.map(({ id, name, team }) => (
            <Box key={id} flex>
              <Box flexible pad="tight">
                <Text preset="label">{name}</Text>
              </Box>
              <Box
                pad="tight"
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
                pad="tight"
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
        <Box alignItems="center" flex pad="tight" padY="normal">
          <Box flexible />
          <Button type="submit">SUBMIT</Button>
        </Box>
      </Box>
    </Container>
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
};

export default SelectTeams;
