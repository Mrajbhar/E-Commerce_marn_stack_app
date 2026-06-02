import React, { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import axios from "axios";
import { AiOutlineReload } from "react-icons/ai";
import "../styles/NewArrivals.css";
import { useTheme } from "../pages/Themes/ThemeContext";
import ProductCard from "../components/Product/ProductCard";
import AOS from "aos";
import "aos/dist/aos.css";

const NewArrivals = () => {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const { darkMode } = useTheme();

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
    getProducts(1);
    getTotal();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (page === 1) return;
    loadMore();
    // eslint-disable-next-line
  }, [page]);

  const getProducts = async (pageNum) => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/product-list/${pageNum}`
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
        `${process.env.REACT_APP_API}/api/v1/product/product-count`
      );
      setTotal(data?.total);
    } catch (error) {
      console.log(error);
    }
  };

  const loadMore = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/product-list/${page}`
      );
      setProducts((prev) => [...prev, ...data.products]);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="New Arrivals">
      <div className={`new-arrivals-page ${darkMode ? "dark" : ""}`}>
        <header className="na-header" data-aos="fade-up">
          <span className="na-kicker">Just landed</span>
          <h1 className="na-title">New Arrivals</h1>
          <p className="na-sub">
            <b>{total}</b> fresh pieces, just added
          </p>
        </header>

        {/* Use the global product-grid + product-card classes from Homepage.css
            via the shared ProductCard. The page wrapper keeps the .na-header
            styles unique. */}
        <div className="product-grid">
          {products.map((p, i) => (
            <div key={p._id} data-aos="fade-up" data-aos-delay={(i % 4) * 60}>
              <ProductCard p={p} badge="New" />
            </div>
          ))}
        </div>

        <div className="na-loadmore">
          {products.length < total && (
            <button className="loadmore" onClick={() => setPage(page + 1)}>
              {loading ? "Loading…" : <>Load more <AiOutlineReload /></>}
            </button>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default NewArrivals;
