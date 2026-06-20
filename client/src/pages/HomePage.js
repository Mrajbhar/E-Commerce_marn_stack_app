import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import axios from "axios";
import toast from "react-hot-toast";
import Layout from "../components/Layout/Layout";
import ProductCard from "../components/Product/ProductCard";
import {
  TbTruckDelivery,
  TbArrowBackUp,
  TbLock,
  TbHeadset,
} from "react-icons/tb";
import { useTheme } from "../pages/Themes/ThemeContext";
import "../styles/Homepage.css";
import { mainCaroseldata } from "./mainCaroseldata";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { MdOutlineNavigateBefore, MdOutlineNavigateNext } from "react-icons/md";

/* ---- Static fallbacks: used only when the API returns nothing, so the
   homepage never looks empty (e.g. fresh DB, offline backend). ---- */
const STATIC_CATEGORIES = [
  {
    _id: "s-cat-1",
    name: "Apparel",
    slug: "apparel",
    featured: true,
    img: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=700&q=80",
    count: 128,
  },
  {
    _id: "s-cat-2",
    name: "Footwear",
    slug: "footwear",
    img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=700&q=80",
    count: 86,
  },
  {
    _id: "s-cat-3",
    name: "Bags",
    slug: "bags",
    img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80",
    count: 42,
  },
  {
    _id: "s-cat-4",
    name: "Watches",
    slug: "watches",
    img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80",
    count: 37,
  },
  {
    _id: "s-cat-5",
    name: "Eyewear",
    slug: "eyewear",
    img: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=700&q=80",
    count: 54,
  },
];

/* ---- Static hero banners: shown only when no banners exist in the DB yet,
   so the hero never looks empty. Replace these or upload real banners in admin. ---- */
const STATIC_BANNERS = [
  {
    id: "s-ban-1",
    image:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&q=80",
    link: "/allproduct",
    title: "The Tailored Edit",
    subtitle: "Considered pieces for the new season",
  },
  {
    id: "s-ban-2",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&q=80",
    link: "/allproduct",
    title: "New Arrivals",
    subtitle: "Fresh drops, just landed",
  },
  {
    id: "s-ban-3",
    image:
      "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1600&q=80",
    link: "/allproduct",
    title: "Member Exclusive",
    subtitle: "Up to 15% off your first order",
  },
];

