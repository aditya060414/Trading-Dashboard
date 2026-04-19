import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import Home from "./components/Home";
import ProtectedRoute from "./ProtectedRoute";
import { AuthProvider, useAuth } from "./Auth";
import AuthLayout from "./components/AuthLayout";
import { Navigate } from "react-router-dom";
import { LoaderCircle } from "lucide-react";

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="load-circle">
        <LoaderCircle className="spinner" />
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={user ? <Navigate to="" replace /> : <AuthLayout />}
      />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);