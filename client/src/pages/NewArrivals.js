import React, { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useCart } from "../context/cart";
import { AiOutlineReload } from "react-icons/ai";
import "../styles/NewArrivals.css";
import { FaCartArrowDown } from "react-icons/fa";
import { PiShoppingCartFill, PiHeartBold } from "react-icons/pi";
import { useTheme } from "../pages/Themes/ThemeContext";
import AOS from "aos";
import "aos/dist/aos.css";

const NewArrivals = () => {
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
    getProducts();
    getTotal();
  }, []);

  useEffect(() => {
    if (page === 1) return;
    loadMore();
  }, [page]);

  const getProducts = async () => {
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
      setLoading(false);
      setProducts([...products, ...data.products]);
    } catch (error) {
      console.log(error);
      setLoading(false);
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
    <Layout title="New Arrivals">
      <div className={`new-arrivals-page ${darkMode ? "dark" : ""}`}>
        {/* Header */}
        <header className="na-header" data-aos="fade-up">
          <span className="na-kicker">Just landed</span>
          <h1 className="na-title">New Arrivals</h1>
          <p className="na-sub">
            <b>{total}</b> fresh pieces, just added
          </p>
        </header>

        {/* Grid */}
        <div className="na-grid">
          {products.map((p, i) => (
            <article
              className="na-card"
              key={p._id}
              data-aos="fade-up"
              data-aos-delay={(i % 4) * 60}
            >
              <div className="na-media">
                <span className="na-badge">New</span>
                <button className="na-wish" aria-label="Add to wishlist">
                  <PiHeartBold size={15} />
                </button>
                <img
                  src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`}
                  alt={p.name}
                  onClick={() => navigate(`/product/${p.slug}`)}
                />
              </div>

              <div className="na-body">
                {p?.rating && (
                  <div className="na-rating">
                    {"\u2605".repeat(Math.round(p.rating))}
                    {"\u2606".repeat(5 - Math.round(p.rating))}
                    {p?.numReviews ? <small>({p.numReviews})</small> : null}
                  </div>
                )}
                <h3 className="na-name" onClick={() => navigate(`/product/${p.slug}`)}>
                  {p.name}
                </h3>
                <p className="na-desc">{p.description?.substring(0, 80)}...</p>
                <div className="na-price">{formatPrice(p?.price)}</div>

                {itemAdded[p._id] ? (
                  <button className="na-cta na-cta-go" onClick={() => navigate("/cart")}>
                    <PiShoppingCartFill /> Go to cart
                  </button>
                ) : (
                  <button className="na-cta na-cta-add" onClick={() => addItemToCart(p)}>
                    <FaCartArrowDown /> Add to cart
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>

        {/* Load more */}
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
