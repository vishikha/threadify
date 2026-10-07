// src/pages/Products.jsx
import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../api/CartContext";
import { WishlistContext } from "../api/WishlistContext";
import { useRecentlyViewed } from "../api/RecentlyViewedContext"; 
import { menuData } from "../data/menuData";
import Rating from "../components/Rating"; // Added
import "./Products.css";

const Products = () => {
  const { category, subcategory } = useParams(); 
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);

  const { addToCart } = useCart();
  const { wishlist, addToWishlist, removeFromWishlist } = useContext(WishlistContext);
  const { recentlyViewed } = useRecentlyViewed();

  // Load products based on category and optional subcategory
  useEffect(() => {
    if (!category || !menuData[category]) {
      setProducts([]);
      return;
    }

    const categoryData = menuData[category];

    let allProducts = [];
    if (subcategory && categoryData[subcategory]) {
      allProducts = categoryData[subcategory];
    } else {
      allProducts = Object.values(categoryData).flat();
    }

    setProducts(allProducts);
  }, [category, subcategory]);

  const getNumericPrice = (priceStr) => Number(priceStr.replace(/[^0-9.-]+/g, "")) || 0;

  const toggleWishlist = (product) => {
    wishlist.some(item => item.id === product.id)
      ? removeFromWishlist(product.id)
      : addToWishlist(product);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>{category?.toUpperCase()} {subcategory ? `- ${subcategory}` : ""} Products</h2>

      {/* Recently Viewed Section */}
      {recentlyViewed.length > 0 && (
        <div style={{ marginBottom: "40px" }}>
          <h3>Recently Viewed</h3>
          <div style={{ display: "flex", gap: "15px", overflowX: "auto" }}>
            {recentlyViewed
              .filter(p => !products.some(prod => prod.id === p.id)) 
              .map(p => (
                <div
                  key={p.id}
                  onClick={() => navigate(`/product/${p.gender}/${p.category}/${p.id}`)}
                  style={{ minWidth: "150px", cursor: "pointer", textAlign: "center" }}
                >
                  <img
                    src={p.image}
                    alt={p.name}
                    style={{ width: "100%", borderRadius: "5px" }}
                  />
                  <p style={{ fontWeight: "bold", margin: "5px 0" }}>{p.name}</p>
                  <p style={{ color: "#B12704", fontWeight: "bold" }}>{p.price}</p>
                </div>
              ))}
          </div>
        </div>
      )}

      {products.length === 0 ? (
        <p>No products available.</p>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
          {products.map((product) => (
            <div
              key={product.id}
              style={{
                border: "1px solid #eee",
                padding: "15px",
                width: "220px",
                textAlign: "center",
                borderRadius: "10px",
              }}
            >
              <img
                src={product.image}
                alt={product.name}
                style={{
                  width: "100%",
                  height: "250px",
                  objectFit: "cover",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
                onClick={() => navigate(`/product/${category}/${subcategory || "all"}/${product.id}`)}
              />
              <h3>{product.name}</h3>
              <p style={{ fontWeight: "bold" }}>{product.price}</p>

              {/* Rating Display */}
              <div style={{ margin: "5px 0" }}>
                <Rating value={product.rating || 0} edit={false} />
                <p style={{ fontSize: "0.9rem", color: "#555" }}>{product.rating || 0} / 5</p>
              </div>

              <button
                onClick={() => navigate(`/product/${category}/${subcategory || "all"}/${product.id}`)}
                style={{
                  width: "100%",
                  padding: "10px",
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  marginBottom: "10px",
                }}
              >
                View Product
              </button>

              <button
                onClick={() => toggleWishlist(product)}
                style={{
                  width: "100%",
                  padding: "10px",
                  backgroundColor: "#ff4081",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                {wishlist.some(item => item.id === product.id) ? "💖 Remove" : "❤️ Add to Wishlist"}
              </button>

              <button
                style={{
                  width: "100%",
                  padding: "10px",
                  backgroundColor: "#28a745",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  marginTop: "10px",
                }}
                onClick={() => addToCart({ ...product, price: getNumericPrice(product.price), qty: 1 })}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;