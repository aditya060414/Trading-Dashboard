import { useState, useEffect } from "react";
import axios from "axios";
import { LoaderCircle } from "lucide-react";

export default function Funds() {
  const [balance, setBalance] = useState(null);
  const [history, setHistory] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("Deposit");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case "BUY": return "#276e29ff";
      case "ADD": return "#358f38ff";
      case "SELL": return "#f44336";
      case "WITHDRAW": return "#da660eff";
      default: return "#6f1a1aff"; // Default Dark Red
    }
  };

  // fetch balance and history
  const fetchData = async () => {
    try {
      const [balRes, histRes] = await Promise.all([
        axios.get(`https://trading-backend-tf3j.onrender.com/api/v1/funds/balance`, {
          withCredentials: true
        }),
        axios.get(`https://trading-backend-tf3j.onrender.com/api/v1/funds/history`, {
          withCredentials: true
        }),
      ]);
      setBalance(balRes.data.balance || 0);
      setHistory(histRes.data.history || []);
      if(balRes.error){
        alert(balRes.error.message);
      }  
      if(histRes.error){
        alert(histRes.error.message);
      } 
    } catch (err) {
      console.error("Data fetch error", err);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  console.log(balance, history)

  // Transaction Handler
  const handleTransaction = async () => {
    if (!amount || amount <= 0) return alert("Enter a valid amount");
    setLoading(true);

    try {
      const type = modalMode.toLowerCase(); // "deposit" or "withdraw"
      const payload = { amount: Number(amount) };
      if (type === "deposit") {
        const res = await axios.post(`https://trading-backend-tf3j.onrender.com/api/v1/funds/add`, payload, { withCredentials: true });
        alert(res.data.message);
      } else {
        const res = await axios.post(`https://trading-backend-tf3j.onrender.com/api/v1/funds/withdraw`, payload, { withCredentials: true });
        alert(res.data.message);
      }

      setIsModalOpen(false);
      setAmount("");
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Transaction failed");
    } finally {
      setLoading(false);
    }
  };
  // handle cancel
  const handleCancel = () => {
    setIsModalOpen(false);
    setAmount("");
  };
  const formatINR = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };
  if (loading) return <div className="load-circle" ><LoaderCircle className="spinner" /></div>;
  return (
    <div className="funds">
      <div className="funds-info">
        <div className="wallet">
          <h5>Total fund balance</h5>
          <p>{balance !== null ? formatINR(balance) : "0"}</p>

          <div className="deposit-withdraw-btns">
            <button
              className="btn-deposit"
              onClick={() => {
                setModalMode("Deposit");
                setIsModalOpen(true);
              }}
            >
              Deposit
            </button>
            <button
              className="btn-withdraw"
              onClick={() => {
                setModalMode("Withdraw");
                setIsModalOpen(true);
              }}
            >
              Withdraw
            </button>
          </div>
        </div>
        {/* <div className="investment-graph">graph</div> */}
      </div>
      <div className="transactions">
        <h5>Transactions</h5>
        <table>
          <thead>
            <tr>
              <th>Type</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Time</th>
              <th>Stock</th>
            </tr>
          </thead>
          <tbody>
            {history?.map((h) => {
              const dateObj = new Date(h.createdAt);

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
                <tr
                  key={h._id}
                  className={h.type === "WITHDRAW" ? "withdraw-row" : "deposit-row"}
                >
                  <td style={{ color: getStatusColor(h.type) }}>{h.type}</td>
                  <td className="amount">₹ {h.amount}</td>
                  <td>{date}</td>
                  <td>{time}</td>
                  <td style={{ color: getStatusColor(h.type) }}>{h.type === "BUY" || h.type === "SELL" ? h.symbol : "-"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {(!history || history.length === 0) && (
          <p style={{ textAlign: "center", padding: "20px", color: "#999" }}>
            No transactions found.
          </p>
        )}
      </div>
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{modalMode} Funds</h3>
            <p>Available Fund: {balance !== null ? formatINR(balance) : "0"}</p>
            <div
              className={`input-box ${modalMode === "Withdraw" && balance < amount ? "input-text-red" : ""}`}
            >
              <span>₹</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                autoFocus
              />
            </div>
            <div className="modal-actions">
              <button disabled={loading} onClick={handleCancel}>
                Cancel
              </button>
              <button
                disabled={loading}
                className={modalMode.toLowerCase()}
                onClick={handleTransaction}
              >
                {loading ? "Processing..." : `Confirm ${modalMode}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
