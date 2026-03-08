import { useEffect, useRef, useState } from "react";
import { createChart, LineSeries } from "lightweight-charts";
import axios from "axios";

export default function LineChart({ symbol }) {
  const containerRef = useRef(null);
  const chartRef = useRef(null);
  const seriesRef = useRef(null);

  const [fullData, setFullData] = useState([]);

  useEffect(() => {
    if (!containerRef.current) return;

    /*  CREATE CHART */
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
        timeVisible: true,
        borderVisible: true,
      },

      rightPriceScale: {
        borderVisible: true,
        scaleMargins: {
          top: 0.15,
          bottom: 0.15,
        },
      },
    });

    /*  LINE SERIES */
    const lineSeries = chart.addSeries(LineSeries, {
      color: "#ef4444",
      lineWidth: 3,
    });

    chartRef.current = chart;
    seriesRef.current = lineSeries;

    /*  FETCH DATA */
    axios
      .get(`http://localhost:3001/stocks/history?symbol=${symbol}`)
      .then((res) => {
        const data = res.data.map((d) => ({
          time: d.tradeDate.split("T")[0],
          value: d.close,
        }));

        setFullData(data);
        lineSeries.setData(data);
        chart.timeScale().fitContent();
      });

    /*  RESPONSIVE RESIZE */
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

  /*  RANGE FILTER */
  const setRange = (days) => {
    if (!fullData.length || !seriesRef.current) return;

    if (days === 0) {
      seriesRef.current.setData(fullData);
      chartRef.current.timeScale().fitContent();
      return;
    }

    const lastDate = new Date(fullData[fullData.length - 1].time);
    const cutoff = new Date(lastDate);
    cutoff.setDate(cutoff.getDate() - days);

    const filtered = fullData.filter(
      (d) => new Date(d.time) >= cutoff
    );

    seriesRef.current.setData(filtered);
    chartRef.current.timeScale().fitContent();
  };

  return (
    <>
      {/* RANGE BUTTONS */}
      <div className="chart-controls">
        <button onClick={() => setRange(7)}>1W</button>
        <button onClick={() => setRange(30)}>1M</button>
        <button onClick={() => setRange(180)}>6M</button>
        <button onClick={() => setRange(365)}>1Y</button>
        <button onClick={() => setRange(0)}>ALL</button>
      </div>

      {/* CHART */}
      <div
        ref={containerRef}
        style={{ width: "100%", height: "90%" }}
      />
    </>
  );
}