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
  const [, setCart] = useCart();
  const [itemAdded, setItemAdded] = useState(false);
  const [qty, setQty] = useState(1);
  const [activePhoto, setActivePhoto] = useState(0);
  const { darkMode } = useTheme();

  useEffect(() => {
    if (params?.slug) getProduct();
    setItemAdded(false);
    setQty(1);
    setActivePhoto(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.slug]);

  const getProduct = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/get-product/${params.slug}`,
      );
      setProduct(data?.product);
      if (data?.product?._id && data?.product?.category?._id) {
        getSimilarProduct(data.product._id, data.product.category._id);
      }
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
      style: "currency", currency: "INR", maximumFractionDigits: 0,
    });

  // Discount + stock + ratings derived
  const photoCount = product?.photoCount || 1;
  const isSoldOut = product?.stockStatus === "out_of_stock";
  const isLowStock = product?.stockStatus === "low_stock";
  const discountPct =
    product?.originalPrice && product.originalPrice > product.price
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) * 100
        )
      : 0;
  const rating = product?.ratings?.average || 0;
  const reviewCount = product?.ratings?.count || 0;

  // Specs to render as a key-value table, skipping any blank
  const specEntries = Object.entries(product?.specifications || {})
    .filter(([, v]) => v);

  const addItemToCart = () => {
    if (isSoldOut) {
      toast.error("This item is sold out");
      return;
    }
    setCart((prev) => {
      const existing = prev.find((i) => i._id === product._id);
      const next = existing
        ? prev.map((i) => i._id === existing._id
            ? { ...i, quantity: i.quantity + qty } : i)
        : [...prev, { ...product, quantity: qty }];
      localStorage.setItem("cart", JSON.stringify(next));
      return next;
    });
    toast.success("Item added to cart");
    setItemAdded(true);
  };

  const photoUrl = (idx) =>
    `${process.env.REACT_APP_API}/api/v1/product/product-photo/${product._id}${
      idx > 0 ? "/" + idx : ""
    }`;

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
          {/* Gallery */}
          <motion.div
            className="pd-gallery"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="pd-gallery-main">
              {discountPct > 0 && (
                <span className="pd-sale-badge">{discountPct}% OFF</span>
              )}
              {product?._id && (
                <img src={photoUrl(activePhoto)} alt={product?.name} />
              )}
            </div>
            {photoCount > 1 && (
              <div className="pd-thumbs">
                {Array.from({ length: photoCount }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`pd-thumb ${activePhoto === i ? "active" : ""}`}
                    onClick={() => setActivePhoto(i)}
                  >
                    <img src={photoUrl(i)} alt={`view ${i + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Info */}
          <motion.div
            className="pd-info"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {/* Brand or category kicker */}
            {(product?.brand || product?.category?.name) && (
              <span className="pd-cat">
                {product?.brand || product.category.name}
                {product?.brand && product?.category?.name && (
                  <> &middot; {product.category.name}</>
                )}
              </span>
            )}

            <h1 className="pd-name">{product?.name}</h1>

            {/* SKU under the name */}
            {product?.sku && <div className="pd-sku">SKU: {product.sku}</div>}

            {/* Ratings */}
            {rating > 0 && (
              <div className="pd-rating">
                <span className="stars">
                  {"\u2605".repeat(Math.round(rating))}
                  {"\u2606".repeat(5 - Math.round(rating))}
                </span>
                <span>{rating.toFixed(1)}</span>
                {reviewCount > 0 && <span>({reviewCount} reviews)</span>}
              </div>
            )}

            {/* Price block — discount aware */}
            <div className="pd-price-row">
              <h2 className="pd-price">{inr(product?.price)}</h2>
              {discountPct > 0 && (
                <>
                  <span className="pd-price-original">{inr(product.originalPrice)}</span>
                  <span className="pd-discount-chip">Save {discountPct}%</span>
                </>
              )}
            </div>
            <p className="pd-price-note">Inclusive of all taxes</p>

            {/* Stock pill */}
            {product?.stockStatus && (
              <div className={`pd-stock pd-stock-${product.stockStatus}`}>
                <span className="dot" />
                {isSoldOut
                  ? "Sold out"
                  : isLowStock
                  ? `Only ${product.quantity || "a few"} left in stock`
                  : "In stock"}
              </div>
            )}

            <hr className="pd-divider" />

            {/* Description */}
            <div className="pd-desc-label">Description</div>
            <p className="pd-desc">{product?.description}</p>

            {/* Specifications */}
            {specEntries.length > 0 && (
              <>
                <div className="pd-specs-title">Specifications</div>
                <dl className="pd-specs">
                  {specEntries.map(([k, v]) => (
                    <React.Fragment key={k}>
                      <dt>{k.charAt(0).toUpperCase() + k.slice(1)}</dt>
                      <dd>{v}</dd>
                    </React.Fragment>
                  ))}
                </dl>
              </>
            )}

            {/* Tags */}
            {product?.tags?.length > 0 && (
              <div className="pd-tags">
                {product.tags.map((t) => (
                  <span className="pd-tag" key={t}>#{t}</span>
                ))}
              </div>
            )}

            {/* Quantity + add to cart */}
            <div className="pd-buy-row">
              <div className="pd-qty">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  aria-label="Decrease" disabled={isSoldOut}
                >−</button>
                <span>{qty}</span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  aria-label="Increase" disabled={isSoldOut}
                >+</button>
              </div>

              {itemAdded && !isSoldOut ? (
                <motion.button
                  className="pd-btn pd-btn-go"
                  whileTap={{ scale: 0.96 }}
                  onClick={() => navigate("/cart")}
                >
                  <PiShoppingCartFill /> Go to cart
                </motion.button>
              ) : (
                <motion.button
                  className={`pd-btn pd-btn-add ${isSoldOut ? "is-disabled" : ""}`}
                  whileTap={{ scale: isSoldOut ? 1 : 0.96 }}
                  onClick={addItemToCart}
                  disabled={isSoldOut}
                >
                  <FaCartArrowDown /> {isSoldOut ? "Sold out" : "Add to cart"}
                </motion.button>
              )}
            </div>

            {/* Trust strip */}
            <div className="pd-trust">
              <div><span className="ti"><TbTruckDelivery /></span> Free shipping over ₹999</div>
              <div><span className="ti"><TbArrowBackUp /></span> 30-day returns</div>
              <div><span className="ti"><TbLock /></span> Secure checkout</div>
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
            {relatedProducts?.map((p) => {
              const rDisc =
                p?.originalPrice && p.originalPrice > p.price
                  ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
                  : 0;
              return (
                <motion.div
                  key={p._id}
                  className="pd-card"
                  whileHover={{ y: -6 }}
                  transition={{ type: "spring", stiffness: 300, damping: 22 }}
                  onClick={() => navigate(`/product/${p.slug}`)}
                >
                  <div className="pd-card-media">
                    {rDisc > 0 && <span className="pd-card-sale">{rDisc}% off</span>}
                    <img
                      src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`}
                      alt={p.name}
                    />
                  </div>
                  <div className="pd-card-body">
                    {p?.brand && <div className="pd-card-brand">{p.brand}</div>}
                    <h5 className="pd-card-name">{p.name}</h5>
                    <p className="pd-card-text">
                      {p.description?.substring(0, 60)}...
                    </p>
                    <div className="pd-card-foot">
                      <div className="pd-card-prices">
                        <span className="pd-card-price">{inr(p.price)}</span>
                        {rDisc > 0 && (
                          <span className="pd-card-original">{inr(p.originalPrice)}</span>
                        )}
                      </div>
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
              );
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetails;
