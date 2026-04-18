import { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import { useAuth } from "../Auth";
import { LoaderCircle } from "lucide-react";
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
  const { user } = useAuth();
  const [portfolioData, setPortfolioData] = useState(null);
  const [funds, setFunds] = useState(0);
  const [loading, setLoading] = useState(true);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    if (hour < 21) return "Good Evening";
    return "Good Night";
  };

  const fetchData = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const [portfolioRes, fundsRes] = await Promise.all([
        axios.get(`http://localhost:3002/api/v1/portfolio/${user.id}`, {
          withCredentials: true,
        }),
        axios.get(`http://localhost:3002/api/v1/funds/balance`, {
          withCredentials: true,
        }),
      ]);

      // portfolioRes.data contains: { portfolioValue, investedAmount, todaysGain, allocation }
      setPortfolioData(portfolioRes.data);
      setFunds(fundsRes.data.balance || 0);
    } catch (err) {
      console.error("Data fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  // Chart Configuration
  const chartData = {
    labels: portfolioData?.allocation?.map((s) => s.symbol) || [],
    datasets: [
      {
        label: "Today's Profit / Loss",
        data: portfolioData?.allocation?.map((s) => s.dailyGain) || [],
        backgroundColor: portfolioData?.allocation?.map((s) =>
          s.dailyGain >= 0 ? "#2ecc71" : "#ff4d4d"
        ),
        borderRadius: 6,
        barThickness: 30,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => `₹${context.raw.toLocaleString("en-IN")}`,
        },
      },
    },
    scales: {
      x: { grid: { display: false } },
      y: {
        ticks: {
          callback: (value) => "₹" + value.toLocaleString("en-IN"),
        },
      },
    },
  };

  if (loading) return <div className="load-circle" ><LoaderCircle className="spinner" /></div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>
          {getGreeting()}, <span>{user?.username}</span>
        </h2>
        <p>Welcome back to MarketEx</p>
      </div>

      <div className="portfolio-cards">
        <div className="card">
          <p className="label">Total Portfolio Value</p>
          <h3>₹{(portfolioData?.portfolioValue || 0).toLocaleString("en-IN")}</h3>
        </div>

        <div className="card">
          <p className="label">Today's Gain</p>
          <h3 className={`profit ${(portfolioData?.todaysGain || 0) >= 0 ? "green" : "red"}`}>
            ₹{(portfolioData?.todaysGain || 0).toLocaleString("en-IN")}
          </h3>
        </div>

        <div className="card">
          <p className="label">Available Cash</p>
          <h3>₹{(funds || 0).toLocaleString("en-IN")}</h3>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="graph-card">
          <h4>Today's Profit / Loss by Stock</h4>
          <div className="graph-container" style={{ height: "300px", marginTop: "20px" }}>
            {portfolioData?.allocation?.length > 0 ? (
              <Bar data={chartData} options={chartOptions} />
            ) : (
              <p>No holdings to display chart.</p>
            )}
          </div>
        </div>

        <div className="news-card">
          <h4>Market News</h4>
          <div className="news-item">
            <div className="news-title">Reliance shares rise after strong quarterly results</div>
            <div className="news-meta"><span>Economic Times</span> • <span>2h ago</span></div>
          </div>
          <div className="news-item">
            <div className="news-title">Nifty closes above 22,000 amid banking rally</div>
            <div className="news-meta"><span>Moneycontrol</span> • <span>4h ago</span></div>
          </div>
          <div className="news-item">
            <div className="news-title">TCS announces new AI partnership with global firm</div>
            <div className="news-meta"><span>Bloomberg</span> • <span>6h ago</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}