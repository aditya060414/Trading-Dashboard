import { useState, useEffect } from "react"; // 1. Added useEffect
import { Tooltip } from "@mui/material";
import { BarChartOutlined } from "@mui/icons-material";

import DeleteIcon from "@mui/icons-material/Delete";
import { TrendingUp, TrendingDown } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import Portal from "./Portal";

export default function WatchList({
  watchlistStocks = [],
  onBuy,
  onSell,
  onAnalytics
}) {
  // 2. Initialize local state with the props
  const [displayStocks, setDisplayStocks] = useState(watchlistStocks);

  // Sync local state if the prop changes from the parent
  useEffect(() => {
    setDisplayStocks(watchlistStocks);
  }, [watchlistStocks]);

  const [deleteState, setDeleteState] = useState({
    show: false,
    stock: null,
  });

  const handleDeleteClick = (stock) => {
    setDeleteState({ show: true, stock });
  };

  const cancelDelete = () => {
    setDeleteState({ show: false, stock: null });
  };

  // 3. Updated handleDelete to update UI state
  const handleDelete = async (stock) => {
    try {
      const symbol = stock.symbol;

      // Await the delete request
      await axios.delete("https://trading-backend-tf3j.onrender.com/api/v1/watchlist/remove", {
        data: { symbol: symbol },
        withCredentials: true,
      });

      // Update local state to remove the stock from UI immediately
      setDisplayStocks((prev) => prev.filter((s) => s.symbol !== symbol));
      setDeleteState({ show: false, stock: null });

      toast.success(`${symbol} removed from watchlist`);
    } catch (err) {
      console.error("Failed to delete stock:", err);
      toast.error(err.response?.data?.message || "Error removing stock. Please try again.");
    }
  };

  return (
    <>
      <div className="watchlist-container">
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
                  handleBuyButton={onBuy}
                  handleSellButton={onSell}
                  handleAnalytics={onAnalytics}
                  handleDelete={handleDeleteClick}
                />
              );
            })}
          </ul>
        </div>
      </div>

      {deleteState.show && (
        <Portal>
          <DeleteConfirmationModal
            stock={deleteState.stock}
            onConfirm={handleDelete}
            onCancel={cancelDelete}
          />
        </Portal>
      )}
    </>
  );
}

const DeleteConfirmationModal = ({ stock, onConfirm, onCancel }) => {
  useEffect(() => {
    document.body.classList.add("modal-open");
    return () => document.body.classList.remove("modal-open");
  }, []);

  return (
    <div className="modal-overlay">
      <div className="modal-content delete-modal">
        <h3>Remove {stock.symbol}?</h3>
        <p>Are you sure you want to remove this stock from your watchlist?</p>
        <div className="btn-group">
          <button className="cancel-btn" onClick={onCancel}>
            Cancel
          </button>
          <button className="confirm-btn" onClick={() => onConfirm(stock)}>
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};


const WatchListItem = ({
  stock,
  handleBuyButton,
  handleSellButton,
  handleAnalytics,
  handleDelete,
}) => {
  const [showWatchListAction, setShowWatchListAction] = useState(false);

  const close = Number(stock.close) || 0;
  const open = Number(stock.open) || 0;
  const change = close - open;
  const percentChange = open !== 0 ? ((change / open) * 100).toFixed(2) : "0.00";
  const isUp = change >= 0;

  return (
    <li
      className="watchlist-li"
      onMouseEnter={() => setShowWatchListAction(true)}
      onMouseLeave={() => setShowWatchListAction(false)}
    >
      <div className="item">
        <div className="symbol-info">
          <p className={isUp ? "up" : "down"}>{stock.symbol}</p>
        </div>
        <div className="itemInfo">
          <span className="price">₹{close.toFixed(2)}</span>
          <span className={`percent ${isUp ? "up" : "down"}`}>
            {isUp ? "+" : ""}{percentChange}%
            {isUp ? (
              <TrendingUp size={14} style={{ marginLeft: "4px" }} />
            ) : (
              <TrendingDown size={14} style={{ marginLeft: "4px" }} />
            )}
          </span>
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