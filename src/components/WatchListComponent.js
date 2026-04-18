import { useState, useEffect, useCallback } from "react";
import SearchBar from "./SearchBar";
import StockDetails from "./StockDetails";
import WatchList from "./WatchList";
import axios from "axios";

export default function WatchListComponent() {
  const [watchlistStocks, setWatchlistStocks] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);
  const [loading, setLoading] = useState(false);


  const fetchWatchlist = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:3002/api/v1/watchlist/get`, {
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
        `http://localhost:3002/api/v1/watchlist/add`,
        {
          symbol: stock.symbol,
          high: stock.high,
          open: stock.open,
          close: stock.close,
          low: stock.low,
        },
        { withCredentials: true },
      );

      // Refresh the list from backend to get the "Live" data version of this stock
      await fetchWatchlist();
      setSelectedStock(null); // Close the modal/details after adding
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add to watchlist");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mx-navbar-search">
        <SearchBar onSelectStock={setSelectedStock} />
      </div>

      {selectedStock && (
        <StockDetails
          stock={selectedStock}
          loading={loading}
          onClose={() => setSelectedStock(null)}
          onAddToWatchlist={handleAddToWatchlist}
        />
      )}

      <WatchList
        watchlistStocks={watchlistStocks}
      />
    </>
  );
}