import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function TrackOrder() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `http://localhost:5000/api/orders/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setOrder(res.data);
    } catch (err) {
      console.error("Error fetching order:", err);
    }
  };

  if (!order) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Track Order</h2>

      <p><strong>Status:</strong> {order.orderStatus}</p>

      <p>
        <strong>Estimated Delivery:</strong>{" "}
        {new Date(order.estimatedDelivery).toDateString()}
      </p>

      <h3>Status History</h3>
      <ul>
        {order.statusHistory.map((s, i) => (
          <li key={i}>
            {s.status} - {new Date(s.date).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TrackOrder;