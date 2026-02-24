import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import axios from "axios";
export default function Orders() {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);
  const [orders, setOrders] = useState([]);
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
  useEffect(() => {
    axios
      .get(`http://localhost:3002/orderHistory/${userDetails?.email}`)
      .then((res) => {
        setOrders(res.data);
        // console.log(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [userDetails]);
  const formatINR = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };
  return (
    <div className="orders-container">
      <div className="order-hero">
        <p className="order-title">Orders</p>
      </div>
      <div className="order-details">
        <table>
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Quantity</th>
              <th>close</th>
              <th>Mode</th>
              <th>Date</th>
              <th>TIme</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const dateObj = new Date(order.createdAt);

              const date = dateObj.toLocaleDateString("en-IN", {
                timeZone: "Asia/Kolkata",
                day: "2-digit",
                month: "short",
                year: "numeric",
              });
              const time = dateObj.toLocaleTimeString("en-IN", {
                timeZone: "Asia/Kolkata",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              });
              return (
                <tr key={order._id}>
                  <td>{order.symbol}</td>
                  <td>{order.qty}</td>
                  <td>{formatINR(order.close)}</td>
                  <td
                    style={{
                      color: order.mode === "BUY" ? "#4CAF50" : "#c62828",
                    }}
                  >
                    {order.mode}
                  </td>
                  <td>{date}</td>
                  <td>{time}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
