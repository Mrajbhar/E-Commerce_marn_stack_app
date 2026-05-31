import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import { useParams, useNavigate } from "react-router-dom";
import { CgDetailsMore } from "react-icons/cg";
import { FaCartArrowDown } from "react-icons/fa";
import { PiShoppingCartFill, PiHeartBold } from "react-icons/pi";
import axios from "axios";
import toast from "react-hot-toast";
import "../styles/CategoryProductStyles.css";
import { useCart } from "../context/cart";
import { useTheme } from "../pages/Themes/ThemeContext";

const CategoryProduct = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [cart, setCart] = useCart();
  const [itemAdded, setItemAdded] = useState({});
  const { darkMode } = useTheme();

  useEffect(() => {
    if (params?.slug) getProductsByCategory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.slug]);

  const getProductsByCategory = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/product-category/${params.slug}`,
      );
      setProducts(data?.products);
      setCategory(data?.category);
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

  const addItemToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item._id === product._id);
      let updatedCart;
      if (existingItem) {
        updatedCart = prevCart.map((item) =>
          item._id === existingItem._id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      } else {
        updatedCart = [...prevCart, { ...product, quantity: 1 }];
      }
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    });
    setItemAdded((prev) => ({ ...prev, [product._id]: true }));
    toast.success("Item added to cart");
  };

  return (
    <Layout title={category?.name ? `${category.name} - Category` : "Category"}>
      <div className={`category-page ${darkMode ? "dark-mode" : ""}`}>
        {/* Header */}
        <header className="cat-header">
          <span className="cat-kicker">Category</span>
          <h1 className="cat-title">{category?.name}</h1>
          <p className="cat-subtitle">
            <b>{products.length}</b> item{products.length !== 1 ? "s" : ""}{" "}
            found
          </p>
        </header>

        {/* Grid */}
        {products.length === 0 ? (
          <div className="cat-empty">No products found in this category.</div>
        ) : (
          <div className="cat-grid">
            {products.map((p) => (
              <article className="cat-card" key={p._id}>
                <div className="cat-media">
                  <button className="cat-wish" aria-label="Add to wishlist">
                    <PiHeartBold size={15} />
                  </button>
                  <img
                    src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`}
                    alt={p.name}
                    onClick={() => navigate(`/product/${p.slug}`)}
                  />
                </div>

                <div className="cat-body">
                  <h5
                    className="cat-name"
                    onClick={() => navigate(`/product/${p.slug}`)}
                  >
                    {p.name}
                  </h5>
                  <p className="cat-desc">
                    {p.description?.substring(0, 60)}...
                  </p>
                  <div className="cat-price">{inr(p?.price)}</div>

                  <div className="cat-actions">
                    {itemAdded[p._id] ? (
                      <button
                        className="cat-btn cat-btn-add added"
                        onClick={() => navigate("/cart")}
                      >
                        <PiShoppingCartFill /> Go to cart
                      </button>
                    ) : (
                      <button
                        className="cat-btn cat-btn-add"
                        onClick={() => addItemToCart(p)}
                      >
                        <FaCartArrowDown /> Add to cart
                      </button>
                    )}
                    <button
                      className="cat-btn cat-btn-details"
                      onClick={() => navigate(`/product/${p.slug}`)}
                      aria-label="View details"
                    >
                      <CgDetailsMore /> <span>Details</span>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CategoryProduct;
