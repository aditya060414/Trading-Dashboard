
import { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../Auth";
import { LoaderCircle } from "lucide-react";
import { Sun, Moon } from 'lucide-react';

export default function Menu({ dark, handleTheme }) {
  const notActiveMenu = "menu-links";
  const activeMenu = "menu-links-active";
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useAuth();


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
      const res = await axios.post(
        "https://trading-backend-tf3j.onrender.com/api/v1/auth/logout",
        {},
        { withCredentials: true },
      );
      if (res.data.message) {
        alert(res.data.message);
      }
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };
  const handleRoute = (path)=>{
    setOpen(false);
    navigate(path);
  }
  return (
    <div className="menu-container">
      <div className="menu-logo">
        <h4 className="brand-logo">
          Market<span>Ex</span>
        </h4>
      </div>
      <div className="menu-items">
        <ul>
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

          <li className="separator" style={{ color: 'var(--border)' }}>|</li>

          <li className="user-logo" ref={menuRef}>
            <button className="user-details" onClick={handleButtonClick}>
              <span className="material-symbols-outlined">account_circle</span>
            </button>
            {open && (
              <div className="user-menu">
                <div className="user-menu-header">
                  <span className="material-symbols-outlined">person</span>
                  {user ? (
                    <div>
                      <p className="username">{user.username}</p>
                      <p className="email">{user.email}</p>
                    </div>
                  ) : (
                    <div className="spinner-container"><LoaderCircle className="spinner" /></div>
                  )}
                </div>

                <ul className="user-menu-list">
                  <li onClick={() => handleRoute("/")}>Profile</li>
                  <li onClick={() => handleRoute("/orders")}>Orders</li>
                  <li onClick={() => handleRoute("/holdings")}>Holdings</li>
                  <li onClick={() => handleRoute("/funds")}>Funds</li>
                  <li onClick={() => handleRoute("/settings")}>Settings</li>
                  <li>
                    <button className="logout-btn" onClick={handleLogout}>
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </li>
          <li>
            <button onClick={handleTheme} className="theme-button">{!dark ? <Sun className="lightheme" /> : <Moon className="darktheme" />}</button>
          </li>
        </ul>
      </div>
    </div>
  );
}
