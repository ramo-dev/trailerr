
import { Navigate } from "react-router-dom";
import useAuthState from "../hooks/useAuth";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuthState();
  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
