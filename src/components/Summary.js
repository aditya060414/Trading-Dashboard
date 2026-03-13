import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);
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
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    if (!userDetails?.email) return;

    axios
      .get(`http://localhost:3002/portfolioAnalytics/${userDetails.email}`)
      .then((res) => setAnalytics(res.data))
      .catch(console.error);
  }, [userDetails]);

  const chartData = {
    labels: analytics?.allocation.map((s) => s.symbol) || [],

    datasets: [
      {
        label: "Today's Profit / Loss",

        data: analytics?.allocation.map((s) => s.gain) || [],

        backgroundColor: analytics?.allocation.map((s) =>
          s.gain >= 0 ? "#2ecc71" : "#ff4d4d",
        ),

        borderRadius: 6,
        barThickness: 40,
      },
    ],
  };
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => `₹${context.raw.toLocaleString("en-IN")}`,
        },
      },
    },

    scales: {
    x: {
      ticks: {
        color: "#374151",
        font: {
          size: 12,
          weight: "500",
        },
      },
      grid: {
        display: false,
      },
    },

    y: {
      ticks: {
        color: "#374151",
      },
      grid: {
        color: "#e5e7eb",
      },
    },
  },

  };
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
          <h4>Today's Profit / Loss by Stock</h4>
          <div className="graph-placeholder">
            <p>
              Today's Gain:
              <span
                style={{ color: analytics?.todaysGain >= 0 ? "green" : "red" }}
              >
                ₹{analytics?.todaysGain?.toLocaleString("en-IN")}
              </span>
            </p>
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* Watchlist */}
        <div className="news-card">
          <h4>Market News</h4>

          <div className="news-item">
            <div className="news-title">
              Reliance shares rise after strong quarterly results
            </div>
            <div className="news-meta">
              <span>Economic Times</span>
              <span>2h ago</span>
            </div>
          </div>

          <div className="news-item">
            <div className="news-title">
              Nifty closes above 22,000 amid banking rally
            </div>
            <div className="news-meta">
              <span>Moneycontrol</span>
              <span>4h ago</span>
            </div>
          </div>

          <div className="news-item">
            <div className="news-title">
              TCS announces new AI partnership with global firm
            </div>
            <div className="news-meta">
              <span>Bloomberg</span>
              <span>6h ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
