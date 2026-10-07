import { useCart } from "../api/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Cart = () => {
  const { cart, removeFromCart } = useCart();
  const navigate = useNavigate();

  // 🔒 Check if user is logged in on mount
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      alert("Please register or login first to view your cart!");
      // Redirect to Register first and remember current page
      navigate("/register", { state: { from: window.location.pathname } });
    }
  }, [navigate]);

  const totalPrice = cart.reduce((sum, item) => {
    const price =
      typeof item.price === "string"
        ? Number(item.price.replace(/[^0-9.]/g, ""))
        : Number(item.price);
    const qty = Number(item.qty || 1);
    return sum + price * qty;
  }, 0);

  // 🔒 Checkout click handler with login check
  const handleCheckout = () => {
    const user = localStorage.getItem("user");
    if (!user) {
      alert("Please register or login first to proceed to checkout!");
      navigate("/register", { state: { from: window.location.pathname } });
      return;
    }
    navigate("/payment");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "40px 20px",
        backgroundImage: "url('/images/men/cart.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div
        style={{
          maxWidth: "800px",
          margin: "auto",
          backgroundColor: "rgba(255, 255, 255, 0.92)",
          padding: "30px",
          borderRadius: "15px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "30px",
            borderBottom: "2px solid #333",
            paddingBottom: "10px",
          }}
        >
          My Shopping Cart
        </h2>

        {cart.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <p>Your cart is empty.</p>
            <Link to="/">
              <button style={{ padding: "10px 20px", cursor: "pointer" }}>
                Start Shopping
              </button>
            </Link>
          </div>
        ) : (
          cart.map((item) => (
            <div
              key={`${item.id}-${item.size}`}
              style={{
                display: "flex",
                gap: 20,
                borderBottom: "1px solid #ddd",
                padding: "15px 0",
                alignItems: "center",
              }}
            >
              <img
                src={item.image}
                width="80"
                alt={item.name}
                style={{ borderRadius: "8px" }}
              />
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: "0" }}>{item.name}</h4>
                <p style={{ margin: "5px 0", fontSize: "14px", color: "#666" }}>
                  Size: <strong>{item.size || "M"}</strong>
                </p>
                <p style={{ margin: "0", fontWeight: "bold" }}>₹{item.price}</p>
                <p style={{ margin: "0", fontSize: "12px" }}>Qty: {item.qty}</p>
              </div>
              <button
                onClick={() => removeFromCart(item.id, item.size)}
                style={{
                  padding: "4px 8px",
                  fontSize: "11px",
                  backgroundColor: "#fff",
                  color: "#d9534f",
                  border: "1px solid #d9534f",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Remove
              </button>
            </div>
          ))
        )}

        {cart.length > 0 && (
          <div style={{ marginTop: "30px", textAlign: "right" }}>
            <h3 style={{ fontSize: "22px" }}>Total Amount: ₹{totalPrice}</h3>
            <button
              onClick={handleCheckout}
              style={{
                padding: "12px 30px",
                backgroundColor: "#000",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontWeight: "bold",
                marginTop: "10px",
              }}
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;