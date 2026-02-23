import { useEffect, useRef, useState } from "react";
import { createChart, CandlestickSeries } from "lightweight-charts";
import axios from "axios";

export default function CandleChart({ symbol }) {
  const containerRef = useRef(null);
  const chartRef = useRef(null);
  const seriesRef = useRef(null);

  const [fullData, setFullData] = useState([]);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      width: containerRef.current.clientWidth,
      height: containerRef.current.clientHeight,

      layout: {
        background: { color: "#ffffff" },
        textColor: "#333",
      },

      grid: {
        vertLines: { color: "#eee" },
        horzLines: { color: "#eee" },
      },

      timeScale: {
        visible: true, 
        borderVisible: true, 
        timeVisible: true, 
        secondsVisible: false,
      },

      rightPriceScale: {
        borderVisible: true,
        scaleMargins: {
          top: 0.15,
          bottom: 0.15,
        },
      },
    });
    const candleSeries = chart.addSeries(CandlestickSeries);

    chartRef.current = chart;
    seriesRef.current = candleSeries;

    axios
      .get(`http://localhost:3001/stocks/history?symbol=${symbol}`)
      .then((res) => {
        const data = res.data.map((d) => ({
          time: d.tradeDate.split("T")[0], // YYYY-MM-DD
          open: d.open,
          high: d.high,
          low: d.low,
          close: d.close,
        }));

        setFullData(data);
        candleSeries.setData(data);
        chart.timeScale().fitContent();
      });

    const resizeObserver = new ResizeObserver(() => {
      chart.applyOptions({
        width: containerRef.current.clientWidth,
        height: containerRef.current.clientHeight,
      });
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
      chart.remove();
    };
  }, [symbol]);

  /* 🔹 RANGE FILTER */
  const setRange = (days) => {
    if (!fullData.length || !seriesRef.current) return;

    if (days === 0) {
      seriesRef.current.setData(fullData);
      chartRef.current.timeScale().fitContent();
      return;
    }

    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);

    const filtered = fullData.filter((d) => {
      return new Date(d.time) >= cutoff;
    });

    seriesRef.current.setData(filtered);
    chartRef.current.timeScale().fitContent();
  };

  return (
    <>
      {/* 🔘 RANGE BUTTONS */}
      <div className="chart-controls">
        <button onClick={() => setRange(30)}>1M</button>
        <button onClick={() => setRange(180)}>6M</button>
        <button onClick={() => setRange(365)}>1Y</button>
        <button onClick={() => setRange(0)}>ALL</button>
      </div>
      {/*  CHART */}
      <div ref={containerRef} style={{ width: "100%", height: "100%" }} />
    </>
  );
}
