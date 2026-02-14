import React,{useState,useEffect} from "react";
import TopBar from "./TopBar";
import DashBoard from "./Dashboard";
import axios from "axios";
export default function Home() {
  useEffect(() => {
  axios.get("http://localhost:3002/verify", {
    withCredentials: true
  })
  .then(res => {
    if (!res.data.status) {
      window.location.href = "http://localhost:3000";
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
