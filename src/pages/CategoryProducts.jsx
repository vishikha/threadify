import { useLocation, Link } from "react-router-dom";
import { menuData } from "../data/menuData";
import "./CategoryProduct.css";

export default function CategoryProduct({ addToCart }) {
  const location = useLocation();
  
  // Destructure gender and category from the state passed by the previous page
  const { gender, category, filterName } = location.state || {};

  // Guard clause if someone tries to access this page without state
  if (!gender || !category) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <p>Category not found. Please select a category from the menu.</p>
        <Link to="/">Go Back Home</Link>
      </div>
    );
  }

  // Filter products based on search term (filterName)
  const products = menuData[gender][category].filter((p) =>
    filterName ? p.name.toLowerCase().includes(filterName.toLowerCase()) : true
  );

  if (products.length === 0) {
    return <p style={{ padding: "20px" }}>No products found for "{filterName}".</p>;
  }

  return (
    <div className="category-products-page">
      <h2>
        {category} {filterName && `- ${filterName}`}
      </h2>

      <div className="product-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <img
              src={product.image || "/images/placeholder.jpg"}
              alt={product.name}
              onError={(e) => (e.target.src = "/images/placeholder.jpg")}
            />
            <h4>{product.name}</h4>
            <p>{product.price}</p>

            <div className="product-actions">
              {/* ✅ UPDATED LINK: We now pass gender and category in the URL path */}
              <Link
                to={`/product/${gender}/${category}/${product.id}`}
                className="view-btn"
              >
                View Product
              </Link>

              {addToCart && (
                <button
                  className="add-cart-btn"
                  onClick={() => addToCart({
                    ...product,
                    // Clean the price string like "₹4000" to a Number 4000
                    price: Number(product.price.replace(/[^0-9.-]+/g, "")),
                    qty: 1
                  })}
                >
                  Add to Cart
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
