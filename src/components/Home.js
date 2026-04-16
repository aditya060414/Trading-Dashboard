import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "./TopBar";
import DashBoard from "./Dashboard";
import axios from "axios";


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
