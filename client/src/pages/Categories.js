import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import useCategory from "../hooks/useCategory";
import Layout from "../components/Layout/Layout";
import { useTheme } from "../pages/Themes/ThemeContext";
import "../styles/Categories.css";

// Cobalt/navy gradient fallbacks when a category has no uploaded image.
const fallbackGradients = [
  "linear-gradient(140deg, #0a1f44, #1d4ed8)",
  "linear-gradient(140deg, #123a7a, #3b82f6)",
  "linear-gradient(140deg, #1e293b, #475569)",
  "linear-gradient(140deg, #0c4a6e, #0ea5e9)",
  "linear-gradient(140deg, #1e1b4b, #4f46e5)",
  "linear-gradient(140deg, #0a1f44, #2563eb)",
];

// Cobalt-family hover tints (bottom fade on hover).
const hoverColors = [
  "rgba(29,78,216,.88)",
  "rgba(59,130,246,.88)",
  "rgba(71,85,105,.88)",
  "rgba(14,165,233,.88)",
  "rgba(79,70,229,.88)",
  "rgba(37,99,235,.88)",
];

const Categories = () => {
  const categories = useCategory();
  const { darkMode } = useTheme();
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_API}/api/v1/category/category-counts`,
        );
        if (active && data?.success) setCounts(data.counts || {});
      } catch (err) {
        console.log(err);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (categories && categories.length >= 0) {
      const t = setTimeout(() => setLoading(false), 250);
      return () => clearTimeout(t);
    }
  }, [categories]);

  const photoUrl = (id) =>
    `${process.env.REACT_APP_API}/api/v1/category/category-photo/${id}`;

  const handleTilt = (e) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `translateY(-6px) rotateX(${(-py * 4).toFixed(2)}deg) rotateY(${(px * 6).toFixed(2)}deg)`;
  };
  const resetTilt = (e) => {
    e.currentTarget.style.transform = "";
  };

  return (
    <Layout title={"All Categories"}>
      <div className={`categories-page ${darkMode ? "dark-mode" : ""}`}>
        <header className="cats-header">
          <span className="cats-kicker">Browse</span>
          <h1 className="cats-title">Shop by Category</h1>
          <p className="cats-subtitle">
            Explore our full range across {categories?.length || 0} categories
          </p>
        </header>

        {loading ? (
          <ul className="cats-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <li key={i}>
                <div className="cat-skeleton" />
              </li>
            ))}
          </ul>
        ) : !categories || categories.length === 0 ? (
          <div className="cats-empty">No categories available yet.</div>
        ) : (
          <ul className="cats-grid">
            {categories.map((c, index) => {
              const count = counts[c._id] || 0;
              const tint = hoverColors[index % hoverColors.length];
              const fallback =
                fallbackGradients[index % fallbackGradients.length];

              return (
                <li
                  key={c._id}
                  className={c.featured ? "cat-li featured" : "cat-li"}
                >
                  <Link
                    to={`/category/${c.slug}`}
                    className="cat-link"
                    style={{
                      "--hover-color": tint,
                      "--fallback-bg": fallback,
                    }}
                    onMouseMove={handleTilt}
                    onMouseLeave={resetTilt}
                  >
                    <img
                      src={photoUrl(c._id)}
                      alt={c.name}
                      loading="lazy"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                    <div className="cat-content">
                      <div>
                        {c.featured && (
                          <span className="cat-featured-chip">Featured</span>
                        )}
                        <h3 className="cat-name">{c.name}</h3>
                        <span className="cat-count">
                          {count} item{count !== 1 ? "s" : ""}
                        </span>
                      </div>
                      <span className="cat-go">&#8599;</span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </Layout>
  );
};

export default Categories;
