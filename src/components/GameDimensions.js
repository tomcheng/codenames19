import React, { useEffect, useState } from "react";
import clamp from "lodash/clamp";

const getDimensions = () => {
  const width = window.innerWidth;
  const lineLength = width / 8 - 2;
  const keyWidth = clamp(Math.floor((width - 6) / 10), 36, 56);

  return { keyWidth, lineLength };
};

const GameDimensions = React.createContext(getDimensions());

export const GameDimensionsProvider = ({ children }) => {
  const [dimensions, setDimensions] = useState(getDimensions());

  useEffect(() => {
    const handleResize = () => {
      setDimensions(getDimensions());
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [setDimensions]);

  return (
    <GameDimensions.Provider value={dimensions}>
      {children}
    </GameDimensions.Provider>
  );
};

export const GameDimensionsConsumer = GameDimensions.Consumer;
