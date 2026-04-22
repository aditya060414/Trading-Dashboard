import { Routes, Route } from "react-router-dom";
import Summary from "./Summary";
import Orders from "./Orders";
import Holdings from "./Holdings";
import Funds from "./Funds";
import Settings from "./Setting";
import WatchListComponent from "./WatchListComponent";
const DashBoard = () => {
  return (
      <div className="dashboard">
        <div className="watchlist" >
          <WatchListComponent />
        </div>
        <div className="content-container" >
          <div className="content">
            <Routes>
              <Route exact path="/" element={<Summary />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/holdings" element={<Holdings />} />
              <Route path="/funds" element={<Funds />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </div>
        </div>
      </div>
  );
};

export default DashBoard;
