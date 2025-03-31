import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import { useParams, useNavigate } from "react-router-dom";
import { CgDetailsMore } from "react-icons/cg";
import axios from "axios";
import "../styles/CategoryProductStyles.css";
import { useTheme } from "../pages/Themes/ThemeContext";

const CategoryProduct = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
    const { darkMode } = useTheme();
  
  const exchangeRate = 83.61;

  useEffect(() => {
    if (params?.slug) getProductsByCategory();
  }, [params?.slug]);

  const getProductsByCategory = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/product-category/${params.slug}`
      );
      setProducts(data?.products);
      setCategory(data?.category);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={darkMode ? "dark-mode" : ""}>

    <Layout>
    <div className={`category-container ${darkMode ? "dark-mode" : ""}`}>
    {/* Category Header */}
        <div className="text-center category-header">
          <h2 className="category-title">Category - {category?.name}</h2>
          <p className="category-subtitle">{products.length} items found</p>
        </div>

        {/* Products Grid */}
        <div className="row justify-content-center">
          {products.map((p) => (
            <div className="col-lg-3 col-md-4 col-sm-6 mb-4" key={p._id}>
              <div className="product-card">
                {/* Product Image */}
                <div className="product-image">
                  <img
                    src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`}
                    alt={p.name}
                    className="img-fluid"
                  />
                </div>

                {/* Product Details */}
                <div className="product-info">
                  <h5 className="product-name">{p.name}</h5>
                  <p className="product-price">
                    {(p?.price || 0).toLocaleString("en-IN", {
                      style: "currency",
                      currency: "INR",
                    })}
                  </p>
                  <p className="product-description">
                    {p.description.substring(0, 60)}...
                  </p>

                  {/* View Details Button */}
                  <button
                    className="btn btn-view-details"
                    onClick={() => navigate(`/product/${p.slug}`)}
                  >
                    <CgDetailsMore /> <span>View Details</span>
                  </button>

                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
    </div>
  );
};

export default CategoryProduct;
