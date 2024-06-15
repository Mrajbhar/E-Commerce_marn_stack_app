import React, { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useCart } from "../context/cart";
import { AiOutlineReload } from "react-icons/ai";
import "../styles/BestSellers.css";
import { FaCartArrowDown } from "react-icons/fa";
import { CgDetailsMore } from "react-icons/cg";
import "../styles/Homepage.css";
import { useTheme } from "../pages/Themes/ThemeContext";
import { PiShoppingCartFill } from "react-icons/pi";

const NewArrivals = () => {
  const [newArrivals, setNewArrivals] = useState([]);
  const [cart, setCart] = useCart();
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]); // State to hold fetched products
  const [itemAdded, setItemAdded] = useState({}); // State for tracking item added to cart
  const navigate = useNavigate();
  const { darkMode } = useTheme(); // Access darkMode state from ThemeContext

  const exchangeRate = 83.61;

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

  useEffect(() => {
    getAllProducts();
    getTotal();
  }, []);

  const addItemToCart = (product) => {
    const existingItem = cart.find((item) => item._id === product._id);
    if (existingItem) {
      // If the item already exists in the cart, update its quantity
      const updatedCart = cart.map((item) =>
        item._id === existingItem._id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    } else {
      // If the item does not exist in the cart, add it with a quantity of 1
      setCart([...cart, { ...product, quantity: 1 }]);
      localStorage.setItem("cart", JSON.stringify([...cart, { ...product, quantity: 1 }]));
    }
    toast.success("Item Added to cart");
    setItemAdded((prev) => ({ ...prev, [product._id]: true })); // Set itemAdded to true for the specific product
  };

  return (
    <Layout title="New Arrivals">
      <div
        className={`container-fluid row mt-3 home-page ${
          darkMode ? "dark-mode" : ""
        }`}
      >
        <h2>New Arrivals</h2>
        <div className="d-flex flex-wrap">
          {products.map((p) => (
            <div className="card m-2" key={p._id}>
              {/* Redirect to product details page when clicking on the image */}
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
                <p className="card-text">{p.description.substring(0, 60)}...</p>
                <div className="card-name-price">
                  <button
                    className="btn btn-info ms-1"
                    onClick={() => navigate(`/product/${p.slug}`)}
                  >
                    <CgDetailsMore /> More Details
                  </button>
                  {itemAdded[p._id] ? (
                    <button
                      className="btn btn-success ms-1"
                      onClick={() => navigate("/cart")}
                    >
                      <PiShoppingCartFill /> GO TO CART
                    </button>
                  ) : (
                    <button
                      className="btn btn-dark ms-1"
                      onClick={() => addItemToCart(p)}
                    >
                      <FaCartArrowDown /> ADD TO CART
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="m-2 p-3">
          {products.length < total && (
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
    </Layout>
  );
};

export default NewArrivals;
