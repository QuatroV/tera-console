import { LocalStorageValues } from "./types";

class localStore {
  static set = (
    key: keyof LocalStorageValues,
    value: LocalStorageValues[keyof LocalStorageValues]
  ) => {
    localStorage.setItem(key, JSON.stringify(value));
  };
  static get = (key: keyof LocalStorageValues) => {
    const value = localStorage.getItem(key);
    if (!value) return null;
    try {
      return JSON.parse(value);
    } catch (e) {
      return value;
    }
  };
  static remove = (key: keyof LocalStorageValues) => {
    localStorage.removeItem(key);
  };
}

export default localStore;
