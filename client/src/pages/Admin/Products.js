import React, { useState, useEffect } from "react";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "./../../components/Layout/Layout";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { PiShoppingCartSimpleBold } from "react-icons/pi";
import { FiEdit3 } from "react-icons/fi";
import { useTheme } from "../Themes/ThemeContext";
import "../../styles/Dashboard.css";

const Products = () => {
  const [products, setProducts] = useState([]);
  const { darkMode } = useTheme();

  // Get all products
  const getAllProducts = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/get-product`
      );
      setProducts(data.products);
    } catch (error) {
      console.log(error);
      toast.error("Something Went Wrong");
    }
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  return (
    <Layout title={"Dashboard - All Products"}>
      <div className={`dashboard-page ${darkMode ? "dark-mode" : ""}`}>
        <div className="dash-layout">
          {/* Sidebar */}
          <aside className="dash-sidebar">
            <AdminMenu />
          </aside>

          {/* Main */}
          <main>
            <div className="dash-head-row">
              <h1 className="dash-heading" style={{ margin: 0 }}>
                <PiShoppingCartSimpleBold />
                All Products
              </h1>
              <span className="dash-count">
                <b>{products.length}</b> product{products.length !== 1 ? "s" : ""}
              </span>
            </div>

            {products.length === 0 ? (
              <div className="dash-table-card">
                <p className="dash-empty-row">No products yet.</p>
              </div>
            ) : (
              <div className="dash-prod-grid">
                {products.map((product) => (
                  <Link
                    key={product._id}
                    to={`/dashboard/admin/product/${product.slug}`}
                    className="dash-prod-card"
                  >
                    <div className="dash-prod-media">
                      <span className="dash-prod-edit">
                        <FiEdit3 size={13} /> Edit
                      </span>
                      <img
                        src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${product._id}`}
                        alt={product.name}
                      />
                    </div>
                    <div className="dash-prod-body">
                      <h5 className="dash-prod-name">{product.name}</h5>
                      <p className="dash-prod-desc">{product.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </Layout>
  );
};

export default Products;
