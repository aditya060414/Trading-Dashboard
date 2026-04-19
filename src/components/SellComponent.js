
import { useState } from "react";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
export default function SellComponent({ stock, closeBuy }) {
  const [loading, setLoading] = useState(false);

  const [qty, setQty] = useState(null);
  const handleQtyChange = (event) => {
    setQty(Number(event.target.value));
  };
  const handleSubmitPurchase = async () => {
    let result;
    try {
      setLoading(true);

      result = await axios.post("https://trading-backend-tf3j.onrender.com/api/v1/orders/placeOrder", {
        quantity: qty,
        symbol: stock.symbol,
        close: stock.close,
        mode: "SELL",
      }, {
        withCredentials: true
      });

      alert(result.data.message);
      closeBuy();
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="buy-sell-component">
      <div className="container">
        <div className="hero-section">
          <h5 style={{ fontSize: "1.7rem" }}>Sell Stock</h5>
          <Tooltip title="close">
            <Button variant="outlined" color="error" onClick={closeBuy}>
              <CloseIcon />
            </Button>
          </Tooltip>
        </div>
        <div className="stock-description">
          <p style={{ fontSize: "0.9rem" }}>Company: {stock.symbol}</p>
          <section className="price-desc">
            <p style={{ fontSize: "1.5rem" }}>
              &#8377;&nbsp;<b>{stock.close}</b>
            </p>
          </section>
        </div>

        <div className="sell-quantity">
          <label htmlFor="qty">Qty:</label>
          <input
            id="qty"
            type="number"
            value={qty}
            onChange={handleQtyChange}
            placeholder="Quantity"
          />
          {/* <p>Max Qty. : {holdingsData?.qty ?? 0}</p> */}
        </div>
        <div className="sell-purchase-button">
          <Button
            variant="contained"
            size="small"
            onClick={handleSubmitPurchase}
            disabled={loading}
          >
            {loading ? "Processing..." : "Confirm Purchase"}
          </Button>
        </div>
      </div>
    </div>
  );
}
