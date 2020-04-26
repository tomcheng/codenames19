import PropTypes from "prop-types";
import styled from "styled-components";

const getPresetStyles = (props) => {
  switch (props.preset) {
    case "label":
      return `
  font-family: "Roboto", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 13px;
`;
    case "app-title":
      return `
  font-size: 15px;
  font-weight: bold;
  letter-spacing: 3px;
  text-transform: uppercase;
`;
    case "document-title":
      return `  
  font-family: "Roboto", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-weight: 700;
  font-size: 15px;
  text-transform: uppercase;
`;
    default:
      return "";
  }
};

const Text = styled.div`
  display: block;
  font-weight: normal;
  letter-spacing: 0;
  font-size: 17px;
  ${getPresetStyles};
  color: ${(props) => (props.color === "danger" ? "#bf0000" : null)};
  flex-grow: ${props => props.flexible ? 1 : null};
  flex-shrink: ${props => props.flexible ? 1 : null};
`;

Text.propTypes = {
  preset: PropTypes.oneOf(["app-title", "document-title", "label"]).isRequired,
  color: PropTypes.oneOf(["danger"]),
  flexible: PropTypes.bool,
};

export default Text;
