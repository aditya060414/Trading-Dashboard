import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Summary from "./Summary";
import Orders from "./Orders";
import Holdings from "./Holdings";
import Funds from "./Funds";
import Settings from "./Setting";
import ChangeUsername from "./changeUsername";
import ChangePassword from "./changePassword"
import WatchListComponent from "./WatchListComponent";
import { LayoutList, X } from "lucide-react";

const DashBoard = () => {
  const [showWatchlist, setShowWatchlist] = useState(false);

  const toggleWatchlist = () => {
    setShowWatchlist(!showWatchlist);
  };

  return (
    <div className="dashboard">
      <button
        className="mobile-watchlist-toggle"
        onClick={toggleWatchlist}
        aria-label="Toggle Watchlist"
      >
        {showWatchlist ? <X size={20} /> : <LayoutList size={20} />}
        <span>Watchlist</span>
      </button>

      <div className={`watchlist ${showWatchlist ? "show-mobile" : ""}`}>
        <WatchListComponent />
      </div>
      {/* Overlay for closing drawer on mobile */}
      {showWatchlist && (
        <div
          className="watchlist-overlay"
          onClick={() => setShowWatchlist(false)}
        ></div>
      )}


      <div className="content-container">
        <div className="content">
          <Routes>
            <Route exact path="/" element={<Summary />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/holdings" element={<Holdings />} />
            <Route path="/funds" element={<Funds />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/changeUsername" element={<ChangeUsername />} />
            <Route path="/changePassword" element={<ChangePassword />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};


export default DashBoard;
