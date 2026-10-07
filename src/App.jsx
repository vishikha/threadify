import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./Footer";
import FrontPage from "./FrontPage";
import MenSection from "./pages/MenSection";
import WomenSection from "./pages/WomenSection";
import KidsSection from "./pages/KidsSection";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import CategoryProducts from "./pages/CategoryProducts";
import Profile from "./pages/Profile";
import Form from "./Form";
import Login from "./Login";
import Cart from "./components/Cart";
import Payment from "./pages/Payment";
import Wishlist from "./pages/Wishlist";
import About from "./pages/About";
import Careers from "./pages/Careers";
import Blog from "./pages/Blog";
import Help from "./pages/Help";
import Returns from "./pages/Returns";
import Contact from "./pages/Contact";
import TrackOrder from "./pages/TrackOrder";


// ✅ ProtectedRoute Component
const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem("user");
  const location = useLocation();
  if (!user) {
    // Redirect to login and remember attempted page
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  return children;
};

function AppContent() {
  const location = useLocation();
  const hideLayout = ["/login", "/register"].includes(location.pathname);

  const userId = localStorage.getItem("user") || "guest";

  return (
    <div className="app-container">
      {!hideLayout && <Navbar />}

      {hideLayout ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            backgroundColor: "#f8f8f8",
            padding: "20px",
          }}
        >
          <img
            src="src/Gemini_Generated_Image_vcczamvcczamvccz-removebg-preview.png"
            alt="Website Logo"
            style={{ height: "100px", marginBottom: "40px", cursor: "pointer" }}
            onClick={() => (window.location.href = "/")}
          />

          <Routes>
            <Route path="/login" element={<Login clean />} />
            <Route path="/register" element={<Form clean />} />
          </Routes>
        </div>
      ) : (
        <>
          <div className="page-wrapper">
            <Routes>
              <Route path="/" element={<FrontPage />} />
              <Route path="/men" element={<MenSection />} />
              <Route path="/men/:category" element={<MenSection />} />
              <Route path="/women" element={<WomenSection />} />
              <Route path="/women/:category" element={<WomenSection />} />
              <Route path="/kids" element={<KidsSection />} />
              <Route path="/kids/:category" element={<KidsSection />} />
              <Route path="/product/:gender/:category/:id" element={<ProductDetail />} />
              <Route path="/products/:category" element={<Products />} />
              <Route path="/products/:category/:subcategory" element={<Products />} />
              <Route path="/beauty" element={<Products />} />
              <Route path="/category-products" element={<CategoryProducts />} />

              {/* ✅ Protected Routes */}
              <Route
                path="/cart"
                element={
                  <ProtectedRoute>
                    <Cart />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/wishlist"
                element={
                  <ProtectedRoute>
                    <Wishlist />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/payment"
                element={
                  <ProtectedRoute>
                    <Payment />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              {/* Track Order */}
              <Route path="/track-order" element={<TrackOrder />} />
              <Route path="/track-order/:id" element={<TrackOrder />} />

              <Route path="/about" element={<About />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/help" element={<Help />} />
              <Route path="/returns" element={<Returns />} />
              <Route path="/contact" element={<Contact />} />

              <Route
                path="*"
                element={
                  <div style={{ padding: "50px", textAlign: "center" }}>
                    <h2>Page not found</h2>
                  </div>
                }
              />
            </Routes>
          </div>

          <Footer />
        </>
      )}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;