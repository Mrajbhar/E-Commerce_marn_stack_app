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
  const [sort, setSort] = useState("popular");
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
        `${process.env.REACT_APP_API}/api/v1/product/product-list/${page}`,
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
        `${process.env.REACT_APP_API}/api/v1/product/best-sellers-count`,
      );
      setTotal(data?.total || 0);
    } catch (error) {
      console.log(error);
    }
  };

  const sorted = [...products].sort((a, b) => {
    if (sort === "price-low") return (a.price || 0) - (b.price || 0);
    if (sort === "price-high") return (b.price || 0) - (a.price || 0);
    if (sort === "name") return (a.name || "").localeCompare(b.name || "");
    return 0; // popular = API order
  });

  return (
    <Layout title="Best Sellers">
      <div className={`best-sellers-page ${darkMode ? "dark" : ""}`}>
        <header className="bs-hero" data-aos="fade-up">
          <span className="bs-kicker">Customer favourites</span>
          <h1 className="bs-title">Best Sellers</h1>
          <p className="bs-sub">
            <b>{total}</b> most-loved piece{total !== 1 ? "s" : ""}
          </p>
        </header>

        <div className="bs-toolbar">
          <span className="bs-count">
            Showing <b>{products.length}</b> of <b>{total}</b>
          </span>
          <select
            className="bs-sort"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="popular">Sort: Most popular</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name">Name: A–Z</option>
          </select>
        </div>

        {loading && products.length === 0 ? (
          <div className="bs-grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <div className="bs-skel" key={i}>
                <div className="m" />
                <div className="l s" />
                <div className="l" />
                <div className="l p" />
              </div>
            ))}
          </div>
        ) : sorted.length === 0 ? (
          <div className="bs-empty">
            <h3>No best sellers yet</h3>
            <p>As orders come in, your top products will show up here.</p>
          </div>
        ) : (
          <div className="bs-grid">
            {sorted.map((p, i) => (
              <div key={p._id} data-aos="fade-up" data-aos-delay={(i % 4) * 60}>
                <ProductCard
                  p={p}
                  badge={
                    sort === "popular" && i < 3
                      ? `#${i + 1} Best seller`
                      : "Best seller"
                  }
                />
              </div>
            ))}
          </div>
        )}

        <div className="bs-loadmore">
          {products.length < total && (
            <button className="load-more" onClick={() => setPage(page + 1)}>
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

export default BestSellers;
