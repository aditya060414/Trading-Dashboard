import * as React from "react";
import { useState, useEffect } from "react";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { useNavigate } from "react-router-dom";
export default function SellComponent({ stock, closeBuy }) {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    axios
      .get("http://localhost:3002/verify", { withCredentials: true })
      .then((res) => {
        if (!res.data.authenticated) {
          navigate("/login", { replace: true });
        } else {
          setUserDetails(res.data.user);
        }
      })
      .catch(() => {
        navigate("/login", { replace: true });
      });
  }, [navigate]);

  const [holdingsData, setHoldingsData] = useState(null);
  useEffect(() => {
    if (!stock?.symbol || !userDetails?.email) return;
    try {
      axios
        .get(`http://localhost:3002/fetchOrders/${userDetails.email}`)
        .then((res) => {
          const stockDetail = res.data.find(
            (item) => item.symbol === stock.symbol,
          );
          console.log(stockDetail);
          setHoldingsData(stockDetail || null);
        });
    } catch (err) {
      console.error(err);
      alert("Failed to fetch holdings data!");
    }
  }, [stock, userDetails]);
  const [qty, setQty] = useState(1);
  const handleQtyChange = (event) => {
    setQty(Number(event.target.value));
  };
  const handleSubmitPurchase = async () => {
    if (!holdingsData || holdingsData.qty === 0) {
      alert(`You don't have any holdings of ${stock.symbol}`);
      closeBuy();
      return;
    }
    if (!qty || qty <= 0) {
      alert("Quantity must be greater than 0");
      closeBuy();
      return;
    }
    if (qty > holdingsData.qty) {
      alert("Entered quantity exceeds available holdings.");
      closeBuy();
      return;
    }
    const totAmt = qty * stock.close;
    const payload = {
      deposit: totAmt,
    };
    try {
      setLoading(true);
      await Promise.all([
        axios.post("http://localhost:3002/orders", {
          quantity: qty,
          symbol: stock.symbol,
          close: stock.close,
          mode: "SELL",
          email: userDetails?.email,
        }),
        axios.post(`http://localhost:3002/funds/${userDetails.email}`, payload),
      ]);
      alert("Order Placed Successfully");
      closeBuy();
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (err) {
      console.error(err);
      alert("Failed to place order");
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
          <p>Max Qty. : {holdingsData?.qty ?? 0}</p>
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
