import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import useCategory from "../hooks/useCategory";
import Layout from "../components/Layout/Layout";
import { useTheme } from "../pages/Themes/ThemeContext";
import "../styles/Categories.css";

// Six warm gradients used as fallbacks when a category has no uploaded image.
const fallbackGradients = [
  "linear-gradient(140deg, #7a4a30, #c2562f)",
  "linear-gradient(140deg, #34514f, #5f8f7d)",
  "linear-gradient(140deg, #574766, #8b6aa0)",
  "linear-gradient(140deg, #6a5734, #bda158)",
  "linear-gradient(140deg, #3c3a4f, #6f6a86)",
  "linear-gradient(140deg, #7a4435, #b07258)",
];

// Soft hover-overlay tints (used as the bottom-fade color on hover).
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
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch product counts per category once.
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_API}/api/v1/category/category-counts`
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

  // Show skeleton briefly so the page doesn't flicker on fast networks.
  useEffect(() => {
    if (categories && categories.length >= 0) {
      const t = setTimeout(() => setLoading(false), 250);
      return () => clearTimeout(t);
    }
  }, [categories]);

  const photoUrl = (id) =>
    `${process.env.REACT_APP_API}/api/v1/category/category-photo/${id}`;

  // Parallax tilt — uses pointer position to rotate the card slightly.
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
              const fallback = fallbackGradients[index % fallbackGradients.length];

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
                        // Category has no uploaded image — hide the broken img
                        // and let the gradient fallback show through.
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