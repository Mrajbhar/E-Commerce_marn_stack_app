import React from "react";
import { Link } from "react-router-dom";
import useCategory from "../hooks/useCategory";
import Layout from "../components/Layout/Layout";
import { useTheme } from "../pages/Themes/ThemeContext"; // Import useTheme hook
import "../styles/Categories.css";

const Categories = () => {
  const categories = useCategory();
  const { darkMode } = useTheme(); // Access darkMode state

  return (
    <Layout title={"All Categories"}>
      <div className={`container ${darkMode ? 'dark-mode' : ''}`}>
        <div className="row">
          {categories.map((c) => (
            <div className="col-md-3 col-sm-6 mt-4" key={c._id}>
              <Link to={`/category/${c.slug}`} className="category-link">
                <div className="category-menu">
                  <div className="category-icon">{c.icon}</div>
                  <div className="category-name">{c.name}</div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Categories;
