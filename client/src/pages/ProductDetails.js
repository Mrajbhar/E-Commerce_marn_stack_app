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

const ProductDetails = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({});
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [cart, setCart] = useCart();
  const [itemAdded, setItemAdded] = useState(false);
  const exchangeRate = 83.61;

  useEffect(() => {
    if (params?.slug) getProduct();
  }, [params?.slug]);

  const getProduct = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/get-product/${params.slug}`
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
        `${process.env.REACT_APP_API}/api/v1/product/related-product/${pid}/${cid}`
      );
      setRelatedProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  };

  const addItemToCart = () => {
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
    toast.success("Item Added to cart");
    setItemAdded(true); // Set itemAdded to true
  };

  return (
    <Layout>
     <div className="row container product-details">
  <div className="col-md-6 d-flex justify-content-center align-items-center">
    <img
      src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${product._id}`}
      className="product-image"
      alt={product.name}
    />
  </div>
  <div className="col-md-6 product-details-info">
    <h1 className="text-center">Product Details</h1>
    <hr />
    <h4>{product?.name}</h4>
    <h6>{product?.description}</h6>
    <h2>
  <strong>
    {Number(product?.price || 0).toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
    })}
  </strong>
</h2>

    {/* <h6><strong>Category:</strong> {product?.category?.name}</h6> */}

    {itemAdded ? (
      <motion.button
        className="btn btn-success ms-1"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => navigate("/cart")}
      >
        <PiShoppingCartFill /> GO TO CART
      </motion.button>
    ) : (
      <motion.button
      className="btn ms-1 btn-custom"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={addItemToCart}
    >
      <FaCartArrowDown /> ADD TO CART
    </motion.button>
    
    )}
  </div>
</div>

      <hr />
      <div className="row container similar-products">
        <h4>Similar Products ➡️</h4>
        {relatedProducts.length < 1 && (
          <p className="text-center">No Similar Products found</p>
        )}
        <div className="d-flex flex-wrap">
          {relatedProducts?.map((p) => (
            <motion.div
              key={p._id}
              className="card m-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <img
                src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`}
                className="card-img-top"
                alt={p.name}
              />
              <div className="card-body">
                <div className="card-name-price">
                  <h5 className="card-title">{p.name}</h5>
                  <h5 className="card-title card-price">
                    {(p.price * exchangeRate).toLocaleString("en-IN", {
                      style: "currency",
                      currency: "INR",
                    })}
                  </h5>
                </div>
                <p className="card-text ">
                  {p.description.substring(0, 60)}...
                </p>
                <div className="card-name-price">
                  <button
                    className="btn btn-info ms-1"
                    onClick={() => navigate(`/product/${p.slug}`)}
                  >
                    <CgDetailsMore />
                    More Details
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetails;
