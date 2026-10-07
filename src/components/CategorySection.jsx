import { useLocation, Link } from "react-router-dom";
import { menuData } from "../data/menuData";
import "./CategoryProducts.css";

export default function CategoryProducts({ addToCart }) {
  const location = useLocation();
  const { gender, category } = location.state || {};

  if (!gender || !category) {
    return <p>Category not found.</p>;
  }

  const products = menuData[gender][category] || [];

  if (products.length === 0) {
    return <p>No products found in this category.</p>;
  }

  return (
    <div className="category-products-page">
      <h2>{category}</h2>

      <div className="product-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <img
              src={product.image}
              alt={product.name}
              onError={(e) => (e.target.src = "/images/placeholder.jpg")}
            />
            <h4>{product.name}</h4>
            <p>{product.price}</p>

            <div className="product-actions">
              <Link
                to={`/product/${product.id}`}
                state={{ gender, category, product }}
                className="view-btn"
              >
                View Product
              </Link>

              {addToCart && (
                <button
                  className="add-cart-btn"
                  onClick={() => addToCart(product)}
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