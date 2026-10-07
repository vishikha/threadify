import { useState, useEffect } from "react";
import { useCart } from "../api/CartContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const Payment = () => {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  const totalPrice = cart.reduce((sum, item) => {
    const price =
      typeof item.price === "string"
        ? Number(item.price.replace(/[^0-9.]/g, ""))
        : Number(item.price);
    const qty = Number(item.qty || 1);
    return sum + price * qty;
  }, 0);

  const [method, setMethod] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });

  // 🔒 Redirect guests to Register first
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      alert("Please register or login first to place an order!");
      navigate("/register", { state: { from: "/payment" } });
    }
  }, [navigate]);

  const handleChange = (e) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  };

  const handlePayment = async () => {
    const { name, phone, address, city, pincode } = customer;

    // Validation
    if (!name || !phone || !address || !city || !pincode) {
      alert("Please fill all delivery details");
      return;
    }

    if (!method) {
      alert("Please select a payment method");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please register or login first to place an order!");
      navigate("/register", { state: { from: "/payment" } });
      return;
    }

    const itemsToSend = cart
      .filter((item) => item._id || item.id)
      .map((item) => ({
        productId: item._id || item.id,
        name: item.name,
        price: Number(item.price.toString().replace(/[^0-9.]/g, "")),
        quantity: item.qty || 1,
        size: item.size || "",
        image: item.image,
      }));

    if (itemsToSend.length === 0) {
      alert("Cart is empty");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/orders/create",
        {
          items: itemsToSend,
          totalAmount: totalPrice,
          paymentMethod: method,
          paymentStatus: method === "cod" ? "Pending" : "Paid",
          shippingAddress: customer,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 201 || res.status === 200) {
        clearCart();
        setSuccess(true);
      } else {
        alert("Failed to place order. Please try again.");
      }
    } catch (error) {
      if (error.response?.status === 401) {
        alert("Session expired or not authorized. Please login again.");
        localStorage.removeItem("token");
        navigate("/register", { state: { from: "/payment" } });
      } else {
        alert("Failed to place order. Please try again.");
        console.error(error.response || error);
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Order Placed Successfully!</h2>
        <p>
          <strong>Name:</strong> {customer.name}
        </p>
        <p>
          <strong>Delivery Address:</strong> {customer.address}, {customer.city} - {customer.pincode}
        </p>
        <p>
          <strong>Total Paid:</strong> ₹{totalPrice}
        </p>
        <p>
          {method === "cod"
            ? "Payment Method: Cash on Delivery. Please keep cash ready."
            : "Payment Method: Online Payment. Payment successful!"}
        </p>
        <p>Your order will be delivered soon 🚚</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 20, maxWidth: 600 }}>
      <h2>Order Summary</h2>
      {cart.map((item) => {
        const price =
          typeof item.price === "string"
            ? Number(item.price.replace(/[^0-9.]/g, ""))
            : Number(item.price);
        return (
          <div key={item._id || item.id} style={{ marginBottom: 8 }}>
            {item.name} × {item.qty || 1} = ₹{price * (item.qty || 1)}
          </div>
        );
      })}

      <h3>Total: ₹{totalPrice}</h3>

      <h2>Delivery Details</h2>
      <input
        type="text"
        name="name"
        placeholder="Full Name"
        value={customer.name}
        onChange={handleChange}
        style={{ width: "100%", marginBottom: 10 }}
      />
      <input
        type="text"
        name="phone"
        placeholder="Phone Number"
        value={customer.phone}
        onChange={handleChange}
        style={{ width: "100%", marginBottom: 10 }}
      />
      <input
        type="text"
        name="address"
        placeholder="Address"
        value={customer.address}
        onChange={handleChange}
        style={{ width: "100%", marginBottom: 10 }}
      />
      <input
        type="text"
        name="city"
        placeholder="City"
        value={customer.city}
        onChange={handleChange}
        style={{ width: "100%", marginBottom: 10 }}
      />
      <input
        type="text"
        name="pincode"
        placeholder="Pincode"
        value={customer.pincode}
        onChange={handleChange}
        style={{ width: "100%", marginBottom: 20 }}
      />

      <h3>Payment Method</h3>
      <label>
        <input
          type="radio"
          name="payment"
          value="cod"
          onChange={(e) => setMethod(e.target.value)}
        />
        Cash on Delivery
      </label>
      <br />
      <label>
        <input
          type="radio"
          name="payment"
          value="online"
          onChange={(e) => setMethod(e.target.value)}
        />
        Online Payment
      </label>
      <br />
      <br />
      <button onClick={handlePayment} disabled={loading}>
        {loading ? "Placing Order..." : `Place Order (₹${totalPrice})`}
      </button>
    </div>
  );
};

export default Payment;