import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("yappy-theme") || "coffee",
  setTheme: (theme) => {
    localStorage.setItem("yappy-theme", theme);
    set({ theme });
  },
}));
