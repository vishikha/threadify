import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Form = ({ clean }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Redirect back after registration, fallback to home
  const from = location.state?.from || "/";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // ✅ Save user to localStorage
        localStorage.setItem(
          "user",
          JSON.stringify({
            name: formData.name.trim(),
            email: formData.email.trim(),
            id: data.id || Date.now(),
          })
        );

        setMessage("Registration successful! Redirecting to login...");

        // Redirect to login page with `from` info
        setTimeout(() => {
          navigate("/login", { state: { from } });
        }, 1000);

        setFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
      } else {
        setMessage(data.message || "Registration failed.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Server error. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      padding: "40px 20px",
      backgroundColor: "#f0f2f5",
      gap: "20px",
    },
    form: {
      width: "100%",
      maxWidth: "380px",
      display: "flex",
      flexDirection: "column",
      gap: "18px",
      background: clean ? "transparent" : "#ffffff",
      padding: clean ? "0" : "30px 25px",
      borderRadius: clean ? "0" : "12px",
      boxShadow: clean ? "none" : "0 8px 25px rgba(0,0,0,0.08)",
    },
    heading: {
      color: "#c9002b",
      textAlign: "center",
      marginBottom: "15px",
      fontSize: "24px",
      fontWeight: "700",
    },
    input: {
      padding: "12px 14px",
      borderRadius: "8px",
      border: "1px solid #ccc",
      fontSize: "16px",
      outline: "none",
    },
    button: {
      padding: "12px",
      border: "none",
      borderRadius: "8px",
      background: "#c9002b",
      color: "#fff",
      fontWeight: "600",
      cursor: "pointer",
      fontSize: "16px",
      transition: "background 0.3s",
    },
    message: {
      marginTop: "10px",
      fontWeight: "600",
      color: "green",
      textAlign: "center",
    },
    loginLink: {
      marginTop: "10px",
      textAlign: "center",
      fontSize: "14px",
      color: "#c9002b",
      cursor: "pointer",
      textDecoration: "underline",
    },
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.heading}>Register</h2>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? "Registering..." : "Register"}
        </button>

        {message && <p style={styles.message}>{message}</p>}

        <p
          style={styles.loginLink}
          onClick={() => navigate("/login", { state: { from } })}
        >
          Already have an account? Login here
        </p>
      </form>
    </div>
  );
};

export default Form;