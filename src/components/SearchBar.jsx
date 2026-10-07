// src/components/SearchBar.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { menuData } from "../data/menuData";
import "./SearchBar.css";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  // Handle search input change
  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (!value) {
      setSuggestions([]);
      return;
    }

    const results = [];

    // Loop through all sections and categories
    Object.keys(menuData).forEach((section) => {
      Object.keys(menuData[section]).forEach((category) => {
        menuData[section][category].forEach((product) => {
          if (product.name.toLowerCase().includes(value.toLowerCase())) {
            // Add only unique products per section/category
            results.push({
              ...product,
              section,
              category,
            });
          }
        });
      });
    });

    // Optional: sort results alphabetically by section first, then product name
    results.sort((a, b) => {
      if (a.section === b.section) return a.name.localeCompare(b.name);
      return a.section.localeCompare(b.section);
    });

    setSuggestions(results.slice(0, 5)); // show max 5 suggestions
  };

  // Handle clicking a suggestion or pressing search
  const handleSearch = (product) => {
    if (!product && suggestions.length > 0) {
      product = suggestions[0]; // default to first suggestion
    }

    if (product) {
      navigate(`/product/${product.section}/${product.category}/${product.id}`);
      setQuery("");
      setSuggestions([]);
    } else {
      alert("Product not found!");
    }
  };

  return (
    <div className="searchbar-container">
      <input
        type="text"
        placeholder="Search products..."
        value={query}
        onChange={handleChange}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
      />
      <button onClick={() => handleSearch()}>Search</button>

      {/* Suggestions Dropdown */}
      {suggestions.length > 0 && (
        <ul className="search-suggestions">
          {suggestions.map((product) => (
            <li
              key={`${product.section}-${product.category}-${product.id}`}
              onClick={() => handleSearch(product)}
            >
              {product.name} ({product.section})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}