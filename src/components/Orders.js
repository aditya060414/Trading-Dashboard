import { useState, useEffect } from "react";
import axios from "axios";
import { LoaderCircle } from "lucide-react";

export default function Orders() {
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:3002/api/v1/orders/history`, {
          withCredentials: true,
        });
        setOrders(res.data.data);
      } catch (error) {
        console.log("Error fetching data.", error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [])

  const formatINR = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };
  const getStatusColor = (status) => {
    switch (status) {
      case "COMPLETED": return "#4CAF50"; // Green
      case "PENDING": return "#FF9800"; // Orange
      case "FAILED": return "#f44336"; // Red
      default: return "#c62828"; // Default Dark Red
    }
  };

  if (loading) return <div className="load-circle" ><LoaderCircle className="spinner" /></div>;
  if (!orders || !orders.length) return <div className="p-10" style={{ display: 'flex', position: 'absolute', top: '50%', left: '50%' }}>No orders found.</div>;
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
              <th>Mode</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
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
                  <td
                    style={{
                      color: order.mode === "BUY" ? "#4CAF50" : "#c62828",
                    }}
                  >
                    {order.mode}
                  </td>
                  <td>{date}</td>
                  <td>{time}</td>
                  <td style={{
                    color: getStatusColor(order.status),
                  }}>{order.status}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
