import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "./TopBar";
import DashBoard from "./Dashboard";
import axios from "axios";


export default function Home() {
  <TopBar />;
  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get("http://localhost:3002/verify", {
        withCredentials: true,
      })
      .then((res) => {
        if (!res.data.authenticated) {
          navigate("/login");
        }
      });
  }, []);
  return (
    <>
      <div className="home-container">
        <TopBar />
        <DashBoard />
      </div>
    </>
  );
}
