import { positionsData } from "../data/data";
import React, { useState, useEffect } from "react";
import axios from "axios";
export default function Positions() {
  const [allPositions, setAllPositions] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3002/allPositions").then((res) => {
      setAllPositions(res.data);
    });
  }, []);
  return (
    <div className="position-container">
      <p className="position-header">Positions</p>
      <div className="position-data">
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Instrument</th>
              <th>Qty.</th>
              <th>Avg. cost</th>
              <th>LTP</th>
              <th>P&L</th>
              <th>Chg.</th>
            </tr>
          </thead>
          <tbody style={{ margin: "5px 0 0 0" }}>
            {allPositions.map((position, index) => (
              <tr key={index}>
                <td>{position.product}</td>
                <td>{position.instrument}</td>
                <td>{position.qty}</td>
                <td>{position.avgCost}</td>
                <td>{position.ltp}</td>
                <td
                  style={{ color: position.pnl >= 0 ? "#4CAF50" : "#c62828" }}
                >
                  {position.pnl}
                </td>
                <td
                  style={{ color: position.chg >= 0 ? "#4CAF50" : "#c62828" }}
                >
                  {position.chg}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
