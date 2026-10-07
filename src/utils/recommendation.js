// Flatten data
export const getAllProducts = (menuData) => {
  let all = [];

  Object.keys(menuData).forEach(category => {
    Object.keys(menuData[category]).forEach(subCategory => {
      menuData[category][subCategory].forEach(product => {
        all.push({
          ...product,
          category,
          subCategory
        });
      });
    });
  });

  return all;
};

// Similar products
export const getSimilarProducts = (product, menuData) => {
  const all = getAllProducts(menuData);

  return all.filter(p =>
    p.category === product.category &&
    p.subCategory === product.subCategory &&
    p.id !== product.id
  ).slice(0, 6);
};

// Recently viewed
export const addToRecentlyViewed = (product) => {
  let items = JSON.parse(localStorage.getItem("recent")) || [];

  items = items.filter(p => p.id !== product.id);
  items.unshift(product);

  localStorage.setItem("recent", JSON.stringify(items.slice(0, 5)));
};

export const getRecentlyViewed = () => {
  return JSON.parse(localStorage.getItem("recent")) || [];
};

// Recommended
export const getRecommendedProducts = (menuData) => {
  const all = getAllProducts(menuData);
  const recent = getRecentlyViewed();

  if (!recent.length) return [];

  const categories = recent.map(p => p.category);
  const subCategories = recent.map(p => p.subCategory);

  return all.filter(p =>
    categories.includes(p.category) ||
    subCategories.includes(p.subCategory)
  ).slice(0, 8);
};