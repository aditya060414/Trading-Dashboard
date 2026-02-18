import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:3002/me", { withCredentials: true })
      .then((res) => {
        setAuth(res.data.authenticated);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;

  return auth ? children : <Navigate to="/login" replace />;
}
