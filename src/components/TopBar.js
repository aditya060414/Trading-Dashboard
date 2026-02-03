import React from "react";
import Menu from "./Menu"
const TopBar = () => {
  return (
    <>
      <div className="top-bar">
        <div className="top-bar-container">
          <div className="topbar-section nifty">
            <p className="nifty-index">NIFTY50</p>
            <p style={{ color: "red" }} className="index-points">0.00</p>
            <p className="index-percentage">0</p>
          </div>
          <div className="topbar-section sensex">
            <p className="sensex-index">SENSEX</p>
            <p style={{ color: "red" }} className="index-points">0.00</p>
            <p className="index-percentage">0</p>
          </div>
        </div>
      <Menu/>
      </div>
    </>
  );
};

export default TopBar;
