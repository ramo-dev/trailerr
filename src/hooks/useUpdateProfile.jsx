import { account } from "../utils/firebase";
import { useAuth } from "../store/store";
import { EmailAuthProvider, reauthenticateWithCredential, updateEmail, updatePassword, updateProfile } from "firebase/auth";
import useAuthState from "./useAuth";

const useUpdateProfile = () => {
  const { setUser, setError, error } = useAuth();
  const { user } = useAuthState();


  async function deleteAccount(password) {
    try {

      const credential = EmailAuthProvider.credential(user.email, password);

      // Reauthenticate user
      await reauthenticateWithCredential(user, credential);

      // Delete user account
      await user.delete();
      setUser(null);

      return { success: true };
    } catch (err) {
      setError("Invalid Email or Password");
      return { success: false, message: err.message };
    }
  }



  async function updateDetails(displayName) {
    try {
      if (displayName) {
        await updateProfile(user, { displayName });
      }

      return { success: true, message: "Profile updated successfully" };
    } catch (err) {
      return { success: false, message: "Error updating profile", error: err.message };
    }
  }


  return { deleteAccount, error, updateDetails };
};

export default useUpdateProfile;
