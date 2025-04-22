import React from 'react';
import { useCart } from '../context/CardContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <div className="product-card">
      <div className="product-image"></div>
      <span className="badge">New</span>
      <h3>{product.title || product.item}</h3>
      <p>${product.price}</p>
      <button onClick={() => addToCart(product)}>Add to Cart</button>
    </div>
  );
};


export default ProductCard;
