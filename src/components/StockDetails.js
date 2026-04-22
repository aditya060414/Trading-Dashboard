import CloseIcon from "@mui/icons-material/Close";
import CandleChart from "./CandleChart";
import LineChart from "./LineChart";
import { useState, useEffect } from "react";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { TrendingUp, TrendingDown, Star, ShoppingCart, Tag } from "lucide-react";
import Button from "@mui/material/Button";
import Portal from "./Portal";

export default function StockDetails({ 
  stock, 
  onClose, 
  onAddToWatchlist, 
  onBuy, 
  onSell, 
  isInWatchlist 
}) {
  const [alignment, setAlignment] = useState("line");

  useEffect(() => {
    document.body.classList.add("modal-open");
    return () => document.body.classList.remove("modal-open");
  }, []);

  const handleChange = (event, newAlignment) => {
    if (newAlignment !== null) {
      setAlignment(newAlignment);
    }
  };

  const close = Number(stock.close) || 0;
  const open = Number(stock.open) || 0;
  const change = close - open;
  const percentChange = open !== 0 ? ((change / open) * 100).toFixed(2) : "0.00";
  const isUp = change >= 0;

  return (
    <div className="modal-overlay">
      <div className="modal-content details-pop">
        <div className="stock-details-header">
          <div className="header-info">
            <h3>{stock.symbol}</h3>
            <p className="exchange-label">NSE • Live Market</p>
          </div>
          <button className="close-btn" onClick={onClose}>
            <CloseIcon />
          </button>
        </div>

        <div className="stock-price-section">
          <div className="price-main">₹{close.toFixed(2)}</div>
          <div className={`price-metrics ${isUp ? "up" : "down"}`}>
            {isUp ? "+" : ""}{change.toFixed(2)} ({isUp ? "+" : ""}{percentChange}%)
            {isUp ? <TrendingUp size={18} style={{ marginLeft: "8px" }} /> : <TrendingDown size={18} style={{ marginLeft: "8px" }} />}
          </div>
        </div>

        <div className="stock-ohlc-grid">
          <div className="ohlc-item">
            <p>Open</p>
            <span>₹{stock.open ?? "--"}</span>
          </div>
          <div className="ohlc-item">
            <p>High</p>
            <span>₹{stock.high ?? "--"}</span>
          </div>
          <div className="ohlc-item">
            <p>Low</p>
            <span>₹{stock.low ?? "--"}</span>
          </div>
          <div className="ohlc-item">
            <p>Close</p>
            <span>₹{stock.close}</span>
          </div>
        </div>

        <div className="stock-unified-actions">
          <div className="trading-btns">
            <Button 
              variant="contained" 
              className="buy-btn" 
              onClick={() => onBuy(stock)}
              startIcon={<ShoppingCart size={18} />}
            >
              Buy
            </Button>
            <Button 
              variant="contained" 
              className="sell-btn" 
              onClick={() => onSell(stock)}
              startIcon={<Tag size={18} />}
            >
              Sell
            </Button>
            <Button 
              variant="outlined" 
              className={`watchlist-add-btn ${isInWatchlist ? "added" : ""}`} 
              onClick={() => onAddToWatchlist(stock)}
              disabled={isInWatchlist}
              startIcon={isInWatchlist ? <Star size={18} fill="currentColor" /> : <Star size={18} />}
            >
              {isInWatchlist ? "In Watchlist" : "Watchlist"}
            </Button>
          </div>

          <ToggleButtonGroup
            color="primary"
            value={alignment}
            exclusive
            onChange={handleChange}
            aria-label="Chart Type"
            size="small"
          >
            <ToggleButton value="line">Line</ToggleButton>
            <ToggleButton value="candle">Candle</ToggleButton>
          </ToggleButtonGroup>
        </div>

        <div className="stock-chart-container">
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
