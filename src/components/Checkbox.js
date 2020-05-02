import React from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckSquare, faSquare } from "@fortawesome/free-regular-svg-icons";
import { Grid, GridItem } from "./Grid";
import Text from "./Text";

const Checkbox = ({ checked, label }) => {
  const icon = <FontAwesomeIcon icon={checked ? faCheckSquare : faSquare} />;

  return label ? (
    <Grid align="center" spacing="tight">
      <GridItem>{icon}</GridItem>
      <GridItem>
        <Text preset="label">{label}</Text>
      </GridItem>
    </Grid>
  ) : (
    icon
  );
};

Checkbox.propTypes = {
  checked: PropTypes.bool,
  label: PropTypes.string,
};

export default Checkbox;
