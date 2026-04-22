import { useState, useEffect } from "react";
import axios from "axios";
import { LoaderCircle, ArrowUpRight, ArrowDownRight, Inbox } from "lucide-react";

export default function Orders() {
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`https://trading-backend-tf3j.onrender.com/api/v1/orders/history`, {
          withCredentials: true,
        });
        setOrders(res.data.data);
      } catch (error) {
        console.log("Error fetching data.", error.message);
        if(error.response.data.message){
          alert(error.response.data.message);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [])

  

  if (loading) return (
    <div className="loader-overlay">
      <LoaderCircle className="spinner" size={48} />
      <h4 className="loader-brand">Market<span>Ex</span></h4>
      <p className="loader-message">Loading your trade history...</p>
    </div>
  );

  if (!orders || !orders.length) return (
    <div className="orders-empty-state">
      <div className="empty-icon-wrapper">
        <Inbox size={64} strokeWidth={1} />
      </div>
      <h3>No Orders Yet</h3>
      <p>Your trade history will appear here once you start trading.</p>
    </div>
  );

  return (
    <div className="orders-wrapper">
      <div className="orders-header">
        <h2>Order History</h2>
        <div className="orders-count">{orders.length} Total Trades</div>
      </div>
      
      <div className="orders-table-container">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Stock</th>
              <th>Type</th>
              <th>Qty</th>
              <th>Status</th>
              <th>Amount</th>
              <th>Date & Time</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const dateObj = new Date(order.createdAt);
              const formattedDate = dateObj.toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              });
              const formattedTime = dateObj.toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <tr key={order._id}>
                  <td>
                    <div className="stock-cell">
                      <span className="symbol-main">{order.symbol}</span>
                    </div>
                  </td>
                  <td>
                    <div className={`mode-badge ${order.mode === "BUY" ? "buy" : "sell"}`}>
                      {order.mode === "BUY" ? (
                        <ArrowUpRight size={14} />
                      ) : (
                        <ArrowDownRight size={14} />
                      )}
                      {order.mode}
                    </div>
                  </td>
                  <td>
                    <span className="qty-value">{order.qty}</span>
                  </td>
                  <td>
                    <div className={`status-badge ${order.status.toLowerCase()}`}>
                      {order.status}
                    </div>
                  </td>
                  <td>₹{order.totalAmount}</td>
                  <td>
                    <div className="time-cell">
                      <span className="date-part">{formattedDate}</span>
                      <span className="time-part">{formattedTime}</span>
                    </div>
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
