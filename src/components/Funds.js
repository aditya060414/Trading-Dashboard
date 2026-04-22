import { useState, useEffect } from "react";
import axios from "axios";
import { LoaderCircle, Wallet, Plus, Minus, History, IndianRupee, X } from "lucide-react";
import Button from "@mui/material/Button";
import { PieChart } from "lucide-react";
import { toast } from "react-toastify";

export default function Funds() {
  const [balance, setBalance] = useState(null);
  const [history, setHistory] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("Deposit");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const getStatusClass = (type) => {
    switch (type) {
      case "BUY": return "buy";
      case "ADD": return "add";
      case "SELL": return "sell";
      case "WITHDRAW": return "withdraw";
      default: return "";
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
        toast.error(balRes.error.message);
      }  
      if(histRes.error){
        toast.error(histRes.error.message);
      } 
    } catch (err) {
      console.error("Data fetch error", err);
      toast.error("Failed to fetch wallet data");
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  // Transaction Handler
  const handleTransaction = async () => {
    if (!amount || amount <= 0) {
      toast.warning("Please enter a valid amount");
      return;
    }
    setLoading(true);

    try {
      const type = modalMode.toLowerCase(); // "deposit" or "withdraw"
      const payload = { amount: Number(amount) };
      if (type === "deposit") {
        const res = await axios.post(`https://trading-backend-tf3j.onrender.com/api/v1/funds/add`, payload, { withCredentials: true });
        toast.success(res.data.message || "Funds added successfully!");
      } else {
        const res = await axios.post(`https://trading-backend-tf3j.onrender.com/api/v1/funds/withdraw`, payload, { withCredentials: true });
        toast.success(res.data.message || "Withdrawal successful!");
      }

      setIsModalOpen(false);
      setAmount("");
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Transaction failed");
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
  if (loading && balance === null) return (
    <div className="loader-overlay blur">
      <LoaderCircle className="spinner" size={48} />
      <p className="loader-message">Fetching your wallet details...</p>
    </div>
  );

  return (
    <div className="funds-wrapper">
      <div className="funds-header">
        <div className="header-left">
          <h2>Funds</h2>
          <p className="funds-subtitle">Manage your wallet and trade balance</p>
        </div>
      </div>

      <div className="funds-top-section">
        <div className="wallet-card">
          <div className="wallet-header">
            <div className="wallet-icon-bg">
              <Wallet size={24} />
            </div>
            <span>Total Balance</span>
          </div>
          <div className="balance-amount">
            {formatINR(balance || 0)}
          </div>
          <div className="wallet-actions">
            <Button 
              variant="contained" 
              className="deposit-action-btn"
              onClick={() => {
                setModalMode("Deposit");
                setIsModalOpen(true);
              }}
              startIcon={<Plus size={18} />}
            >
              Add Funds
            </Button>
            <Button 
              variant="contained" 
              className="withdraw-action-btn"
              onClick={() => {
                setModalMode("Withdraw");
                setIsModalOpen(true);
              }}
              startIcon={<Minus size={18} />}
            >
              Withdraw
            </Button>
          </div>
        </div>
        
        <div className="wallet-illustration-card">
           <PieChart size={120} strokeWidth={1} className="illustration-icon" />
           <div className="illustration-text">
              <h4>Safe & Secure</h4>
              <p>Your funds are protected with bank-grade encryption and real-time monitoring.</p>
           </div>
        </div>
      </div>

      <div className="transactions-section">
        <div className="section-header">
          <History size={20} />
          <h3>Transaction History</h3>
        </div>
        
        <div className="orders-table-container">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Activity</th>
                <th>Amount</th>
                <th>Status / Asset</th>
                <th>Date & Time</th>
              </tr>
            </thead>
            <tbody>
              {history?.map((h) => {
                const dateObj = new Date(h.createdAt);
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
                  <tr key={h._id}>
                    <td>
                      <div className={`transaction-type-cell ${getStatusClass(h.type)}`}>
                        <div className="type-icon">
                          {h.type === "ADD" || h.type === "SELL" ? <Plus size={14} /> : <Minus size={14} />}
                        </div>
                        <span className="type-text">{h.type}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`transaction-amount ${h.type === "ADD" || h.type === "SELL" ? "credit" : "debit"}`}>
                        {h.type === "ADD" || h.type === "SELL" ? '+' : '-'}{formatINR(h.amount)}
                      </span>
                    </td>
                    <td>
                      {h.symbol ? (
                         <div className="asset-tag">
                            <IndianRupee size={12} />
                            <span>{h.symbol}</span>
                         </div>
                      ) : (
                         <span className="status-label-muted">System Transfer</span>
                      )}
                    </td>
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
          {(!history || history.length === 0) && (
            <div className="table-empty-state">
              <p>No transaction records found.</p>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="trade-component fund-modal">
            {loading && (
              <div className="loader-overlay blur">
                <LoaderCircle className="spinner" />
                <p className="loader-message">Processing transaction...</p>
              </div>
            )}
            <button className="close-trade-btn" onClick={handleCancel}>
              <X size={20} />
            </button>

            <div className="trade-header">
              <div className="trade-title-group">
                <h3>{modalMode} Funds</h3>
                <span className="exchange-label">Wallet</span>
              </div>
            </div>
            
            <div className="fund-modal-body">
              <div className="current-balance-preview">
                <small>Available Balance</small>
                <p>{formatINR(balance || 0)}</p>
              </div>

              <div className={`amount-input-wrapper ${modalMode === "Withdraw" && balance < amount ? "error" : ""}`}>
                <div className="input-field-group">
                  <span className="currency-symbol">₹</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    autoFocus
                  />
                </div>
                
                <div className="quick-amount-chips">
                  {[1000, 5000, 10000, 25000].map(val => (
                    <button 
                      key={val} 
                      className="amount-chip"
                      onClick={() => setAmount(val.toString())}
                    >
                      +₹{val >= 1000 ? `${val/1000}k` : val}
                    </button>
                  ))}
                </div>
              </div>
              
              {modalMode === "Withdraw" && balance < amount && (
                <p className="input-error-msg">Insufficient funds for this withdrawal.</p>
              )}
            </div>

            <div className="modal-footer">
              <Button onClick={handleCancel} className="cancel-btn">Cancel</Button>
              <Button 
                variant="contained"
                className={`confirm-btn ${modalMode.toLowerCase()}`}
                disabled={loading || (modalMode === "Withdraw" && balance < amount)}
                onClick={handleTransaction}
              >
                {loading ? <LoaderCircle className="spinner" size={18} /> : `Confirm ${modalMode}`}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


