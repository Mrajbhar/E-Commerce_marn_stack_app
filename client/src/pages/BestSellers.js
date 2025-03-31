import React, { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useCart } from "../context/cart";
import { AiOutlineReload } from "react-icons/ai";
import "../styles/BestSellers.css";
import { FaCartArrowDown } from "react-icons/fa";
import { PiShoppingCartFill } from "react-icons/pi";
import { useTheme } from "../pages/Themes/ThemeContext";

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
    const existingItem = cart.find((item) => item._id === product._id);
    if (existingItem) {
      const updatedCart = cart.map((item) =>
        item._id === existingItem._id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
      localStorage.setItem("cart", JSON.stringify([...cart, { ...product, quantity: 1 }]));
    }
    toast.success("Item Added to Cart");
    setItemAdded((prev) => ({ ...prev, [product._id]: true }));
  };

  return (
    <div className={darkMode ? "dark-mode" : ""}>
    <Layout title="Best Sellers">
      <div className={`container ${darkMode ? "dark-mode" : ""}`}>
        <h2 className="text-center mb-4">🔥 Best Sellers 🔥</h2>

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
        {/* Load More Button */}
        {products.length < total && (
          <div className="text-center mt-4">
            <button className="btn load-more" onClick={() => setPage(page + 1)}>
              {loading ? "Loading..." : <>Load More <AiOutlineReload /></>}
            </button>
          </div>
        )}
      </div>
    </Layout>
    </div>
  );
};

export default BestSellers;
