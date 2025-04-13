import React from "react";
import ProductCard from "../components/ProductCard";
import products from '../product_catalog.json';

let startIndex = Math.floor(Math.random()*10)
const recommended = products.slice(startIndex, startIndex + 5)

const Recommended = () => (
  <div className="recommended">
    <h2>Recommended for You</h2>
    <div className="product-grid">
      {recommended.map((item) => (
        <ProductCard key={item.id} product={item} />
      ))}
    </div>
  </div>
);

export default Recommended;
