import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/cart";
import axios from "axios";
import toast from "react-hot-toast";
import Layout from "../../components/Layout/Layout";
import { AiOutlineLoading } from "react-icons/ai";
import "../../styles/AllProducts.css";

const AllProducts = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useCart();
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    getAllProducts();
    getTotal();
  }, []);

  // Get product getAllproducts
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

  // Get Total Count
  const getTotal = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/product-count`
      );
      setTotal(data?.total);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (page === 1) return;
    loadMore();
  }, [page]);

  // Load more
  const loadMore = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/product-list/${page}`
      );
      setLoading(false);
      setProducts([...products, ...data?.products]);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <Layout title={"All Products - Best offers"}>
      <div className="container">
        <h1 className="text-center heading-text heading-animation">Products</h1>
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {products.map((p) => (
            <div className="col" key={p._id}>
              <div className="card h-100">
                <img
                  src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`}
                  className="card-img-top"
                  alt={p.name}
                />
                <div className="card-body">
                  <h5 className="card-title">{p.name}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">
                    {p.price.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </h6>
                  <p className="card-text">{p.description.substring(0, 60)}...</p>
                </div>
                <div className="card-footer">
                  <button
                    className="btn btn-info me-2"
                    onClick={() => navigate(`/product/${p.slug}`)}
                  >
                    More Details
                  </button>
                  <button
                    className="btn btn-dark"
                    onClick={() => {
                      setCart([...cart, p]);
                      localStorage.setItem("cart", JSON.stringify([...cart, p]));
                      toast.success("Item Added to cart");
                    }}
                  >
                    ADD TO CART
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center">
          {loading ? (
            <AiOutlineLoading className="animate-spin text-3xl text-gray-500" />
          ) : (
            <button
              className="btn btn-primary mt-3"
              onClick={(e) => {
                e.preventDefault();
                setPage(page + 1);
              }}
            >
              Load More
            </button>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AllProducts;
