import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import CandleChart from "./CandleChart";
export default function StockDetails({ stock, onClose, onAddToWatchlist }) {

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
          <div><p>Open</p><span>{stock.open ?? "--"}</span></div>
          <div><p>High</p><span>{stock.high ?? "--"}</span></div>
          <div><p>Low</p><span>{stock.low ?? "--"}</span></div>
          <div><p>Close</p><span>{stock.close}</span></div>
        </div>

        <div className="stock-actions">
          <button
            className="watchlist-btn"
            onClick={handleAdd}
          >
            <AddIcon /> Add to Watchlist
          </button>
        </div>

        <div className="stock-chart">
          <CandleChart symbol={stock.symbol} />
        </div>
      </div>
    </div>
  );
}