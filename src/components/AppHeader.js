import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Grid, GridItem } from "./Grid";
import Text from "./Text";

const Container = styled.div`
  padding: 10px 20px;
`;

const AppHeader = ({ roomCode }) => {
  return (
    <Container>
      <Grid align="center">
        <GridItem isFlexible>
          <Text preset="app-title">Codenames-19.</Text>
        </GridItem>
        {roomCode && (
          <GridItem>
            <Grid spacing="tight">
              <GridItem>
                <Text preset="label">Mission Code:</Text>
              </GridItem>
              <GridItem>{roomCode}</GridItem>
            </Grid>
          </GridItem>
        )}
      </Grid>
    </Container>
  );
};

AppHeader.propTypes = {
  roomCode: PropTypes.string,
};

export default AppHeader;
