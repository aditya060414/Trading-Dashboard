import { useEffect, useRef, useState } from "react";

export default function SearchBar({ onSelectStock }) {
  // Use a ref to keep the WebSocket instance across renders
  const ws = useRef(null);
  const debounceRef = useRef(null);
  const containerRef = useRef(null);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  /* WebSocket connection */
  useEffect(() => {
    // 1. Create the socket and assign it to the REF
    ws.current = new WebSocket('ws://localhost:4000/');

    ws.current.onopen = () => {
      console.log("WebSocket Connected");
    };
    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);

      // Check if it's a raw array (what your backend currently sends)
      if (Array.isArray(data)) {
        setResults(data);
      }
      // Or check if it's the wrapped object format
      else if (data.type === "SEARCH_RESULTS") {
        setResults(data.data || []);
      }
    };

    ws.current.onerror = (error) => {
      if (ws.current?.readyState !== WebSocket.CLOSING && ws.current?.readyState !== WebSocket.CLOSED) {
        console.error("WebSocket Error:", error);
      }
    };

    return () => {
      if (ws.current?.readyState === WebSocket.OPEN || ws.current?.readyState === WebSocket.CONNECTING) {
        ws.current.close();
      }
    };
  }, []);

  /* Input handler with debounce */
  const handleChange = (e) => {
    const value = e.target.value.toUpperCase();
    setQuery(value);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Don't search if query is empty
    if (!value.trim()) {
      setResults([]);
      return;
    }

    debounceRef.current = setTimeout(() => {
      // 3. Use ws.current (which is now assigned) to send
      if (ws.current?.readyState === WebSocket.OPEN) {
        ws.current.send(
          JSON.stringify({
            type: "SEARCH",
            query: value,
          }),
        );
      }
    }, 300);
  };

  /* Close dropdown on outside click */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!containerRef.current?.contains(e.target)) {
        setResults([]);
        // Keep the query if you want, or clear it:
        // setQuery(""); 
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectStock = (stock) => {
    if (typeof onSelectStock === "function") {
      onSelectStock(stock);
      setResults([]);
      setQuery("");
    }
  };

  return (
    <div className="mx-search-container" ref={containerRef}>
      <input
        className="mx-search-input"
        placeholder="Search stock (e.g. RELIANCE)..."
        value={query}
        onChange={handleChange}
      />
      {results.length > 0 && (
        <div className="mx-search-dropdown">
          <table className="mx-search-table">
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Open</th>
                <th>High</th>
                <th>Low</th>
                <th>Close</th>
              </tr>
            </thead>
            <tbody>
              {results.map((s) => {
                const isPositive = s.close >= s.open;
                return (
                  <tr
                    key={s._id || s.symbol}
                    className="mx-search-row"
                    onClick={() => handleSelectStock(s)}
                  >
                    <td className="mx-symbol">{s.symbol}</td>
                    <td>₹{s.open}</td>
                    <td>₹{s.high}</td>
                    <td>₹{s.low}</td>
                    <td className={isPositive ? "price-up" : "price-down"}>
                      ₹{s.close}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}