import * as React from "react";
import { useState, useEffect } from "react";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { useNavigate } from "react-router-dom";
export default function BuyComponent({ stock, closeBuy }) {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);
  const [alignment, setAlignment] = React.useState("nifty");

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
  const handleChange = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  const [qty, setQty] = useState(1);
  const handleQtyChange = (event) => {
    console.log(event.target.value);
    setQty(event.target.value);
  };
  const handleSubmitPurchase = async () => {
    if (!qty || qty <= 0) {
      alert("Quantity must be greater than 0");
      closeBuy();
      return;
    }
    try {
      const response = await axios.post("http://localhost:3002/orders", {
        quantity: qty,
        symbol: stock.symbol,
        close: stock.close,
        email: userDetails?.email,
        mode: "BUY",
      });
      alert("Order Placed Successfully");
      closeBuy();
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (err) {
      console.error(err);
      alert("Failed to place order");
    }
  };
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
          >
            Confirm Purchase
          </Button>
        </div>
      </div>
    </div>
  );
}
