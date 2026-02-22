import { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
export default function Summary() {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);
  useEffect(() => {
    axios
      .get("http://localhost:3002/verify", { withCredentials: true })
      .then((res) => {
        if (!res.data.authenticated) {
          navigate("/login", { replace: true });
        } else {
          setUserDetails(res.data.user);
        }
      })
      .catch(() => {
        navigate("/login", { replace: true });
      });
  }, []);
  return (
    <div className="dashboard-container">
      <div className="dashboard-user">
        <h2>{userDetails?.username}</h2>
      </div>
      <div className="portfolio">
        <h5 style={{ fontWeight: "300" }}>Equity</h5>
        <div className="dashboard-mini-container">
          <div className="margin-available">
            <p style={{ fontSize: "2rem" }}>3.74K</p>
            <p style={{ fontSize: "0.9rem" }} className="text-muted">
              Margin Available
            </p>
          </div>
          <div className="margin-used">
            <p>margins used 0</p>

            <p>opening balance : 3.74k</p>
          </div>
        </div>
      </div>
      <div className="dashboard-holdings">
        <h5 style={{ fontWeight: "300" }}>Holdings</h5>
        <div className="dashboard-mini-container">
          <div className="margin-available">
            <div className="profit-loss">
              <p style={{ fontSize: "2rem", color: "#4CAF50" }}>1.55K</p>
              <p
                style={{ fontSize: "0.7rem", color: "#4CAF50" }}
                className="percentage"
              >
                +5.20%
              </p>
            </div>
            <p style={{ fontSize: "0.9rem" }} className="text-muted">
              P&L
            </p>
          </div>
          <div className="value">
            <p>current value 31.43k</p>
            <p>investment 29.88k</p>
          </div>
        </div>
      </div>
    </div>
  );
}
