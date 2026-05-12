import { StateCreator } from "zustand";

export type ThemeMode = "light" | "dark" | "system";

export interface ThemeSlice {
  themeMode: ThemeMode;
  setThemeMode: (themeMode: ThemeMode) => void;
  toggleTheme: () => void;
}

export const createThemeSlice: StateCreator<ThemeSlice> = (set, get) => ({
  themeMode: "system",
  setThemeMode: (themeMode) => set({ themeMode }),
  toggleTheme: () => {
    const current = get().themeMode;
    const next = current === "dark" ? "light" : current === "light" ? "dark" : "dark";
    set({ themeMode: next });
  },
});
