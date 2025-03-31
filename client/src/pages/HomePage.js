import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import axios from "axios";
import toast from "react-hot-toast";
import Layout from "../components/Layout/Layout";
import { AiOutlineReload } from "react-icons/ai";
import { CgDetailsMore } from "react-icons/cg";
import { PiShoppingCartFill } from "react-icons/pi";
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
  const exchangeRate = 83.61;
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
      const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/product-list/${page}`);
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
      const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/product-list/${page}`);
      setLoading(false);
      setProducts([...products, ...data.products]);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const getTotal = async () => {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/product-count`);
      setTotal(data.total);
    } catch (error) {
      console.log(error);
    }
  };

  const getSpecialProducts = async () => {
    try {
      const [newArrivalsResponse, bestSellersResponse, popularProductsResponse] = await Promise.all([
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
      toast.success("Item Added to cart");
    } else {
      const newCart = [...cart, { ...product, quantity: 1 }];
      setCart(newCart);
      localStorage.setItem("cart", JSON.stringify(newCart));
      toast.success("Item Added to cart");
    }
    setCartProductIds([...cartProductIds, product._id]);
  };

  const popularProductSettings = {
    autoplay: true,
    autoplaySpeed: 3000,
    infinite: true,
    slidesToShow: 3, // Default number of slides to show
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: 3 } }, // Large screens
      { breakpoint: 992, settings: { slidesToShow: 3 } },  // Medium screens
      { breakpoint: 768, settings: { slidesToShow: 2 } },  // Tablets
      { breakpoint: 576, settings: { slidesToShow: 3 } },  // Smartphones (show 3 slides)
    ],
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
  };
  
  
  const carouselSettings = {
    autoplay: true,
    autoplaySpeed: 3000,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true, // Enable arrows
    prevArrow: <button className="slick-prev">Prev</button>,
    nextArrow: <button className="slick-next">Next</button>,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false, // Optionally hide arrows on small screens
        },
      },
    ],
  };
  

  const offerSettings = {
    autoplay: true,
    autoplaySpeed: 3000,
    infinite: true,
    slidesToShow: 3,  // Show 3 items by default
    slidesToScroll: 1,
    arrows: true,
    prevArrow: <button className="slick-prev">Prev</button>,
    nextArrow: <button className="slick-next">Next</button>,
    responsive: [
      {
        breakpoint: 1200,  // For large screens
        settings: {
          slidesToShow: 3,  // Show 3 items at a time
        },
      },
      {
        breakpoint: 768,  // For tablets and smaller screens
        settings: {
          slidesToShow: 2,  // Show 2 items at a time
        },
      },
      {
        breakpoint: 576,  // For very small screens (e.g., smartphones)
        settings: {
          slidesToShow: 3,  // Show 3 items at a time
          centerMode: true, // Center the items
          centerPadding: "10px", // Add some padding for better spacing
        },
      },
    ],
  };
  
  

  return (
    <div className={darkMode ? "dark-mode" : ""}>
    <Layout title={"All Products - Best offers"}>
      {/* Hero Section */}
      <div className="hero-section">
        <Slider {...carouselSettings}>
          {mainCaroseldata.map((item, index) => (
            <img
              key={index}
              src={item.image}
              className="hero-image"
              alt={`banner-${index}`}
              onClick={() => navigate(`/allproduct`)}
            />
          ))}
        </Slider>
      </div>

      {/* Special Offers */}
      <section className="special-offers">
        <h2 className="section-title">Special Offers</h2>
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
        <h2 className="section-title">New Arrivals</h2>
        <div className="product-grid">
          {newArrivals.map((p) => (
            <div className="product-card" key={p._id}>
              <img
                src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`}
                className="card-img-top"
                alt={p.name}
                onClick={() => navigate(`/product/${p.slug}`)}
              />
              <div className="card-body">
                <h5 className="card-title">{p.name}</h5>
                <h5 className="card-price">
                {(p?.price || 0).toLocaleString("en-IN", {
                    style: "currency",
                    currency: "INR",
                  })}
                </h5>
                <p className="card-text">{p.description.substring(0, 60)}...</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Best Sellers */}
      <section className={`best-sellers ${darkMode ? "dark-mode" : ""}`}>
        <h2 className="section-title">Best Sellers</h2>
        <div className="product-grid">
          {bestSellers.map((p) => (
            <div className="product-card" key={p._id}>
              <img
                src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`}
                className="card-img-top"
                alt={p.name}
                onClick={() => navigate(`/product/${p.slug}`)}
              />
              <div className="card-body">
                <h5 className="card-title">{p.name}</h5>
                <h5 className="card-price">
                  {(p?.price || 0).toLocaleString("en-IN", {
                    style: "currency",
                    currency: "INR",
                  })}
                </h5>

                <p className="card-text">{p.description.substring(0, 60)}...</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={`popular-products ${darkMode ? "dark-mode" : ""}`}>
  <h2 className="section-title">Popular Products</h2>
  <Slider {...popularProductSettings}>
    {popularProducts.map((p) => (
      <div className="product-card" key={p._id}>
        <img
          src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`}
          className="card-img-top"
          alt={p.name}
          onClick={() => navigate(`/product/${p.slug}`)}
        />
        <div className="card-body">
          <h5 className="card-title">{p.name}</h5>
          <h5 className="card-price">
          {(p?.price || 0).toLocaleString("en-IN", {
                    style: "currency",
                    currency: "INR",
                  })}
          </h5>
          <p className="card-text">{p.description.substring(0, 60)}...</p>
        </div>
      </div>
    ))}
  </Slider>
</section>



      <div className="m-2 p-3">
        {/* Removed Load More button */}
      </div>
    </Layout>
    </div>
  );
};

export default HomePage;
