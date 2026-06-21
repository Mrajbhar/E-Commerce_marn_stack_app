import React from "react";
import Layout from "../components/Layout/Layout";
import { useWishlist } from "../context/wishlist";
import { useCart } from "../context/cart";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FiHeart, FiTrash2, FiShoppingCart } from "react-icons/fi";
import { useTheme } from "./Themes/ThemeContext";
import "../styles/Wishlist.css";

const Wishlist = () => {
  const [wishlist, setWishlist] = useWishlist();
  const [cart, setCart] = useCart();
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  const inr = (n) =>
    Number(n || 0).toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    });

  const removeItem = (id) => {
    const next = wishlist.filter((p) => p._id !== id);
    setWishlist(next);
    localStorage.setItem("wishlist", JSON.stringify(next));
    toast.success("Removed from wishlist");
  };

  const clearAll = () => {
    setWishlist([]);
    localStorage.setItem("wishlist", JSON.stringify([]));
    toast.success("Wishlist cleared");
  };

  const moveToCart = (product) => {
    if (product.stockStatus === "out_of_stock") {
      toast.error("This item is sold out");
      return;
    }
    setCart((prev) => {
      const existing = prev.find((i) => i._id === product._id);
      const next = existing
        ? prev.map((i) =>
            i._id === existing._id ? { ...i, quantity: i.quantity + 1 } : i,
          )
        : [...prev, { ...product, quantity: 1 }];
      localStorage.setItem("cart", JSON.stringify(next));
      return next;
    });
    // remove from wishlist after moving
    const next = wishlist.filter((p) => p._id !== product._id);
    setWishlist(next);
    localStorage.setItem("wishlist", JSON.stringify(next));
    toast.success("Moved to cart");
  };

  return (
    <Layout title="My Wishlist">
      <div className={`wishlist-page ${darkMode ? "dark-mode" : ""}`}>
        <header className="wl-head">
          <div>
            <span className="wl-kicker">Saved for later</span>
            <h1 className="wl-title">My Wishlist</h1>
            <p className="wl-sub">
              {wishlist.length
                ? `${wishlist.length} item${wishlist.length !== 1 ? "s" : ""} saved`
                : "Your saved items will appear here"}
            </p>
          </div>
          {wishlist.length > 0 && (
            <button className="wl-clear" onClick={clearAll}>
              <FiTrash2 /> Clear all
            </button>
          )}
        </header>

        {!wishlist.length ? (
          <div className="wl-empty">
            <div className="wl-empty-ico">
              <FiHeart />
            </div>
            <h3>Your wishlist is empty</h3>
            <p>Tap the heart on any product to save it here for later.</p>
            <button
              className="btn btn-primary"
              onClick={() => navigate("/allproduct")}
            >
              Browse products
            </button>
          </div>
        ) : (
          <div className="wl-grid">
            {wishlist.map((p) => {
              const isSoldOut = p.stockStatus === "out_of_stock";
              const hasDiscount = p.originalPrice && p.originalPrice > p.price;
              return (
                <div
                  className={`wl-card ${isSoldOut ? "is-soldout" : ""}`}
                  key={p._id}
                >
                  <div className="wl-card-media">
                    <img
                      src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`}
                      alt={p.name}
                      onClick={() => navigate(`/product/${p.slug}`)}
                      onError={(e) => (e.target.style.opacity = 0.3)}
                    />
                    {isSoldOut && (
                      <div className="wl-soldout-overlay">Sold out</div>
                    )}
                    <button
                      className="wl-remove"
                      onClick={() => removeItem(p._id)}
                      aria-label="Remove from wishlist"
                    >
                      <FiTrash2 />
                    </button>
                  </div>

                  <div className="wl-card-body">
                    {p.brand && (
                      <span className="wl-card-brand">{p.brand}</span>
                    )}
                    <h3
                      className="wl-card-name"
                      onClick={() => navigate(`/product/${p.slug}`)}
                    >
                      {p.name}
                    </h3>
                    <div className="wl-card-prices">
                      <span className="wl-card-price">{inr(p.price)}</span>
                      {hasDiscount && (
                        <span className="wl-card-original">
                          {inr(p.originalPrice)}
                        </span>
                      )}
                    </div>
                    <button
                      className={`wl-move ${isSoldOut ? "is-disabled" : ""}`}
                      onClick={() => moveToCart(p)}
                      disabled={isSoldOut}
                    >
                      <FiShoppingCart />{" "}
                      {isSoldOut ? "Sold out" : "Move to cart"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Wishlist;
