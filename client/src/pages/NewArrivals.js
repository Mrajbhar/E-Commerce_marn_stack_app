import React, { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useCart } from "../context/cart";
import { AiOutlineReload } from "react-icons/ai";
import "../styles/NewArrivals.css";
import { FaCartArrowDown } from "react-icons/fa";
import { PiShoppingCartFill } from "react-icons/pi";
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
    AOS.init({ duration: 800 }); 
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
          item._id === existingItem._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        updatedCart = [...prevCart, { ...product, quantity: 1 }];
      }
  
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    });
  
    setItemAdded((prev) => ({ ...prev, [product._id]: true })); // Ensure correct button rendering
    toast.success("Item Added to cart");
  };
  

  return (
    <Layout title="New Arrivals">
      <div className={`container new-arrivals-container ${darkMode ? "dark-mode" : ""}`}>
        
        {/* ✅ Heading */}
        <h2 className="new-arrivals-heading">✨ New Arrivals ✨</h2>

        {/* ✅ Product List */}
        <div className="product-list">
          {products.map((p) => (
            <div className="product-item" key={p._id} data-aos="fade-up">
              
              {/* ✅ Product Image */}
              <div className="product-image-container">
                <img
                  src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`}
                  className="product-image"
                  alt={p.name}
                  onClick={() => navigate(`/product/${p.slug}`)}
                />
              </div>

              {/* ✅ Product Details */}
              <div className="product-details">
                <h3 className="product-name">{p.name}</h3>
                <p className="product-description">{p.description.substring(0, 150)}...</p>
                <h4 className="product-price">
                  {Number(p?.price || 0).toLocaleString("en-IN", {
                    style: "currency",
                    currency: "INR",
                  })}
                </h4>

                {/* ✅ Add to Cart Button */}
                {itemAdded[p._id] ? (
                  <button className="btn btn-success btn-cart" onClick={() => navigate("/cart")}>
                    <PiShoppingCartFill /> GO TO CART
                  </button>
                ) : (
                  <button className="btn btn-custom btn-cart" onClick={() => addItemToCart(p)}>
                    <FaCartArrowDown /> ADD TO CART
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* ✅ Load More Button */}
        <div className="text-center mt-4">
          {products.length < total && (
            <button
              className="btn loadmore"
              onClick={() => setPage(page + 1)}
            >
              {loading ? "Loading ..." : <> Load More <AiOutlineReload /> </>}
            </button>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default NewArrivals;
