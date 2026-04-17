import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "./Auth";
import { LoaderCircle } from "lucide-react";
export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState(false);
  const { setUser } = useAuth();

  useEffect(() => {
    axios
      .get("http://localhost:3002/api/v1/auth/verify", {
        withCredentials: true,
      })
      .then((res) => {
        setAuth(res.data.authenticated);
        if (res.data.authenticated) {
          setUser(res.data.user);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="load-circle">
        <LoaderCircle className="spinner" />
      </div>
    );

  return auth ? children : <Navigate to="/login" replace />;
}
