import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
export default function Holdings() {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);
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
  const [orders, setOrders] = useState([]);
  const [latestPrice, setLatestPrice] = useState({});

  useEffect(() => {
    if (!userDetails?.email) return;
    axios
      .get(`http://localhost:3002/fetchOrders/${userDetails.email}`)
      .then((res) => {
        setOrders(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [userDetails]);

  useEffect(() => {
    if (!orders.length) return;
    const symbols = orders.map((o) => o.symbol);
    axios
      .post("http://localhost:3002/getLatestStock", { symbols })
      .then((res) => {
        setLatestPrice(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [orders]);
  const formatINR = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  return (
    <div className="orders-container">
      <div className="order-hero">
        <p className="order-title">Holdings</p>
      </div>
      <div className="order-details">
        <table>
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Qty</th>
              <th>Buy Price</th>
              <th>Curr Price</th>
              <th>Gross</th>
              <th>Current Value</th>
              <th>P/L</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const current = latestPrice?.[order.symbol]?.close ?? 0;
              const currentValue = current * order.qty;
              const pnl = currentValue - order.gross;
              const roundedPnl = Number(pnl.toFixed(3));

              return (
                <tr
                  key={order._id}
                  className={`${current > order.close ? "green" : "red"}`}
                >
                  <td>{order.symbol}</td>
                  <td>{order.qty}</td>
                  <td>{formatINR(order.close)}</td>
                  <td>{formatINR(current)}</td>
                  <td>{formatINR(order.gross)}</td>
                  <td>{formatINR(currentValue)}</td>
                  <td>
                    {roundedPnl}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
