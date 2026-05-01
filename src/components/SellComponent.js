import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import axios from "axios";
import { Plus, Minus, X, Info, LoaderCircle } from "lucide-react";
import { toast } from "react-toastify";
import { api } from "../API";

export default function SellComponent({ stock, closeBuy }) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.body.classList.add("modal-open");
    return () => document.body.classList.remove("modal-open");
  }, []);

  const [qty, setQty] = useState(1);
  const handleQtyChange = (event) => {
    setQty(Number(event.target.value));
  };
  const handleSubmitPurchase = async () => {
    let result;
    try {
      setLoading(true);

      result = await axios.post(
        `${api}orders/placeOrder`,
        {
          quantity: qty,
          symbol: stock.symbol,
          close: stock.close,
          mode: "SELL",
        },
        {
          withCredentials: true,
        },
      );

      toast.success(result.data.message || "Sell order placed!");
      setTimeout(() => {
        closeBuy();
      }, 500);
    } catch (err) {
      closeBuy();
      console.error(err);
      toast.error(err.response?.data?.message || err.message || "Sell failed");
    } finally {
      setLoading(false);
    }
  };
  if (loading)
    return (
      <div className="loader-overlay blur">
        <LoaderCircle className="spinner" size={40} />
        <p className="loader-message">Executing sell order...</p>
      </div>
    );

  return (
    <div className="trade-component sell-mode">
      <button className="close-trade-btn" onClick={closeBuy}>
        <X size={20} />
      </button>

      <div className="trade-header">
        <div className="trade-title-group">
          <h3>Sell {stock.symbol}</h3>
          <span className="exchange-label">NSE</span>
        </div>
        <div className="price-badge">
          <small>LTP</small>
          <p>₹{stock.close}</p>
        </div>
      </div>

      <div className="trade-body">
        <div className="trade-input-section">
          <div className="trade-field-group">
            <label>Quantity</label>
            <div className="qty-control">
              <button
                className="control-btn"
                onClick={() => setQty(Math.max(1, Number(qty) - 1))}
              >
                <Minus size={16} />
              </button>
              <input
                type="number"
                value={qty}
                onChange={handleQtyChange}
                min="1"
              />
              <button
                className="control-btn"
                onClick={() => setQty(Number(qty) + 1)}
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          <div className="order-info-card">
            <div className="info-row">
              <span>Exit Value</span>
              <span className="value">
                ₹{(qty * stock.close).toLocaleString("en-IN")}
              </span>
            </div>
            <div className="info-row">
              <span>Execution</span>
              <span className="value">Market Price</span>
            </div>
          </div>
        </div>

        <div className="trade-footer">
          <div className="margin-notice">
            <Info size={14} />
            <span>
              Ensure you have sufficient quantity in your holdings to sell.
            </span>
          </div>
          <Button
            variant="contained"
            fullWidth
            className="confirm-trade-btn"
            onClick={handleSubmitPurchase}
            disabled={loading}
          >
            Sell Now
          </Button>
        </div>
      </div>
    </div>
  );
}
