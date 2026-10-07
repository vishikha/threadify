import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { menuData } from "../data/menuData";
import { useCart } from "../api/CartContext";
import { useRecentlyViewed } from "../api/RecentlyViewedContext";
import Rating from "../components/Rating"; 

const ProductDetail = () => {
  const { gender, category, id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addRecentlyViewed, recentlyViewed } = useRecentlyViewed();

  const [selectedSize, setSelectedSize] = useState("");
  const allCategoryProducts = menuData[gender]?.[category] || [];
  const product = allCategoryProducts.find((p) => String(p.id) === String(id));

  // Rating state
  const [userRating, setUserRating] = useState(product?.rating || 0);

  // Load saved rating from localStorage
  useEffect(() => {
    if (product) {
      const savedRating = localStorage.getItem(`product-${product.id}-rating`);
      if (savedRating) setUserRating(Number(savedRating));
    }
  }, [product]);

  // Add to recently viewed
  useEffect(() => {
    if (product) addRecentlyViewed({ ...product, gender, category });
  }, [product]);

  if (!product) return <p>Product not found</p>;

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size before adding to cart!");
      return;
    }
    const numericPrice = Number(product.price.replace(/[^0-9.-]+/g, ""));
    addToCart({
      ...product,
      id: `${product.id}-${selectedSize}`,
      price: numericPrice,
      size: selectedSize,
      qty: 1,
    });
    alert(`Added ${product.name} (Size: ${selectedSize}) to cart!`);
  };

  const handleRatingChange = (newRating) => {
    setUserRating(newRating);
    localStorage.setItem(`product-${product.id}-rating`, newRating);
  };

  // Recommended products (exclude current)
  const recommendedProducts = allCategoryProducts
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  // Recently viewed excluding current
  const recentlyViewedProducts = recentlyViewed.filter((p) => p.id !== product.id);

  return (
    <div style={{ padding: "40px", maxWidth: "1200px", margin: "auto" }}>
      <button
        onClick={() => navigate(-1)}
        style={{ marginBottom: "20px", cursor: "pointer" }}
      >
        ← Back
      </button>

      {/* Main Product Section */}
      <div
        style={{
          display: "flex",
          gap: "50px",
          border: "1px solid #eee",
          padding: "30px",
          borderRadius: "10px",
        }}
      >
        <img
          src={product.image}
          alt={product.name}
          style={{ width: "400px", borderRadius: "8px" }}
        />
        <div style={{ textAlign: "left", flex: 1 }}>
          <h1 style={{ fontSize: "2.5rem" }}>{product.name}</h1>

          {/* Price */}
          <p
            style={{
              fontSize: "2rem",
              color: "#B12704",
              fontWeight: "bold",
              margin: "10px 0",
            }}
          >
            {product.price}
          </p>

          {/* Rating */}
          <div style={{ margin: "10px 0" }}>
            <Rating value={userRating} onChange={handleRatingChange} edit={true} />
            <p style={{ fontSize: "0.9rem", color: "#555" }}>
              {userRating} out of 5 stars
            </p>
          </div>

          <p style={{ margin: "20px 0", color: "#666" }}>{product.description}</p>

          {/* Size Selection */}
          <div style={{ margin: "30px 0" }}>
            <h4 style={{ marginBottom: "15px" }}>Select Size:</h4>
            <div style={{ display: "flex", gap: "12px" }}>
              {["S", "M", "L", "XL", "XXL"].map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  style={{
                    padding: "10px 20px",
                    border: "2px solid",
                    borderColor: selectedSize === size ? "#007bff" : "#ddd",
                    backgroundColor: selectedSize === size ? "#e7f1ff" : "#fff",
                    cursor: "pointer",
                    borderRadius: "5px",
                    fontWeight: "bold",
                    transition: "0.2s",
                  }}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            style={{
              padding: "15px 40px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "1.1rem",
              fontWeight: "bold",
            }}
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* Recently Viewed Section */}
      {recentlyViewedProducts.length > 0 && (
        <div style={{ marginTop: "50px" }}>
          <h2>Recently Viewed</h2>
          <div style={{ display: "flex", gap: "20px", overflowX: "auto" }}>
            {recentlyViewedProducts.map((p) => (
              <div
                key={p.id}
                onClick={() => navigate(`/product/${p.gender}/${p.category}/${p.id}`)}
                style={{ cursor: "pointer", minWidth: "150px", textAlign: "center" }}
              >
                <img
                  src={p.image}
                  alt={p.name}
                  style={{ width: "100%", borderRadius: "5px" }}
                />
                <p style={{ fontWeight: "bold" }}>{p.name}</p>
                <p style={{ color: "#B12704", fontWeight: "bold" }}>{p.price}</p>
                {/* Rating for recently viewed */}
                <Rating value={p.rating || 0} edit={false} />
                <p style={{ fontSize: "0.8rem", color: "#555" }}>
                  {p.rating || 0} / 5
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommended Products Section */}
      {recommendedProducts.length > 0 && (
        <div style={{ marginTop: "50px" }}>
          <h2>You might also like</h2>
          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
            {recommendedProducts.map((recProduct) => (
              <div
                key={recProduct.id}
                style={{
                  border: "1px solid #eee",
                  padding: "10px",
                  width: "200px",
                  textAlign: "center",
                  borderRadius: "10px",
                  cursor: "pointer",
                }}
                onClick={() =>
                  navigate(`/product/${gender}/${category}/${recProduct.id}`)
                }
              >
                <img
                  src={recProduct.image}
                  alt={recProduct.name}
                  style={{
                    width: "100%",
                    height: "180px",
                    objectFit: "cover",
                    borderRadius: "5px",
                  }}
                />
                <p style={{ margin: "10px 0", fontWeight: "bold" }}>
                  {recProduct.name}
                </p>
                <p style={{ color: "#B12704", fontWeight: "bold" }}>
                  {recProduct.price}
                </p>
                {/* Rating for recommended */}
                <Rating value={recProduct.rating || 0} edit={false} />
                <p style={{ fontSize: "0.8rem", color: "#555" }}>
                  {recProduct.rating || 0} / 5
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;