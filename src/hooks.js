import { useCallback, useState } from "react";

export const useStoredState = (key, defaultValue = null) => {
  let parsedItem;
  try {
    parsedItem = JSON.parse(localStorage.getItem(key));
  } catch (e) {
    parsedItem = defaultValue;
  }
  const [item, setItem] = useState(parsedItem);

  const setAndStore = useCallback(
    (newItem) => {
      setItem(newItem);
      localStorage.setItem(key, JSON.stringify(newItem));
    },
    [key, setItem]
  );

  return [item, setAndStore];
};
