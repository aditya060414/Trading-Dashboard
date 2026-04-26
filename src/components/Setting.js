
import { useNavigate } from 'react-router';
import { useAuth } from '../Auth';
import { useState } from 'react';
import ChangeUsername from './changeUsername';
import {
  User,
  Shield,
  Bell,
  Monitor,
  Moon,
  Sun,
  ChevronRight,
  LogOut,
  Lock
} from 'lucide-react';
import Switch from "@mui/material/Switch";

export default function Settings() {
  const navigate = useNavigate();
  const { user, logout, theme, toggleTheme } = useAuth();
  const [changeUsername, setChangeUsername] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const handleChangeClick = (path) => {
    setChangeUsername(true);
    navigate(path) 
  }
  return (
    <>
      <div className="settings-wrapper">
        <div className="settings-header">
          <div className="header-left">
            <h2>Settings</h2>
            <p className="settings-subtitle">Manage your account preferences and security</p>
          </div>
        </div>

        <div className="settings-grid">
          {/* Profile Card */}
          <div className="settings-card profile-main-card">
            <div className="profile-top">
              <div className="avatar-big">
                {user?.username?.charAt(0).toUpperCase() || <User size={40} />}
              </div>
              <div className="profile-meta">
                <h3>{user?.username || "Investor Account"}</h3>
                <p className="user-id">UID: {user?.id?.slice(-8).toUpperCase() || "N/A"}</p>
              </div>
            </div>
            <div className="profile-details-grid">
              <div className="detail-item">
                <small>Email Address</small>
                <p>{user?.email || "user@marketex.com"}</p>
              </div>
              <div className="detail-item">
                <small>Account Status</small>
                <p className="status-verified">Verified</p>
              </div>
            </div>
          </div>

          <div className="settings-sections-container">
            {/* Security Section */}
            <div className="settings-block">
              <div className="block-header">
                <Shield size={20} />
                <h3>Security & Privacy</h3>
              </div>
              <div className="settings-list">
                <div className="settings-row clickable" onClick={() => { handleChangeClick("/changeUsername") }}>
                  <div className="row-content" >
                    <div className="row-icon"><User size={18} /></div>
                    <div className="row-info">
                      <p>Change Username</p>
                      <span>Update your Username</span>
                    </div>
                  </div>
                  <ChevronRight size={18} className="arrow" />
                </div>
                <div className="settings-row clickable">
                  <div className="row-content">
                    <div className="row-icon"><Lock size={18} /></div>
                    <div className="row-info">
                      <p>Change Password</p>
                      <span>Update your login credentials regularly</span>
                    </div>
                  </div>
                  <ChevronRight size={18} className="arrow" />
                </div>
                <div className="settings-row">
                  <div className="row-content">
                    <div className="row-icon"><Shield size={18} /></div>
                    <div className="row-info">
                      <p>Two-Factor Auth</p>
                      <span>Enable 2FA for enhanced security</span>
                    </div>
                  </div>
                  <Switch size="small" color="primary" />
                </div>
              </div>
            </div>

            {/* Preferences Section */}
            <div className="settings-block">
              <div className="block-header">
                <Bell size={20} />
                <h3>App Preferences</h3>
              </div>
              <div className="settings-list">
                <div className="settings-row">
                  <div className="row-content">
                    <div className="row-icon"><Bell size={18} /></div>
                    <div className="row-info">
                      <p>Notifications</p>
                      <span>Alerts for trade execution and price drops</span>
                    </div>
                  </div>
                  <Switch size="small" color="primary" defaultChecked />
                </div>
                <div className="settings-row">
                  <div className="row-content">
                    <div className="row-icon"><Monitor size={18} /></div>
                    <div className="row-info">
                      <p>Dark Mode</p>
                      <span>Toggle between light and dark themes</span>
                    </div>
                  </div>
                  <div className="theme-toggle-container">
                    <Sun size={14} />
                    <Switch
                      size="small"
                      checked={theme === "dark"}
                      onChange={toggleTheme}
                    />
                    <Moon size={14} />
                  </div>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="settings-block logout-block">
              <div className="settings-list">
                <div className="settings-row clickable logout-row" onClick={logout}>
                  <div className="row-content">
                    <div className="row-icon logout-icon"><LogOut size={18} /></div>
                    <div className="row-info">
                      <p>Sign Out</p>
                      <span>End your current session securely</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {changeUsername && <changeUsername />}
    </>
  );
}