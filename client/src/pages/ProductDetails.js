import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/cart";
import "../styles/ProductDetailsStyles.css";
import toast from "react-hot-toast";
import { FaCartArrowDown } from "react-icons/fa";
import { motion } from "framer-motion";
import { CgDetailsMore } from "react-icons/cg";
import { PiShoppingCartFill } from "react-icons/pi";
import { TbTruckDelivery, TbArrowBackUp, TbLock } from "react-icons/tb";
import { useTheme } from "../pages/Themes/ThemeContext";

const ProductDetails = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({});
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [cart, setCart] = useCart();
  const [itemAdded, setItemAdded] = useState(false);
  const [qty, setQty] = useState(1);
  const { darkMode } = useTheme();

  useEffect(() => {
    if (params?.slug) getProduct();
    // reset state when navigating between products
    setItemAdded(false);
    setQty(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.slug]);

  const getProduct = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/get-product/${params.slug}`,
      );
      setProduct(data?.product);
      getSimilarProduct(data?.product._id, data?.product.category._id);
    } catch (error) {
      console.log(error);
    }
  };

  const getSimilarProduct = async (pid, cid) => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/related-product/${pid}/${cid}`,
      );
      setRelatedProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  };

  const inr = (n) =>
    Number(n || 0).toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    });

  const addItemToCart = () => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item._id === product._id);
      let updatedCart;
      if (existingItem) {
        updatedCart = prevCart.map((item) =>
          item._id === existingItem._id
            ? { ...item, quantity: item.quantity + qty }
            : item,
        );
      } else {
        updatedCart = [...prevCart, { ...product, quantity: qty }];
      }
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    });
    toast.success("Item added to cart");
    setItemAdded(true);
  };

  return (
    <Layout title={product?.name || "Product Details"}>
      <div className={`pd-page ${darkMode ? "dark-mode" : ""}`}>
        {/* Breadcrumb */}
        <div className="pd-breadcrumb">
          <span onClick={() => navigate("/")}>Home</span>
          <span className="sep">/</span>
          <span onClick={() => navigate("/allproduct")}>Products</span>
          <span className="sep">/</span>
          {product?.name}
        </div>

        {/* Main */}
        <div className="pd-main">
          <motion.div
            className="pd-gallery"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <img
              src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${product._id}`}
              alt={product?.name}
            />
          </motion.div>

          <motion.div
            className="pd-info"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {product?.category?.name && (
              <span className="pd-cat">{product.category.name}</span>
            )}
            <h1 className="pd-name">{product?.name}</h1>

            {product?.rating ? (
              <div className="pd-rating">
                <span className="stars">
                  {"\u2605".repeat(Math.round(product.rating))}
                  {"\u2606".repeat(5 - Math.round(product.rating))}
                </span>
                {product?.numReviews ? (
                  <span>({product.numReviews} reviews)</span>
                ) : null}
              </div>
            ) : null}

            <h2 className="pd-price">{inr(product?.price)}</h2>
            <p className="pd-price-note">Inclusive of all taxes</p>

            <hr className="pd-divider" />

            <div className="pd-desc-label">Description</div>
            <p className="pd-desc">{product?.description}</p>

            {/* Quantity + add to cart */}
            <div className="pd-buy-row">
              <div className="pd-qty">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  aria-label="Decrease"
                >
                  −
                </button>
                <span>{qty}</span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  aria-label="Increase"
                >
                  +
                </button>
              </div>

              {itemAdded ? (
                <motion.button
                  className="pd-btn pd-btn-go"
                  whileTap={{ scale: 0.96 }}
                  onClick={() => navigate("/cart")}
                >
                  <PiShoppingCartFill /> Go to cart
                </motion.button>
              ) : (
                <motion.button
                  className="pd-btn pd-btn-add"
                  whileTap={{ scale: 0.96 }}
                  onClick={addItemToCart}
                >
                  <FaCartArrowDown /> Add to cart
                </motion.button>
              )}
            </div>

            {/* Trust strip */}
            <div className="pd-trust">
              <div>
                <span className="ti">
                  <TbTruckDelivery />
                </span>{" "}
                Free shipping over ₹999
              </div>
              <div>
                <span className="ti">
                  <TbArrowBackUp />
                </span>{" "}
                30-day returns
              </div>
              <div>
                <span className="ti">
                  <TbLock />
                </span>{" "}
                Secure checkout
              </div>
            </div>
          </motion.div>
        </div>

        {/* Similar products */}
        <div className="pd-similar">
          <div className="pd-similar-head">
            <div>
              <span className="pd-similar-kicker">You may also like</span>
              <h4>Similar Products</h4>
            </div>
          </div>

          {relatedProducts.length < 1 && (
            <p className="pd-empty">No similar products found.</p>
          )}

          <div className="pd-grid">
            {relatedProducts?.map((p) => (
              <motion.div
                key={p._id}
                className="pd-card"
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                onClick={() => navigate(`/product/${p.slug}`)}
              >
                <div className="pd-card-media">
                  <img
                    src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`}
                    alt={p.name}
                  />
                </div>
                <div className="pd-card-body">
                  <h5 className="pd-card-name">{p.name}</h5>
                  <p className="pd-card-text">
                    {p.description?.substring(0, 60)}...
                  </p>
                  <div className="pd-card-foot">
                    <span className="pd-card-price">{inr(p.price)}</span>
                    <button
                      className="pd-card-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/product/${p.slug}`);
                      }}
                    >
                      <CgDetailsMore /> Details
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetails;
