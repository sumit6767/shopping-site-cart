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
import AuthStatus from "./components/Authstatus";
import AuthForm from "./pages/AuthForm";
import SideNav from "./components/Navigation";
import OrderHistory from "./components/Orderhistory";
import CheckoutForm from "./components/CheckoutFrom";

function App() {
  const { getTotalItemCount } = useCart();

  return (
    <Router>
      <nav>
        <SideNav isLogged={true} />
        <Link to="/">
          <h1>
            <i>🛍️ Daily Store</i>
          </h1>
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
          <AuthStatus />
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        {/* Optional: Restrict access to /cart if not logged in */}
        <Route path="/cart" element={<Cart />} />
        <Route path="/authform" element={<AuthForm />} />
        <Route path="/orders" element={<OrderHistory userId="1234" />} />
        <Route path="/checkout" element={<CheckoutForm />} />
      </Routes>
    </Router>
  );
}

export default App;
