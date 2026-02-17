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
export default function SellComponent({ stock, closeBuy }) {
  // console.log("Stock received:", stock);
  const [alignment, setAlignment] = React.useState("nifty");

  const handleChange = (event, newAlignment) => {
    setAlignment(newAlignment);
  };
  const [holdingsData, setHoldingsData] = useState([]);
  useEffect(() => {
    if (!stock?.name) return;
    try {
      axios.get("http://localhost:3002/fetchOrders").then((res) => {
        const stockDetail = res.data.find((item) => item.name === stock.name);
        console.log(stockDetail);
        setHoldingsData(stockDetail);
      });
    } catch (err) {
      console.error(err);
      alert("Failed to fetch holdings data!");
    }
  }, [stock]);
  const [qty, setQty] = useState(1);
  const handleQtyChange = (event) => {
    setQty(Number(event.target.value));
  };
  const handleSubmitPurchase = async () => {
    if (!holdingsData || holdingsData.qty === 0) {
      alert(`You don't have any holdings of ${stock.name}`);
      closeBuy();
      return;
    }
    if (!holdingsData || qty > holdingsData.qty) {
      alert("Entered quantity exceeds available holdings.");
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
    try {
      const response = await axios.post("http://localhost:3002/orders", {
        quantity: qty,
        name: stock.name,
        price: stock.price,
        mode: "SELL",
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
          <h5 style={{ fontSize: "1.7rem" }}>Sell Stock</h5>
          <ToggleButtonGroup
            color="primary"
            value={alignment}
            exclusive
            onChange={handleChange}
            aria-label="Platform"
          >
            <ToggleButton value="nifty" className="toggle">
              Nifty
            </ToggleButton>
            <ToggleButton value="sensex">Sensex</ToggleButton>
          </ToggleButtonGroup>
          <Tooltip title="close">
            <Button variant="outlined" color="error" onClick={closeBuy}>
              <CloseIcon />
            </Button>
          </Tooltip>
        </div>
        <div className="stock-description">
          <p style={{ fontSize: "0.9rem" }}>Company: {stock.name}</p>
          <section className="price-desc">
            <p style={{ fontSize: "1.5rem" }}>
              &#8377;&nbsp;<b>{stock.price}</b>
            </p>
            <p
              style={{ color: stock.percent >= 0 ? "#4CAF50" : "#c62828" }}
              className="percentage-desc"
            >
              <span>
                {stock.isDown ? (
                  <KeyboardArrowDownIcon className="down" />
                ) : (
                  <KeyboardArrowUpIcon className="up" />
                )}
              </span>
              <span>{stock.percent}%</span>
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
          >
            Confirm Purchase
          </Button>
        </div>
      </div>
    </div>
  );
}
