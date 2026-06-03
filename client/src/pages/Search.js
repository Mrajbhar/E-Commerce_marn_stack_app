import React from "react";
import Layout from "./../components/Layout/Layout";
import { useSearch } from "../context/search";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../pages/Themes/ThemeContext";
import ProductCard from "../components/Product/ProductCard";
import { FiSearch } from "react-icons/fi";
import "../styles/Search.css";

const Search = () => {
  const [values] = useSearch();
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  const results = values?.results || [];
  const keyword = values?.keyword;

  return (
    <Layout title={"Search results"}>
      <div className={`search-page ${darkMode ? "dark-mode" : ""}`}>
        <header className="search-header">
          <span className="search-kicker">
            <FiSearch /> Search
          </span>
          <h1 className="search-title">
            {keyword ? `Results for “${keyword}”` : "Search Results"}
          </h1>
          <p className="search-subtitle">
            {results.length < 1 ? (
              "No products matched your search."
            ) : (
              <>
                <b>{results.length}</b> product{results.length !== 1 ? "s" : ""} found
              </>
            )}
          </p>
        </header>

        {results.length < 1 ? (
          <div className="search-empty">
            <div className="search-empty-ico"><FiSearch /></div>
            <h3>Nothing found</h3>
            <p>Try a different keyword, brand, or product name.</p>
            <button
              className="search-empty-btn"
              onClick={() => navigate("/allproduct")}
            >
              Browse all products
            </button>
          </div>
        ) : (
          <div className="product-grid search-grid">
            {results.map((p) => (
              <ProductCard key={p._id} p={p} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Search;
