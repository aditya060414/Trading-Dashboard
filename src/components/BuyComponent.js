import { useState } from "react";

import Button from "@mui/material/Button";
import axios from "axios";
import { LoaderCircle, Plus, Minus, X, Info } from "lucide-react";
import { toast } from "react-toastify";

export default function BuyComponent({ stock, closeBuy }) {
  const [loading, setLoading] = useState(false);

  const [qty, setQty] = useState(1);
  const handleQtyChange = (event) => {
    setQty(event.target.value);
  };

  const handleSubmitPurchase = async () => {
    if (!qty || qty <= 0) {
      toast.error("Quantity must be greater than 0");
      closeBuy();
      return;
    }

    try {
      setLoading(true);

      const result = await axios.post("https://trading-backend-tf3j.onrender.com/api/v1/orders/placeOrder", {
        quantity: qty,
        symbol: stock.symbol,
        close: stock.close,
        mode: "BUY",
      }, {
        withCredentials: true
      })

      toast.success(result.data.message || "Order placed successfully!");
      setTimeout(() => {
        closeBuy();
      }, 500);
      
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || err.message || "Order failed");
    } finally {
      setLoading(false);
    }
  };
  if (loading) return (
    <div className="loader-overlay blur">
      <LoaderCircle className="spinner" size={40} />
      <p className="loader-message">Executing buy order...</p>
    </div>
  );

  return (
    <div className="trade-component buy-mode">
      <button className="close-trade-btn" onClick={closeBuy}>
        <X size={20} />
      </button>

      <div className="trade-header">
        <div className="trade-title-group">
          <h3>Buy {stock.symbol}</h3>
          <span className="exchange-label">NSE</span>
        </div>
        <div className="price-badge">
          <small>LTP</small>
          <p>₹{stock.close}</p>
        </div>
      </div>

      <div className="trade-body">
        <div className="trade-input-section">
          <div className="input-group">
            <label>Quantity</label>
            <div className="premium-qty-control">
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
              <span>Total Value</span>
              <span className="value">₹{(qty * stock.close).toLocaleString('en-IN')}</span>
            </div>
            <div className="info-row">
              <span>Order Type</span>
              <span className="value">Market</span>
            </div>
          </div>
        </div>

        <div className="trade-footer">
          <div className="margin-notice">
            <Info size={14} />
            <span>Market orders are executed at the best available price.</span>
          </div>
          <Button
            variant="contained"
            fullWidth
            className="confirm-trade-btn"
            onClick={handleSubmitPurchase}
            disabled={loading}
          >
            Buy Now
          </Button>
        </div>
      </div>
    </div>
  );
}
