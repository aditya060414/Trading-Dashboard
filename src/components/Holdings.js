import { holdingsData } from "../data/data";
import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Holdings() {

  const [allHoldings, setAllHoldings] = useState([]);


useEffect(() => {
  axios.get("http://localhost:3002/allHoldings").then((res) => {
    console.log(res.data);
    setAllHoldings(res.data);
  });
}, []);
  return (
    <div className="holdings-container">
      <div className="holdings-table">
        <h3>Holdings</h3>
        <table>
          <thead>
            <tr>
              <th>Instrument</th>
              <th>Qty.</th>
              <th>Avg. cost</th>
              <th>LTP</th>
              <th>Cur. val</th>
              <th>P&L</th>
              <th>Net chg.</th>
              <th>Day chg.</th>
            </tr>
          </thead>
          <tbody style={{ margin: "5px 0 0 0" }}>
            {allHoldings.map((stock, index) => (
              <tr key={index}>
                <td>{stock.instrument}</td>
                <td>{stock.qty}</td>
                <td>{stock.avgCost}</td>
                <td>{stock.ltp}</td>
                <td>{stock.curVal}</td>
                <td style={{ color: stock.pnl >= 0 ? "#4CAF50" : "#c62828" }}>
                  {stock.pnl}
                </td>
                <td
                  style={{ color: stock.netChg >= 0 ? "#4CAF50" : "#c62828" }}
                >
                  {stock.netChg}%
                </td>
                <td
                  style={{ color: stock.dayChg >= 0 ? "#4CAF50" : "#c62828" }}
                >
                  {stock.dayChg}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="holdings-value">
        <div className="conatiner">
          <p className="main-amount">29,875.</p>
          <p className="decimal-amount">55</p>
          <p className="value-type">Total Investment</p>
        </div>
        <div className="conatiner">
          <p className="main-amount">31,428.</p>
          <p className="decimal-amount">95</p>
          <p className="value-type">Total Investment</p>
        </div>
        <div className="conatiner">
          <p className="main-amount" style={{ color: "#4CAF50" }}>
            +1,553.40 (+5.20%)
          </p>
          <p className="decimal-amount">&nbsp;</p>
          <p className="value-type">P&L</p>
        </div>
      </div>
    </div>
  );
}
