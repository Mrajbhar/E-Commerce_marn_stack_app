import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Checkbox, Radio, Collapse, Divider } from "antd";
import { Prices } from "../../components/Prices";
import { useCart } from "../../context/cart";
import axios from "axios";
import toast from "react-hot-toast";
import Layout from "../../components/Layout/Layout";
import { AiOutlineReload } from "react-icons/ai";
import "../../styles/Homepage.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useTheme } from "../Themes/ThemeContext";
import { PiShoppingCartFill } from "react-icons/pi";
import { FaCartArrowDown } from "react-icons/fa";

const { Panel } = Collapse;

const AllProducts = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useCart();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [priceOpen, setPriceOpen] = useState(true);
  const [categoryOpen, setCategoryOpen] = useState(true);
   const [itemAdded, setItemAdded] = useState({}); 
  const { darkMode } = useTheme();
  const exchangeRate = 83.61;

  // Fetch categories
  const getAllCategory = useCallback(async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/category/get-category`
      );

      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong in getting category");
    }
  }, []);

  // Fetch products
  const getAllProducts = useCallback(async () => {
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
  }, [page]);

  const getTotal = useCallback(async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/product-count`
      );
      setTotal(data?.total || 0); // Ensure total is set correctly
    } catch (error) {
      console.log(error);
    }
  }, []);
  
  const loadMore = useCallback(async () => {
    if (loading || products.length >= total) return; // Prevent unnecessary calls
  
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/product-list/${page}`
      );
      setLoading(false);
      
      setProducts((prevProducts) => [...new Set([...prevProducts, ...data.products])]); // Prevent duplicates
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }, [page, total, loading, products]);
  

  // Filter products
  const filterProducts = useCallback(async () => {
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/product/product-filters`,
        {
          checked,
          radio,
        }
      );
      setProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  }, [checked, radio]);

  useEffect(() => {
    getAllCategory();
    getTotal();
    getAllProducts();
  }, [getAllCategory, getTotal, getAllProducts]);

  useEffect(() => {
    if (page === 1) return;
    loadMore();
  }, [page, loadMore]);

  useEffect(() => {
    if (!checked.length && !radio.length) {
      getAllProducts();
    } else {
      filterProducts();
    }
  }, [checked, radio, filterProducts, getAllProducts]);

  const handleCategoryFilter = (value, id) => {
    let all = [...checked];
    if (value) {
      all.push(id);
    } else {
      all = all.filter((c) => c !== id);
    }
    setChecked(all);
    setActiveCategory(id);
  };

  const handlePriceFilter = (value) => {
    setRadio(value);
  };

  const clearFilters = () => {
    setChecked([]);
    setRadio([]);
    setActiveCategory(null);
    getAllProducts();
  };

  const addItemToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item._id === product._id);
      
      let updatedCart;
      if (existingItem) {
        updatedCart = prevCart.map((item) =>
          item._id === existingItem._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        updatedCart = [...prevCart, { ...product, quantity: 1 }];
      }
  
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    });
  
    setItemAdded((prev) => ({ ...prev, [product._id]: true })); // Ensure correct button rendering
    toast.success("Item Added to cart");
  };
  


  return (
    <Layout title={"All Products - Best Offers"}>
      <div className={`container-fluid mt-3 home-page ${darkMode ? "dark-mode" : ""}`}>
        <div className="row">
          {/* Filters Section (Left Sidebar) */}
          <div className="col-lg-3 col-md-4 filters">
            <Collapse activeKey={categoryOpen ? "category" : []} onChange={() => setCategoryOpen(!categoryOpen)}>
              <Panel header="Select Category" key="category" showArrow={false}>
                <div className="d-flex flex-column">
                  {categories?.map((c) => (
                    <Checkbox key={c._id} onChange={(e) => handleCategoryFilter(e.target.checked, c._id)}
                      className={activeCategory === c._id ? "active-category" : ""}>
                      {c.name}
                    </Checkbox>
                  ))}
                </div>
              </Panel>
            </Collapse>
  
            <Divider />
  
            <Collapse activeKey={priceOpen ? "price" : []} onChange={() => setPriceOpen(!priceOpen)}>
              <Panel header="Select Price" key="price" showArrow={false}>
                <div className="d-flex flex-column">
                  <Radio.Group onChange={(e) => handlePriceFilter(e.target.value)}>
                    {Prices?.map((p) => (
                      <div key={p._id}>
                        <Radio value={p.array}>{p.name}</Radio>
                      </div>
                    ))}
                  </Radio.Group>
                </div>
              </Panel>
            </Collapse>
  
            <Divider />
  
            <div className="d-flex flex-column mt-3">
              <button className="btn btn-danger" onClick={clearFilters}>
                <AiOutlineReload /> RESET FILTERS
              </button>
            </div>
          </div>
  
          {/* Products Section (Right Side) */}
<div className="col-lg-9 col-md-8 product-section">
<h1 className="ecom-header">
  <span>All Products</span>
</h1>

            <span className="d-block mb-4">{total} items</span>
  
            <div className="d-flex flex-wrap justify-content-center">
              {products?.map((p) => (
                <div className="product-list-item" key={p._id}>
                  {/* Product Image */}
                  <div className="product-image-container">
                    <img
                      src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`}
                      className="product-image"
                      alt={p.name}
                      onClick={() => navigate(`/product/${p.slug}`)}
                      style={{ cursor: "pointer" }}
                    />
                  </div>
  
                  {/* Product Details */}
                  <div className="product-info">
                    <h4 className="product-name">{p.name}</h4>
                    <p className="product-description">
                      {p.description.substring(0, 100)}...
                    </p>
                    <h5 className="product-price">
                      {Number(p?.price || 0).toLocaleString("en-IN", {
                        style: "currency",
                        currency: "INR",
                      })}
                    </h5>
  
                    {/* Add to Cart Button */}
                    {itemAdded[p._id] ? (
                      <button className="btn btn-success btn-cart" onClick={() => navigate("/cart")}>
                        <PiShoppingCartFill /> GO TO CART
                      </button>
                    ) : (
                      <button className="btn btn-custom btn-cart" onClick={() => addItemToCart(p)}>
                        <FaCartArrowDown /> ADD TO CART
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
  
            {/* Load More Button */}
           {/* Load More Button */}
<div className="d-flex justify-content-center mt-4">
  {products && products.length < total && (
    <button className="btn btn-primary" onClick={(e) => {
      e.preventDefault();
      setPage(page + 1);
    }}>
      {loading ? "Loading..." : "Load More"}
    </button>
  )}
</div>

          </div>
        </div>
      </div>
    </Layout>
  );
  
};

export default AllProducts;
