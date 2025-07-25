import React, { useState, useRef } from "react";
import ProductCard from "../components/ProductCard";
import products from "../product_catalog.json";

const getUniqueCategories = (products) => {
  const categories = products.map(p => p.categories || "Uncategorized");
  return ["All", ...new Set(categories)];
};

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const productGridRef = useRef(null); // Create a ref for the product grid

  const categories = getUniqueCategories(products);

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((p) => p.categories === selectedCategory);

  const handleCategoryClick = (cat) => {
    setSelectedCategory(cat);

    // Scroll to product grid after state update
    setTimeout(() => {
      productGridRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 0);
  };

  return (
    <div className="container">
      <h1>Products</h1>

      <div className="category-toggle-bar">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`category-toggle ${selectedCategory === cat ? "active" : ""}`}
            onClick={() => handleCategoryClick(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div ref={productGridRef} className="product-grid">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Payment Button Section */}
      {/* <div className="payment-section">
        <h2>Complete Your Purchase</h2>
        <PaymentButton />
      </div> */}
    </div>
  );
};

export default Home;
