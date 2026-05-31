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
  const [auth, setAuth] = useAuth();
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

  const totalAmount = () => {
    try {
      return (
        cart?.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0
      );
    } catch (error) {
      console.log(error);
      return 0;
    }
  };

  const totalPrice = () => inr(totalAmount());

  const removeCartItem = (pid) => {
    const updatedCart = cart.filter((item) => item._id !== pid);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const increaseQuantity = (pid) => {
    const updatedCart = cart.map((item) =>
      item._id === pid ? { ...item, quantity: item.quantity + 1 } : item,
    );
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const decreaseQuantity = (pid) => {
    const updatedCart = cart.map((item) =>
      item._id === pid && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item,
    );
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const getToken = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/braintree/token`,
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
    try {
      setLoading(true);
      const { nonce } = await instance.requestPaymentMethod();
      await axios.post(
        `${process.env.REACT_APP_API}/api/v1/product/braintree/payment`,
        { nonce, cart },
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
                You have <b>{cart.length}</b> item{cart.length > 1 ? "s" : ""}{" "}
                in your cart
              </>
            ) : (
              "Your cart is waiting to be filled"
            )}
          </p>
        </header>

        {/* Empty state */}
        {!cart?.length ? (
          <div className="cart-empty">
            <div className="ico">
              <IoMdCart />
            </div>
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
              {cart?.map((item) => (
                <div className="cart-item" key={item._id}>
                  <div className="cart-item-img">
                    <img
                      src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${item._id}`}
                      alt={item.name}
                      onClick={() => navigate(`/product/${item.slug}`)}
                    />
                  </div>

                  <div className="cart-item-info">
                    <h3
                      className="cart-item-name"
                      onClick={() => navigate(`/product/${item.slug}`)}
                    >
                      {item.name}
                    </h3>
                    <p className="cart-item-desc">
                      {item.description?.substring(0, 40)}
                    </p>
                    <p className="cart-item-price">{inr(item.price)}</p>
                    <div className="quantity-controls">
                      <button
                        onClick={() => decreaseQuantity(item._id)}
                        aria-label="Decrease"
                      >
                        −
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => increaseQuantity(item._id)}
                        aria-label="Increase"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="cart-item-actions">
                    <span className="cart-line-total">
                      {inr(item.price * item.quantity)}
                    </span>
                    <button
                      className="cart-remove-btn"
                      onClick={() => removeCartItem(item._id)}
                    >
                      <IoIosRemoveCircle /> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <aside className="cart-summary">
              <h2>Order Summary</h2>

              <div className="summary-row">
                <span>Subtotal</span>
                <span>{totalPrice()}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>
                  {totalAmount() >= 999 || totalAmount() === 0
                    ? "Free"
                    : inr(49)}
                </span>
              </div>

              <hr className="summary-divider" />

              <div className="summary-total">
                <span className="lbl">Total</span>
                <span className="val">
                  {inr(
                    totalAmount() +
                      (totalAmount() >= 999 || totalAmount() === 0 ? 0 : 49),
                  )}
                </span>
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
                        {
                          state: "/cart",
                        },
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
                    disabled={loading || !instance || !auth?.user?.address}
                  >
                    <MdPayment /> {loading ? "Processing…" : "Make payment"}
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
