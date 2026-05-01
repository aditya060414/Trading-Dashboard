import { useState, useEffect, useRef } from "react";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import { useAuth } from "../Auth";
import { LoaderCircle } from "lucide-react";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import EmailIcon from "@mui/icons-material/Email";
import GitHubIcon from "@mui/icons-material/GitHub";
import { api } from "../API";

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
        axios.get(`${api}portfolio/${user.id}`, {
          withCredentials: true,
        }),
        axios.get(`${api}funds/balance`, {
          withCredentials: true,
        }),
      ]);

      setPortfolioData(portfolioRes.data);
      setFunds(fundsRes.data.balance || 0);
    } catch (err) {
      console.error("Data fetch error", err);
      if (err.response.data.message) {
        alert(err.response.data.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const profitValue =
    portfolioData?.portfolioValue - portfolioData?.investedAmount || 0;

  // Chart Configuration
  const chartData = {
    labels: portfolioData?.allocation?.map((s) => s.symbol) || [],
    datasets: [
      {
        label: "Today's Profit / Loss",
        data: portfolioData?.allocation?.map((s) => s.dailyGain) || [],
        backgroundColor: portfolioData?.allocation?.map((s) =>
          s.dailyGain >= 0 ? "#2ecc71" : "#ff4d4d",
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

  const [news, setNews] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const token = process.env.REACT_APP_FINNHUB_API_KEY;
        if (!token) {
          console.warn(
            "Finnhub API key is missing. Please set REACT_APP_FINNHUB_API_KEY in your .env file.",
          );
          return;
        }
        const res = await fetch(
          `https://finnhub.io/api/v1/news?category=general&token=${token}`,
        );
        const data = await res.json();

        setNews(data);
      } catch (err) {
        console.error("Failed to fetch news:", err);
      }
    };

    fetchNews();
  }, []);
  const containerRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    let interval;

    if (!isHovering && news.length > 0) {
      interval = setInterval(() => {
        const container = containerRef.current;
        if (container) {
          // Check if we've reached the bottom (with a small buffer for sub-pixel accuracy)
          if (
            container.scrollTop + container.clientHeight >=
            container.scrollHeight - 2
          ) {
            container.scrollTop = 0;
          } else {
            container.scrollTop += 1;
          }
        }
      }, 40);
    }

    return () => clearInterval(interval);
  }, [isHovering, news]);

  if (loading)
    return (
      <div className="loader-overlay">
        <LoaderCircle className="spinner" />
        <h4 className="loader-brand">
          Market<span>Ex</span>
        </h4>
        <p className="loader-message">Loading your portfolio...</p>
      </div>
    );

  return (
    <div className="summary-container">
      <div className="summary-header">
        <h2>
          {getGreeting()}, <span>{user?.username}</span>
        </h2>
        <p>Welcome back to MarketEx</p>
      </div>

      <div className="portfolio-cards">
        <div className="card">
          <p className="label">Total Portfolio Value</p>
          <h3>
            ₹{(portfolioData?.portfolioValue || 0).toLocaleString("en-IN")}
          </h3>
        </div>

        <div className="card">
          <p className="label">Total Investment</p>
          <h3>
            ₹{(portfolioData?.investedAmount || 0).toLocaleString("en-IN")}
          </h3>
        </div>

        <div className="card">
          <p className="label">Total Profit / Loss</p>
          <h3
            className={`${profitValue !== 0 ? (profitValue > 0 ? "profit" : "loss") : ""}`}
          >
            {profitValue > 0 ? "+" : ""}₹{profitValue.toLocaleString("en-IN")}
          </h3>
        </div>

        <div className="card">
          <p className="label">Available Cash</p>
          <h3>₹{(funds || 0).toLocaleString("en-IN")}</h3>
        </div>
      </div>

      <div className="summary-grid">
        <div className="graph-card">
          <h4>Today's Profit / Loss by Stock</h4>
          <div
            className="graph-container"
            style={{ height: "300px", marginTop: "20px" }}
          >
            {portfolioData?.allocation?.length > 0 ? (
              <Bar data={chartData} options={chartOptions} />
            ) : (
              <p>No holdings to display chart.</p>
            )}
          </div>
        </div>

        <div className="news-card">
          <h4>Market News</h4>

          <div
            className="news-container"
            ref={containerRef}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            {news && news.length > 0 ? (
              news.map((item, index) => (
                <div
                  className="news-item"
                  key={index}
                  onClick={() => window.open(item.url, "_blank")}
                >
                  <div className="news-title">{item.headline}</div>

                  <div className="news-meta">
                    <span>{item.source}</span> •{" "}
                    <span>
                      {new Date(item.datetime * 1000).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div
                className="no-news-message"
                style={{
                  padding: "20px",
                  textAlign: "center",
                  color: "var(--text-muted)",
                }}
              >
                {process.env.REACT_APP_FINNHUB_API_KEY
                  ? "No news items found."
                  : "Please configure your Finnhub API key to see market news."}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="my-details-card">
        <div className="owner-details">
          <h4>Project Owner</h4>
          <p>Aditya Singh</p>
        </div>
        <div className="owner-links">
          <a
            href="https://www.linkedin.com/in/aditya-singh-0604adi/"
            target="_blank"
            rel="noopener noreferrer"
            title="LinkedIn"
          >
            <LinkedInIcon />
          </a>
          <a
            href="https://www.instagram.com/aditya___029/?hl=en"
            target="_blank"
            rel="noopener noreferrer"
            title="Instagram"
          >
            <InstagramIcon />
          </a>
          <a
            href="mailto:singh.aditya.44618@gmail.com?subject=Contact from MarketEx"
            title="Email"
          >
            <EmailIcon />
          </a>
          <a
            href="https://github.com/aditya060414"
            target="_blank"
            rel="noopener noreferrer"
            title="GitHub"
          >
            <GitHubIcon />
          </a>
        </div>
      </div>
    </div>
  );
}
