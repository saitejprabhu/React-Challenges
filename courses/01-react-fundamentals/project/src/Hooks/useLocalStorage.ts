import { useState } from "react";

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T | ((prev: T) => T)) => void] {
  const [value, setValue] = useState<T>(() => {
    try {
      const savedValue = localStorage.getItem(key);

      if (savedValue !== null) {
        return JSON.parse(savedValue);
      }

      return initialValue;
    } catch {
      return initialValue;
    }
  });

  const setStoredValue = (value: T | ((prev: T) => T)) => {
    setValue((prev) => {
      const newValue =
        typeof value === "function" ? (value as (prev: T) => T)(prev) : value;

      try {
        localStorage.setItem(key, JSON.stringify(newValue));
      } catch {
        // Ignore localStorage write errors
      }

      return newValue;
    });
  };

  return [value, setStoredValue];
}
