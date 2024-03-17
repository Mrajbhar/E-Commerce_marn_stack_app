import React, { useState, useEffect } from "react";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "./../../components/Layout/Layout";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { PiShoppingCartSimpleBold } from "react-icons/pi";
const Products = () => {
  const [products, setProducts] = useState([]);

  // Get all products
  const getAllProducts = async () => {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/get-product`);
      setProducts(data.products);
    } catch (error) {
      console.log(error);
      toast.error("Something Went Wrong");
    }
  };

  // Lifecycle method
  useEffect(() => {
    getAllProducts();
  }, []);

  return (
    <Layout>
      <div className="row dashboard">
        <div className="col-md-3">
          <AdminMenu />
        </div>
        <div className="col-md-9">
          <h1 className="text-center mb-4 animated-heading"> <PiShoppingCartSimpleBold />All Products List</h1>
          <div className="row">
            {products.map((product) => (
              <div key={product._id} className="col-md-4 mb-4">
                <Link to={`/dashboard/admin/product/${product.slug}`} className="product-link">
                  <div className="card">
                    <img
                      src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${product._id}`}
                      className="card-img-top"
                      alt={product.name}
                    />
                    <div className="card-body">
                      <h5 className="card-title">{product.name}</h5>
                      <p className="card-text">{product.description}</p>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Products;
