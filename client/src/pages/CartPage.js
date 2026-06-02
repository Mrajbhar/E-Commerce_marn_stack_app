import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";
import DropIn from "braintree-web-drop-in-react";
import axios from "axios";
import toast from "react-hot-toast";
import "../styles/CartPage.css";
import { IoIosRemoveCircle, IoMdCart } from "react-icons/io";
import { MdPayment } from "react-icons/md";
import { GrDocumentUpdate } from "react-icons/gr";
import { BiSolidLogInCircle } from "react-icons/bi";
import { useTheme } from "../pages/Themes/ThemeContext";

const CartPage = () => {
  const [auth] = useAuth();
  const [cart, setCart] = useCart();
  const [clientToken, setClientToken] = useState("");
  const [instance, setInstance] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  const inr = (n) =>
    Number(n || 0).toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    });

  // ---- Totals (now also tracking discount savings) ----
  const subtotal = () =>
    cart?.reduce((s, i) => s + (i.price || 0) * (i.quantity || 0), 0) || 0;

  // Savings = sum of (originalPrice - price) * qty across items with a discount
  const savings = () =>
    cart?.reduce((s, i) => {
      if (i.originalPrice && i.originalPrice > i.price) {
        return s + (i.originalPrice - i.price) * (i.quantity || 0);
      }
      return s;
    }, 0) || 0;

  const shippingFee = () =>
    subtotal() >= 999 || subtotal() === 0 ? 0 : 49;

  const grandTotal = () => subtotal() + shippingFee();

  const itemCount = () => cart?.reduce((n, i) => n + (i.quantity || 0), 0) || 0;

  // Cart contains any sold-out item? blocks checkout if true
  const hasSoldOut = () =>
    cart?.some((i) => i.stockStatus === "out_of_stock") || false;

  // ---- Item actions ----
  const updateCart = (next) => {
    setCart(next);
    localStorage.setItem("cart", JSON.stringify(next));
  };

  const removeCartItem = (pid) =>
    updateCart(cart.filter((item) => item._id !== pid));

  const increaseQuantity = (pid) =>
    updateCart(
      cart.map((item) =>
        item._id === pid ? { ...item, quantity: item.quantity + 1 } : item
      )
    );

  const decreaseQuantity = (pid) =>
    updateCart(
      cart.map((item) =>
        item._id === pid && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );

  const removeSoldOutItems = () => {
    updateCart(cart.filter((i) => i.stockStatus !== "out_of_stock"));
    toast.success("Sold-out items removed");
  };

  // ---- Payment ----
  const getToken = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/braintree/token`
      );
      setClientToken(data?.clientToken);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getToken();
  }, [auth?.token]);

  const handlePayment = async () => {
    if (hasSoldOut()) {
      toast.error("Please remove sold-out items before checking out");
      return;
    }
    try {
      setLoading(true);
      const { nonce } = await instance.requestPaymentMethod();
      await axios.post(
        `${process.env.REACT_APP_API}/api/v1/product/braintree/payment`,
        { nonce, cart }
      );
      setLoading(false);
      localStorage.removeItem("cart");
      setCart([]);
      navigate("/dashboard/user/orders");
      toast.success("Payment completed successfully");
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className={`cart-page ${darkMode ? "dark-mode" : ""}`}>
        {/* Header */}
        <header className="cart-head">
          <h1 className="cart-greeting">
            {!auth?.user
              ? "Your Cart"
              : `Hello, ${auth?.token && auth?.user?.name}`}
          </h1>
          <p className="cart-sub">
            {cart?.length ? (
              <>
                You have <b>{itemCount()}</b> item{itemCount() > 1 ? "s" : ""} in your cart
              </>
            ) : (
              "Your cart is waiting to be filled"
            )}
          </p>
        </header>

        {/* Sold-out warning banner */}
        {hasSoldOut() && (
          <div className="cart-soldout-banner">
            <span>Some items in your cart are sold out and can't be ordered.</span>
            <button
              className="cart-soldout-action"
              onClick={removeSoldOutItems}
            >
              Remove them
            </button>
          </div>
        )}

        {/* Empty state */}
        {!cart?.length ? (
          <div className="cart-empty">
            <div className="ico"><IoMdCart /></div>
            <h3>Your cart is empty</h3>
            <p>Looks like you haven't added anything yet.</p>
            <button
              className="cart-btn cart-btn-shop"
              onClick={() => navigate("/allproduct")}
            >
              Start shopping
            </button>
          </div>
        ) : (
          <div className="cart-layout">
            {/* Items */}
            <div className="cart-items">
              {cart?.map((item) => {
                const isSoldOut = item.stockStatus === "out_of_stock";
                const isLowStock = item.stockStatus === "low_stock";
                const hasDiscount =
                  item.originalPrice && item.originalPrice > item.price;
                const lineTotal = (item.price || 0) * (item.quantity || 0);

                return (
                  <div
                    className={`cart-item ${isSoldOut ? "is-soldout" : ""}`}
                    key={item._id}
                  >
                    <div className="cart-item-img">
                      <img
                        src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${item._id}`}
                        alt={item.name}
                        onClick={() => navigate(`/product/${item.slug}`)}
                      />
                      {isSoldOut && (
                        <div className="cart-item-soldout-overlay">Sold out</div>
                      )}
                    </div>

                    <div className="cart-item-info">
                      {item.brand && (
                        <span className="cart-item-brand">{item.brand}</span>
                      )}
                      <h3
                        className="cart-item-name"
                        onClick={() => navigate(`/product/${item.slug}`)}
                      >
                        {item.name}
                      </h3>
                      <p className="cart-item-desc">
                        {item.description?.substring(0, 40)}
                      </p>

                      {/* Stock pill */}
                      {item.stockStatus && (
                        <span className={`cart-stock-chip cart-stock-${item.stockStatus}`}>
                          {isSoldOut
                            ? "Sold out"
                            : isLowStock
                            ? "Low stock"
                            : "In stock"}
                        </span>
                      )}

                      {/* Price + (struck) original */}
                      <div className="cart-price-row">
                        <span className="cart-item-price">{inr(item.price)}</span>
                        {hasDiscount && (
                          <span className="cart-item-original">
                            {inr(item.originalPrice)}
                          </span>
                        )}
                      </div>

                      <div className="quantity-controls">
                        <button
                          onClick={() => decreaseQuantity(item._id)}
                          aria-label="Decrease"
                          disabled={isSoldOut}
                        >−</button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() => increaseQuantity(item._id)}
                          aria-label="Increase"
                          disabled={isSoldOut}
                        >+</button>
                      </div>
                    </div>

                    <div className="cart-item-actions">
                      <span className="cart-line-total">{inr(lineTotal)}</span>
                      <button
                        className="cart-remove-btn"
                        onClick={() => removeCartItem(item._id)}
                      >
                        <IoIosRemoveCircle /> Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary */}
            <aside className="cart-summary">
              <h2>Order Summary</h2>

              <div className="summary-row">
                <span>Subtotal ({itemCount()} item{itemCount() !== 1 ? "s" : ""})</span>
                <span>{inr(subtotal())}</span>
              </div>

              {savings() > 0 && (
                <div className="summary-row summary-savings">
                  <span>You save</span>
                  <span>−{inr(savings())}</span>
                </div>
              )}

              <div className="summary-row">
                <span>Shipping</span>
                <span>{shippingFee() === 0 ? "Free" : inr(shippingFee())}</span>
              </div>

              {shippingFee() > 0 && (
                <p className="summary-shipping-hint">
                  Add {inr(999 - subtotal())} more to get free shipping
                </p>
              )}

              <hr className="summary-divider" />

              <div className="summary-total">
                <span className="lbl">Total</span>
                <span className="val">{inr(grandTotal())}</span>
              </div>
              <p className="summary-note">Taxes calculated at checkout.</p>

              {/* Address */}
              {auth?.user?.address ? (
                <div className="cart-address">
                  <h4>Deliver to</h4>
                  <p>{auth?.user?.address}</p>
                  <button
                    className="cart-btn cart-btn-address"
                    onClick={() => navigate("/dashboard/user/profile")}
                  >
                    <GrDocumentUpdate /> Update address
                  </button>
                </div>
              ) : (
                <div className="cart-address">
                  <h4>Delivery address</h4>
                  <p>
                    {auth?.token
                      ? "Add an address to continue to checkout."
                      : "Sign in to add an address and check out."}
                  </p>
                  <button
                    className="cart-btn cart-btn-login"
                    onClick={() =>
                      navigate(
                        auth?.token ? "/dashboard/user/profile" : "/login",
                        { state: "/cart" }
                      )
                    }
                  >
                    <BiSolidLogInCircle />{" "}
                    {auth?.token ? "Add address" : "Login to checkout"}
                  </button>
                </div>
              )}

              {/* Payment */}
              {!clientToken || !auth?.token || !cart?.length ? null : (
                <>
                  <DropIn
                    options={{
                      authorization: clientToken,
                      paypal: { flow: "vault" },
                    }}
                    onInstance={(instance) => setInstance(instance)}
                  />
                  <button
                    className="cart-btn cart-btn-pay"
                    onClick={handlePayment}
                    disabled={
                      loading ||
                      !instance ||
                      !auth?.user?.address ||
                      hasSoldOut()
                    }
                  >
                    <MdPayment />{" "}
                    {loading
                      ? "Processing…"
                      : hasSoldOut()
                      ? "Remove sold-out items first"
                      : "Make payment"}
                  </button>
                </>
              )}
            </aside>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CartPage;