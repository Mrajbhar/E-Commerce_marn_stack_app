import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../styles/CategoryProductStyles.css";
import { useTheme } from "../pages/Themes/ThemeContext";
import ProductCard from "../components/Product/ProductCard";

const CategoryProduct = () => {
  const params = useParams();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const { darkMode } = useTheme();

  useEffect(() => {
    if (params?.slug) getProductsByCategory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.slug]);

  const getProductsByCategory = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/product-category/${params.slug}`
      );
      setProducts(data?.products || []);
      setCategory(data?.category);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout title={category?.name ? `${category.name} - Category` : "Category"}>
      <div className={`category-page ${darkMode ? "dark-mode" : ""}`}>
        {/* Header */}
        <header className="cat-header">
          <span className="cat-kicker">Category</span>
          <h1 className="cat-title">{category?.name}</h1>
          <p className="cat-subtitle">
            <b>{products.length}</b> item{products.length !== 1 ? "s" : ""} found
          </p>
        </header>

        {/* Grid — uses the shared ProductCard so it matches the rest of the
            store and automatically shows discount / stock / brand / ratings. */}
        {products.length === 0 ? (
          <div className="cat-empty">No products found in this category.</div>
        ) : (
          <div className="product-grid cat-product-grid">
            {products.map((p) => (
              <ProductCard key={p._id} p={p} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CategoryProduct;
