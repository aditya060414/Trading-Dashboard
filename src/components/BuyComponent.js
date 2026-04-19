
import { useState} from "react";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { LoaderCircle } from "lucide-react";

export default function BuyComponent({ stock, closeBuy }) {
  const [loading, setLoading] = useState(false);

  const [qty, setQty] = useState(1);
  const handleQtyChange = (event) => {
    setQty(event.target.value);
  };

  const handleSubmitPurchase = async () => {
    if (!qty || qty <= 0) {
      alert("Quantity must be greater than 0");
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

      alert(result.data.message);
      closeBuy();
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };
  if (loading) return <div className="load-circle" ><LoaderCircle className="spinner" /></div>;
  return (
    <div className="buy-sell-component">
      <div className="container">
        <div className="hero-section">
          <h5 style={{ fontSize: "1.7rem" }}>Buy Stock</h5>
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
        <div className="quantity">
          <label htmlFor="qty">Qty:</label>
          <input
            id="qty"
            type="number"
            value={qty}
            onChange={handleQtyChange}
            placeholder="Quantity"
          />
          <br />
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
