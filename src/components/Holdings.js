import { useState, useEffect } from "react";
import { useAuth } from '../Auth';
import axios from "axios";
import { LoaderCircle, TrendingUp, TrendingDown, Briefcase, IndianRupee, PieChart, ShoppingCart, Tag, BarChart2 } from "lucide-react";
import { Tooltip } from "@mui/material";
import BuyComponent from "./BuyComponent";
import SellComponent from "./SellComponent";
import StockDetails from "./StockDetails";

import { toast } from "react-toastify";
import Portal from "./Portal";

export default function Holdings() {
  const { user } = useAuth();

  const [portfolio, setPortfolio] = useState(null);
  const [watchlistStocks, setWatchlistStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredSymbol, setHoveredSymbol] = useState(null);

  // Trade & Analytics states
  const [selectedStock, setSelectedStock] = useState(null);
  const [tradeState, setTradeState] = useState({
    type: null,
    stock: null,
  });

  const fetchWatchlist = async () => {
    try {
      const response = await axios.get(`https://trading-backend-tf3j.onrender.com/api/v1/watchlist/get`, {
        withCredentials: true,
      });
      setWatchlistStocks(response.data.stock || []);
    } catch (error) {
      console.error("Error fetching watchlist:", error.message);
    }
  };

  useEffect(() => {
    if (!user?.id) return;
    const fetchPortfolio = async () => {
      try {
        setLoading(true);

        const res = await axios.get(`https://trading-backend-tf3j.onrender.com/api/v1/portfolio/${user.id}`, {
          withCredentials: true,
        });
        setPortfolio(res.data);
      } catch (error) {
        console.error("Error fetching portfolio:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
    fetchWatchlist();
  }, [user]);

  const handleAddToWatchlist = async (stock) => {
    try {
       await axios.post(
        `https://trading-backend-tf3j.onrender.com/api/v1/watchlist/add`,
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
      await fetchWatchlist();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add to watchlist");
    }
  };

  const handleBuy = (stock) => setTradeState({ type: "BUY", stock });
  const handleSell = (stock) => setTradeState({ type: "SELL", stock });
  const closeTrade = () => setTradeState({ type: null, stock: null });

  const formatINR = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount || 0);
  };
  if (loading) return (
    <div className="loader-overlay">
      <LoaderCircle className="spinner" size={48} />
      <h4 className="loader-brand">Market<span>Ex</span></h4>
      <p className="loader-message">Analyzing your portfolio...</p>
    </div>
  );

  if (!portfolio || !portfolio.allocation.length) return (
    <div className="orders-empty-state">
      <div className="empty-icon-wrapper">
        <Briefcase size={64} strokeWidth={1} />
      </div>
      <h3>No Holdings Found</h3>
      <p>Your long-term investments will appear here after your orders are executed.</p>
    </div>
  );

  const totalPnL = portfolio.portfolioValue - portfolio.investedAmount;
  const isTotalProfit = totalPnL >= 0;

  return (
    <div className="holdings-wrapper">
      <div className="holdings-header">
        <div className="header-left">
          <h2>Holdings</h2>
          <span className="holdings-count">{portfolio.allocation.length} Stocks</span>
        </div>
      </div>

      <div className="portfolio-summary-grid">
        <div className="summary-card">
          <div className="card-icon"><IndianRupee size={20} /></div>
          <div className="card-data">
            <small>Total Invested</small>
            <p>{formatINR(portfolio.investedAmount)}</p>
          </div>
        </div>
        <div className="summary-card">
          <div className="card-icon"><PieChart size={20} /></div>
          <div className="card-data">
            <small>Current Value</small>
            <p className={`${portfolio.portfolioValue >= portfolio.investedAmount ? 'profit' : 'loss'}`}>{formatINR(portfolio.portfolioValue)}</p>
          </div>
        </div>
        <div className="summary-card pnl-card">
          <div className={`card-data `}>
            <small>Total P&L</small>
            <div className="pnl-main">
              <p className={`pnl-amount ${isTotalProfit ? 'profit' : 'loss'}`}>{formatINR(totalPnL)}</p>
              <span className={`pnl-indicator ${isTotalProfit ? 'profit' : 'loss'}`}>
                {isTotalProfit ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                {((totalPnL / portfolio.investedAmount) * 100).toFixed(2)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="orders-table-container">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Stock</th>
              <th>Qty</th>
              <th>Avg. Price</th>
              <th>Current</th>
              <th>Market Value</th>
              <th>Total P&L</th>
            </tr>
          </thead>
          <tbody>
            {portfolio.allocation.map((stock) => {
              const isProfit = stock.totalGain >= 0;
              const pnlPercentage = ((stock.totalGain / stock.totalInvestment) * 100).toFixed(2);

              // Create a stock object for the modals
              const stockObj = {
                symbol: stock.symbol,
                close: stock.currPrice,
                open: stock.currPrice, // Approximate for modals
                high: stock.currPrice,
                low: stock.currPrice
              };

              return (
                <tr 
                  key={stock.symbol}
                  onMouseEnter={() => setHoveredSymbol(stock.symbol)}
                  onMouseLeave={() => setHoveredSymbol(null)}
                >
                  <td className="symbol-column">
                    <div className="stock-cell">
                      <span className="symbol-main">{stock.symbol}</span>
                      {hoveredSymbol === stock.symbol && (
                        <div className="order-row-actions">
                          <Tooltip title="Buy More" arrow>
                            <button className="action-btn buy" onClick={() => handleBuy(stockObj)}>
                              <ShoppingCart size={14} />
                            </button>
                          </Tooltip>
                          <Tooltip title="Sell" arrow>
                            <button className="action-btn sell" onClick={() => handleSell(stockObj)}>
                              <Tag size={14} />
                            </button>
                          </Tooltip>
                          <Tooltip title="Analytics" arrow>
                            <button className="action-btn analytics" onClick={() => setSelectedStock(stockObj)}>
                              <BarChart2 size={14} />
                            </button>
                          </Tooltip>
                        </div>
                      )}
                    </div>
                  </td>
                  <td><span className="qty-value">{stock.qty}</span></td>
                  <td>{formatINR(stock.avgPrice)}</td>
                  <td>{formatINR(stock.currPrice)}</td>
                  <td>
                    <div className="value-cell">
                      <span>{formatINR(stock.currentValue)}</span>
                      <small>Inv: {formatINR(stock.totalInvestment)}</small>
                    </div>
                  </td>
                  <td>
                    <div className={`pnl-cell `}>
                      <span className={`pnl-amount ${isProfit ? 'profit' : 'loss'}`}>{isProfit ? '+' : ''}{formatINR(stock.totalGain)}</span>
                      <span className={`pnl-percent ${isProfit ? 'profit' : 'loss'}`}>{isProfit ? '+' : ''}{pnlPercentage}%</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Analytics Modal */}
      {selectedStock && (
        <Portal>
          <StockDetails
            stock={selectedStock}
            onClose={() => setSelectedStock(null)}
            onBuy={handleBuy}
            onSell={handleSell}
            onAddToWatchlist={handleAddToWatchlist}
            isInWatchlist={watchlistStocks.some(s => s.symbol === selectedStock.symbol)}
          />
        </Portal>
      )}

      {/* Trade Modals */}
      {tradeState.type && (
        <Portal>
          <div className="modal-overlay">
            <div className="modal-content">
              {tradeState.type === "BUY" ? (
                <BuyComponent
                  stock={tradeState.stock}
                  closeBuy={closeTrade}
                />
              ) : (
                <SellComponent
                  stock={tradeState.stock}
                  closeBuy={closeTrade}
                />
              )}
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
}
