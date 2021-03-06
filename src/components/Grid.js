import React from "react";
import PropTypes from "prop-types";

const GridContext = React.createContext(null);

const SPACINGS = {
  tight: 8,
  normal: 16,
};

export const Grid = ({ align, spacing, children }) => {
  return (
    <GridContext.Provider value={spacing}>
      <div
        style={{
          display: "flex",
          alignItems: align,
          margin: `0 -${0.5 * SPACINGS[spacing]}px`,
        }}
      >
        {children}
      </div>
    </GridContext.Provider>
  );
};

Grid.propTypes = {
  spacing: PropTypes.oneOf(["tight", "normal"]).isRequired,
  align: PropTypes.oneOf(["center"]),
};

export const GridItem = ({ children, flexible }) => {
  return (
    <GridContext.Consumer>
      {(value) => (
        <div
          style={{
            padding: `0 ${0.5 * SPACINGS[value]}px`,
            flexBasis: flexible ? 0 : null,
            flexGrow: flexible ? 1 : null,
            flexShrink: flexible ? 1 : null,
          }}
        >
          {children}
        </div>
      )}
    </GridContext.Consumer>
  );
};

GridItem.propTypes = {
  flexible: PropTypes.bool,
};
