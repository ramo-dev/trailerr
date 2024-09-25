import { useEffect } from "react";
import { useAuth } from "../store/store";
import { account } from "../utils/firebase";


const useAuthState = () => {
  const { user, loading, error, setUser, login, logout, register } = useAuth();

  useEffect(() => {
    const unsub = account?.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null)
      }
    })

    return () => unsub();
  }, [setUser]);

  return { user, loading, error, setUser, login, logout, register }
};



//have to export it as hook function not result
export default useAuthState;
