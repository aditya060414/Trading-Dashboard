import { useEffect, useRef, useState } from "react";
export default function SearchBar({ onSelectStock }) {
  console.log("onSelectStock prop:", onSelectStock);
  const ws = useRef(null);
  const debounceRef = useRef(null);
  const containerRef = useRef(null);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  /* WebSocket connection */
  useEffect(() => {
    if (ws.current) return; // prevent double connect

    const socket = new WebSocket("ws://localhost:4000");
    ws.current = socket;

    socket.onmessage = (event) => {
      setResults(JSON.parse(event.data));
    };

    return () => {
      socket.close();
      ws.current = null;
    };
  }, []);

  /* Input handler with debounce */
  const handleChange = (e) => {
    const value = e.target.value.toUpperCase();
    setQuery(value);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
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
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectStock = (stock) => {
    if (typeof onSelectStock !== "function") {
      console.error("onSelectStock missing");
      return;
    }
    onSelectStock(stock);
    setResults([]);
  };
  return (
    <>
      <div className="mx-search-container" ref={containerRef}>
        <input
          className="mx-search-input"
          placeholder="Search stock..."
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
                      key={s._id}
                      className="mx-search-row"
                      onClick={() => handleSelectStock(s)}
                    >
                      <td className="mx-symbol">{s.symbol}</td>
                      <td className="price-up">₹{s.open}</td>
                      <td className="price-up">₹{s.high}</td>
                      <td className="price-down">₹{s.low}</td>
                      <td
                        className={`x-number ${
                          isPositive ? "price-up" : "price-down"
                        }`}
                      >
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
    </>
  );
}
