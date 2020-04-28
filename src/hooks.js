import { useCallback, useState } from "react";

export const useStoredState = (key, defaultValue = null) => {
  const rawItem = localStorage.getItem(key);
  const [item, setItem] = useState(rawItem ? JSON.parse(rawItem) : defaultValue);

  const setAndStore = useCallback(
    (newItem) => {
      setItem(newItem);
      localStorage.setItem(key, JSON.stringify(newItem));
    },
    [key, setItem]
  );

  return [item, setAndStore];
};
