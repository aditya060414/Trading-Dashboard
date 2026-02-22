import React from "react";
import { Routes, Route } from "react-router-dom";
import Summary from "./Summary";
import Orders from "./Orders";
import Holdings from "./Holdings";
import Positions from "./Positions";
import Funds from "./Funds";
import Apps from "./Apps";
import WatchListComponent from "./WatchListComponent";


const DashBoard = () => {
  return (
    <div className="container-fluid dashboard">
      <div className="row dashboard-row">
        <div className="col-4" style={{ margin: "0", padding: "0" }}>
          <WatchListComponent />
        </div>
        <div className="col-8">
          <div className="content">
            <Routes>
              <Route exact path="/" element={<Summary />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/holdings" element={<Holdings />} />
              <Route path="/positions" element={<Positions />} />
              <Route path="/funds" element={<Funds />} />
              <Route path="/apps" element={<Apps />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
