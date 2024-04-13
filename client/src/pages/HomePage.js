import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Checkbox, Radio, Collapse } from "antd"; // Import Collapse
import { Prices } from "../components/Prices";
import { useCart } from "../context/cart";
import axios from "axios";
import toast from "react-hot-toast";
import Layout from "./../components/Layout/Layout";
import { AiOutlineReload } from "react-icons/ai";
import "../styles/Homepage.css";
import { mainCaroseldata } from "./mainCaroseldata";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useTheme } from "../pages/Themes/ThemeContext";
import { FaCartArrowDown } from "react-icons/fa";
import { CgDetailsMore } from "react-icons/cg";

const { Panel } = Collapse;

const HomePage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useCart();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [priceOpen, setPriceOpen] = useState(true); // State for Price Collapse
  const [categoryOpen, setCategoryOpen] = useState(true); // State for Category Collapse
  const { darkMode } = useTheme(); // Access darkMode state from ThemeContext

  const exchangeRate = 83.61;


  const getAllCategory = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/category/get-category`
      );

      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong in getting category");
    }
  };

  useEffect(() => {
    getAllCategory();
    getTotal();
  }, []);

  //get product getAllproducts
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

  //get Total Count
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

  useEffect(() => {
    if (page === 1) return;
    loadMore();
  }, [page]);

  //load more
  const loadMore = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/product-list/${page}`
      );
      setLoading(false);
      setProducts([...products, ...data?.products]);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  //filter by category

  useEffect(() => {
    if (!checked.length || !radio.length) getAllProducts();
  }, [checked.length, radio.length]);

  useEffect(() => {
    if (checked.length || radio.length) filterProducts();
  }, [checked, radio]);

  //get filtered products
  const filterProducts = async () => {
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/product/product-filters`,
        {
          checked,
          radio,
        }
      );
      setProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  };

  const settings = {
    autoplay: true,
    autoplaySpeed: 1000,
    infinite: true,
  };

  const settingss = {
    autoplay: true,
    autoplaySpeed: 3000,
    infinite: true,
    slidesToShow: 5,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <Layout title={"All Products - Best offers"}>
      {/* banner image */}
      <Slider {...settings}>
        {mainCaroseldata.map((item, index) => (
          <img
            key={index}
            src={item.image}
            className="banner-img"
            alt={`bannerimage-${index}`}
            onClick={() => navigate(`/allproduct`)}
            width={"100%"}
            height={"auto"}
          />
        ))}
      </Slider>

      <h2 className="special-offers-heading">Special Offers</h2>
      <Slider {...settingss}>
        {mainCaroseldata.map((item, index) => (
          <div key={index} className="offer-item">
            <img
              src={item.image}
              alt={`bannerimage-${index}`}
              className="offer-image"
              onClick={() => navigate(`/allproduct`)}
            />
          </div>
        ))}
      </Slider>
      {/* banner image */}
      <div
        className={`container-fluid row mt-3 home-page ${
          darkMode ? "dark-mode" : ""
        }`}
      >
        <div className="col-md-9">
          <h1 className="text-center">Products</h1>
          <div className="d-flex flex-wrap">
            {products?.map((p) => (
              <div className="card m-2" key={p._id}>
                <img
                  src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`}
                  className="card-img-top"
                  alt={p.name}
                  onClick={() => navigate(`/product/${p.slug}`)}
                  style={{ cursor: "pointer" }}
                />
                <div className="card-body">
                  <div className="card-name-price">
                    <h5 className="card-title">{p.name}</h5>
                    <h5 className="card-title card-price">
                    {(p.price * exchangeRate).toLocaleString("en-IN", {
                      style: "currency",
                      currency: "INR",
                    })}
                    </h5>
                  </div>
                  <p className="card-text">
                    {p.description.substring(0, 60)}...
                  </p>
                  <div className="card-name-price">
                    <button
                      className="btn btn-info ms-1"
                      onClick={() => navigate(`/product/${p.slug}`)}
                    >
                      <CgDetailsMore /> More Details
                    </button>
                    <button
                      className="btn btn-dark ms-1"
                      onClick={() => {
                        const existingItem = cart.find(
                          (item) => item._id === p._id
                        );
                        if (existingItem) {
                          // If the item already exists in the cart, update its quantity
                          const updatedCart = cart.map((item) =>
                            item._id === existingItem._id
                              ? { ...item, quantity: item.quantity + 1 }
                              : item
                          );
                          setCart(updatedCart);
                          localStorage.setItem(
                            "cart",
                            JSON.stringify(updatedCart)
                          );
                          toast.success("Item Added to cart");
                        } else {
                          // If the item does not exist in the cart, add it with a quantity of 1
                          setCart([...cart, { ...p, quantity: 1 }]);
                          localStorage.setItem(
                            "cart",
                            JSON.stringify([...cart, { ...p, quantity: 1 }])
                          );
                          toast.success("Item Added to cart");
                        }
                      }}
                    >
                      <FaCartArrowDown /> ADD TO CART
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="m-2 p-3">
            {products && products.length < total && (
              <button
                className="btn loadmore"
                onClick={(e) => {
                  e.preventDefault();
                  setPage(page + 1);
                }}
              >
                {loading ? (
                  "Loading ..."
                ) : (
                  <>
                    {" "}
                    Loadmore <AiOutlineReload />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
