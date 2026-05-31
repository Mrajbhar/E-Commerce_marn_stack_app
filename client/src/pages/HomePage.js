import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import axios from "axios";
import toast from "react-hot-toast";
import Layout from "../components/Layout/Layout";
import { CgDetailsMore } from "react-icons/cg";
import { PiShoppingCartFill, PiHeartBold } from "react-icons/pi";
import {
  TbTruckDelivery,
  TbArrowBackUp,
  TbLock,
  TbHeadset,
} from "react-icons/tb";
import { useCart } from "../context/cart";
import { useTheme } from "../pages/Themes/ThemeContext";
import "../styles/Homepage.css";
import { mainCaroseldata } from "./mainCaroseldata";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { MdOutlineNavigateBefore, MdOutlineNavigateNext } from "react-icons/md";

const HomePage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useCart();
  const [products, setProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const { darkMode } = useTheme();
  const [cartProductIds, setCartProductIds] = useState([]);

  useEffect(() => {
    getAllProducts();
    getTotal();
    getSpecialProducts();
  }, [page]);

  useEffect(() => {
    if (page === 1) return;
    loadMore();
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

  const loadMore = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/product-list/${page}`
      );
      setLoading(false);
      setProducts([...products, ...data.products]);
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
      setTotal(data.total);
    } catch (error) {
      console.log(error);
    }
  };

  const getSpecialProducts = async () => {
    try {
      const [newArrivalsResponse, bestSellersResponse, popularProductsResponse] =
        await Promise.all([
          axios.get(`${process.env.REACT_APP_API}/api/v1/product/product-list/${page}`),
          axios.get(`${process.env.REACT_APP_API}/api/v1/product/product-list/${page}`),
          axios.get(`${process.env.REACT_APP_API}/api/v1/product/product-list/${page}`),
        ]);
      setNewArrivals(newArrivalsResponse.data.products);
      setBestSellers(bestSellersResponse.data.products);
      setPopularProducts(popularProductsResponse.data.products);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddToCart = (product) => {
    const existingItem = cart.find((item) => item._id === product._id);
    if (existingItem) {
      const updatedCart = cart.map((item) =>
        item._id === existingItem._id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      toast.success("Item added to cart");
    } else {
      const newCart = [...cart, { ...product, quantity: 1 }];
      setCart(newCart);
      localStorage.setItem("cart", JSON.stringify(newCart));
      toast.success("Item added to cart");
    }
    setCartProductIds([...cartProductIds, product._id]);
  };

  const formatPrice = (price) =>
    (price || 0).toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    });

  // ---- static content for the showcase sections ----
  const tickerItems = [
    "Free shipping over \u20B9999",
    "30-day easy returns",
    "New season just landed",
    "Members get 15% off",
  ];

  const features = [
    { icon: <TbTruckDelivery />, title: "Free shipping", text: "On orders over \u20B9999" },
    { icon: <TbArrowBackUp />, title: "Easy returns", text: "30-day money back" },
    { icon: <TbLock />, title: "Secure payment", text: "Encrypted checkout" },
    { icon: <TbHeadset />, title: "24/7 support", text: "Always here to help" },
  ];

  const categories = [
    { name: "Apparel", count: "128 items \u00B7 The full wardrobe", slug: "apparel", cls: "feat g1" },
    { name: "Footwear", count: "86 items", slug: "footwear", cls: "g2" },
    { name: "Accessories", count: "204 items", slug: "accessories", cls: "g3" },
    { name: "Home", count: "57 items", slug: "home", cls: "g4" },
    { name: "Beauty", count: "73 items", slug: "beauty", cls: "g5" },
  ];

  // ---- reusable product card ----
  const ProductCard = (p, badge) => (
    <article className="product-card" key={p._id}>
      <div className="product-media">
        {badge && <span className="product-badge">{badge}</span>}
        <button className="wish-btn" aria-label="Add to wishlist">
          <PiHeartBold size={16} />
        </button>
        <img
          src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`}
          className="card-img-top"
          alt={p.name}
          onClick={() => navigate(`/product/${p.slug}`)}
        />
        <div className="product-actions">
          <button
            className="btn btn-primary btn-sm action-cart"
            onClick={() => handleAddToCart(p)}
            aria-label="Add to cart"
          >
            <PiShoppingCartFill size={16} /> Add to cart
          </button>
          <button
            className="btn btn-icon action-details"
            onClick={() => navigate(`/product/${p.slug}`)}
            aria-label="View details"
          >
            <CgDetailsMore size={18} />
          </button>
        </div>
      </div>
      <div className="card-body">
        {p?.rating && (
          <div className="card-rating">
            {"\u2605".repeat(Math.round(p.rating))}
            {"\u2606".repeat(5 - Math.round(p.rating))}
            {p?.numReviews ? <small>({p.numReviews})</small> : null}
          </div>
        )}
        <h5 className="card-title" onClick={() => navigate(`/product/${p.slug}`)}>
          {p.name}
        </h5>
        <p className="card-text">{p.description?.substring(0, 60)}...</p>
        <div className="card-footer-row">
          <span className="card-price">{formatPrice(p?.price)}</span>
        </div>
      </div>
    </article>
  );

  const popularProductSettings = {
    autoplay: true, autoplaySpeed: 3000, infinite: true,
    slidesToShow: 3, slidesToScroll: 1,
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: 3 } },
      { breakpoint: 992, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 576, settings: { slidesToShow: 1 } },
    ],
    arrows: true,
    prevArrow: <button className="slick-prev"><MdOutlineNavigateBefore size={24} /></button>,
    nextArrow: <button className="slick-next"><MdOutlineNavigateNext size={24} /></button>,
  };

  const carouselSettings = {
    autoplay: true, autoplaySpeed: 4000, infinite: true,
    slidesToShow: 1, slidesToScroll: 1, fade: true, arrows: true,
    prevArrow: <button className="slick-prev"><MdOutlineNavigateBefore size={26} /></button>,
    nextArrow: <button className="slick-next"><MdOutlineNavigateNext size={26} /></button>,
    responsive: [{ breakpoint: 768, settings: { slidesToShow: 1, arrows: false } }],
  };

  const offerSettings = {
    autoplay: true, autoplaySpeed: 3000, infinite: true,
    slidesToShow: 3, slidesToScroll: 1, arrows: true,
    prevArrow: <button className="slick-prev"><MdOutlineNavigateBefore size={24} /></button>,
    nextArrow: <button className="slick-next"><MdOutlineNavigateNext size={24} /></button>,
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 576, settings: { slidesToShow: 1, centerMode: true, centerPadding: "24px" } },
    ],
  };

  return (
    <div className={darkMode ? "dark-mode" : ""}>
      <Layout title={"All Products - Best offers"}>
        {/* Announcement ticker */}
        <div className="home-ticker">
          <div className="ticker-track">
            {[...tickerItems, ...tickerItems].map((t, i) => (
              <span key={i}>{t}</span>
            ))}
          </div>
        </div>

        {/* Hero */}
        <section className="hero-section">
          <Slider {...carouselSettings}>
            {mainCaroseldata.map((item, index) => (
              <div key={index} className="hero-slide">
                <img
                  src={item.image}
                  className="hero-image"
                  alt={`banner-${index}`}
                  onClick={() => navigate(`/allproduct`)}
                />
                <div className="hero-overlay">
                  <span className="hero-kicker">New season</span>
                  <h1 className="hero-heading">Pieces made to last</h1>
                  <p className="hero-sub">
                    Thoughtfully designed essentials, crafted from premium materials.
                  </p>
                  <div className="hero-btns">
                    <button className="btn btn-accent btn-lg" onClick={() => navigate(`/allproduct`)}>
                      Shop the collection
                    </button>
                    <button className="btn btn-outline btn-lg" onClick={() => navigate(`/allproduct`)}>
                      Explore new in
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </section>

        {/* Trust / features bar */}
        <section className="home-features">
          {features.map((f, i) => (
            <div className="feature-item" key={i}>
              <div className="feature-ico">{f.icon}</div>
              <div>
                <h4>{f.title}</h4>
                <p>{f.text}</p>
              </div>
            </div>
          ))}
        </section>

        {/* Bento categories */}
        <section className="home-categories">
          <div className="section-head">
            <div>
              <span className="section-kicker">Browse</span>
              <h2 className="section-title">Shop by Category</h2>
            </div>
            <button className="btn btn-outline btn-sm" onClick={() => navigate(`/allproduct`)}>
              View all &rarr;
            </button>
          </div>
          <div className="bento-grid">
            {categories.map((c, i) => (
              <div
                className={`cat-tile ${c.cls}`}
                key={i}
                onClick={() => navigate(`/category/${c.slug}`)}
              >
                <span className="cat-arrow">&#8599;</span>
                <div className="cat-tile-text">
                  <span className="cat-name">{c.name}</span>
                  <span className="cat-count">{c.count}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Special Offers */}
        <section className="special-offers">
          <div className="section-head">
            <div>
              <span className="section-kicker">Limited time</span>
              <h2 className="section-title">Special Offers</h2>
            </div>
          </div>
          <Slider {...offerSettings}>
            {mainCaroseldata.map((item, index) => (
              <div key={index} className="offer-item">
                <img
                  src={item.image}
                  alt={`offer-${index}`}
                  className="offer-image"
                  onClick={() => navigate(`/allproduct`)}
                />
              </div>
            ))}
          </Slider>
        </section>

        {/* New Arrivals */}
        <section className={`new-arrivals ${darkMode ? "dark-mode" : ""}`}>
          <div className="section-head">
            <div>
              <span className="section-kicker">Just landed</span>
              <h2 className="section-title">New Arrivals</h2>
            </div>
            <button className="btn btn-outline btn-sm" onClick={() => navigate(`/allproduct`)}>
              View all &rarr;
            </button>
          </div>
          <div className="product-grid">
            {newArrivals.map((p) => ProductCard(p, "New"))}
          </div>
        </section>

        {/* Promo banner */}
        <section className="promo-banner">
          <div className="promo-inner">
            <span className="promo-kicker">Free shipping this weekend</span>
            <h2>Elevate your everyday with timeless design</h2>
            <p>Quality you can feel, prices you'll love.</p>
            <button className="btn btn-accent btn-lg" onClick={() => navigate(`/allproduct`)}>
              Start shopping
            </button>
          </div>
        </section>

        {/* Best Sellers */}
        <section className={`best-sellers ${darkMode ? "dark-mode" : ""}`}>
          <div className="section-head">
            <div>
              <span className="section-kicker">Customer favourites</span>
              <h2 className="section-title">Best Sellers</h2>
            </div>
            <button className="btn btn-outline btn-sm" onClick={() => navigate(`/allproduct`)}>
              View all &rarr;
            </button>
          </div>
          <div className="product-grid">
            {bestSellers.map((p) => ProductCard(p, "Top rated"))}
          </div>
        </section>

        {/* Popular Products */}
        <section className={`popular-products ${darkMode ? "dark-mode" : ""}`}>
          <div className="section-head">
            <div>
              <span className="section-kicker">Trending now</span>
              <h2 className="section-title">Popular Products</h2>
            </div>
          </div>
          <Slider {...popularProductSettings}>
            {popularProducts.map((p) => (
              <div className="carousel-card-wrap" key={p._id}>
                {ProductCard(p)}
              </div>
            ))}
          </Slider>
        </section>

        {/* Newsletter */}
        <section className="home-newsletter">
          <div className="news-card">
            <h2>Stay in the loop</h2>
            <p>Subscribe for early access to drops, exclusive offers, and 10% off your first order.</p>
            <div className="news-form">
              <input type="email" placeholder="you@example.com" />
              <button className="btn btn-accent" onClick={() => toast.success("Subscribed!")}>
                Subscribe
              </button>
            </div>
          </div>
        </section>
      </Layout>
    </div>
  );
};

export default HomePage;
