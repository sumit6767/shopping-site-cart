import React from "react";
import ProductCard from "../components/ProductCard";
// import Recommended from "../components/Recommended";
import products from '../product_catalog.json';

// let startIndex = Math.floor(Math.random()*10)
let startIndex = 0;
const Home = () => (
  <div className="container">
    <h1>Products</h1>
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
    {/* <Recommended /> */}
  </div>
);

export default Home;