const HomePage = () => {
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  const [newArrivals, setNewArrivals] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryCounts, setCategoryCounts] = useState({});
  const [banners, setBanners] = useState([]);
  const [usingStaticCats, setUsingStaticCats] = useState(false);

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
      setNewArrivals(na.data.products || []);
      setBestSellers(bs.data.products || []);
      setPopularProducts(pop.data.products || []);
    } catch (error) {
      console.log(error);
    }
  };

  const getCategories = async () => {
    try {
      const [catRes, countRes] = await Promise.all([
        axios.get(`${process.env.REACT_APP_API}/api/v1/category/get-category`),
        axios.get(
          `${process.env.REACT_APP_API}/api/v1/category/category-counts`,
        ),
      ]);
      const cats = catRes.data?.success ? catRes.data.category || [] : [];
      if (cats.length) {
        setCategories(cats);
        setUsingStaticCats(false);
        if (countRes.data?.success)
          setCategoryCounts(countRes.data.counts || {});
      } else {
        setUsingStaticCats(true); // empty DB → show static demo categories
      }
    } catch (error) {
      console.log(error);
      setUsingStaticCats(true);
    }
  };

  const getBanners = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/banner/active`,
      );
      if (data?.success && data.banners?.length) setBanners(data.banners);
    } catch (error) {
      console.log("banner fetch failed, using static:", error?.message);
    }
  };

  // Hero: dynamic banners → else static carousel images
  const heroSlides = banners.length
    ? banners.map((b) => ({
        image: `${process.env.REACT_APP_API}/api/v1/banner/photo/${b._id}`,
        link: b.linkUrl || "/allproduct",
        title: b.title,
        subtitle: b.subtitle,
        id: b._id,
      }))
    : STATIC_BANNERS.map((b) => ({
        image: b.image,
        link: b.link,
        title: b.title,
        subtitle: b.subtitle,
        id: b.id,
      }));

  // Categories: dynamic → else static demo set
  const bentoSource = usingStaticCats
    ? STATIC_CATEGORIES
    : categories.slice(0, 5);

  const tickerItems = [
    "Free shipping over \u20B9999",
    "30-day easy returns",
    "New season just landed",
    "Members get 15% off",
  ];
  const features = [
    {
      icon: <TbTruckDelivery />,
      title: "Free shipping",
      text: "On orders over \u20B9999",
    },
    {
      icon: <TbArrowBackUp />,
      title: "Easy returns",
      text: "30-day money back",
    },
    { icon: <TbLock />, title: "Secure payment", text: "Encrypted checkout" },
    { icon: <TbHeadset />, title: "24/7 support", text: "Always here to help" },
  ];

  const tileCls = (i, c) =>
    i === 0 || c.featured ? "feat g1" : `g${(i % 4) + 2}`;
  const catPhoto = (c) =>
    usingStaticCats
      ? c.img
      : `${process.env.REACT_APP_API}/api/v1/category/category-photo/${c._id}`;
  const catCount = (c) =>
    usingStaticCats ? c.count : categoryCounts[c._id] || 0;

  const popularProductSettings = {
    autoplay: true,
    autoplaySpeed: 3000,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    prevArrow: (
      <button className="slick-prev">
        <MdOutlineNavigateBefore size={24} />
      </button>
    ),
    nextArrow: (
      <button className="slick-next">
        <MdOutlineNavigateNext size={24} />
      </button>
    ),
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: 3 } },
      { breakpoint: 992, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 576, settings: { slidesToShow: 1 } },
    ],
  };
  const carouselSettings = {
    autoplay: true,
    autoplaySpeed: 4000,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    fade: true,
    arrows: true,
    prevArrow: (
      <button className="slick-prev">
        <MdOutlineNavigateBefore size={26} />
      </button>
    ),
    nextArrow: (
      <button className="slick-next">
        <MdOutlineNavigateNext size={26} />
      </button>
    ),
    responsive: [
      { breakpoint: 768, settings: { slidesToShow: 1, arrows: false } },
    ],
  };
  const offerSettings = {
    autoplay: true,
    autoplaySpeed: 3000,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    prevArrow: (
      <button className="slick-prev">
        <MdOutlineNavigateBefore size={24} />
      </button>
    ),
    nextArrow: (
      <button className="slick-next">
        <MdOutlineNavigateNext size={24} />
      </button>
    ),
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      {
        breakpoint: 576,
        settings: { slidesToShow: 1, centerMode: true, centerPadding: "24px" },
      },
    ],
  };

  return (
    <div className={darkMode ? "dark-mode" : ""}>
      <Layout title={"MarketHub - Design-led shopping"}>
        <div className="home-ticker">
          <div className="ticker-track">
            {[...tickerItems, ...tickerItems].map((t, i) => (
              <span key={i}>{t}</span>
            ))}
          </div>
        </div>

        {/* Cobalt intro band */}
        <section className="home-intro">
          <div className="home-intro-inner">
            <div className="home-intro-left">
              <span className="home-intro-eyebrow">Autumn / Winter 2026</span>
              <h1 className="home-intro-title">
                Design-led pieces, <em>made</em> to last
              </h1>
              <p className="home-intro-sub">
                A curated edit for people who notice the details. Premium
                quality, honest prices, delivered fast.
              </p>
              <div className="home-intro-cta">
                <button
                  className="btn btn-primary"
                  onClick={() => navigate("/allproduct")}
                >
                  Shop the collection &rarr;
                </button>
                <button
                  className="btn btn-outline"
                  onClick={() => navigate("/categories")}
                >
                  Browse categories
                </button>
              </div>

              <div className="home-intro-stats">
                <div className="hi-stat">
                  <span className="hi-n">2,400+</span>
                  <span className="hi-l">Products</span>
                </div>
                <div className="hi-stat">
                  <span className="hi-n">98%</span>
                  <span className="hi-l">5-star reviews</span>
                </div>
                <div className="hi-stat">
                  <span className="hi-n">40K</span>
                  <span className="hi-l">Happy members</span>
                </div>
              </div>
            </div>

            <div className="home-intro-right">
              <img
                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=900&q=80"
                alt="Featured collection"
                className="home-intro-img"
              />
              <div className="home-intro-img-card">
                <div>
                  <span className="hic-t">Featured drop</span>
                  <span className="hic-n">The Tailored Edit</span>
                </div>
                <button
                  className="hic-go"
                  onClick={() => navigate("/allproduct")}
                  aria-label="Shop featured"
                >
                  &rarr;
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Hero banners (dynamic + static fallback) */}
        <section className="hero-section">
          <Slider {...carouselSettings}>
            {heroSlides.map((slide) => (
              <div key={slide.id} className="hero-slide">
                <img
                  src={slide.image}
                  className="hero-image"
                  alt={slide.title || "banner"}
                  onClick={() => navigate(slide.link)}
                  onError={(e) => {
                    e.target.style.opacity = 0.3;
                  }}
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
            <button
              className="btn btn-outline btn-sm"
              onClick={() => navigate(`/categories`)}
            >
              View all &rarr;
            </button>
          </div>
          {bentoSource.length > 0 && (
            <div className="bento-grid">
              {bentoSource.map((c, i) => {
                const count = catCount(c);
                return (
                  <div
                    className={`cat-tile ${tileCls(i, c)}`}
                    key={c._id}
                    onClick={() => navigate(`/category/${c.slug}`)}
                  >
                    <img
                      src={catPhoto(c)}
                      alt={c.name}
                      loading="lazy"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
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
          )}
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

        <section className={`new-arrivals ${darkMode ? "dark-mode" : ""}`}>
          <div className="section-head">
            <div>
              <span className="section-kicker">Just landed</span>
              <h2 className="section-title">New Arrivals</h2>
            </div>
            <button
              className="btn btn-outline btn-sm"
              onClick={() => navigate(`/allproduct`)}
            >
              View all &rarr;
            </button>
          </div>
          {newArrivals.length ? (
            <div className="product-grid">
              {newArrivals.map((p) => (
                <ProductCard key={p._id} p={p} badge="New" />
              ))}
            </div>
          ) : (
            <div className="home-empty">
              Products will appear here once you add them.
            </div>
          )}
        </section>

        <section className="promo-banner">
          <div className="promo-inner promo-split">
            <div className="promo-text">
              <span className="promo-kicker">Free shipping this weekend</span>
              <h2>Elevate your everyday with timeless design</h2>
              <p>Quality you can feel, prices you'll love.</p>
              <button
                className="btn btn-accent btn-lg"
                onClick={() => navigate(`/allproduct`)}
              >
                Start shopping
              </button>
            </div>
            <div className="promo-image">
              <img
                src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=900&q=80"
                alt="Featured collection"
              />
            </div>
          </div>
        </section>

        <section className={`best-sellers ${darkMode ? "dark-mode" : ""}`}>
          <div className="section-head">
            <div>
              <span className="section-kicker">Customer favourites</span>
              <h2 className="section-title">Best Sellers</h2>
            </div>
            <button
              className="btn btn-outline btn-sm"
              onClick={() => navigate(`/allproduct`)}
            >
              View all &rarr;
            </button>
          </div>
          {bestSellers.length ? (
            <div className="product-grid">
              {bestSellers.map((p) => (
                <ProductCard key={p._id} p={p} badge="Top rated" />
              ))}
            </div>
          ) : (
            <div className="home-empty">
              Best sellers will show here as orders come in.
            </div>
          )}
        </section>

        {popularProducts.length > 0 && (
          <section
            className={`popular-products ${darkMode ? "dark-mode" : ""}`}
          >
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
        )}

        <section className="home-newsletter">
          <div className="news-card">
            <h2>Stay in the loop</h2>
            <p>
              Subscribe for early access to drops, exclusive offers, and 10% off
              your first order.
            </p>
            <div className="news-form">
              <input type="email" placeholder="you@example.com" />
              <button
                className="btn btn-accent"
                onClick={() => toast.success("Subscribed!")}
              >
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
