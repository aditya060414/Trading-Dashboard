import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, Check } from 'lucide-react';

export default function ChangePassword() {
    const navigate = useNavigate();
    const location = useLocation();
    const [loader, setLoader] = useState(false);
    const [password, setPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confmPassword, setConfPassword] = useState("");
    const [errors, setErrors] = useState({});

    useEffect(() => {
        setPassword("");
        setNewPassword("");
        setConfPassword("");
        setErrors({});
    }, [location.pathname])

    const validate = () => {
        const errs = {};
        if (!password) errs.password = 'Current password is required';
        if (!newPassword || newPassword.length < 8)
            errs.newPassword = 'New password must be at least 8 characters';
        if (newPassword !== confmPassword)
            errs.confmPassword = 'Passwords do not match';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setLoader(true);
        try {
            await axios.patch('http://trading-backend-tf3j.onrender.com/api/v1/update/password', {
                password,
                newPassword
            }, { withCredentials: true });
            toast.success('Password updated successfully!');
            setPassword("");
            setNewPassword("");
            setConfPassword("");
            setErrors({});
        } catch (error) {
            const msg = error?.response?.data?.message || 'Failed to update password';
            toast.error(msg);
        } finally {
            setLoader(false);
        }
    }

    return (
        <div className='change-wrapper'>
            <div className='goback-btn'>
                <button type='button' onClick={() => navigate("/settings")}><ArrowLeft size={20} />Back to Settings</button>
            </div>
            <div className='account-page'>
                <h2>CHANGE PASSWORD</h2>
            </div>
            <div className='change-password'>
                <form onSubmit={handleSubmit} noValidate autoComplete="off">
                    <div className='change-input-field'>
                        <label htmlFor="password">Current Password</label>
                        <div className='input-wrap'>
                            <Lock size={16} className='field-icon' />
                            <input
                                type="password"
                                id="password"
                                name='password'
                                placeholder='Enter password'
                                value={password}
                                onChange={(e) => { setPassword(e.target.value); setErrors(p => ({ ...p, password: "" })); }}
                                className={errors.password ? 'error' : password ? 'valid' : ''}
                                autoComplete="current-password"
                            />
                            {password && !errors.password && (<Check size={15} className="check-icon" />)}
                        </div>
                        {errors.password && <p className="err-msg">{errors.password}</p>}
                    </div>

                    <div className='change-input-field'>
                        <label htmlFor="newPassword">New Password</label>
                        <div className='input-wrap'>
                            <Lock size={16} className='field-icon' />
                            <input
                                type="password"
                                id="newPassword"
                                name='newPassword'
                                placeholder='Enter new password'
                                value={newPassword}
                                onChange={(e) => { setNewPassword(e.target.value); setErrors(p => ({ ...p, newPassword: "" })); }}
                                className={errors.newPassword ? 'error' : newPassword.length >= 8 ? 'valid' : ''}
                                autoComplete="new-password"
                            />
                            {newPassword.length >= 8 && !errors.newPassword && (<Check size={15} className="check-icon" />)}
                        </div>
                        {errors.newPassword && <p className="err-msg">{errors.newPassword}</p>}
                    </div>

                    <div className='change-input-field'>
                        <label htmlFor="confmPassword">Confirm New Password</label>
                        <div className='input-wrap'>
                            <Lock size={16} className='field-icon' />
                            <input
                                type="password"
                                id="confmPassword"
                                name='confmPassword'
                                placeholder='Re-enter new password'
                                value={confmPassword}
                                onChange={(e) => { setConfPassword(e.target.value); setErrors(p => ({ ...p, confmPassword: "" })); }}
                                className={errors.confmPassword ? 'error' : (confmPassword && confmPassword === newPassword) ? 'valid' : ''}
                                autoComplete="new-password"
                            />
                            {confmPassword && confmPassword === newPassword && (<Check size={15} className="check-icon" />)}
                        </div>
                        {errors.confmPassword && <p className="err-msg">{errors.confmPassword}</p>}
                    </div>

                    <hr />
                    <button type="submit" disabled={loader}>
                        {loader ? 'Updating…' : 'Change Password'}
                    </button>
                </form>
            </div>
        </div>
    )
}