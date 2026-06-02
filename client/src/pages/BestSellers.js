import React, { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import axios from "axios";
import { AiOutlineReload } from "react-icons/ai";
import "../styles/BestSellers.css";
import { useTheme } from "../pages/Themes/ThemeContext";
import ProductCard from "../components/Product/ProductCard";
import AOS from "aos";
import "aos/dist/aos.css";

const BestSellers = () => {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const { darkMode } = useTheme();

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  useEffect(() => {
    getAllProducts();
    getTotal();
    // eslint-disable-next-line
  }, [page]);

  const getAllProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/product-list/${page}`
      );
      setProducts(data.products);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getTotal = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/best-sellers-count`
      );
      setTotal(data?.total);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout title="Best Sellers">
      <div className={`best-sellers-page ${darkMode ? "dark" : ""}`}>
        <header className="bs-header" data-aos="fade-up">
          <span className="bs-kicker">Customer favourites</span>
          <h1 className="bs-title">Best Sellers</h1>
          <p className="bs-sub">
            <b>{total}</b> most-loved pieces
          </p>
        </header>

        <div className="product-grid">
          {products.map((p, i) => (
            <div key={p._id} data-aos="fade-up" data-aos-delay={(i % 4) * 60}>
              {/* Rank chip for top 3 sellers, shown as the badge */}
              <ProductCard p={p} badge={i < 3 ? `#${i + 1} Best seller` : "Best seller"} />
            </div>
          ))}
        </div>

        {products.length < total && (
          <div className="bs-loadmore">
            <button className="load-more" onClick={() => setPage(page + 1)}>
              {loading ? "Loading…" : <>Load more <AiOutlineReload /></>}
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default BestSellers;
