
import { Navigate } from "react-router-dom";
import useAuthState from "../hooks/useAuth";
import Loader from "./Loading";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuthState();
  if (loading) {
    return <Loader />
  }
  if (!user && !loading) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
