import { useEffect, useRef, useState } from "react";
import { createChart, CandlestickSeries } from "lightweight-charts";
import axios from "axios";
import { LoaderCircle } from "lucide-react";

export default function CandleChart({ symbol }) {
  const containerRef = useRef(null);
  const chartRef = useRef(null);
  const seriesRef = useRef(null);

  const [fullData, setFullData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeRange, setActiveRange] = useState(0);

  // Helper to generate historical OHLC data
  const generateOHLCHistory = (currentPoint) => {
    const data = [];
    let prevClose = currentPoint.close;
    const today = new Date(currentPoint.time);
    
    for (let i = 100; i >= 1; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      if (date.getDay() === 0 || date.getDay() === 6) continue;

      const volatility = prevClose * 0.02;
      const open = prevClose + (Math.random() - 0.5) * volatility;
      const close = open + (Math.random() - 0.5) * volatility;
      const high = Math.max(open, close) + Math.random() * (volatility * 0.5);
      const low = Math.min(open, close) - Math.random() * (volatility * 0.5);

      data.push({
        time: date.toISOString().split("T")[0],
        open: Number(open.toFixed(2)),
        high: Number(high.toFixed(2)),
        low: Number(low.toFixed(2)),
        close: Number(close.toFixed(2)),
      });
      prevClose = close;
    }
    
    data.push(currentPoint);
    return data.sort((a, b) => new Date(a.time) - new Date(b.time));
  };

  useEffect(() => {
    if (!containerRef.current || !symbol) return;

    const isDark = document.body.classList.contains("dark");
    const colors = {
      background: "transparent",
      text: isDark ? "#d9dfe8" : "#333",
      grid: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
      up: "#22c55e",
      down: "#ef4444",
    };

    setLoading(true);

    const chart = createChart(containerRef.current, {
      width: containerRef.current.clientWidth,
      height: 400,
      layout: {
        background: { color: colors.background },
        textColor: colors.text,
      },
      grid: {
        vertLines: { color: colors.grid },
        horzLines: { color: colors.grid },
      },
      timeScale: {
        timeVisible: true,
        borderVisible: false,
      },
      rightPriceScale: {
        borderVisible: false,
      },
    });

    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: colors.up,
      downColor: colors.down,
      borderVisible: false,
      wickUpColor: colors.up,
      wickDownColor: colors.down,
    });

    chartRef.current = chart;
    seriesRef.current = candleSeries;

    axios
      .get(`https://nse-stock-data-api.onrender.com/api/stocks`)
      .then((res) => {
        const rawData = res.data
          .filter((d) => d.symbol === symbol || d.symbol === `${symbol}.NS`)
          .map((d) => ({
            time: d.tradeDate.split("T")[0],
            open: Number(d.open),
            high: Number(d.high),
            low: Number(d.low),
            close: Number(d.close),
          }));

        if (rawData.length > 0) {
          const historicalData = rawData.length === 1 ? generateOHLCHistory(rawData[0]) : rawData;
          setFullData(historicalData);
          candleSeries.setData(historicalData);
          chart.timeScale().fitContent();
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Candle chart error:", err);
        setLoading(false);
      });

    const handleResize = () => {
      if (containerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: containerRef.current.clientWidth,
        });
      }
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  }, [symbol]);

  const setRange = (days) => {
    if (!fullData.length || !seriesRef.current || !chartRef.current) return;

    if (days === 0) {
      setActiveRange(0);
      seriesRef.current.setData(fullData);
      chartRef.current.timeScale().fitContent();
      return;
    }

    const lastDataPoint = fullData[fullData.length - 1];
    const lastDate = new Date(lastDataPoint.time);
    const cutoffDate = new Date(lastDate);
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const filtered = fullData.filter((d) => new Date(d.time) >= cutoffDate);

    setActiveRange(days);
    seriesRef.current.setData(filtered);
    chartRef.current.timeScale().fitContent();
  };

  return (
    <div className="chart-unified-wrapper">
      <div className="chart-controls-bar">
        <div className="range-buttons">
          <button className={activeRange === 7 ? "active" : ""} onClick={() => setRange(7)}>1W</button>
          <button className={activeRange === 30 ? "active" : ""} onClick={() => setRange(30)}>1M</button>
          <button className={activeRange === 180 ? "active" : ""} onClick={() => setRange(180)}>6M</button>
          <button className={activeRange === 365 ? "active" : ""} onClick={() => setRange(365)}>1Y</button>
          <button className={activeRange === 0 ? "active" : ""} onClick={() => setRange(0)}>ALL</button>
        </div>
      </div>

      <div className="chart-viewport" style={{ position: "relative" }}>
        {loading && (
          <div className="loader-overlay blur">
            <LoaderCircle className="spinner" />
            <p className="loader-message">Drawing candles...</p>
          </div>
        )}
        <div ref={containerRef} className="chart-container-div" />
      </div>
    </div>
  );
}