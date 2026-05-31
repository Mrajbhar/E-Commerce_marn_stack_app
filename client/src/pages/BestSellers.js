import React, { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useCart } from "../context/cart";
import { AiOutlineReload } from "react-icons/ai";
import "../styles/BestSellers.css";
import { FaCartArrowDown, FaFire } from "react-icons/fa";
import { PiShoppingCartFill, PiHeartBold } from "react-icons/pi";
import { useTheme } from "../pages/Themes/ThemeContext";
import AOS from "aos";
import "aos/dist/aos.css";

const BestSellers = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useCart();
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [itemAdded, setItemAdded] = useState({});
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  useEffect(() => {
    getAllProducts();
    getTotal();
  }, [page]);

  const getAllProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/product-list/${page}`
      );
      setLoading(false);
      setProducts(data.products);
    } catch (error) {
      setLoading(false);
      console.log(error);
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

  const addItemToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item._id === product._id);
      let updatedCart;
      if (existingItem) {
        updatedCart = prevCart.map((item) =>
          item._id === existingItem._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        updatedCart = [...prevCart, { ...product, quantity: 1 }];
      }
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    });
    setItemAdded((prev) => ({ ...prev, [product._id]: true }));
    toast.success("Item added to cart");
  };

  const formatPrice = (price) =>
    Number(price || 0).toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    });

  return (
    <Layout title="Best Sellers">
      <div className={`best-sellers-page ${darkMode ? "dark" : ""}`}>
        {/* Header */}
        <header className="bs-header" data-aos="fade-up">
          <span className="bs-kicker">Customer favourites</span>
          <h1 className="bs-title">Best Sellers</h1>
          <p className="bs-sub">
            <b>{total}</b> most-loved pieces
          </p>
        </header>

        {/* Grid */}
        <div className="bs-grid">
          {products.map((p, i) => (
            <article
              className="bs-card"
              key={p._id}
              data-aos="fade-up"
              data-aos-delay={(i % 4) * 60}
            >
              <div className="bs-media">
                <span className="bs-badge">
                  <FaFire size={11} /> Best seller
                </span>
                {i < 3 && <span className="bs-rank">{i + 1}</span>}
                <button className="bs-wish" aria-label="Add to wishlist">
                  <PiHeartBold size={15} />
                </button>
                <img
                  src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`}
                  alt={p.name}
                  onClick={() => navigate(`/product/${p.slug}`)}
                />
              </div>

              <div className="bs-body">
                {p?.rating && (
                  <div className="bs-rating">
                    {"\u2605".repeat(Math.round(p.rating))}
                    {"\u2606".repeat(5 - Math.round(p.rating))}
                    {p?.numReviews ? <small>({p.numReviews})</small> : null}
                  </div>
                )}
                <h3 className="bs-name" onClick={() => navigate(`/product/${p.slug}`)}>
                  {p.name}
                </h3>
                <p className="bs-desc">{p.description?.substring(0, 80)}...</p>
                <div className="bs-price">{formatPrice(p?.price)}</div>

                {itemAdded[p._id] ? (
                  <button className="bs-cta bs-cta-go" onClick={() => navigate("/cart")}>
                    <PiShoppingCartFill /> Go to cart
                  </button>
                ) : (
                  <button className="bs-cta bs-cta-add" onClick={() => addItemToCart(p)}>
                    <FaCartArrowDown /> Add to cart
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>

        {/* Load more */}
        {products.length < total && (
          <div className="bs-loadmore">
            <button className="load-more" onClick={() => setPage(page + 1)}>
              {loading ? (
                "Loading…"
              ) : (
                <>
                  Load more <AiOutlineReload />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default BestSellers;
