import React from "react";
import TopBar from "./TopBar";
import DashBoard from "./Dashboard";

export default function Home() {
  return (
    <>
      <div className="home-container">
        <TopBar />
        <DashBoard />
      </div>
    </>
  );
}
