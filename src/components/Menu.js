import React from "react";
import { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../Auth";

export default function Menu({ onSelectStock }) {
  const notActiveMenu = "menu-links";
  const activeMenu = "menu-links-active";
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const {user} = useAuth();


  const handleButtonClick = () => {
    setOpen((prev) => !prev);
  };
  
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:3002/api/v1/auth/logout",
        {},
        { withCredentials: true },
      );

      navigate("/login", { replace: true });
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="menu-container">
      <div className="menu-logo">
        <h2>
          Market<span>Ex</span>
        </h2>
      </div>
      <div className="menu-items-top">
        <ul style={{ margin: "10px 2px 5px 0", padding: "0" }}>
          <li>
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                isActive ? activeMenu : notActiveMenu
              }
            >
              Dashboard
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/orders"
              className={({ isActive }) =>
                isActive ? activeMenu : notActiveMenu
              }
            >
              Orders
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/holdings"
              className={({ isActive }) =>
                isActive ? activeMenu : notActiveMenu
              }
            >
              Holdings
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/funds"
              className={({ isActive }) =>
                isActive ? activeMenu : notActiveMenu
              }
            >
              Funds
            </NavLink>
          </li>

          <li>|</li>

          <li className="user-logo" ref={menuRef}>
            <button className="user-details" onClick={handleButtonClick}>
              <span className="material-symbols-outlined">account_circle</span>
            </button>
            {open && (
              <div className="user-menu">
                <div className="user-menu-header">
                  <span className="material-symbols-outlined">person</span>
                  {user && (
                    <div>
                      <p className="username">{user.username}</p>
                      <p className="email">{user.email}</p>
                    </div>
                  )}
                </div>

                <ul className="user-menu-list">
                  <li>Profile</li>
                  <li>Orders</li>
                  <li>Holdings</li>
                  <li>Settings</li>
                  <li>
                    <button className="logout-btn" onClick={handleLogout}>
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </li>
        </ul>
      </div>
    </div>
  );
}
