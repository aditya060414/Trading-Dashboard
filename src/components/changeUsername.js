import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ArrowLeft, Lock, User, Check } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { api } from "../API";
export default function ChangeUsername() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loader, setLoader] = useState(false);
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [confirmUsername, setConfirmUsername] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setPassword("");
    setUsername("");
    setConfirmUsername("");
    setErrors({});
  }, [location.pathname]);

  const validate = () => {
    const errs = {};
    if (!password) errs.password = 'Password is required';
    if (!username || !/^[a-zA-Z0-9_]{3,30}$/.test(username))
      errs.username = 'Only letters, numbers, and underscores (3–30 chars)';
    if (username !== confirmUsername)
      errs.confirmUsername = 'Usernames do not match';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoader(true);
    try {
      await axios.patch(`${api}update/username`, { password, username }, { withCredentials: true });
      toast.success('Username updated successfully!');
      setPassword(''); setUsername(''); setConfirmUsername('');
      setErrors({});
    } catch (err) {
      const msg = err?.response?.data?.message || 'Something went wrong';
      toast.error(msg);
    } finally {
      setLoader(false);
    }
  };
  return (
    <div className='change-wrapper'>
      <div className='goback-btn'>
        <button type="button" onClick={() => navigate("/settings")}><ArrowLeft size={20} /> Back to Settings</button>
      </div>
      <div className="account-page">
        <h2>CHANGE USERNAME</h2>
      </div>
      <div className='change-username'>
        <form onSubmit={handleSubmit} noValidate autoComplete="off">
          <div className="change-input-field">
            <label htmlFor="password">Current Password</label>
            <div className='input-wrap'>
              <Lock size={16} className="field-icon" />
              <input type="password" id="password" name="password" placeholder="Enter password" value={password} onChange={(e) => { setPassword(e.target.value); setErrors(p => ({ ...p, password: "" })); }} className={errors.password ? 'error' : password ? 'valid' : ''} autoComplete="new-password" />
              {password && !errors.password && (<Check size={15} className="check-icon" />)}
            </div>
            {errors.password && <p className="err-msg">{errors.password}</p>}
          </div>

          <div className="change-input-field">
            <label htmlFor="username">New Username</label>
            <div className="input-wrap">
              <User size={15} className="field-icon" />
              <input
                type="text" id="username" name="username"
                placeholder="e.g. cool_username_42" maxLength={30}
                value={username}
                onChange={(e) => { setUsername(e.target.value); setErrors(p => ({ ...p, username: '' })); }}
                className={errors.username ? 'error' : username.length >= 3 ? 'valid' : ''}
                autoComplete="off"
              />
              {username.length >= 3 && !errors.username && (<Check size={15} className="check-icon" />)}
            </div>
            {errors.username && <p className="err-msg">{errors.username}</p>}
          </div>

          <div className="change-input-field">
            <label htmlFor="confirmUsername">Confirm New Username</label>
            <div className="input-wrap">
              <User size={15} className="field-icon" />
              <input
                type="text" id="confirmUsername" name="confirmUsername"
                placeholder="Re-enter new username" maxLength={30}
                value={confirmUsername}
                onChange={(e) => { setConfirmUsername(e.target.value); setErrors(p => ({ ...p, confirmUsername: '' })); }}
                className={errors.confirmUsername ? 'error' : confirmUsername && confirmUsername === username ? 'valid' : ''}
                autoComplete="off"
              />
              {confirmUsername && confirmUsername === username && (<Check size={15} className="check-icon" />)}
            </div>
            {errors.confirmUsername && <p className="err-msg">{errors.confirmUsername}</p>}
          </div>

          <hr />
          <button type="submit" disabled={loader}>
            {loader ? 'Updating…' : 'Change Username'}
          </button>
        </form>
      </div>
    </div>
  )
}