import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/CategoryProductStyles.css";
import { useTheme } from "../pages/Themes/ThemeContext";
import ProductCard from "../components/Product/ProductCard";

const CategoryProduct = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [sort, setSort] = useState("featured");
  const { darkMode } = useTheme();

  useEffect(() => {
    if (params?.slug) getProductsByCategory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.slug]);

  const getProductsByCategory = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/product-category/${params.slug}`,
      );
      setProducts(data?.products || []);
      setCategory(data?.category);
    } catch (error) {
      console.log(error);
    }
  };

  const sorted = [...products].sort((a, b) => {
    if (sort === "price-low") return (a.price || 0) - (b.price || 0);
    if (sort === "price-high") return (b.price || 0) - (a.price || 0);
    if (sort === "name") return (a.name || "").localeCompare(b.name || "");
    return 0;
  });

  return (
    <Layout title={category?.name ? `${category.name} - Category` : "Category"}>
      <div className={`category-page ${darkMode ? "dark-mode" : ""}`}>
        <div className="cat-breadcrumb">
          <span onClick={() => navigate("/")}>Home</span>
          <span className="sep">/</span>
          <span onClick={() => navigate("/categories")}>Categories</span>
          <span className="sep">/</span>
          {category?.name}
        </div>

        <header className="cat-header">
          <span className="cat-kicker">Category</span>
          <h1 className="cat-title">{category?.name}</h1>
          <p className="cat-subtitle">
            <b>{products.length}</b> item{products.length !== 1 ? "s" : ""}{" "}
            found
          </p>
        </header>

        {products.length > 0 && (
          <div className="cat-toolbar">
            <select
              className="cat-sort"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="featured">Sort: Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name: A–Z</option>
            </select>
          </div>
        )}

        {products.length === 0 ? (
          <div className="cat-empty">No products found in this category.</div>
        ) : (
          <div className="product-grid cat-product-grid">
            {sorted.map((p) => (
              <ProductCard key={p._id} p={p} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CategoryProduct;
