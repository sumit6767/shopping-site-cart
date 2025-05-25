import React, { useState, useMemo } from "react";
import { useCart } from "../context/CardContext";
import Recommended from "../components/Recommended";
import "../cart.css";
import SimilarProducts from "../components/SimilarProducts";
import handlePayment from "../components/PaymentButton";
import RecentlyBought from "../components/RecentlyBought";

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, total, removeAllFromCart } =
    useCart();
  const [removingItem, setRemovingItem] = useState(null);
  const [recentPurchaseOrder, setRecentPurchaseOrder] = useState(() => {
    // Get cart from localStorage on first load
    const savedCart = localStorage.getItem("recentPurchaseOrder");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const handleRemove = (item) => {
    setRemovingItem(item.id);
    setTimeout(() => {
      removeFromCart(item);
      setRemovingItem(null);
    }, 500); // Wait for the animation to complete before removing from cart
  };

  const bodyData = useMemo(() => {
    const items = cart.length ? cart : recentPurchaseOrder;
    return {
      item: items.map((item) => item.id),
    };
  }, [cart, recentPurchaseOrder]);
  console.log(cart);

  return (
    <div className="container">
      <h1>Your Cart</h1>

      {cart.length === 0 && recentPurchaseOrder.length === 0 ? (
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
                  <p>${item.price}</p>
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
                <span>${total}</span>
              </div>
              <div className="summary-line">
                <span>Shipping</span>
                <span>$0.00</span>
              </div>
              <hr />
              <div className="summary-line total-line">
                <span>Total</span>
                <span>${total}</span>
              </div>
              <button
                className="checkout-btn"
                onClick={() =>
                  handlePayment(
                    total,
                    removeAllFromCart,
                    setRecentPurchaseOrder,
                    cart
                  )
                }
              >
                Proceed to Checkout
              </button>
            </div>
          ) : (
            <>
              <p>
                🎉 Woow! Your order was successful! 🛍️ Check out your recently
                purchased items below 👇✨
              </p>
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
