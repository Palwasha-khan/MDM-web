import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { admin, checkingSession } = useAuth();

  if (checkingSession) {
    return <p>Loading...</p>;  
  }

  if (!admin) {
    return <Navigate to="/login" replace />;
  }

  return children;
}