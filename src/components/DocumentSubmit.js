import React from "react";
import PropTypes from "prop-types";
import Box from "./Box";
import Button from "./Button";
import Text from "./Text";

const DocumentSubmit = ({ disabled, error, message, onSubmit }) => (
  <Box padBottom="x-loose">
    <Box flex justifyContent="center">
      <Button
        disabled={disabled}
        type={onSubmit ? "button" : "submit"}
        onClick={onSubmit}
      >
        Submit
      </Button>
    </Box>
    {error && (
      <Box textAlign="center" padTop="tight">
        <Text color="danger" preset="label">
          Error: {error}
        </Text>
      </Box>
    )}
    {message && (
      <Box textAlign="center" padTop="tight">
        <Text preset="label">{message}</Text>
      </Box>
    )}
  </Box>
);

DocumentSubmit.propTypes = {
  disabled: PropTypes.bool,
  error: PropTypes.string,
  message: PropTypes.string,
  onSubmit: PropTypes.func,
};

export default DocumentSubmit;
