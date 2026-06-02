import React, { useState, useEffect } from "react";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "./../../components/Layout/Layout";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { PiShoppingCartSimpleBold } from "react-icons/pi";
import { FiEdit3, FiImage } from "react-icons/fi";
import { useTheme } from "../Themes/ThemeContext";
import "../../styles/Dashboard.css";

const Products = () => {
  const [products, setProducts] = useState([]);
  const { darkMode } = useTheme();

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

  const inr = (n) =>
    Number(n || 0).toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    });

  const stockLabel = {
    in_stock: "In stock",
    low_stock: "Low stock",
    out_of_stock: "Sold out",
  };

  return (
    <Layout title={"Dashboard - All Products"}>
      <div className={`dashboard-page ${darkMode ? "dark-mode" : ""}`}>
        <div className="dash-layout">
          <aside className="dash-sidebar">
            <AdminMenu />
          </aside>

          <main>
            <div className="dash-head-row">
              <h1 className="dash-heading" style={{ margin: 0 }}>
                <PiShoppingCartSimpleBold />
                All Products
              </h1>
              <span className="dash-count">
                <b>{products.length}</b> product
                {products.length !== 1 ? "s" : ""}
              </span>
            </div>

            {products.length === 0 ? (
              <div className="dash-table-card">
                <p className="dash-empty-row">No products yet.</p>
              </div>
            ) : (
              <div className="dash-prod-grid">
                {products.map((product) => {
                  const discountPct =
                    product.originalPrice && product.originalPrice > product.price
                      ? Math.round(
                          ((product.originalPrice - product.price) /
                            product.originalPrice) *
                            100
                        )
                      : 0;
                  const isSoldOut = product.stockStatus === "out_of_stock";

                  return (
                    <Link
                      key={product._id}
                      to={`/dashboard/admin/product/${product.slug}`}
                      className={`dash-prod-card ${isSoldOut ? "is-soldout" : ""}`}
                    >
                      <div className="dash-prod-media">
                        {discountPct > 0 && (
                          <span className="dash-prod-discount">
                            {discountPct}% off
                          </span>
                        )}
                        {product.stockStatus && (
                          <span
                            className={`dash-prod-stock dash-stock-${product.stockStatus}`}
                          >
                            {stockLabel[product.stockStatus]}
                          </span>
                        )}

                        <span className="dash-prod-edit">
                          <FiEdit3 size={13} /> Edit
                        </span>

                        <img
                          src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${product._id}`}
                          alt={product.name}
                          onError={(e) => {
                            e.target.style.opacity = 0.3;
                          }}
                        />

                        {isSoldOut && (
                          <div className="dash-prod-soldout-overlay">
                            Sold out
                          </div>
                        )}
                      </div>

                      <div className="dash-prod-body">
                        {product.brand && (
                          <span className="dash-prod-brand">
                            {product.brand}
                          </span>
                        )}
                        <h5 className="dash-prod-name">{product.name}</h5>
                        <p className="dash-prod-desc">{product.description}</p>

                        <div className="dash-prod-meta">
                          <div className="dash-prod-prices">
                            <span className="dash-prod-price">
                              {inr(product.price)}
                            </span>
                            {discountPct > 0 && (
                              <span className="dash-prod-original">
                                {inr(product.originalPrice)}
                              </span>
                            )}
                          </div>
                          <span className="dash-prod-qty">
                            Qty: <b>{product.quantity ?? 0}</b>
                          </span>
                        </div>

                        <div className="dash-prod-chips">
                          {product.category?.name && (
                            <span className="dash-prod-chip">
                              {product.category.name}
                            </span>
                          )}
                          {product.sku && (
                            <span className="dash-prod-chip mono">
                              {product.sku}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>
    </Layout>
  );
};

export default Products;
