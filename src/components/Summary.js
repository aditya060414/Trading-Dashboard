import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
export default function Summary() {
  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    if (hour < 21) return "Good Evening";

    return "Good Night";
  };
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);
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
  const [holdings, setHoldings] = useState(null);
  const [funds, setFunds] = useState(null);
  const [latestPrice, setLatestPrice] = useState(null);
  const fetchData = async () => {
    if (!userDetails.email) return;
    try {
      const [holdings, funds] = await Promise.all([
        axios.get(`http://localhost:3002/fetchOrders/${userDetails?.email}`),
        axios.get(`http://localhost:3002/funds/${userDetails?.email}`),
      ]);
      setHoldings(holdings.data);
      setFunds(funds.data.balance || 0);
    } catch (err) {
      console.error("Data fetch error", err);
    }
  };

  useEffect(() => {
    if (!userDetails?.email) return;
    fetchData();
  }, [userDetails]);

  useEffect(() => {
    if (!holdings || holdings.length === 0) return;
    const symbols = holdings.map((o) => o.symbol);
    axios
      .post("http://localhost:3002/getLatestStock", { symbols })
      .then((res) => {
        setLatestPrice(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [holdings]);

  let portfolioValue = Number(funds) || 0;

if (holdings && latestPrice) {
  holdings.forEach((h) => {
    const stock = latestPrice[h.symbol];

    if (!stock) return;

    const qty = Number(h.qty) || 0;
    const price = Number(stock.close) || 0;

    portfolioValue += qty * price;
  });
}

  const todaysGain = (holdings || []).reduce((total, h) => {
    const stock = latestPrice?.[h.symbol];
    if (!stock) return total;

    const close = Number(stock.close);
    const prev = Number(stock.prevClose);
    const qty = Number(h.quantity || h.qty || 0);

    return total + (close - prev) * qty;
  }, 0);
  return (
    <div className="dashboard-container">
      {/* Greeting */}
      <div className="dashboard-header">
        <h2>
          {getGreeting()}, <span>{userDetails?.username}</span>
        </h2>
        <p>Welcome back to MarketEx</p>
      </div>

      {/* Portfolio Cards */}
      <div className="portfolio-cards">
        <div className="card">
          <p className="label">Portfolio Value</p>
          <h3>₹{portfolioValue.toLocaleString("en-IN")}</h3>
        </div>

        <div className="card">
          <p className="label">Today's Gain</p>
          <h3 className={`profit ${todaysGain > 0 ? "green" : "red"}`}>
            ₹{todaysGain.toLocaleString("en-IN")}
          </h3>
        </div>

        <div className="card">
          <p className="label">Available Cash</p>
          <h3>₹{(funds || 0).toLocaleString("en-IN")}</h3>
        </div>
      </div>

      {/* MAIN DASHBOARD GRID */}
      <div className="dashboard-grid">
        {/* Portfolio Graph */}
        <div className="graph-card">
          <h4>Portfolio Performance</h4>
          <div className="graph-placeholder">Graph</div>
        </div>

        {/* Watchlist */}
        <div className="watchlist-card">
          <h4>Watchlist</h4>

          <div className="watch-item">
            <span>NIFTY</span>
            <span className="profit">+0.42%</span>
          </div>

          <div className="watch-item">
            <span>RELIANCE</span>
            <span className="loss">-0.18%</span>
          </div>

          <div className="watch-item">
            <span>TCS</span>
            <span className="profit">+1.12%</span>
          </div>
        </div>

        {/* Activity */}
        <div className="activity-card">
          <h4>Recent Activity</h4>

          <p>Deposit ₹5000</p>
          <p>Withdraw ₹2000</p>
          <p>Buy INFY</p>
        </div>
      </div>
    </div>
  );
}
