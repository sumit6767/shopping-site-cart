import React from "react";
import ProductCard from "../components/ProductCard";
import { useCart } from '../context/CardContext';

function Recommended() {
  const [recommended, setRecommended] = React.useState([]);
  const { cart } = useCart();

  React.useEffect(() => {
    const fetchRecommended = async () => {
      try {
        const bodyData = {
          item: []
        };
        console.log(cart)
        cart.forEach((items) => bodyData.item.push(items.id))
        const res = await fetch("https://productrecommendation.cfapps.us10-001.hana.ondemand.com/also_buy", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
          },
          body: JSON.stringify(bodyData),
        });
        if (!res.ok) throw new Error("Network response was not ok");

        const data = await res.json();
        setRecommended(data?.Promotion);
      } catch (error) {
        console.error("Failed to fetch recommended products:", error);
      }
    };

    fetchRecommended();
  }, [cart]);

  return (
    <div className="recommended">
      <h2>Recommended for You</h2>
      <div className="product-grid">
        {recommended.map((item) => (
          <ProductCard key={item.id} product={item} />
        ))}
      </div>
    </div>
  );
}

export default Recommended;
