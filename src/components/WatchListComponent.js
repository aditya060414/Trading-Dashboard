import { useState, useEffect, useCallback } from "react";
import SearchBar from "./SearchBar";
import StockDetails from "./StockDetails";
import WatchList from "./WatchList";
import axios from "axios";
import BuyComponent from "./BuyComponent";
import SellComponent from "./SellComponent";
import { toast } from "react-toastify";
import Portal from "./Portal";
import { api } from "../API";

export default function WatchListComponent() {
  const [watchlistStocks, setWatchlistStocks] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tradeState, setTradeState] = useState({
    type: null,
    stock: null,
  });

  const handleBuy = (stock) => setTradeState({ type: "BUY", stock });
  const handleSell = (stock) => setTradeState({ type: "SELL", stock });
  const closeTrade = () => setTradeState({ type: null, stock: null });

  const fetchWatchlist = useCallback(async () => {
    try {
      const response = await axios.get(`${api}watchlist/get`, {
        withCredentials: true,
      });
      setWatchlistStocks(response.data.stock || []);
    } catch (error) {
      console.error("Error fetching watchlist:", error.message);
    }
  }, []);

  // 2. Fetch on mount
  useEffect(() => {
    fetchWatchlist();
  }, [fetchWatchlist]);

  // 3. Update handleAdd to refresh the list immediately
  const handleAddToWatchlist = async (stock) => {
    setLoading(true);
    try {
      await axios.post(
        `${api}watchlist/add`,
        {
          symbol: stock.symbol,
          high: stock.high,
          open: stock.open,
          close: stock.close,
          low: stock.low,
        },
        { withCredentials: true },
      );

      toast.success(`${stock.symbol} added to watchlist!`);
      // Refresh the list from backend to get the "Live" data version of this stock
      await fetchWatchlist();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add to watchlist");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="search-bar-container">
        <SearchBar onSelectStock={setSelectedStock} />
      </div>

      {selectedStock && (
        <Portal>
          <StockDetails
            stock={selectedStock}
            loading={loading}
            onClose={() => setSelectedStock(null)}
            onAddToWatchlist={handleAddToWatchlist}
            onBuy={handleBuy}
            onSell={handleSell}
            isInWatchlist={watchlistStocks.some(
              (s) => s.symbol === selectedStock.symbol,
            )}
          />
        </Portal>
      )}

      {tradeState.type && (
        <Portal>
          <div className="modal-overlay">
            <div className="modal-content">
              {tradeState.type === "BUY" ? (
                <BuyComponent stock={tradeState.stock} closeBuy={closeTrade} />
              ) : (
                <SellComponent stock={tradeState.stock} closeBuy={closeTrade} />
              )}
            </div>
          </div>
        </Portal>
      )}

      <WatchList
        watchlistStocks={watchlistStocks}
        onBuy={handleBuy}
        onSell={handleSell}
        onAnalytics={setSelectedStock}
      />
    </>
  );
}
