import PropTypes from "prop-types";
import styled from "styled-components";
import { BORDER_COLOR } from "../tokens";

const SPACING = {
  "x-tight": "4px",
  tight: "8px",
  normal: "16px",
  loose: "24px",
  "x-loose": "32px",
};

const Box = styled.div`
  align-items: ${(props) => props.alignItems};
  border: ${(props) => props.border && `1px solid ${BORDER_COLOR}`};
  border-bottom: ${(props) =>
    props.borderBottom && `1px solid ${BORDER_COLOR}`};
  border-left: ${(props) => props.borderLeft && `1px solid ${BORDER_COLOR}`};
  border-right: ${(props) => props.borderRight && `1px solid ${BORDER_COLOR}`};
  border-top: ${(props) => props.borderTop && `1px solid ${BORDER_COLOR}`};
  display: ${(props) => (props.flex ? "flex" : null)};
  flex-direction: ${(props) => props.flexDirection};
  flex-grow: ${(props) => (props.flexible ? 1 : null)};
  flex-shrink: ${(props) => (props.flexible ? 1 : null)};
  justify-content: ${(props) => props.justifyContent};
  opacity: ${(props) => typeof props.opacity === "number" && props.opacity};
  padding: ${(props) => SPACING[props.pad]};
  padding-left: ${(props) => SPACING[props.padLeft || props.padX]};
  padding-right: ${(props) => SPACING[props.padRight || props.padX]};
  padding-top: ${(props) => SPACING[props.padTop || props.padY]};
  padding-bottom: ${(props) => SPACING[props.padBottom || props.padY]};
  text-align: ${(props) => props.textAlign};
  width: ${(props) =>
    typeof props.width === "number" ? `${props.width}px` : props.width};
`;

Box.propTypes = {
  alignItems: PropTypes.oneOf(["center"]),
  border: PropTypes.bool,
  borderTop: PropTypes.bool,
  borderBottom: PropTypes.bool,
  borderLeft: PropTypes.bool,
  borderRight: PropTypes.bool,
  flex: PropTypes.bool,
  flexDirection: PropTypes.oneOf(["column", "row"]),
  flexible: PropTypes.bool,
  justifyContent: PropTypes.oneOf(["center", "space-between"]),
  opacity: PropTypes.number,
  pad: PropTypes.oneOf(["x-tight", "tight", "normal", "loose", "x-loose"]),
  padX: PropTypes.oneOf(["x-tight", "tight", "normal", "loose", "x-loose"]),
  padY: PropTypes.oneOf(["x-tight", "tight", "normal", "loose", "x-loose"]),
  padLeft: PropTypes.oneOf(["x-tight", "tight", "normal", "loose", "x-loose"]),
  padRight: PropTypes.oneOf(["x-tight", "tight", "normal", "loose", "x-loose"]),
  padTop: PropTypes.oneOf(["x-tight", "tight", "normal", "loose", "x-loose"]),
  padBottom: PropTypes.oneOf([
    "x-tight",
    "tight",
    "normal",
    "loose",
    "x-loose",
  ]),
  textAlign: PropTypes.oneOf(["center"]),
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default Box;
