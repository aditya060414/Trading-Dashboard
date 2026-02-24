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
        console.log(res.data);
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
              <th>Gross</th>
              <th>Current Value</th>
              <th>P/L</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const current = latestPrice?.[order.symbol] ?? 0;
              const currentValue = current * order.qty;
              const pnl = currentValue - order.gross;
              const roundedPnl = Number(pnl.toFixed(3));

              return (
                <tr key={order._id}>
                  <td>{order.symbol}</td>
                  <td>{order.qty}</td>
                  <td>{formatINR(order.close)}</td>
                  <td>{formatINR(order.gross)}</td>
                  <td>{formatINR(currentValue)}</td>
                  <td style={{ color: roundedPnl >= 0 ? "green" : "red" }}>
                    {roundedPnl}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
    // <div className="holdings-container">
    //   <div className="holdings-table">
    //     <h3>Holdings</h3>
    //     <table>
    //       <thead>
    //         <tr>
    //           <th>Instrument</th>
    //           <th>Qty.</th>
    //           <th>Avg. cost</th>
    //           <th>LTP</th>
    //           <th>Cur. val</th>
    //           <th>P&L</th>
    //           <th>Net chg.</th>
    //           <th>Day chg.</th>
    //         </tr>
    //       </thead>
    //       <tbody style={{ margin: "5px 0 0 0" }}>
    //         {allHoldings.map((stock, index) => (
    //           <tr key={index}>
    //             <td>{stock.instrument}</td>
    //             <td>{stock.qty}</td>
    //             <td>{stock.avgCost}</td>
    //             <td>{stock.ltp}</td>
    //             <td>{stock.curVal}</td>
    //             <td style={{ color: stock.pnl >= 0 ? "#4CAF50" : "#c62828" }}>
    //               {stock.pnl}
    //             </td>
    //             <td
    //               style={{ color: stock.netChg >= 0 ? "#4CAF50" : "#c62828" }}
    //             >
    //               {stock.netChg}%
    //             </td>
    //             <td
    //               style={{ color: stock.dayChg >= 0 ? "#4CAF50" : "#c62828" }}
    //             >
    //               {stock.dayChg}%
    //             </td>
    //           </tr>
    //         ))}
    //       </tbody>
    //     </table>
    //   </div>
    //   <div className="holdings-value">
    //     <div className="conatiner">
    //       <p className="main-amount">29,875.</p>
    //       <p className="decimal-amount">55</p>
    //       <p className="value-type">Total Investment</p>
    //     </div>
    //     <div className="conatiner">
    //       <p className="main-amount">31,428.</p>
    //       <p className="decimal-amount">95</p>
    //       <p className="value-type">Total Investment</p>
    //     </div>
    //     <div className="conatiner">
    //       <p className="main-amount" style={{ color: "#4CAF50" }}>
    //         +1,553.40 (+5.20%)
    //       </p>
    //       <p className="decimal-amount">&nbsp;</p>
    //       <p className="value-type">P&L</p>
    //     </div>
    //   </div>
    // </div>
  );
}
