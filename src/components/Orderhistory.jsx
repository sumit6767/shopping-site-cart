import { useEffect, useMemo, useState } from "react";
import { fetchOrderHistory } from "../api/apiconsume";
import { addCategoryemoji } from "../utils/emojihelper";
import { useAuth } from "../context/AuthContext";
import handleDownload from "../utils/download";

const OrderHistory = ({ userId }) => {
  const [orders, setOrders] = useState(
    []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!userId) return;

    setLoading(true);
    if (!user || !user.uid) {
      setError("User ID is required to fetch order history.");
      setLoading(false);
      return;
    }
    fetchOrderHistory(user.uid)
      .then(({ status, data }) => {
        if (status === 200) {
          setOrders(addCategoryemoji(data.Order_History));
          setError(null);
        } else {
          setError(data.message || "Failed to load orders");
          setOrders([]);
        }
      })
      .catch(() => {
        // setError("Network error");
        // setOrders([]);
      })
      .finally(() => setLoading(false));
  }, [user]);

  useMemo(() => {
  }, [orders.length]);

  if (loading) return <div className="loading">Loading orders...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!orders.length) return <div className="no-orders">No orders found.</div>;

  return (
    <div className="order-history-container">
      <h2>Your Order History</h2>
      {orders.sort((a,b) => {
        return new Date(b.timestamp) - new Date(a.timestamp);
      }).map((order, index) => (
        <div className="order-card" key={index}>
          <div className="order-header">
            <div>
              <strong>Order Date:</strong>{" "}
              {new Date(order.timestamp).toLocaleString()}
            </div>
            <div>
              <strong>Transaction ID:</strong> {order.transaction_id || "N/A"}
            </div>
            <div>
              <strong>Delivery Address:</strong>{" "}
              {order.address || "Not provided"}
            </div>
          </div>

          <div className="order-items">
            {order.items.map((item) => (
              <div className="order-item" key={item.id}>
                <div className="item-title">{item.title}</div>
                <div className="item-category">
                  {item.emojiicon} {item.categories}
                </div>
                <div className="item-quantity">Qty: {item.quantity}</div>
                <div className="item-price">₹{item.price}</div>
              </div>
            ))}
          </div>

          <button
            onClick={() => handleDownload(order)}
            className="download-bill-button"
          >
            ⬇️
            <span className="bill-icon">🧾Download Your Full Bill</span>
          </button>
        </div>
      ))}
    </div>
  );
};

export default OrderHistory;
