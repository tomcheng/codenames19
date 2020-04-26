import React from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckSquare, faSquare } from "@fortawesome/free-regular-svg-icons";

const Checkbox = ({ checked }) => {
  return <FontAwesomeIcon icon={checked ? faCheckSquare : faSquare} />;
};

Checkbox.propTypes = {
  checked: PropTypes.bool.isRequired,
};

export default Checkbox;
