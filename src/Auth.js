// Auth.js
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    // Initial verification only once on mount
    const verifyUser = async () => {
      try {
        const res = await axios.get("https://trading-backend-tf3j.onrender.com/api/v1/auth/verify", {
          withCredentials: true,
        });
        if (res.data.authenticated) {
          setUser(res.data.user);
        }
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    verifyUser();
  }, []);

  useEffect(() => {
    // Theme application on theme change
    if (theme === "dark") {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const logout = async () => {
    try {
      const res = await axios.post(
        "https://trading-backend-tf3j.onrender.com/api/v1/auth/logout",
        {},
        { withCredentials: true }
      );

      toast.success(res.data.message || "Logged out successfully");
    } catch (err) {
      console.error("Logout request failed:", err);
      // Still show a message, as we will clear the state locally anyway
      toast.info("Session ended locally.");
    } finally {
      // Always clear user state and reload to ensure a clean slate
      setTimeout(() => {
        setUser(null);
        window.location.reload();
      }, 800);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, theme, toggleTheme, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);