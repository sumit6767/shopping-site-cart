import handleDownload from "../utils/download";
import {emojiMap}from "../utils/emojihelper";

const RecentlyBought = ({ products }) => {
  if (!(products.items) || products.items.length === 0) {
    return (
      <p>🛒 No recently bought products to show yet. Let’s go shopping! 🛍️</p>
    );
  }
  return (
    <div className="recently-bought">
      <h2>🎉 Woow! You just bought these awesome items!</h2>
      <div className="product-list">
        {products.items?.map((product, index) => {
          const subtotal = product.price * product.quantity;

          return (
            <div key={index} className="product-card-recent">
              <h3>{`${emojiMap.get(product.categories) || "📦"} ${product.title}`}</h3>
              <p className="price">💵 Price: ${product.price.toFixed(2)}</p>
              <p className="quantity">📦 Quantity: {product.quantity}</p>
              <p className="subtotal">🧾 Subtotal: ${subtotal.toFixed(2)}</p>
              {/* <button
                onClick={() => handleDownload([product])}
                className="download-bill-button"
              >
                ⬇️ Download Bill
              </button> */}
            </div>
          );
        })}
      </div>

      <button
        onClick={() => handleDownload(products)}
        className="download-bill-button"
      >
        ⬇️
        <span className="bill-icon">🧾Download Your Full Bill</span>
      </button>
    </div>
  );
};

export default RecentlyBought;
