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
    <div className="container-fluid dashboard-container">
      <div className="row">
        <div className="col-7 dashboard">
          <div className="dashboard-user">
            <h2>
              WELCOME,&nbsp;<span>{userDetails?.username}!</span>
            </h2>
          </div>
          <div className="mini-container">
            <div className="statistics">
              <div className="stats">
                <p className="header">Portfolio Value</p>
                <p>
                  price&nbsp;&nbsp;<span>24</span>
                </p>
              </div>
              <div className="stats">
                <p className="header">Todays's Gain</p>
                <p>gain</p>
              </div>
              <div className="stats">
                <p className="header">Available Cash</p>
                <p>price</p>
              </div>
            </div>
          </div>
        </div>
        <div className="col-5 dashboard">
          <h3>r</h3>
        </div>
      </div>
    </div>
  );
}
