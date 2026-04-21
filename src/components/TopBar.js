import React from "react";
import Menu from "./Menu"
const TopBar = ({ dark, handleTheme }) => {
  return (
    <>
      <div className="top-bar">
      <Menu dark={dark} handleTheme={handleTheme} />
      </div>
    </>
  );
};

export default TopBar;
