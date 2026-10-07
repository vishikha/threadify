import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../api/CartContext";
import { useContext, useState } from "react";
import { WishlistContext } from "../api/WishlistContext";
import { FaShoppingCart, FaHeart } from "react-icons/fa";
import { menuData } from "../data/menuData";
import "./Navbar.css";

export default function Navbar() {
  const { cart } = useCart();
  const { wishlist } = useContext(WishlistContext);
  const navigate = useNavigate();

  const totalItems = cart.reduce((total, item) => total + item.qty, 0);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = (value) => {
    setQuery(value);
    if (!value.trim()) {
      setResults([]);
      return;
    }
    const lowerValue = value.toLowerCase();

    // Check if category matches
    for (let section in menuData) {
      for (let category in menuData[section]) {
        if (category.toLowerCase().includes(lowerValue)) {
          navigate(`/${section}/${category}`);
          return;
        }
      }
    }

    // Otherwise search for products
    const allProducts = [];
    Object.keys(menuData).forEach((section) => {
      Object.keys(menuData[section]).forEach((category) => {
        menuData[section][category].forEach((product) => {
          allProducts.push({ ...product, section, category });
        });
      });
    });

    const filtered = allProducts.filter((item) =>
      item.name.toLowerCase().includes(lowerValue)
    );
    setResults(filtered);
  };

  // ✅ Logout function
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
    alert("You have been logged out.");
  };

  // ✅ Check if user is logged in
  const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;

  return (
    <nav className="navbar">
      {/* Left: Logo */}
      <div className="navbar-left">
        <Link to="/">
          <img
            src="src/Gemini_Generated_Image_vcczamvcczamvccz-removebg-preview.png"
            alt="Threadify Logo"
            className="navbar-logo"
          />
        </Link>
      </div>

      {/* Center: Menu Links + Search */}
      <div className="navbar-center">
        <ul className="nav-links">
          <li className="nav-item"><Link to="/men" className="nav-link">MEN</Link></li>
          <li className="nav-item"><Link to="/women" className="nav-link">WOMEN</Link></li>
          <li className="nav-item"><Link to="/kids" className="nav-link">KIDS</Link></li>
        </ul>

        <div className="search-box">
          <input
            type="text"
            placeholder="Search products..."
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
          />
          {results.length > 0 && (
            <div className="search-dropdown">
              {results.map((item) => (
                <Link
                  key={item.id}
                  to={`/product/${item.section}/${item.category}/${item.id}`}
                  className="search-item"
                >
                  <img src={item.image} alt={item.name} />
                  <div>
                    <p>{item.name}</p>
                    <small>{item.section} / {item.category}</small>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right: Cart, Wishlist, Auth */}
      <div className="navbar-right">
        <Link to="/cart" className="cart-btn" style={{ position: "relative" }}>
          <FaShoppingCart size={24} />
          {totalItems > 0 && (
            <span style={{
              position: "absolute",
              top: "-5px",
              right: "-10px",
              background: "red",
              color: "white",
              borderRadius: "50%",
              padding: "2px 6px",
              fontSize: "12px",
              fontWeight: "bold",
            }}>
              {totalItems}
            </span>
          )}
        </Link>

        <Link to="/wishlist" className="wishlist-btn" style={{ position: "relative", marginLeft: "20px" }}>
          <FaHeart size={24} color="pink" />
          {wishlist.length > 0 && (
            <span style={{
              position: "absolute",
              top: "-5px",
              right: "-10px",
              background: "red",
              color: "white",
              borderRadius: "50%",
              padding: "2px 6px",
              fontSize: "12px",
              fontWeight: "bold",
            }}>
              {wishlist.length}
            </span>
          )}
        </Link>

        {/* ✅ Auth Buttons */}
        {user ? (
          <>
            <Link to="/profile" className="profile-btn" style={{ marginLeft: "15px" }}>
              {user.name || "Profile"}
            </Link>
            <button
              onClick={handleLogout}
              style={{
                marginLeft: "15px",
                padding: "8px 12px",
                backgroundColor: "#c9002b",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/register" className="register-btn" style={{ marginLeft: "15px" }}>Register</Link>
            <Link to="/login" className="login-btn" style={{ marginLeft: "15px" }}>Login</Link>
          </>
        )}
      </div>
    </nav>
  );
}