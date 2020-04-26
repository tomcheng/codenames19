import PropTypes from "prop-types";
import styled from "styled-components";
import { BORDER_COLOR } from "../tokens";

const Box = styled.div`
  border: ${(props) => props.border && `1px solid ${BORDER_COLOR}`};
  border-bottom: ${(props) =>
    props.borderBottom && `1px solid ${BORDER_COLOR}`};
  border-left: ${(props) => props.borderLeft && `1px solid ${BORDER_COLOR}`};
  border-right: ${(props) => props.borderRight && `1px solid ${BORDER_COLOR}`};
  opacity: ${(props) => typeof props.opacity === "number" && props.opacity};
  padding: ${(props) => (props.pad === "tight" ? "4px 8px" : null)};
  padding-top: ${(props) => (props.padY === "normal" ? "8px" : null)};
  padding-bottom: ${(props) => (props.padY === "normal" ? "8px" : null)};
  width: ${(props) =>
    typeof props.width === "number" ? `${props.width}px` : props.width};
`;

Box.propTypes = {
  border: PropTypes.bool,
  borderBottom: PropTypes.bool,
  borderLeft: PropTypes.bool,
  borderRight: PropTypes.bool,
  opacity: PropTypes.number,
  pad: PropTypes.oneOf(["tight", "normal"]),
  padY: PropTypes.oneOf(["tight", "normal"]),
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default Box;
