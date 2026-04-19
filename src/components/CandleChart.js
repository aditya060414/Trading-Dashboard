// import { useEffect, useRef, useState } from "react";
// import { createChart, CandlestickSeries } from "lightweight-charts";
// import axios from "axios";
// import { LoaderCircle } from "lucide-react";

export default function CandleChart({ symbol }) {
  return (
    <div>
      <h1>Candle Chart(Coming soon)</h1>
    </div>
  )
  // const containerRef = useRef(null);
  // const chartRef = useRef(null);
  // const seriesRef = useRef(null);
  // const [loading, setLoading] = useState(true);
  // const [fullData, setFullData] = useState([]);

  // useEffect(() => {
  //   if (!containerRef.current || !symbol) return;

  //   let isDisposed = false; // Flag to stop async updates

  //   // 1. Setup Chart
  //   const chart = createChart(containerRef.current, {
  //     width: containerRef.current.clientWidth,
  //     height: 400,
  //     layout: { background: { color: "#ffffff" }, textColor: "#333" },
  //     grid: { vertLines: { color: "#f0f0f0" }, horzLines: { color: "#f0f0f0" } },
  //     timeScale: { timeVisible: true, borderVisible: true },
  //   });

  //   const candleSeries = chart.addSeries(CandlestickSeries, {
  //     upColor: "#26a69a",
  //     downColor: "#ef5350",
  //     borderVisible: false,
  //     wickUpColor: "#26a69a",
  //     wickDownColor: "#ef5350",
  //   });

  //   chartRef.current = chart;
  //   seriesRef.current = candleSeries;

  //   // 2. Fetch Data
  //   setLoading(true);
  //   axios
  //     .get(`https://nse-stock-data-api.onrender.com/api/stocks`)
  //     .then((res) => {
  //       if (isDisposed) return; // Stop if component unmounted

  //       const filteredData = res.data
  //         .filter((d) => d.symbol === symbol || d.symbol === `${symbol}.NS`)
  //         .map((d) => ({
  //           time: d.tradeDate.split("T")[0],
  //           open: Number(d.open),
  //           high: Number(d.high),
  //           low: Number(d.low),
  //           close: Number(d.close),
  //         }))
  //         .sort((a, b) => new Date(a.time) - new Date(b.time));

  //       if (filteredData.length > 0 && seriesRef.current) {
  //         setFullData(filteredData);
  //         seriesRef.current.setData(filteredData);
  //         chart.timeScale().fitContent();
  //       }
  //     })
  //     .catch((err) => console.error("API Error", err))
  //     .finally(() => {
  //       if (!isDisposed) setLoading(false);
  //     });

  //   // 3. Robust Resize Handling
  //   const handleResize = () => {
  //     if (!isDisposed && chartRef.current && containerRef.current) {
  //       chartRef.current.applyOptions({ 
  //           width: containerRef.current.clientWidth 
  //       });
  //     }
  //   };

  //   const resizeObserver = new ResizeObserver(handleResize);
  //   resizeObserver.observe(containerRef.current);

  //   // 4. CRITICAL CLEANUP
  //   return () => {
  //     isDisposed = true; // Mark as disposed immediately
  //     resizeObserver.disconnect();
      
  //     if (chartRef.current) {
  //       chartRef.current.remove();
  //       chartRef.current = null;
  //       seriesRef.current = null;
  //     }
  //   };
  // }, [symbol]);

  // const setRange = (days) => {
  //   if (!fullData.length || !seriesRef.current || !chartRef.current) return;

  //   let filtered = fullData;
  //   if (days !== 0) {
  //     const lastDate = new Date(fullData[fullData.length - 1].time);
  //     const cutoff = new Date(lastDate);
  //     cutoff.setDate(cutoff.getDate() - days);
  //     filtered = fullData.filter((d) => new Date(d.time) >= cutoff);
  //   }

  //   seriesRef.current.setData(filtered);
  //   chartRef.current.timeScale().fitContent();
  // };

  // return (
  //   <div className="chart-wrapper" style={{ width: "100%", position: "relative" }}>
  //     {loading && (
  //       <div className="load-circle">
  //         <LoaderCircle className="spinner" />
  //       </div>
  //     )}

  //     <div className="chart-controls" style={{ marginBottom: "10px" }}>
  //       <button onClick={() => setRange(7)}>1W</button>
  //       <button onClick={() => setRange(30)}>1M</button>
  //       <button onClick={() => setRange(180)}>6M</button>
  //       <button onClick={() => setRange(365)}>1Y</button>
  //       <button onClick={() => setRange(0)}>ALL</button>
  //     </div>

  //     <div
  //       ref={containerRef}
  //       style={{
  //         width: "100%",
  //         height: "400px",
  //         display: loading ? "none" : "block", // Don't draw if loading
  //       }}
  //     />
  //   </div>
  // );
}