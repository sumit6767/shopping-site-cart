import React, { useState, useEffect } from "react";
import ProductCard from "./ProductCard";

const SimilarProducts = ({ currentProductId }) => {
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = React.useState(false); // Loader state
  useEffect(() => {
    const fetchSimilarProducts = async () => {
      setLoading(true); // Start loading
      try {
        const response = await fetch(
          "https://productrecommendation2.cfapps.us10-001.hana.ondemand.com/similar_product",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({ item: currentProductId?.item[0] }),
          }
        );
        if (!response.ok) console.log("Network response was not ok");

        const data = await response.json();
        setSimilarProducts(data.Similar_Products || []);
      } catch (error) {
        console.error("Error fetching similar products:", error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchSimilarProducts();
  }, [currentProductId]);

  return (
    <div className="similar-products">
      <h2>Similar Products</h2>
      <div className="recommended">
        {loading ? (
          <div className="loader">
            <div className="spinner"></div>
            <p>Loading Similar Items...</p>
          </div>
        ) : (
          <div className="product-grid">
            {similarProducts.map((product) => (
              <ProductCard
                key={product.product_id}
                product={{
                  id: product.product_id,
                  title: product.title,
                  categories: product.category,
                  price: product.price || 0, // Default price if not provided
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SimilarProducts;
