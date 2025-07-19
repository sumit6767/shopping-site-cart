// src/components/AuthStatus.js
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

function AuthStatus() {
  const { user, login, logout, manualLogout, authLoading, isManualLogin } =
    useAuth(); // 👈 Access auth values

  if (authLoading) {
    return (
      <div className="loading-wrapper">
        <div className="auth-spinner"></div>
      </div>
    );
  }

  return user ? (
    // Logged-in UI
    <div className="profile-dropdown">
      <div className="tooltip-container">
        {isManualLogin && user? (
          <div className="circle-container">
            <div className="circle red">{user.displayName?.charAt(0)}</div>
          </div>
        ) : (
          <img className="user-avatar" src={user.photoURL} alt="User" />
        )}
      </div>
      <div className="dropdown-menu">
        <p className="dropdown-name">Hi {user.displayName},</p>
        <p className="dropdown-email">{user.email}</p>
        <button
          className="logout-btn"
          onClick={isManualLogin ? manualLogout : logout}
        >
          Logout
        </button>
      </div>
    </div>
  ) : (
    // Not logged in UI
    <div className="login-wrapper">
      <button className="login-btn" onClick={login}>
        <img
          src="https://developers.google.com/identity/images/g-logo.png"
          alt="Google Logo"
          className="google-logo"
        />
      </button>
      <div className="swing-arrow">👈</div>
    </div>
  );
}

export default AuthStatus;
