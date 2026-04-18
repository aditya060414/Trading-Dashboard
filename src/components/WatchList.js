import { useState, useEffect } from "react"; // 1. Added useEffect
import { Tooltip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { BarChartOutlined } from "@mui/icons-material";
import BuyComponent from "./BuyComponent";
import SellComponent from "./SellComponent";
import CandleChart from "./CandleChart";
import LineChart from "./LineChart";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

export default function WatchList({ watchlistStocks = [] }) {
  // 2. Initialize local state with the props
  const [displayStocks, setDisplayStocks] = useState(watchlistStocks);

  // Sync local state if the prop changes from the parent
  useEffect(() => {
    setDisplayStocks(watchlistStocks);
  }, [watchlistStocks]);

  const [tradeState, setTradeState] = useState({
    type: null,
    stock: null,
  });

  const handleBuyButton = (stock) => {
    setTradeState({ type: "BUY", stock });
  };

  const handleSellButton = (stock) => {
    setTradeState({ type: "SELL", stock });
  };

  const [analytics, setAnalytics] = useState(false);
  const [analyticsStock, setAnalyticsStock] = useState(null);

  const handleAnalytics = (stock) => {
    if (!stock) return;
    setAnalytics(true);
    setAnalyticsStock(stock);
  };

  const [alignment, setAlignment] = useState("line");
  const handleChange = (event, newAlignment) => {
    if (newAlignment !== null) {
      setAlignment(newAlignment);
    }
  };

  const handleClose = () => {
    setAnalytics(false);
  };

  // 3. Updated handleDelete to update UI state
  const handleDelete = async (stock) => {
    try {
      const symbol = stock.symbol;

      // Await the delete request
      await axios.delete("http://localhost:3002/api/v1/watchlist/remove", {
        data: { symbol: symbol },
        withCredentials: true,
      });

      // Update local state to remove the stock from UI immediately
      setDisplayStocks((prev) => prev.filter((s) => s.symbol !== symbol));

      alert(`${symbol} removed from watchlist`);
    } catch (err) {
      console.error("Failed to delete stock:", err);
      alert("Error removing stock. Please try again.");
    }
  };

  return (
    <>
      <div className="watchlist">
        <div className="watchlist-data">
          <p className="watchlist-title">Watchlist</p>
          <ul>
            {displayStocks.length === 0 && (
              <li className="watchlist-empty">No stocks added</li>
            )}

            {displayStocks.map((stock) => {
              return (
                <WatchListItem
                  key={stock._id || stock.symbol} // Using symbol as fallback key
                  stock={stock}
                  handleBuyButton={handleBuyButton}
                  handleSellButton={handleSellButton}
                  handleAnalytics={handleAnalytics}
                  handleDelete={handleDelete}
                />
              );
            })}
          </ul>
        </div>
        {analytics && analyticsStock && (
          <div className="stock-details-overlay">
            <div className="stock-details-card">
              <div className="stock-details-header">
                <h3>{analyticsStock?.symbol}</h3>
                <button onClick={handleClose}>
                  <CloseIcon />
                </button>
              </div>

              <div className="stock-price">₹{analyticsStock?.close}</div>

              <div className="stock-ohlc">
                <div>
                  <p>Open</p>
                  <span>{analyticsStock?.open ?? "--"}</span>
                </div>
                <div>
                  <p>High</p>
                  <span>{analyticsStock?.high ?? "--"}</span>
                </div>
                <div>
                  <p>Low</p>
                  <span>{analyticsStock?.low ?? "--"}</span>
                </div>
                <div>
                  <p>Close</p>
                  <span>{analyticsStock?.close}</span>
                </div>
              </div>

              <div className="stock-actions">
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
                  <LineChart symbol={analyticsStock?.symbol} />
                ) : (
                  <CandleChart symbol={analyticsStock?.symbol} />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      {/* ... (Trade components remain the same) */}
      {tradeState.type === "BUY" && (
        <BuyComponent
          stock={tradeState.stock}
          closeBuy={() => setTradeState({ type: null, stock: null })}
        />
      )}
      {tradeState.type === "SELL" && (
        <SellComponent
          stock={tradeState.stock}
          closeBuy={() => setTradeState({ type: null, stock: null })}
        />
      )}
    </>
  );
}

// WatchListItem and WatchListActions components remain largely the same
const WatchListItem = ({
  stock,
  handleBuyButton,
  handleSellButton,
  handleAnalytics,
  handleDelete,
}) => {
  const [showWatchListAction, setShowWatchListAction] = useState(false);
  return (
    <li
      className="watchlist-li"
      onMouseEnter={() => setShowWatchListAction(true)}
      onMouseLeave={() => setShowWatchListAction(false)}
    >
      <div className="item">
        <p>{stock.symbol}</p>
        <div className="itemInfo">
          <span className="percent">{stock.close}</span>
        </div>
        {showWatchListAction && (
          <WatchListActions
            handleBuyButton={handleBuyButton}
            handleSellButton={handleSellButton}
            stock={stock}
            handleAnalytics={handleAnalytics}
            handleDelete={handleDelete}
          />
        )}
      </div>
    </li>
  );
};

const WatchListActions = ({
  stock,
  handleBuyButton,
  handleSellButton,
  handleAnalytics,
  handleDelete,
}) => {
  return (
    <span className="actions">
      <span>
        <Tooltip title="Buy (B)" placement="top" arrow>
          <button className="buy" onClick={() => handleBuyButton(stock)}>
            Buy
          </button>
        </Tooltip>
        <Tooltip title="Sell (S)" placement="top" arrow>
          <button className="sell" onClick={() => handleSellButton(stock)}>
            Sell
          </button>
        </Tooltip>
        <Tooltip title="Delete (D)" placement="top" arrow>
          <button className="more" onClick={() => handleDelete(stock)}>
            <DeleteIcon />
          </button>
        </Tooltip>
        <Tooltip title="Analytics (A)" placement="top" arrow>
          <button className="analytics" onClick={() => handleAnalytics(stock)}>
            <BarChartOutlined />
          </button>
        </Tooltip>
      </span>
    </span>
  );
};