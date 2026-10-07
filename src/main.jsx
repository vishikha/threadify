import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { CartProvider } from "./api/CartContext";
import { WishlistProvider } from "./api/WishlistContext";
import { RecentlyViewedProvider } from "./api/RecentlyViewedContext"; 
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CartProvider>
      <WishlistProvider>
        <RecentlyViewedProvider> {/* ✅ Wrap App with Recently Viewed */}
          <App />
        </RecentlyViewedProvider>
      </WishlistProvider>
    </CartProvider>
  </React.StrictMode>
);