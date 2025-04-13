import React from "react";
import ProductCard from "../components/ProductCard";
// import products from '../product_catalog.json';

// let startIndex = Math.floor(Math.random()*10)
// let recommended = products.slice(startIndex, startIndex + 5);

function Recommended() {
  const [recommended, setRecommended] = React.useState([]);

  React.useEffect(() => {
    const fetchRecommended = async () => {
      try {
        const res = await Promise.fetch("http://localhost:5000/api/recommended"); // change URL if needed
        const data = await res.json();
        setRecommended(data);
      } catch (error) {
        console.error("Failed to fetch recommended products:", error);
      }
    };

    fetchRecommended();
  }, []);
  <div className="recommended">
    <h2>Recommended for You</h2>
    <div className="product-grid">
      {recommended.map((item) => (
        <ProductCard key={item.id} product={item} />
      ))}
    </div>
  </div>
};

export default Recommended;
