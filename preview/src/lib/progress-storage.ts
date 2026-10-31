import { create } from "zustand";
import type { StateStorage } from "zustand/middleware";

export const useProgressStorage = create<{ status: "idle" | "saved" | "error" }>(() => ({ status: "idle" }));

// Storage failure must not throw from an input handler or hide the in-memory draft.
export const progressStorage: StateStorage = {
  getItem(name) {
    try { return localStorage.getItem(name); }
    catch { useProgressStorage.setState({ status: "error" }); return null; }
  },
  setItem(name, value) {
    try {
      localStorage.setItem(name, value);
      useProgressStorage.setState({ status: "saved" });
    } catch { useProgressStorage.setState({ status: "error" }); }
  },
  removeItem(name) {
    try { localStorage.removeItem(name); }
    catch { useProgressStorage.setState({ status: "error" }); }
  },
};
