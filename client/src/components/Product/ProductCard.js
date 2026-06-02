import React from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { CgDetailsMore } from "react-icons/cg";
import { PiShoppingCartFill, PiHeartBold } from "react-icons/pi";
import { FaCartArrowDown } from "react-icons/fa";
import { useCart } from "../../context/cart";

const formatPrice = (price) =>
  Number(price || 0).toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });

/**
 * Single shared product card.
 *
 *   <ProductCard p={product} badge="New" />
 *
 * It reads the enriched fields (originalPrice, stockStatus, brand,
 * ratings.average/count) when they exist and degrades gracefully when they
 * don't. Cards can be reused in any page — Homepage, NewArrivals, BestSellers,
 * AllProducts, Category — just by changing CSS class prefixes on the wrapper.
 *
 * Props:
 *  - p:        product object from the API
 *  - badge:    optional override badge text (e.g. "New", "Top rated").
 *              If omitted we auto-derive from product flags.
 */
const ProductCard = ({ p, badge: badgeOverride }) => {
  const navigate = useNavigate();
  const [cart, setCart] = useCart();
  const [added, setAdded] = React.useState(false);

  const isSoldOut = p?.stockStatus === "out_of_stock";
  const isLowStock = p?.stockStatus === "low_stock";
  const discountPct =
    p?.originalPrice && p.originalPrice > p.price
      ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
      : 0;

  // Choose the badge to show (caller can override). Discount wins, then
  // explicit override, then low-stock, then nothing.
  let badge = null;
  let badgeKind = "default";
  if (discountPct > 0) { badge = `${discountPct}% off`; badgeKind = "sale"; }
  else if (badgeOverride) { badge = badgeOverride; }
  else if (isLowStock) { badge = "Low stock"; badgeKind = "lowstock"; }

  const rating = p?.ratings?.average || 0;
  const reviewCount = p?.ratings?.count || 0;

  const addToCart = () => {
    if (isSoldOut) {
      toast.error("This item is sold out");
      return;
    }
    setCart((prev) => {
      const existing = prev.find((i) => i._id === p._id);
      const next = existing
        ? prev.map((i) =>
            i._id === existing._id ? { ...i, quantity: i.quantity + 1 } : i
          )
        : [...prev, { ...p, quantity: 1 }];
      localStorage.setItem("cart", JSON.stringify(next));
      return next;
    });
    setAdded(true);
    toast.success("Item added to cart");
  };

  return (
    <article className={`product-card ${isSoldOut ? "is-sold-out" : ""}`}>
      <div className="product-media">
        {badge && <span className={`product-badge product-badge-${badgeKind}`}>{badge}</span>}
        {isSoldOut && <div className="product-soldout-overlay">Sold out</div>}

        <button className="wish-btn" aria-label="Add to wishlist">
          <PiHeartBold size={16} />
        </button>

        <img
          src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`}
          className="card-img-top"
          alt={p.name}
          onClick={() => navigate(`/product/${p.slug}`)}
        />

        <div className="product-actions">
          {added && !isSoldOut ? (
            <button
              className="btn btn-accent btn-sm action-cart"
              onClick={() => navigate("/cart")}
            >
              <PiShoppingCartFill size={16} /> Go to cart
            </button>
          ) : (
            <button
              className="btn btn-primary btn-sm action-cart"
              onClick={addToCart}
              disabled={isSoldOut}
              aria-label="Add to cart"
            >
              <FaCartArrowDown size={16} /> {isSoldOut ? "Sold out" : "Add to cart"}
            </button>
          )}
          <button
            className="btn btn-icon action-details"
            onClick={() => navigate(`/product/${p.slug}`)}
            aria-label="View details"
          >
            <CgDetailsMore size={18} />
          </button>
        </div>
      </div>

      <div className="card-body">
        {p?.brand && <div className="card-brand">{p.brand}</div>}

        {rating > 0 && (
          <div className="card-rating">
            {"\u2605".repeat(Math.round(rating))}
            {"\u2606".repeat(5 - Math.round(rating))}
            {reviewCount ? <small>({reviewCount})</small> : null}
          </div>
        )}

        <h5
          className="card-title"
          onClick={() => navigate(`/product/${p.slug}`)}
        >
          {p.name}
        </h5>
        <p className="card-text">{p.description?.substring(0, 60)}...</p>

        <div className="card-footer-row">
          <span className="card-price">{formatPrice(p?.price)}</span>
          {discountPct > 0 && (
            <span className="card-original-price">{formatPrice(p.originalPrice)}</span>
          )}
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
