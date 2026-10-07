import { useState } from "react";
import axios from "axios";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/newsletter", {
        email,
      });

      setMessage("Subscribed successfully!");
      setEmail("");
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Something went wrong"
      );
    }
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>Subscribe to our Newsletter</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: "10px", width: "250px" }}
        />

        <button type="submit" style={{ padding: "10px", marginLeft: "10px" }}>
          Subscribe
        </button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
};

export default Newsletter;