import React from "react";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CardContext";

function Recommended({ bodyData}) {
  const [recommended, setRecommended] = React.useState([]);
  const [loading, setLoading] = React.useState(false); // Loader state
  const { cart } = useCart();

  React.useEffect(() => {
    const fetchRecommended = async () => {
      setLoading(true); // Start loading
      try {

        const res = await fetch(
          "https://productrecommendation1.cfapps.us10-001.hana.ondemand.com/also_buy",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify(bodyData),
          }
        );

        if (!res.ok) throw new Error("Network response was not ok");

        const data = await res.json();
        setRecommended((data?.Promotion).map(data => {data.id = data.product_id; return data;}) || []);
      } catch (error) {
        console.error("Failed to fetch recommended products:", error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchRecommended();
  }, [cart.length]);
  
  return (
    <div className="recommended">
      <h2>Recommended for You</h2>
      {loading ? (
        <div className="loader">
          <div className="spinner"></div>
          <p>Loading recommendations...</p>
        </div>
      ) : (
        <div className="product-grid">
          {recommended.map((item) => (
            <ProductCard key={item.product_id} product={item} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Recommended;
