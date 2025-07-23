import { useCart } from '../context/CardContext';
import '../Product.css'; // Assuming you have a CSS file for styling

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const discount = product.discount || 10;
  const finalPrice = Math.round(product.price - (product.price * discount) / 100);

  return (
    <div className="product-card">
      <div className="product-image"></div>
      <span className="badge">New</span>
      <h3>{product.title || product.item}</h3>
      <p>
        <span className="final-price">₹{finalPrice}</span>
        <span className="original-price">₹{product.price}</span>
        <span className="discount">{discount}% OFF</span>
      </p>
      <button onClick={() => addToCart({...product, finalPrice: finalPrice})}>Add to Cart</button>
    </div>
  );
};


export default ProductCard;

