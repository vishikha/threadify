import { useContext } from "react";
import { WishlistContext } from "../api/WishlistContext";
import { useCart } from "../api/CartContext";
import { useNavigate } from "react-router-dom";

const Wishlist = () => {
  const { wishlist, removeFromWishlist } = useContext(WishlistContext);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  // Function to handle Add to Cart with login check
  const handleAddToCart = (item) => {
    const user = localStorage.getItem("user"); // check if logged in

    if (!user) {
      // Redirect guest to Register first and pass current page in state
      navigate("/register", { state: { from: window.location.pathname } });
      return;
    }

    addToCart(item);
    removeFromWishlist(item.id); // optional: remove from wishlist after adding
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>My Wishlist</h2>

      {wishlist.length === 0 ? (
        <p>No items in wishlist</p>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
          {wishlist.map((item) => (
            <div
              key={item.id}
              style={{
                border: "1px solid #eee",
                padding: "15px",
                width: "220px",
                textAlign: "center",
                borderRadius: "10px",
              }}
            >
              <img
                src={item.image}
                alt={item.name}
                style={{
                  width: "100%",
                  height: "250px",
                  objectFit: "cover",
                  borderRadius: "5px",
                }}
              />

              <h3>{item.name}</h3>

              <p style={{ fontWeight: "bold", color: "#B12704" }}>
                {item.price}
              </p>

              {/* ADD TO CART BUTTON */}
              <button
                onClick={() => handleAddToCart(item)}
                style={{
                  padding: "10px",
                  backgroundColor: "#28a745",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  marginBottom: "10px",
                  width: "100%",
                }}
              >
                Add to Cart
              </button>

              {/* REMOVE BUTTON */}
              <button
                onClick={() => removeFromWishlist(item.id)}
                style={{
                  padding: "10px",
                  backgroundColor: "#ff4081",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  width: "100%",
                }}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;