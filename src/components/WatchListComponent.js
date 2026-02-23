import { useState, useEffect } from "react";
import SearchBar from "./SearchBar";
import StockDetails from "./StockDetails";
import WatchList from "./WatchList";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function WatchListComponent() {

  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);
  // verify route
  useEffect(() => {
    axios
      .get("http://localhost:3002/verify", { withCredentials: true })
      .then((res) => {
        if (!res.data.authenticated) {
          navigate("/login", { replace: true });
        } else {
          setUserDetails(res.data.user);
        }
      })
      .catch(() => {
        navigate("/login", { replace: true });
      });
  }, [navigate]);

  // set watchlist data
  useEffect(() => {
    if (!userDetails?.email) return;
    axios
      .get("http://localhost:3002/watchlistData", {
        params: { email: userDetails.email },
        withCredentials: true,
      })
      .then((res) => {
        setWatchlistStocks(res.data);
      })
      .catch((err) => {
        console.error("Failed to load watchlist", err);
      });
  }, [userDetails]);

  const [selectedStock, setSelectedStock] = useState(null);
  const [watchlistStocks, setWatchlistStocks] = useState([]);

  const handleAddToWatchlist = async (stock) => {
    try {
      setWatchlistStocks((prev) => {
        if (prev.some((s) => s.symbol === stock.symbol)) return prev;
        return [...prev, stock];
      });

      await axios.post(
        "http://localhost:3002/watchlist",
        {
          symbol: stock.symbol,
          high: stock.high,
          close: stock.close,
          email: userDetails?.email,
        },
        { withCredentials: true },
      );
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
