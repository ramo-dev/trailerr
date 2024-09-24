
import { create } from "zustand";


const useThemeStore = create((set) => ({
  isDark: true,
  toggleTheme: () => set((state) => ({
    isDark: !state.isDark
  })),
}));

export default useThemeStore;

