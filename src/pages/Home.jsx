import React from "react";
import ProductCard from "../components/ProductCard";
// import Recommended from "../components/Recommended";
import products from "../product_catalog.json";

// Helper function to group products by category
const groupByCategory = (products) => {
  return products.reduce((groups, product) => {
    const category = product.categories || "Uncategorized";
    if (!groups[category]) groups[category] = [];
    groups[category].push(product);
    return groups;
  }, {});
};

const Home = () => {
  const categorizedProducts = groupByCategory(products);

  return (
    <div className="container">
      <h1>Products</h1>

      {Object.entries(categorizedProducts).map(([category, items]) => (
        <div key={category} className="category-section">
          <h2>{category}</h2>
          <div className="product-grid">
            {items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      ))}

      {/* <Recommended /> */}
    </div>
  );
};

export default Home;
