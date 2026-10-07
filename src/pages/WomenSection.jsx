// src/pages/WomenSection.jsx
import { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom"; // ✅ Import useParams
import { menuData } from "../data/menuData";
import { Link } from "react-router-dom";
import { useCart } from "../api/CartContext";
import { WishlistContext } from "../api/WishlistContext";
import "./WomenSection.css";

export default function WomenSection() {
  const { category } = useParams(); // ✅ Get category from URL
  const categories = Object.keys(menuData.women);

  // ✅ Use category from URL if available
  const [selectedCategory, setSelectedCategory] = useState(category || null);

  const { addToCart } = useCart();
  const { wishlist, addToWishlist, removeFromWishlist } =
    useContext(WishlistContext);

  const toggleWishlist = (product) => {
    wishlist.some((item) => item.id === product.id)
      ? removeFromWishlist(product.id)
      : addToWishlist(product);
  };

  // ✅ Update selectedCategory if URL changes
  useEffect(() => {
    if (category) {
      setSelectedCategory(category);
    }
  }, [category]);

  return (
    <div className="women-section-container">
      <h1>Women's Section</h1>

      {/* Category Buttons */}
      <div className="category-menu">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`category-btn ${
              selectedCategory === cat ? "active" : ""
            }`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="product-grid">
        {selectedCategory ? (
          menuData.women[selectedCategory]?.length > 0 ? (
            menuData.women[selectedCategory].map((product) => {
              const isWishlisted = wishlist.some(
                (item) => item.id === product.id
              );

              return (
                <div key={product.id} className="product-card">

                  {/* Image + Heart Icon */}
                  <div className="product-image-wrapper">
                    <img src={product.image} alt={product.name} />

                    <span
                      className={`heart-icon ${
                        isWishlisted ? "active" : ""
                      }`}
                      onClick={() => toggleWishlist(product)}
                    >
                      {isWishlisted ? "❤️" : "🤍"}
                    </span>
                  </div>

                  <h4>{product.name}</h4>
                  <p>{product.price}</p>

                  {/* Add to Cart */}
                  <button
                    className="add-to-cart-btn"
                    onClick={() => addToCart({ ...product, qty: 1 })}
                  >
                    Add to Cart
                  </button>

                  {/* Product Detail */}
                  <Link
                    to={`/product/women/${selectedCategory}/${product.id}`}
                    className="view-btn"
                  >
                    View Details
                  </Link>
                </div>
              );
            })
          ) : (
            <p>No products available in this category.</p>
          )
        ) : (
          <p>Select a category to view products.</p>
        )}
      </div>
    </div>
  );
}