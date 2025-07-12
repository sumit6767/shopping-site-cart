import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import { useCart } from "./context/CardContext"; // 👈 Import Cart context
import { useAuth } from "./context/AuthContext"; // 👈 Import Auth context

function App() {
  const { getTotalItemCount } = useCart();
  const { user, login, logout } = useAuth(); // 👈 Access auth values
  console.log("App rendered", useAuth()); // Debugging line to check user state

  return (
    <Router>
      <nav>
        <Link to="/">
          <h1>🛍️ MyStore</h1>
        </Link>
        <div className="group-icon">
          <Link to="/">Home</Link>
          <Link to="/cart">
            <div>
              <span>Cart: </span>
              <div className="cart-item-count">{getTotalItemCount()}</div>
            </div>
          </Link>
          {/* ✅ Login/Logout UI */}
          {user ? (
            // Logged-in UI
            <div className="profile-dropdown">
              <div className="tooltip-container">
                <img className="user-avatar" src={user.photoURL} alt="User" />
                <span className="tooltip-text">Hi, {user.displayName}</span>
              </div>
              <div className="dropdown-menu">
                <p className="dropdown-name">{user.displayName}</p>
                <p className="dropdown-email">{user.email}</p>
                <button className="logout-btn" onClick={logout}>
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="login-wrapper">
              <button className="login-btn" onClick={login}>
                <img
                  src="https://developers.google.com/identity/images/g-logo.png"
                  alt="Google Logo"
                  className="google-logo"
                />
                Login with Google
              </button>
              <div className="swing-arrow">👈</div>
            </div>
          )}
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        {/* Optional: Restrict access to /cart if not logged in */}
        <Route path="/cart" element={<Cart />} />
      </Routes>
    </Router>
  );
}

export default App;
