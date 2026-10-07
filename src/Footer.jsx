// src/components/Footer.jsx
import { Link } from "react-router-dom";
import "./Footer.css";

/* ✅ NEW IMPORTS */
import { useState } from "react";
import axios from "axios";

export default function Footer() {

  /* ✅ NEW STATE */
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  /* ✅ SUBMIT FUNCTION */
  const handleSubscribe = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/api/newsletter", {
        email,
      });

      setMessage("Subscribed successfully ✅");
      setEmail("");
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Something went wrong"
      );
    }
  };

  return (
    <footer className="footer">
      <div className="footer-container">

        {/* COMPANY INFO */}
        <div className="footer-section">
          <h3>Company</h3>
          <ul>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/careers">Careers</Link></li>
            <li><Link to="/blog">Blog</Link></li>
          </ul>
        </div>

        {/* CUSTOMER CARE */}
        <div className="footer-section">
          <h3>Customer Care</h3>
          <ul>
            <li><Link to="/help">Help Center</Link></li>
            <li><Link to="/returns">Returns</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
          </ul>
        </div>

        {/* NEWSLETTER & SOCIAL */}
        <div className="footer-section">
          <h3>Newsletter</h3>
          <p>Subscribe for latest updates & offers</p>

          {/* ✅ UPDATED FORM */}
          <form className="newsletter-form" onSubmit={handleSubscribe}>
            <input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit">Subscribe</button>
          </form>

          {/* ✅ MESSAGE */}
          {message && <p style={{ marginTop: "10px" }}>{message}</p>}

          <div className="social-icons">
            <a href="#"><span>📘</span></a>
            <a href="#"><span>🐦</span></a>
            <a href="#"><span>📸</span></a>
            <a href="#"><span>▶️</span></a>
          </div>
        </div>

      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Threadify. All rights reserved.</p>
      </div>
    </footer>
  );
}