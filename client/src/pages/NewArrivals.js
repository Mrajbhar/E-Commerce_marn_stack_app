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
  const [sort, setSort] = useState("newest");
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
        `${process.env.REACT_APP_API}/api/v1/product/product-list/${pageNum}`,
      );
      setProducts(data.products || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getTotal = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/product-count`,
      );
      setTotal(data?.total || 0);
    } catch (error) {
      console.log(error);
    }
  };

  const loadMore = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/product-list/${page}`,
      );
      setProducts((prev) => [...prev, ...(data.products || [])]);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const sorted = [...products].sort((a, b) => {
    if (sort === "price-low") return (a.price || 0) - (b.price || 0);
    if (sort === "price-high") return (b.price || 0) - (a.price || 0);
    if (sort === "name") return (a.name || "").localeCompare(b.name || "");
    return 0; // newest = API order
  });

  return (
    <Layout title="New Arrivals">
      <div className={`new-arrivals-page ${darkMode ? "dark" : ""}`}>
        <header className="na-hero" data-aos="fade-up">
          <span className="na-kicker">Just landed</span>
          <h1 className="na-title">New Arrivals</h1>
          <p className="na-sub">
            <b>{total}</b> fresh piece{total !== 1 ? "s" : ""}, just added
          </p>
        </header>

        <div className="na-toolbar">
          <span className="na-count">
            Showing <b>{products.length}</b> of <b>{total}</b>
          </span>
          <select
            className="na-sort"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="newest">Sort: Newest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name">Name: A–Z</option>
          </select>
        </div>

        {loading && products.length === 0 ? (
          <div className="na-grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <div className="na-skel" key={i}>
                <div className="m" />
                <div className="l s" />
                <div className="l" />
                <div className="l p" />
              </div>
            ))}
          </div>
        ) : sorted.length === 0 ? (
          <div className="na-empty">
            <h3>No new arrivals yet</h3>
            <p>Check back soon — fresh pieces are added regularly.</p>
          </div>
        ) : (
          <div className="na-grid">
            {sorted.map((p, i) => (
              <div key={p._id} data-aos="fade-up" data-aos-delay={(i % 4) * 60}>
                <ProductCard p={p} badge="New" />
              </div>
            ))}
          </div>
        )}

        <div className="na-loadmore">
          {products.length < total && (
            <button className="loadmore" onClick={() => setPage(page + 1)}>
              {loading ? (
                "Loading…"
              ) : (
                <>
                  Load more <AiOutlineReload />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default NewArrivals;
