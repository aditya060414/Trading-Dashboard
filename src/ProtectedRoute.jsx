import { Navigate } from "react-router-dom";
import { useAuth } from "./Auth";
import { LoaderCircle } from "lucide-react";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="load-circle">
        <LoaderCircle className="spinner" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}