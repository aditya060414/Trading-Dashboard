
import { useState } from "react";
import SignUp from "./SignUp";
import Login from "./Login";
import Button from "@mui/material/Button";

export default function AuthLayout() {
  const [isSignUp, setIsSignUp] = useState(false);
  const handleButtonClick = () => {
    setIsSignUp(!isSignUp);
  };
  return (
    <>
      <div className="auth-layout">
        <div className="auth-layout-container">
          <div className="authbrandf-info">
            <h4>MarketEx</h4>
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
            <p>Forgot Password?</p>
          </div>
        </div>
      </div>
    </>
  );
}
