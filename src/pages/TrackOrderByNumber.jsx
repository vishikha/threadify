import React, { useState } from "react";
import axios from "axios";

const TrackOrderByNumber = () => {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  const handleTrack = async () => {
    try {
      setError("");
      setOrder(null);

      const res = await axios.get(
        `http://localhost:5000/api/track/${trackingNumber}`
      );

      setOrder(res.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Tracking failed");
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: "50px auto", textAlign: "center" }}>
      <h2>Track Your Order</h2>
      <input
        type="text"
        placeholder="Enter Tracking Number"
        value={trackingNumber}
        onChange={(e) => setTrackingNumber(e.target.value)}
        style={{ padding: "10px", width: "80%" }}
      />
      <button onClick={handleTrack} style={{ padding: "10px 20px", marginLeft: 10 }}>
        Track
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {order && (
        <div style={{ marginTop: 30, textAlign: "left" }}>
          <p><strong>Tracking Number:</strong> {order.trackingNumber}</p>
          <p><strong>Status:</strong> {order.orderStatus}</p>
          <p><strong>Carrier:</strong> {order.carrier || "Not available"}</p>
          <p><strong>Estimated Delivery:</strong> {new Date(order.estimatedDelivery).toDateString()}</p>

          <h4>Status History:</h4>
          <ul>
            {order.statusHistory.map((s, i) => (
              <li key={i}>
                {s.status} — {new Date(s.date).toLocaleString()}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TrackOrderByNumber;