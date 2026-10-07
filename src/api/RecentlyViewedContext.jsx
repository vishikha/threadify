import { createContext, useContext, useState, useEffect } from "react";

const RecentlyViewedContext = createContext();

export const RecentlyViewedProvider = ({ children }) => {
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  // Load from localStorage on first render
  useEffect(() => {
    const saved = localStorage.getItem("recentlyViewed");
    if (saved) setRecentlyViewed(JSON.parse(saved));
  }, []);

  // Save to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("recentlyViewed", JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  const addRecentlyViewed = (product) => {
    // Avoid duplicate
    const exists = recentlyViewed.find((p) => p.id === product.id);
    let updated = exists ? recentlyViewed : [product, ...recentlyViewed];
    // Limit to last 5 items
    if (updated.length > 5) updated = updated.slice(0, 5);
    setRecentlyViewed(updated);
  };

  return (
    <RecentlyViewedContext.Provider value={{ recentlyViewed, addRecentlyViewed }}>
      {children}
    </RecentlyViewedContext.Provider>
  );
};

export const useRecentlyViewed = () => useContext(RecentlyViewedContext);