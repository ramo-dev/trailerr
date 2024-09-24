
import { create } from "zustand";

const getInitalTheme = () => {
  const storedTheme = localStorage.getItem('theme');
  return storedTheme ? JSON.parse(storedTheme) : true;
}


const useThemeStore = create((set) => ({
  isDark: getInitalTheme(),
  toggleTheme: () => set((state) => {
    const newTheme = !state.isDark;
    localStorage.setItem("theme", JSON.stringify(newTheme));
    return { isDark: newTheme };
  }),
}));

export default useThemeStore;

