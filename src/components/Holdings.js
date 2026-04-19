import { useState, useEffect } from "react";
import { useAuth } from '../Auth';
import axios from "axios";
import { LoaderCircle } from "lucide-react";
export default function Holdings() {
  const { user } = useAuth();

  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If no user, don't fetch and don't show loading
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
        if(error.response.data.message){
          alert(error.response.data.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, [user]);

  const formatINR = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount || 0);
  };
  if (loading) return <div className="load-circle" ><LoaderCircle className="spinner" /></div>;
  if (!portfolio || !portfolio.allocation.length) return <div className="p-10" style={{ display: 'flex', position: 'absolute', top: '50%', left: '50%' }}>No holdings found.</div>;
  return (
    <div className="orders-container">
      <div className="order-hero">
        <p className="order-title">Holdings ({portfolio.allocation.length})</p>
        <div className="portfolio-summary" style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
          <div>
            <small>Invested</small>
            <p>{formatINR(portfolio.investedAmount)}</p>
          </div>
          <div>
            <small>Current Value</small>
            <p style={{ color: portfolio.portfolioValue >= portfolio.investedAmount ? 'green' : 'red' }}>
              {formatINR(portfolio.portfolioValue)}
            </p>
          </div>
          <div>
            <small>Today's Profit/Loss</small>
            <p style={{ color: portfolio.todaysGain >= 0 ? 'green' : 'red' }}>
              {formatINR(portfolio.todaysGain)}
            </p>
          </div>
        </div>
      </div>
      <div className="order-details">
        <table>
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Qty</th>
              <th>Avg. Price</th>
              <th>LTP (Current)</th>
              <th>Invested Value</th>
              <th>Current Value</th>
              <th>Total P&L</th>
            </tr>
          </thead>
          <tbody>
            {portfolio.allocation.map((stock) => {
              const isProfit = stock.totalGain >= 0;
              const pnlPercentage = ((stock.totalGain / stock.totalInvestment) * 100).toFixed(2);

              return (
                <tr key={stock.symbol}>
                  <td><strong>{stock.symbol}</strong> <small style={{ display: 'block', color: '#888' }}>{stock.mode}</small></td>
                  <td>{stock.qty}</td>
                  <td>{formatINR(stock.avgPrice)}</td>
                  <td>{formatINR(stock.currPrice)}</td>
                  <td>{formatINR(stock.totalInvestment)}</td>
                  <td>{formatINR(stock.currentValue)}</td>
                  <td style={{ color: isProfit ? '#4caf50' : '#f44336' }}>
                    {formatINR(stock.totalGain)}
                    <div style={{ fontSize: '11px' }}>({pnlPercentage}%)</div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div >
  );
}
