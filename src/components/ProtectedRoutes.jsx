
import { Navigate } from "react-router-dom";
import useAuthState from "../hooks/useAuth";
import Loader from "./Loading";

const ProtectedRoute = ({ children }) => {
  //Get object of current user and loading state
  const { user, loading } = useAuthState();

  //show loading state if user info is still fetching
  if (loading) {
    return <Loader />
  }

  //If no user and loading state is false, then redirect user to login page
  if (!user && !loading) {
    return <Navigate to="/login" />;
  }

  //If user is logged in, then make private routes accessible
  return children;
};

export default ProtectedRoute;
