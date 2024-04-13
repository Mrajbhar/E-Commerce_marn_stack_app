import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";
import DropIn from "braintree-web-drop-in-react";
import { AiFillWarning } from "react-icons/ai";
import axios from "axios";
import toast from "react-hot-toast";
import "../styles/CartPage.css";
import { IoIosRemoveCircle } from "react-icons/io";
import { MdPayment } from "react-icons/md";
import { GrDocumentUpdate } from "react-icons/gr";
import { BiSolidLogInCircle } from "react-icons/bi";

const CartPage = () => {
  const [auth, setAuth] = useAuth();
  const [cart, setCart] = useCart();
  const [clientToken, setClientToken] = useState("");
  const [instance, setInstance] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const totalPrice = () => {
    try {
      let total = 0;
      cart?.map((item) => {
        total = total + item.price * item.quantity; // Multiply price by quantity
      });
      return total.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
    } catch (error) {
      console.log(error);
    }
  };

  const removeCartItem = (pid) => {
    const updatedCart = cart.filter((item) => item._id !== pid);
    setCart(updatedCart);
  };

  const increaseQuantity = (pid) => {
    const updatedCart = cart.map((item) =>
      item._id === pid ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCart(updatedCart);
  };

  const decreaseQuantity = (pid) => {
    const updatedCart = cart.map((item) =>
      item._id === pid && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    setCart(updatedCart);
  };

  //get payment gateway token
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

  //handle payments
  const handlePayment = async () => {
    try {
      setLoading(true);
      const { nonce } = await instance.requestPaymentMethod();
      const { data } = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/product/braintree/payment`,
        {
          nonce,
          cart,
        }
      );
      setLoading(false);
      localStorage.removeItem("cart");
      setCart([]);
      navigate("/dashboard/user/orders");
      toast.success("Payment Completed Successfully ");
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="cart-page">
        <h1 className="text-center">
          {!auth?.user ? "Hello Guest" : `Hello  ${auth?.token && auth?.user?.name}`}
        </h1>
        <p className="text-center">
          {cart?.length ? `You have ${cart.length} items in your cart` : "Your cart is empty"}
        </p>
        <div className="container">
          <div className="row">
            <div className="col-md-7">
              {cart?.map((item) => (
                <div className="cart-item" key={item._id}>
                  <div className="col-md-4">
                    <img
                      src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${item._id}`}
                      alt={item.name}
                    />
                  </div>
                  <div className="cart-item-info col-md-8">
                    <p>{item.name}</p>
                    <p>{item.description.substring(0, 30)}</p>
                    <p>Price: {item.price}</p>
                    <div className="quantity-controls">
                      <button
                        className="btn btn-secondary"
                        onClick={() => decreaseQuantity(item._id)}
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        className="btn btn-secondary"
                        onClick={() => increaseQuantity(item._id)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="cart-remove-btn col-md-12">
                    <button
                      className="btn btn-danger"
                      onClick={() => removeCartItem(item._id)}
                    >
                      <IoIosRemoveCircle />Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="col-md-5 cart-summary">
              <h2>Cart Summary</h2>
              <hr />
              <h4>Total: {totalPrice()} </h4>
              <div className="mb-3">
                {auth?.user?.address ? (
                  <>
                    <h4>Current Address</h4>
                    <h5>{auth?.user?.address}</h5>
                    <button
                      className="btn btn-outline-warning"
                      onClick={() => navigate("/dashboard/user/profile")}
                    >
                      <GrDocumentUpdate />Update Address
                    </button>
                  </>
                ) : (
                  <button
                    className="btn btn-outline-warning"
                    onClick={() => navigate("/login", { state: "/cart" })}
                  >
                    <BiSolidLogInCircle /> Please Login to Checkout
                  </button>
                )}
              </div>
              <div className="mt-2">
                {!clientToken || !auth?.token || !cart?.length ? (
                  ""
                ) : (
                  <>
                    <DropIn
                      options={{
                        authorization: clientToken,
                        paypal: {
                          flow: "vault",
                        },
                      }}
                      onInstance={(instance) => setInstance(instance)}
                    />
                    <button
                      className="btn btn-primary"
                      onClick={handlePayment}
                      disabled={loading || !instance || !auth?.user?.address}
                    >
                      <MdPayment /> {loading ? "Processing ...." : "Make Payment"}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;
