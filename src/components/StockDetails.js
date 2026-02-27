import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import CandleChart from "./CandleChart";
import LineChart from "./LineChart";
import { useState } from "react";
import React from "react";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

export default function StockDetails({ stock, onClose, onAddToWatchlist }) {
  const [alignment, setAlignment] = useState("line");

  const handleChange = (event, newAlignment) => {
    if (newAlignment !== null) {
      setAlignment(newAlignment);
    }
  };
  const handleAdd = () => {
    onAddToWatchlist(stock);
    onClose();
  };

  return (
    <div className="stock-details-overlay">
      <div className="stock-details-card">
        <div className="stock-details-header">
          <h3>{stock.symbol}</h3>
          <button onClick={onClose}>
            <CloseIcon />
          </button>
        </div>

        <div className="stock-price">₹{stock.close}</div>

        <div className="stock-ohlc">
          <div>
            <p>Open</p>
            <span>{stock.open ?? "--"}</span>
          </div>
          <div>
            <p>High</p>
            <span>{stock.high ?? "--"}</span>
          </div>
          <div>
            <p>Low</p>
            <span>{stock.low ?? "--"}</span>
          </div>
          <div>
            <p>Close</p>
            <span>{stock.close}</span>
          </div>
        </div>

        <div className="stock-actions">
          <button className="watchlist-btn" onClick={handleAdd}>
            <AddIcon /> Add to Watchlist
          </button>
          <ToggleButtonGroup
            color="primary"
            value={alignment}
            exclusive
            onChange={handleChange}
            aria-label="Platform"
          >
            <ToggleButton value="line">Line Chart</ToggleButton>
            <ToggleButton value="candle">Candle Chart</ToggleButton>
          </ToggleButtonGroup>
        </div>

        <div className="stock-chart">
          {alignment === "line" ? (
            <LineChart symbol={stock.symbol} />
          ) : (
            <CandleChart symbol={stock.symbol} />
          )}
        </div>
      </div>
    </div>
  );
}
