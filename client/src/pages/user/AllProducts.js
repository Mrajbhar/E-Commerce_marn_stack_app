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

  // Fetch total product count
  const getTotal = useCallback(async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/product-count`
      );
      setTotal(data?.total);
    } catch (error) {
      console.log(error);
    }
  }, []);

  // Load more products
  const loadMore = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/product-list/${page}`
      );
      setLoading(false);
      setProducts((prevProducts) => [...prevProducts, ...data?.products]);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }, [page]);

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

  return (
    <Layout title={"All Products - Best offers"}>
      <div
        className={`container-fluid row mt-3 home-page ${
          darkMode ? "dark-mode" : ""
        }`}
      >
        <div className="col-md-3 filters">
          <Collapse
            activeKey={categoryOpen ? "category" : []}
            onChange={() => setCategoryOpen(!categoryOpen)}
          >
            <Panel header="Select Category" key="category" showArrow={false}>
              <div className="d-flex flex-column">
                {categories?.map((c) => (
                  <Checkbox
                    key={c._id}
                    onChange={(e) =>
                      handleCategoryFilter(e.target.checked, c._id)
                    }
                    className={
                      activeCategory === c._id ? "active-category" : ""
                    }
                  >
                    {c.name}
                  </Checkbox>
                ))}
              </div>
            </Panel>
          </Collapse>
          <Divider />
          <Collapse
            activeKey={priceOpen ? "price" : []}
            onChange={() => setPriceOpen(!priceOpen)}
          >
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
            <button
              className="btn btn-danger"
              onClick={clearFilters}
            >
              <AiOutlineReload /> RESET FILTERS
            </button>
          </div>
        </div>
        <div className="col-md-9">
          <h1 className="text-center mb-4">All Products</h1>
          <span className="d-block mb-4">{total} items</span>
          <div className="row">
            {products?.map((p) => (
              <div className="col-md-4 col-sm-6 mb-4" key={p._id}>
                <div className="card h-100">
                  <img
                    src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`}
                    className="card-img-top"
                    alt={p.name}
                    onClick={() => navigate(`/product/${p.slug}`)}
                    style={{ cursor: "pointer" }}
                  />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{p.name}</h5>
                    <h5 className="card-price">
                      {(p.price * exchangeRate).toLocaleString("en-IN", {
                        style: "currency",
                        currency: "INR",
                      })}
                    </h5>
                    <p className="card-text">
                      {p.description.substring(0, 60)}...
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="d-flex justify-content-center mt-4">
            {products && products.length < total && (
              <button
                className="btn btn-primary"
                onClick={(e) => {
                  e.preventDefault();
                  setPage(page + 1);
                }}
              >
                {loading ? "Loading..." : "Load More"}
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AllProducts;
