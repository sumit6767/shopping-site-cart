import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import { useCart } from "./context/CardContext";

function App() {
  const { getTotalItemCount } = useCart();

  return (
    <Router>
      <nav>
      <Link to="/"><h1>🛍️ MyStore</h1></Link>
        <div class="group-icon">
          <Link to="/">Home</Link>
          <Link to="/cart">
            <div>
              <span>Cart: </span>
              <div className="cart-item-count">{getTotalItemCount()}</div>
            </div>
          </Link>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
    </Router>
  );
}

export default App;
