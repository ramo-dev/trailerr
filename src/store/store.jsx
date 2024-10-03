
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { create } from "zustand";
import { account, db } from "../utils/firebase";
import { doc, setDoc, deleteDoc, collection, onSnapshot } from "firebase/firestore";


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


const useMovieStore = create((set, get) => ({
  movies: [],
  loading: false,
  error: null,
  isAdded: false,
  setError: (error) => set({ error }),


  addMovie: async (userId, movie) => {
    set({ loading: true, error: null, isAdded: false });
    try {
      const existingMovies = get().movies;
      const movieExists = existingMovies.some((m) => m.id === movie.id);

      if (movieExists) {
        set({ error: "Movie already added", loading: false });
        return;
      }

      const movieRef = doc(db, "users", userId, "movies", movie.id.toString());
      await setDoc(movieRef, movie);

      set((state) => ({
        movies: [...state.movies, movie],
        loading: false,
        isAdded: true,
      }));

      // Fetch movies again to sync with Firestore
      get().fetchMovies(userId);

    } catch (error) {
      set({ error: error.message, loading: false, isAdded: false });
    }
  },

  removeMovie: async (userId, movieId) => {
    set({ loading: true, error: null });  // Start loading and clear errors
    try {
      // Reference to the document to be deleted
      // console.log(movieId)
      const movieRef = doc(db, "users", userId, "movies", movieId.toString());
      //console.log(movieRef);
      // Delete the document from Firestore
      await deleteDoc(movieRef);

      // Check if the document was actually deleted by checking Firestore
      const existingMovies = get().movies;
      const movieExists = existingMovies.some((m) => m.id === movieId);

      if (!movieExists) {
        //  console.log("Movie not found in the store:", movieId);
        return; // Exit if the movie was not found
      }

      // Update the local state by filtering out the deleted movie
      set((state) => ({
        movies: state.movies.filter((m) => m.id !== movieId),
        loading: false,
      }));

      //console.log("Movie removed successfully from Firestore and state:", movieId);

    } catch (error) {
      //console.error("Error removing movie:", error);
      set({ error: error.message, loading: false });
    }
  },

  fetchMovies: (userId) => {
    set({ loading: true, error: null });

    try {
      const moviesCollection = collection(db, "users", userId, "movies");

      // Listen for real-time updates
      onSnapshot(moviesCollection, (snapshot) => {
        const movies = snapshot.docs.map((doc) => doc.data());

        set({ movies, loading: false }); // Update the movies array in state
        //console.log("Movies updated in real-time:", movies);
      });

    } catch (error) {
      //console.error("Error fetching movies in real-time:", error);
      set({ error: error.message, loading: false });
    }
  },
  clearMovies: () => {
    //console.log("Clearing movies...");
    set({ movies: [] });
  },
}));

export { useThemeStore, useAuth, useMovieStore };

