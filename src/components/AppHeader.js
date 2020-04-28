import React from "react";
import PropTypes from "prop-types";
import Box from "./Box";
import { Grid, GridItem } from "./Grid";
import Text from "./Text";

const AppHeader = ({ roomCode }) => {
  return (
    <Box pad="tight" padX="normal">
      <Grid align="center" spacing="normal">
        <GridItem flexible>
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
    </Box>
  );
};

AppHeader.propTypes = {
  roomCode: PropTypes.string,
};

export default AppHeader;
