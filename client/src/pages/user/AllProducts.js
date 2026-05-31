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
import { PiShoppingCartFill, PiHeartBold } from "react-icons/pi";
import { FaCartArrowDown } from "react-icons/fa";
import { CgDetailsMore } from "react-icons/cg";

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
  const [filtersOpen, setFiltersOpen] = useState(false); // mobile drawer
  const { darkMode } = useTheme();

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
    document.documentElement.classList.toggle("dark", darkMode);
    document.body.classList.toggle("dark-mode", darkMode);
  }, [darkMode]);

  const getAllCategory = useCallback(async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/category/get-category`
      );
      if (data?.success) setCategories(data?.category);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong in getting category");
    }
  }, []);

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
      setTotal(data?.total || 0);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const loadMore = useCallback(async () => {
    if (loading || products.length >= total) return;
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/product-list/${page}`
      );
      setLoading(false);
      setProducts((prev) => [...new Set([...prev, ...data.products])]);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }, [page, total, loading, products]);

  const filterProducts = useCallback(async () => {
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/product/product-filters`,
        { checked, radio }
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
    if (!checked.length && !radio.length) getAllProducts();
    else filterProducts();
  }, [checked, radio, filterProducts, getAllProducts]);

  const handleCategoryFilter = (value, id) => {
    let all = [...checked];
    if (value) all.push(id);
    else all = all.filter((c) => c !== id);
    setChecked(all);
    setActiveCategory(id);
  };

  const handlePriceFilter = (value) => setRadio(value);

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
          item._id === existingItem._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        updatedCart = [...prevCart, { ...product, quantity: 1 }];
      }
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    });
    setItemAdded((prev) => ({ ...prev, [product._id]: true }));
    toast.success("Item added to cart");
  };

  const formatPrice = (price) =>
    Number(price || 0).toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    });

  return (
    <Layout title={"All Products - Best Offers"}>
      <div className={`shop-page ${darkMode ? "dark-mode" : ""}`}>
        {/* Page header */}
        <header className="shop-header">
          <span className="section-kicker">Shop</span>
          <h1 className="shop-title">All Products</h1>
          <div className="shop-toolbar">
            <span className="shop-results">
              <b>{total}</b> items found
            </span>
            <div className="shop-toolbar-right">
              <button
                className="btn btn-outline btn-sm mobile-filter-btn"
                onClick={() => setFiltersOpen(true)}
              >
                ☰ Filters
              </button>
            </div>
          </div>
        </header>

        <div className="shop-layout">
          {/* Filters sidebar */}
          <aside className={`filters ${filtersOpen ? "open" : ""}`}>
            <div className="filters-head">
              <h3>Filters</h3>
              <button className="filter-reset" onClick={clearFilters}>
                <AiOutlineReload /> Reset
              </button>
            </div>

            <Collapse
              ghost
              activeKey={categoryOpen ? "category" : []}
              onChange={() => setCategoryOpen(!categoryOpen)}
            >
              <Panel header="Category" key="category" showArrow={false}>
                <div className="d-flex flex-column">
                  {categories?.map((c) => (
                    <Checkbox
                      key={c._id}
                      onChange={(e) => handleCategoryFilter(e.target.checked, c._id)}
                      className={activeCategory === c._id ? "active-category" : ""}
                    >
                      {c.name}
                    </Checkbox>
                  ))}
                </div>
              </Panel>
            </Collapse>

            <Collapse
              ghost
              activeKey={priceOpen ? "price" : []}
              onChange={() => setPriceOpen(!priceOpen)}
            >
              <Panel header="Price" key="price" showArrow={false}>
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
          </aside>

          {/* Backdrop for mobile drawer */}
          <div
            className={`filters-backdrop ${filtersOpen ? "show" : ""}`}
            onClick={() => setFiltersOpen(false)}
          />

          {/* Product grid */}
          <main className="shop-main">
            {products?.length === 0 && !loading ? (
              <div className="shop-empty">No products match your filters.</div>
            ) : (
              <div className="product-grid">
                {products?.map((p) => (
                  <article className="product-card shop-card" key={p._id}>
                    <div className="product-media">
                      <button className="wish-btn" aria-label="Add to wishlist">
                        <PiHeartBold size={15} />
                      </button>
                      <img
                        src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`}
                        className="card-img-top"
                        alt={p.name}
                        onClick={() => navigate(`/product/${p.slug}`)}
                      />
                    </div>
                    <div className="card-body">
                      {p?.rating && (
                        <div className="card-rating">
                          {"\u2605".repeat(Math.round(p.rating))}
                          {"\u2606".repeat(5 - Math.round(p.rating))}
                          {p?.numReviews ? <small>({p.numReviews})</small> : null}
                        </div>
                      )}
                      <h5
                        className="card-title"
                        onClick={() => navigate(`/product/${p.slug}`)}
                      >
                        {p.name}
                      </h5>
                      <p className="card-text">
                        {p.description?.substring(0, 70)}...
                      </p>
                      <div className="card-footer-row">
                        <span className="card-price">{formatPrice(p?.price)}</span>
                      </div>
                      {itemAdded[p._id] ? (
                        <button
                          className="btn btn-accent btn-sm btn-block shop-card-cta"
                          onClick={() => navigate("/cart")}
                        >
                          <PiShoppingCartFill /> Go to cart
                        </button>
                      ) : (
                        <button
                          className="btn btn-primary btn-sm btn-block shop-card-cta"
                          onClick={() => addItemToCart(p)}
                        >
                          <FaCartArrowDown /> Add to cart
                        </button>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}

            {/* Load more */}
            <div className="shop-loadmore">
              {products && products.length < total && (
                <button
                  className="btn btn-primary"
                  onClick={(e) => {
                    e.preventDefault();
                    setPage(page + 1);
                  }}
                >
                  {loading ? "Loading..." : "Load more"}
                </button>
              )}
            </div>
          </main>
        </div>
      </div>
    </Layout>
  );
};

export default AllProducts;
