import { useEffect } from "react";
import { useAuth } from "../store/store";
import { account, googleProvider } from "../utils/firebase";
import { signInWithPopup } from "firebase/auth";


const useAuthState = () => {
  //Get  actions and states from the authStore
  const { user, loading, error, setUser, login, logout, register, setError } = useAuth();

  //side effect to check whether user is logged in on component mount and update the user using the setUser func
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



  //Auth function to sign the user in with Google Popup
  async function signInWithGoogle() {
    const result = await signInWithPopup(account, googleProvider);
    if (result) {
      setUser(result.user);
    } else {
      setUser(null);
      setError("Error Signing in with Google")
    }
  }

  //Return the current state and functions to perform auth actions on user
  return { user, loading, error, setUser, login, logout, register, signInWithGoogle }
};



export default useAuthState;
