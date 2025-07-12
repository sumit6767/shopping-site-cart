import React from "react";

const RecentlyBought = ({ products }) => {
  if (!products || products.length === 0) {
    return (
      <p>🛒 No recently bought products to show yet. Let’s go shopping! 🛍️</p>
    );
  }

  // Generate bill text content
  const generateBillText = (billItem) => {
    let bill = "🧾 Your Purchase Summary\n\n";
    let total = 0;

    billItem.forEach((product, index) => {
      const subtotal = product.price * product.quantity;
      total += subtotal;
      bill += `#${index + 1} ${product.title}\n`;
      bill += `   Price: $${product.price.toFixed(2)}\n`;
      bill += `   Quantity: ${product.quantity}\n`;
      bill += `   Subtotal: $${subtotal.toFixed(2)}\n\n`;
    });

    bill += `--------------------------\n`;
    bill += `TOTAL: $${total.toFixed(2)}\n`;
    bill += `Thanks for shopping with us! 🛍️`;

    return bill;
  };

  // Create downloadable file
  const handleDownload = (billItem) => {
    const element = document.createElement("a");
    const file = new Blob([generateBillText(billItem)], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "your-bill.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="recently-bought">
      <h2>🎉 Woow! You just bought these awesome items!</h2>
      <div className="product-list">
        {products.map((product, index) => {
          const subtotal = product.price * product.quantity;

          return (
            <div key={index} className="product-card-recent">
              <h3>🛍️ {product.title}</h3>
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
