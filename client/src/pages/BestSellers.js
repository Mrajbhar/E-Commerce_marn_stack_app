import React, { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useCart } from "../context/cart";
import { AiOutlineReload } from "react-icons/ai";
import "../styles/BestSellers.css";
import "../styles/Homepage.css";
import { useTheme } from "../pages/Themes/ThemeContext";
import { FaCartArrowDown } from "react-icons/fa";
import { CgDetailsMore } from "react-icons/cg";
import { PiShoppingCartFill } from "react-icons/pi";

const BestSellers = () => {
  const [newArrivals, setNewArrivals] = useState([]);
  const [cart, setCart] = useCart();
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]); 
  const [itemAdded, setItemAdded] = useState(false); 
  const navigate = useNavigate();
  const { darkMode } = useTheme();

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

  return (
    <Layout title="New Arrivals">
      <div
        className={`container-fluid row mt-3 home-page ${
          darkMode ? "dark-mode" : ""
        }`}
      >
        <h2>Best Sellers</h2>
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
                   <CgDetailsMore/> More Details
                  </button>
                  
                  {itemAdded ? (
                    <button
                      className="btn btn-success ms-1"
                      onClick={() => navigate("/cart")}
                    >
                      <PiShoppingCartFill /> GO TO CART
                    </button>
                  ) : (
                    <button
                      className="btn btn-dark ms-1"
                      onClick={() => {
                        const existingItem = cart.find(
                          (item) => item._id === p._id
                        );
                        if (existingItem) {
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
                          setCart([...cart, { ...p, quantity: 1 }]);
                          localStorage.setItem(
                            "cart",
                            JSON.stringify([...cart, { ...p, quantity: 1 }])
                          );
                          toast.success("Item Added to cart");
                        }
                        setItemAdded(true); 
                      }}
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

export default BestSellers;
