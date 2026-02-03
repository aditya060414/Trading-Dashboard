import React from "react";
import { NavLink } from "react-router-dom";

export default function Menu() {

  const notActiveMenu = "menu-links";
  const activeMenu = "menu-links-active";

  return (
    <div className="menu-container">
      <div className="menu-logo">
        <img src="/media/kite-logo.svg" alt="logo" />
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
              to="/positions"
              className={({ isActive }) =>
                isActive ? activeMenu : notActiveMenu
              }
            >
              Position
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

          <li>
            <NavLink
              to="/apps"
              className={({ isActive }) =>
                isActive ? activeMenu : notActiveMenu
              }
            >
              Apps
            </NavLink>
          </li>

          <li>|</li>

          <li className="user-logo">
            <span className="material-symbols-outlined">account_circle</span>
          </li>

          <li className="user-name menu-links">user</li>

        </ul>
      </div>
    </div>
  );
}
