import PropTypes from "prop-types";
import styled from "styled-components";
import { BORDER_COLOR } from "../tokens";

const SPACING_Y = {
  tight: "4px",
  normal: "8px",
};

const Box = styled.div`
  align-items: ${(props) => props.alignItems};
  border: ${(props) => props.border && `1px solid ${BORDER_COLOR}`};
  border-bottom: ${(props) =>
    props.borderBottom && `1px solid ${BORDER_COLOR}`};
  border-left: ${(props) => props.borderLeft && `1px solid ${BORDER_COLOR}`};
  border-right: ${(props) => props.borderRight && `1px solid ${BORDER_COLOR}`};
  display: ${(props) => (props.flex ? "flex" : null)};
  flex-direction: ${(props) => props.flexDirection};
  flex-grow: ${(props) => (props.flexible ? 1 : null)};
  flex-shrink: ${(props) => (props.flexible ? 1 : null)};
  justify-content: ${(props) => props.justifyContent};
  opacity: ${(props) => typeof props.opacity === "number" && props.opacity};
  padding: ${(props) => (props.pad === "tight" ? "4px 8px" : null)};
  padding-top: ${(props) => SPACING_Y[props.padTop || props.padY]};
  padding-bottom: ${(props) => SPACING_Y[props.padBottom || props.padY]};
  text-align: ${(props) => props.textAlign};
  width: ${(props) =>
    typeof props.width === "number" ? `${props.width}px` : props.width};
`;

Box.propTypes = {
  alignItems: PropTypes.oneOf(["center"]),
  border: PropTypes.bool,
  borderBottom: PropTypes.bool,
  borderLeft: PropTypes.bool,
  borderRight: PropTypes.bool,
  flex: PropTypes.bool,
  flexDirection: PropTypes.oneOf(["column", "row"]),
  flexible: PropTypes.bool,
  justifyContent: PropTypes.oneOf(["center", "space-between"]),
  opacity: PropTypes.number,
  pad: PropTypes.oneOf(["tight", "normal"]),
  padY: PropTypes.oneOf(["tight", "normal"]),
  padBottom: PropTypes.oneOf(["tight", "normal"]),
  textAlign: PropTypes.oneOf(["center"]),
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default Box;
