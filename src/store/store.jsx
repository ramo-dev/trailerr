
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { create } from "zustand";
import { account } from "../utils/firebase";

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

const useAuth = create((set) => ({
  user: null,
  loading: true,
  error: null,
  setError: (err) => set({ err }),
  setUser: (user) => set({ user, loading: false }),
  register: async (username, email, password) => {
    try {
      set({ loading: true, error: null })
      const userCredentials = await createUserWithEmailAndPassword(account, email, password);
      await updateProfile(userCredentials.user, { displayName: username })
      set({ loading: true, error: null })
    } catch (err) {
      set({ error: err.message, loading: false })
    }
  },
  login: async (email, password) => {
    try {
      set({ loading: true, error: null });
      const userCreate = await signInWithEmailAndPassword(account, email, password);
      set({ user: userCreate.user, loading: false })
    } catch (err) {
      set({ error: err.message, loading: false })
    }
  },
  logout: async () => {
    try {
      await account.signOut();
      set({ user: null, error: null })
    } catch (err) {
      set({ error: err.message })
    }
  }
}));

export { useThemeStore, useAuth };

