import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Sidebar.css";

export default function Sidebar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("http://localhost:5000/api/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setUser(data))
      .catch(err => console.error(err));
  }, []);

  const handleLogin = () => navigate("/login");
  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  return (
    <aside className="sidebar">
      <h2 className="logo">MyStore</h2>

      <ul className="menu">
        <li><Link to="/products?category=men">MEN</Link></li>
        <li><Link to="/products?category=women">WOMEN</Link></li>
        <li><Link to="/products?category=kids">KIDS</Link></li>
        <li><Link to="/products?category=beauty">BEAUTY</Link></li>
        <li><Link to="/products?category=home">HOME & KITCHEN</Link></li>
      </ul>

      <div className="sidebar-actions">
        {user ? (
          <button onClick={handleLogout}>Logout</button>
        ) : (
          <button onClick={handleLogin}>Login</button>
        )}
        <button onClick={() => navigate("/cart")}>Cart</button>
      </div>
    </aside>
  );
}