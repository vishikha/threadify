import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    // ✅ Fetch user profile
    fetch("http://localhost:5000/api/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setUser(data))
      .catch(err => console.error(err));

    // ✅ Fetch user orders
    fetch("http://localhost:5000/api/orders/my-orders", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setOrders(data))
      .catch(err => console.error(err));

  }, []);

  // ✅ Cancel order function
  const cancelOrder = async (orderId) => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(
        `http://localhost:5000/api/orders/${orderId}/cancel`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      alert("Order cancelled successfully");

      // ✅ Update UI without reload
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId
            ? {
                ...order,
                orderStatus: "Cancelled",
                statusHistory: [
                  ...order.statusHistory,
                  { status: "Cancelled", date: new Date() },
                ],
              }
            : order
        )
      );
    } catch (err) {
      console.error(err);
      alert("Failed to cancel order");
    }
  };

  if (!user) return <p>Please login to view your profile</p>;

  return (
    <div className="profile-page">
      <h2>{user.name}</h2>
      <p>{user.email}</p>

      {/* ✅ MY ORDERS SECTION */}
      <h3 style={{ marginTop: "30px" }}>My Orders</h3>

      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        orders.map((order) => (
          <div
            key={order._id}
            style={{
              border: "1px solid #ddd",
              padding: "15px",
              marginBottom: "10px",
              borderRadius: "8px",
            }}
          >
            <p><strong>Order ID:</strong> {order._id}</p>
            <p><strong>Status:</strong> {order.orderStatus}</p>
            <p><strong>Total:</strong> ₹{order.totalAmount}</p>

            {/* ✅ TRACK BUTTON */}
            <button
              onClick={() => navigate(`/track-order/${order._id}`)}
              style={{
                padding: "8px 15px",
                background: "black",
                color: "white",
                border: "none",
                cursor: "pointer",
                marginTop: "10px",
              }}
            >
              Track Order
            </button>

            {/* ✅ CANCEL BUTTON */}
            {order.orderStatus !== "Delivered" &&
             order.orderStatus !== "Cancelled" && (
              <button
                onClick={() => cancelOrder(order._id)}
                style={{
                  padding: "8px 15px",
                  background: "red",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                  marginTop: "10px",
                  marginLeft: "10px",
                }}
              >
                Cancel Order
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}