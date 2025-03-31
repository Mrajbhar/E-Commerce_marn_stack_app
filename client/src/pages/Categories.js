import React from "react";
import { Link } from "react-router-dom";
import useCategory from "../hooks/useCategory";
import Layout from "../components/Layout/Layout";
import { useTheme } from "../pages/Themes/ThemeContext";
import "../styles/Categories.css";

const categoryImages = {
  "Smart Phones": "https://img.freepik.com/premium-psd/iphone-mockup_373676-427.jpg",
  "Iphones": "https://img.freepik.com/free-photo/elegant-smartphone-composition_23-2149437075.jpg",
  "Mens wear": "https://img.freepik.com/free-photo/still-life-with-classic-shirts-hanger_23-2150828578.jpg",
  "Mens collections": "https://img.freepik.com/premium-photo/man-trendy-fashion-clothes-collage-white_1199132-214720.jpg",
  "Mobiles": "https://img.freepik.com/free-photo/elegant-smartphone-composition_23-2149437106.jpg",
  "Mens": "https://img.freepik.com/premium-photo/woman-wearing-watch-is-standing-front-gray-wall_687553-22695.jpg",
  "new Arrivals": "https://img.freepik.com/free-vector/new-arrival-modern-red-banner-design_1017-36760.jpg",
  "Best Sellers": "https://img.freepik.com/premium-vector/bestseller-badge-stamp-sign-vector-design_569027-280.jpg",
  "Women's wear": "https://img.freepik.com/premium-photo/cheerful-beautiful-young-women-having-party_93675-76766.jpg",
};

const hoverColors = [
  "#3b5998", "#00aced", "#dd4b39", "#e4405f", 
  "#ffcc00", "#34a853", "#ff6f61", "#673ab7"
];

const Categories = () => {
  const categories = useCategory();
  const { darkMode } = useTheme();

  return (
    <div className={darkMode ? "dark-mode" : ""}>

    <Layout title={"All Categories"}>
      <div className={`container category-container ${darkMode ? "dark-mode" : ""}`}>
        <h2 className="category-title">Browse Categories</h2>
        <ul className="category-list">
          {categories.map((c, index) => (
            <li key={c._id}>
              <Link 
                to={`/category/${c.slug}`} 
                className="category-item"
                style={{ "--hover-color": hoverColors[index % hoverColors.length] }}
              >
                <img
                  src={categoryImages[c.name] || "https://via.placeholder.com/100"}
                  alt={c.name}
                  className="category-image"
                />
                <span className="category-text">{c.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Layout>
    </div>
  );
};

export default Categories;
