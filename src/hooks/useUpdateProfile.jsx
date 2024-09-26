import { account } from "../utils/firebase";
import { useAuth } from "../store/store";
import { EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";

const useUpdateProfile = () => {
  const { setUser, setError, error } = useAuth();

  async function deleteAccount(password) {
    try {
      const user = account.currentUser;
      if (!user) throw new Error("No user is logged in");

      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, credential);

      await user.delete();
      setUser(null);
    } catch (err) {
      setError(err.message);
    }
  }

  return { deleteAccount, error };
};

export default useUpdateProfile;
