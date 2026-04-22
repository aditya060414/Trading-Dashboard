
import { useState, useEffect } from "react";
import SignUp from "./SignUp";
import Login from "./Login";
import Button from "@mui/material/Button";
import { Sun, Moon } from 'lucide-react';

export default function AuthLayout() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const theme = localStorage.getItem("theme");

    if (theme === "dark") {
      setDark(true);
      document.body.classList.add("dark");
    } else {
      setDark(false);
      document.body.classList.remove("dark");
    }
  }, []);

  const handleTheme = () => {
    const newTheme = !dark;

    setDark(newTheme);

    if (newTheme) {
      document.body.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };
  const handleButtonClick = () => {
    setIsSignUp(!isSignUp);
  };
  return (
    <>
      <div className="auth-layout">
          <button onClick={handleTheme} className="theme-button-auth">{!dark ? <Sun className="lightheme" /> : <Moon className="darktheme" />}</button>
        <div className="auth-layout-container">
          <div className="authbrandf-info">
            <h4 className="brand-logo">Market<span>Ex</span></h4>
            <div className="brand-tagline">
              <p>Smart.&nbsp;Secure.&nbsp;Confident Trading.</p>
            </div>
            <div className="brand-bio">
              <p>
                A modern trading platform built for long-term investors and
                active traders
              </p>
            </div>
            <div className="graph-img">
              <img src="media/graph.png" alt="graph-image" />
            </div>
          </div>
          <div className="signup-login toggle">
            {isSignUp ? <SignUp /> : <Login />}
            <Button variant="contained" onClick={handleButtonClick} className="toggle-Btn">
              {isSignUp ? "Login" : "SignUp"}
            </Button>
            {isSignUp ? <p className="toggle-text">Already have an account?</p> : <p className="toggle-text">Forgot Password?</p>}
          </div>
        </div>
      </div>
    </>
  );
}
