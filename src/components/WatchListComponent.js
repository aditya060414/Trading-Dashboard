import { useState, useEffect } from "react";
import SearchBar from "./SearchBar";
import StockDetails from "./StockDetails";
import WatchList from "./WatchList";
import axios from "axios";

export default function WatchListComponent() {
  const [watchlistStocks, setWatchlistStocks] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);

  // verify route

  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        const response = await axios.get(`http://localhost:3002/api/v1/watchlist/get`, {
          withCredentials: true,
        });
        if (!response.data.stock) {
          setWatchlistStocks([]);
        } else {
          setWatchlistStocks(response.data.stock);
        }
      } catch (error) {
        console.log(error.message);
      }
    }
    fetchWatchlist();
  }, [])

  const handleAddToWatchlist = async (stock) => {
    try {
      const res = await axios.post(
        `http://localhost:3002/api/v1/watchlist/add`,
        {
          symbol: stock.symbol,
          high: stock.high,
          close: stock.close,
          low: stock.low,
        },
        { withCredentials: true },
      );

      console.log(res.data)
    } catch (err) {
      console.error("Failed to add to watchlist", err);
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
          onClose={() => setSelectedStock(null)}
          onAddToWatchlist={handleAddToWatchlist}
        />
      )}

      <WatchList watchlistStocks={watchlistStocks} />
    </>
  );
}
