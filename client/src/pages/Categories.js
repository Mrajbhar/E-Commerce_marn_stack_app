import React from "react";
import { Link } from "react-router-dom";
import useCategory from "../hooks/useCategory";
import Layout from "../components/Layout/Layout";
import { useTheme } from "../pages/Themes/ThemeContext";
import "../styles/Categories.css";

const categoryImages = {
  "Smart Phones":
    "https://img.freepik.com/premium-psd/iphone-mockup_373676-427.jpg",
  Iphones:
    "https://img.freepik.com/free-photo/elegant-smartphone-composition_23-2149437075.jpg",
  "Mens wear":
    "https://img.freepik.com/free-photo/still-life-with-classic-shirts-hanger_23-2150828578.jpg",
  "Mens collections":
    "https://img.freepik.com/premium-photo/man-trendy-fashion-clothes-collage-white_1199132-214720.jpg",
  Mobiles:
    "https://img.freepik.com/free-photo/elegant-smartphone-composition_23-2149437106.jpg",
  Mens: "https://img.freepik.com/premium-photo/woman-wearing-watch-is-standing-front-gray-wall_687553-22695.jpg",
  "new Arrivals":
    "https://img.freepik.com/free-vector/new-arrival-modern-red-banner-design_1017-36760.jpg",
  "Best Sellers":
    "https://img.freepik.com/premium-vector/bestseller-badge-stamp-sign-vector-design_569027-280.jpg",
  "Women's wear":
    "https://img.freepik.com/premium-photo/cheerful-beautiful-young-women-having-party_93675-76766.jpg",
   Apparel:
    "https://img.magnific.com/premium-photo/customer-browsing-through-display-colorful-athletic-apparel-modern-sportswear-shop-ar-32-v_630290-37415.jpg",
      Footwear:
    "https://img.magnific.com/premium-photo/row-shoes-display-store_1288816-4083.jpg",
    Accessories:
    "https://img.magnific.com/premium-photo/luxurious-3d-fashion-accessories-sleek-flat-surface_1313031-300.jpg",
    Beauty:
    "https://img.magnific.com/premium-photo/purple-pink-beauty-products-flowers-pink-background_14117-859094.jpg",
    "Beauty Essentials":
    "https://img.magnific.com/free-photo/model-career-kit-still-life_23-2150217985.jpg",
};

// soft tint applied to the overlay on hover (per tile)
const hoverColors = [
  "rgba(194,86,47,.85)",
  "rgba(52,81,79,.85)",
  "rgba(87,71,102,.85)",
  "rgba(106,87,52,.85)",
  "rgba(60,58,79,.85)",
  "rgba(122,74,48,.85)",
];

const Categories = () => {
  const categories = useCategory();
  const { darkMode } = useTheme();

  return (
    <Layout title={"All Categories"}>
      <div className={`categories-page ${darkMode ? "dark-mode" : ""}`}>
        {/* Header */}
        <header className="cats-header">
          <span className="cats-kicker">Browse</span>
          <h1 className="cats-title">Shop by Category</h1>
          <p className="cats-subtitle">
            Explore our full range across {categories?.length || 0} categories
          </p>
        </header>

        {/* Grid */}
        {!categories || categories.length === 0 ? (
          <div className="cats-empty">No categories available yet.</div>
        ) : (
          <ul className="cats-grid">
            {categories.map((c, index) => (
              <li key={c._id}>
                <Link
                  to={`/category/${c.slug}`}
                  className="cat-link"
                  style={{
                    "--hover-color": hoverColors[index % hoverColors.length],
                  }}
                >
                  <img
                    src={
                      categoryImages[c.name] ||
                      "https://via.placeholder.com/400x300?text=Category"
                    }
                    alt={c.name}
                    loading="lazy"
                  />
                  <div className="cat-content">
                    <h3 className="cat-name">{c.name}</h3>
                    <span className="cat-go">&#8599;</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Layout>
  );
};

export default Categories;
