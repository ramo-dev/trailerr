import { useEffect } from "react";
import { useAuth } from "../store/store";
import { account, googleProvider } from "../utils/firebase";
import { signInWithPopup } from "firebase/auth";


const useAuthState = () => {
  const { user, loading, error, setUser, login, logout, register, setError } = useAuth();

  useEffect(() => {
    const unsub = account?.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null)
        setError("Unable to verify");
      }
    })

    return () => unsub();
  }, [setUser]);

  async function signInWithGoogle() {
    const result = await signInWithPopup(account, googleProvider);
    if (result) {
      setUser(result.user);
    } else {
      setUser(null);
      setError("Error Signing in with Google")
    }
  }

  return { user, loading, error, setUser, login, logout, register, signInWithGoogle }
};



export default useAuthState;
