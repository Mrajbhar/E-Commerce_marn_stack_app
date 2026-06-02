import React, { useState, useEffect, useCallback } from "react";
import { Checkbox, Radio, Collapse } from "antd";
import { Prices } from "../../components/Prices";
import axios from "axios";
import toast from "react-hot-toast";
import Layout from "../../components/Layout/Layout";
import { AiOutlineReload } from "react-icons/ai";
import "../../styles/Homepage.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useTheme } from "../Themes/ThemeContext";
import ProductCard from "../../components/Product/ProductCard";

const { Panel } = Collapse;

const AllProducts = () => {
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
  const [filtersOpen, setFiltersOpen] = useState(false);
  const { darkMode } = useTheme();

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
      setProducts(data.products);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
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
      setProducts((prev) => [...prev, ...data.products]);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [page, total, loading, products.length]);

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

  const clearFilters = () => {
    setChecked([]);
    setRadio([]);
    setActiveCategory(null);
    getAllProducts();
  };

  return (
    <Layout title={"All Products - Best Offers"}>
      <div className={`shop-page ${darkMode ? "dark-mode" : ""}`}>
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
          <aside className={`filters ${filtersOpen ? "open" : ""}`}>
            <div className="filters-head">
              <h3>Filters</h3>
              <button className="filter-reset" onClick={clearFilters}>
                <AiOutlineReload /> Reset
              </button>
            </div>

            <Collapse ghost activeKey={categoryOpen ? "category" : []}
              onChange={() => setCategoryOpen(!categoryOpen)}>
              <Panel header="Category" key="category" showArrow={false}>
                <div className="d-flex flex-column">
                  {categories?.map((c) => (
                    <Checkbox key={c._id}
                      onChange={(e) => handleCategoryFilter(e.target.checked, c._id)}
                      className={activeCategory === c._id ? "active-category" : ""}>
                      {c.name}
                    </Checkbox>
                  ))}
                </div>
              </Panel>
            </Collapse>

            <Collapse ghost activeKey={priceOpen ? "price" : []}
              onChange={() => setPriceOpen(!priceOpen)}>
              <Panel header="Price" key="price" showArrow={false}>
                <div className="d-flex flex-column">
                  <Radio.Group onChange={(e) => setRadio(e.target.value)}>
                    {Prices?.map((p) => (
                      <div key={p._id}><Radio value={p.array}>{p.name}</Radio></div>
                    ))}
                  </Radio.Group>
                </div>
              </Panel>
            </Collapse>
          </aside>

          <div
            className={`filters-backdrop ${filtersOpen ? "show" : ""}`}
            onClick={() => setFiltersOpen(false)}
          />

          <main className="shop-main">
            {products?.length === 0 && !loading ? (
              <div className="shop-empty">No products match your filters.</div>
            ) : (
              <div className="product-grid">
                {products?.map((p) => <ProductCard key={p._id} p={p} />)}
              </div>
            )}

            <div className="shop-loadmore">
              {products && products.length < total && (
                <button className="btn btn-primary" onClick={() => setPage(page + 1)}>
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
