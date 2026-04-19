// import { useEffect, useRef, useState } from "react";
// import { createChart, LineSeries } from "lightweight-charts";
// import axios from "axios";
// import { LoaderCircle } from "lucide-react";

export default function LineChart({ symbol }) {
  return (
    <div>
      <h1>Line Chart(Coming soon)</h1>
    </div>
  )
  // const containerRef = useRef(null);
  // const chartRef = useRef(null);
  // const seriesRef = useRef(null);

  // const [fullData, setFullData] = useState([]);
  // const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   if (!containerRef.current || !symbol) return;

  //   setLoading(true);

  //   /* 1. CREATE CHART */
  //   const chart = createChart(containerRef.current, {
  //     width: containerRef.current.clientWidth,
  //     height: 400, // Fixed height or responsive
  //     layout: {
  //       background: { color: "#ffffff" },
  //       textColor: "#333",
  //     },
  //     grid: {
  //       vertLines: { color: "#f0f0f0" },
  //       horzLines: { color: "#f0f0f0" },
  //     },
  //     timeScale: {
  //       timeVisible: true,
  //       borderVisible: true,
  //     },
  //   });

  //   /* 2. ADD SERIES */
  //   const lineSeries = chart.addSeries(LineSeries, {
  //     color: "#2563eb", // Blue color
  //     lineWidth: 2,
  //   });

  //   chartRef.current = chart;
  //   seriesRef.current = lineSeries;

  //   /* 3. FETCH & FILTER DATA */
  //   axios
  //     .get(`https://nse-stock-data-api.onrender.com/api/stocks`)
  //     .then((res) => {
  //       // Filter by symbol and sort by date ascending
  //       const filteredData = res.data
  //         .filter((d) => d.symbol === symbol || d.symbol === `${symbol}.NS`)
  //         .map((d) => ({
  //           time: d.tradeDate.split("T")[0],
  //           value: Number(d.close),
  //         }))
  //         .sort((a, b) => new Date(a.time) - new Date(b.time)); // CRITICAL: Must be sorted

  //       if (filteredData.length > 0) {
  //         setFullData(filteredData);
  //         lineSeries.setData(filteredData);
  //         chart.timeScale().fitContent();
  //       }
  //       setLoading(false);
  //     })
  //     .catch((err) => {
  //       console.error("Chart data error:", err);
  //       setLoading(false);
  //     });

  //   /* 4. RESPONSIVE RESIZE */
  //   const handleResize = () => {
  //     chart.applyOptions({
  //       width: containerRef.current.clientWidth,
  //     });
  //   };

  //   window.addEventListener("resize", handleResize);

  //   return () => {
  //     window.removeEventListener("resize", handleResize);
  //     chart.remove();
  //   };
  // }, [symbol]); // Re-run when symbol changes

  // /* 5. RANGE FILTER LOGIC */
  // const setRange = (days) => {
  //   if (!fullData.length || !seriesRef.current) return;

  //   if (days === 0) {
  //     seriesRef.current.setData(fullData);
  //     chartRef.current.timeScale().fitContent();
  //     return;
  //   }

  //   const lastDataPoint = fullData[fullData.length - 1];
  //   const lastDate = new Date(lastDataPoint.time);
  //   const cutoffDate = new Date(lastDate);
  //   cutoffDate.setDate(cutoffDate.getDate() - days);

  //   const filtered = fullData.filter((d) => new Date(d.time) >= cutoffDate);

  //   seriesRef.current.setData(filtered);
  //   chartRef.current.timeScale().fitContent();
  // };

  // return (
  //   <div className="chart-wrapper" style={{ position: "relative" }}>
  //     {loading && <div className="chart-loader"><LoaderCircle className="spinner" /></div>}

  //     <div className="chart-controls" style={{ marginBottom: "10px" }}>
  //       <button onClick={() => setRange(7)}>1W</button>
  //       <button onClick={() => setRange(30)}>1M</button>
  //       <button onClick={() => setRange(180)}>6M</button>
  //       <button onClick={() => setRange(365)}>1Y</button>
  //       <button onClick={() => setRange(0)}>ALL</button>
  //     </div>

  //     <div
  //       ref={containerRef}
  //       style={{ width: "100%", height: "400px" }}
  //     />
  //   </div>
  // );
}