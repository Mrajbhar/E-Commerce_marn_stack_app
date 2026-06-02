import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import axios from "axios";
import toast from "react-hot-toast";
import Layout from "../components/Layout/Layout";
import ProductCard from "../components/Product/ProductCard";
import {
  TbTruckDelivery, TbArrowBackUp, TbLock, TbHeadset,
} from "react-icons/tb";
import { useTheme } from "../pages/Themes/ThemeContext";
import "../styles/Homepage.css";
import { mainCaroseldata } from "./mainCaroseldata";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { MdOutlineNavigateBefore, MdOutlineNavigateNext } from "react-icons/md";

const HomePage = () => {
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  const [newArrivals, setNewArrivals] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryCounts, setCategoryCounts] = useState({});
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    getSpecialProducts();
    getCategories();
    getBanners();
  }, []);

  const getSpecialProducts = async () => {
    try {
      const [na, bs, pop] = await Promise.all([
        axios.get(`${process.env.REACT_APP_API}/api/v1/product/product-list/1`),
        axios.get(`${process.env.REACT_APP_API}/api/v1/product/product-list/1`),
        axios.get(`${process.env.REACT_APP_API}/api/v1/product/product-list/1`),
      ]);
      setNewArrivals(na.data.products);
      setBestSellers(bs.data.products);
      setPopularProducts(pop.data.products);
    } catch (error) {
      console.log(error);
    }
  };

  const getCategories = async () => {
    try {
      const [catRes, countRes] = await Promise.all([
        axios.get(`${process.env.REACT_APP_API}/api/v1/category/get-category`),
        axios.get(`${process.env.REACT_APP_API}/api/v1/category/category-counts`),
      ]);
      if (catRes.data?.success) setCategories(catRes.data.category || []);
      if (countRes.data?.success) setCategoryCounts(countRes.data.counts || {});
    } catch (error) {
      console.log(error);
    }
  };

  // Pull active banners from the API — fall back to static array on failure
  const getBanners = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/banner/active`
      );
      if (data?.success && data.banners?.length) {
        setBanners(data.banners);
      }
    } catch (error) {
      console.log("banner fetch failed, falling back to static:", error?.message);
    }
  };

  // Decide which slides the hero renders. If API gave us banners, use those.
  // Otherwise fall back to the original hardcoded list so the page never breaks.
  const heroSlides = banners.length
    ? banners.map((b) => ({
        image: `${process.env.REACT_APP_API}/api/v1/banner/photo/${b._id}`,
        link: b.linkUrl || "/allproduct",
        title: b.title,
        subtitle: b.subtitle,
        id: b._id,
      }))
    : mainCaroseldata.map((c, i) => ({
        image: c.image, link: "/allproduct", id: `static-${i}`,
      }));

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

  const bento = categories.slice(0, 5);
  const tileCls = (i, c) =>
    i === 0 || c.featured ? "feat g1" : `g${(i % 4) + 2}`;
  const photoUrl = (id) =>
    `${process.env.REACT_APP_API}/api/v1/category/category-photo/${id}`;

  const popularProductSettings = {
    autoplay: true, autoplaySpeed: 3000, infinite: true,
    slidesToShow: 3, slidesToScroll: 1, arrows: true,
    prevArrow: <button className="slick-prev"><MdOutlineNavigateBefore size={24} /></button>,
    nextArrow: <button className="slick-next"><MdOutlineNavigateNext size={24} /></button>,
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: 3 } },
      { breakpoint: 992, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 576, settings: { slidesToShow: 1 } },
    ],
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
        <div className="home-ticker">
          <div className="ticker-track">
            {[...tickerItems, ...tickerItems].map((t, i) => <span key={i}>{t}</span>)}
          </div>
        </div>

        {/* Hero — dynamic banners with fallback */}
        <section className="hero-section">
          <Slider {...carouselSettings}>
            {heroSlides.map((slide) => (
              <div key={slide.id} className="hero-slide">
                <img
                  src={slide.image}
                  className="hero-image"
                  alt={slide.title || "banner"}
                  onClick={() => navigate(slide.link)}
                  onError={(e) => { e.target.style.opacity = 0.3; }}
                />
                {(slide.title || slide.subtitle) && (
                  <div className="hero-caption">
                    {slide.title && <h2>{slide.title}</h2>}
                    {slide.subtitle && <p>{slide.subtitle}</p>}
                  </div>
                )}
              </div>
            ))}
          </Slider>
        </section>

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

        <section className="home-categories">
          <div className="section-head">
            <div>
              <span className="section-kicker">Browse</span>
              <h2 className="section-title">Shop by Category</h2>
            </div>
            <button className="btn btn-outline btn-sm" onClick={() => navigate(`/categories`)}>
              View all &rarr;
            </button>
          </div>
          {bento.length > 0 ? (
            <div className="bento-grid">
              {bento.map((c, i) => {
                const count = categoryCounts[c._id] || 0;
                return (
                  <div className={`cat-tile ${tileCls(i, c)}`}
                    key={c._id}
                    onClick={() => navigate(`/category/${c.slug}`)}>
                    <img src={photoUrl(c._id)} alt={c.name} loading="lazy"
                      onError={(e) => { e.target.style.display = "none"; }} />
                    <span className="cat-arrow">&#8599;</span>
                    <div className="cat-tile-text">
                      <span className="cat-name">{c.name}</span>
                      <span className="cat-count">
                        {count} item{count !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : null}
        </section>

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
                <img src={item.image} alt={`offer-${index}`} className="offer-image"
                  onClick={() => navigate(`/allproduct`)} />
              </div>
            ))}
          </Slider>
        </section>

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
            {newArrivals.map((p) => <ProductCard key={p._id} p={p} badge="New" />)}
          </div>
        </section>

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
            {bestSellers.map((p) => <ProductCard key={p._id} p={p} badge="Top rated" />)}
          </div>
        </section>

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
                <ProductCard p={p} />
              </div>
            ))}
          </Slider>
        </section>

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
