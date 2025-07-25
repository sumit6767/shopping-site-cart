import { useState, useMemo, useEffect } from "react";
import { useCart, setOrderDetails } from "../context/CardContext";
import Recommended from "../components/Recommended";
import "../cart.css";
import SimilarProducts from "../components/SimilarProducts";
import RecentlyBought from "../components/RecentlyBought";
import { useAuth } from "../context/AuthContext";
import { getRecentPurchases } from "../api/apiconsume"; // Adjust the import path as necessary
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    total,
    removeAllFromCart,
    setOrderDetails,
  } = useCart();
  const { user = "", login } = useAuth();
  const [removingItem, setRemovingItem] = useState(null);
  const [recentPurchaseOrder, setRecentPurchaseOrder] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecentPurchases = async () => {
      if (user) {
        try {
          const response = await getRecentPurchases(user?.uid || "1234");
          if (response.status && response.status !== 500) {
            setRecentPurchaseOrder(response.data?.Recent_Purchases || {});
            setLoading(false);
          }
        } catch (error) {
          console.error("Failed to fetch recent purchases:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setRecentPurchaseOrder({});
        setLoading(false);
      }
    };

    fetchRecentPurchases();
  }, [user]);

  const handleRemove = (item) => {
    setRemovingItem(item.id);
    setTimeout(() => {
      removeFromCart(item);
      setRemovingItem(null);
    }, 500); // Wait for the animation to complete before removing from cart
  };

  const handleCheckout = async (orderdetails) => {
    // Simulate a successful order
    if (user) { 
      await setOrderDetails(orderdetails);
      navigate("/checkout");
    } else {
      navigate("/authform");
      // handlePayment(orderdetails);
    }
  };

  const refreshRecentOrders = async () => {
    setLoading(true);
    try {
      const response = await getRecentPurchases(user?.uid || "1234");
      if (response.status && response.status !== 500) {
        setRecentPurchaseOrder(response.data?.Recent_Purchases || {});
      }
    } catch (error) {
      console.error("Failed to refresh recent purchases:", error);
    } finally {
      setLoading(false);
    }
  };

  const bodyData = useMemo(() => {
    const items = cart.length ? cart : recentPurchaseOrder?.items || [];
    return {
      item: items.map((item) => item.id),
    };
  }, [cart, recentPurchaseOrder]);
  console.log(cart);

  return (
    <div className="container">
      <h1>Your Cart</h1>

      {cart.length === 0 && !recentPurchaseOrder?.items && !loading ? (
        <p>Your cart is currently empty.</p>
      ) : (
        <>
          <div className="cart-list">
            {cart.map((item, index) => (
              <div
                className={`cart-card ${
                  removingItem === item.id ? "removing" : ""
                }`}
                key={index}
              >
                <div className="cart-image"></div>
                <div className="cart-details">
                  <h3>{item.title || item.item}</h3>
                  <p>&#x20B9;{item.finalPrice}</p>
                  <div className="cart-qty">
                    <button onClick={() => updateQuantity(item, "decrease")}>
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item, "increase")}>
                      +
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => handleRemove(item)}
                  className="remove-btn"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {cart.length ? (
            <div className="cart-summary">
              <h2>Order Summary</h2>
              <div className="summary-line">
                <span>Subtotal</span>
                <span>&#x20B9;{total}</span>
              </div>
              <div className="summary-line">
                <span>Shipping</span>
                <span>&#x20B9;0.00</span>
              </div>
              <hr />
              <div className="summary-line total-line">
                <span>Total</span>
                <span>&#x20B9;{total}</span>
              </div>
              <button
                className="checkout-btn"
                onClick={() =>
                  handleCheckout({
                    total,
                    removeAllFromCart,
                    setRecentPurchaseOrder,
                    cart: cart.map((item) => ({
                      ...item,
                      price: item.finalPrice || item.price,
                    })),
                    user,
                  })
                }
              >
                Proceed to Checkout
              </button>
            </div>
          ) : loading ? (
            <div className="loader">
              <div className="spinner"></div>
              <p>Loading recent purchases...</p>
            </div>
          ) : (
            <>
              <p>
                🎉 Woow! Your order was successful! 🛍️ Check out your recently
                purchased items below 👇✨
              </p>
              <button onClick={refreshRecentOrders} className="refresh-btn">
                🔄
              </button>
              <RecentlyBought products={recentPurchaseOrder} />
            </>
          )}
          {/* Similar Products Section */}
          <SimilarProducts currentProductId={bodyData} />
          <Recommended bodyData={bodyData} />
        </>
      )}
    </div>
  );
};

export default Cart;
