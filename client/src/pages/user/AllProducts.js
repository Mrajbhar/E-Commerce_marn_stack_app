import React, { useState, useEffect, useCallback } from "react";
import { Checkbox, Radio, Collapse } from "antd";
import { Prices } from "../../components/Prices";
import axios from "axios";
import toast from "react-hot-toast";
import Layout from "../../components/Layout/Layout";
import { AiOutlineReload } from "react-icons/ai";
import { FiSliders, FiX, FiGrid, FiList } from "react-icons/fi";
import "../../styles/Homepage.css";
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
  const [sort, setSort] = useState("featured");
  const [view, setView] = useState("grid");          // NEW: grid | list
  const [inStockOnly, setInStockOnly] = useState(false); // NEW
  const [priceOpen, setPriceOpen] = useState(true);
  const [categoryOpen, setCategoryOpen] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const { darkMode } = useTheme();

  const getAllCategory = useCallback(async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/category/get-category`,
      );
      if (data?.success) setCategories(data?.category || []);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong in getting category");
    }
  }, []);

  const getAllProducts = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/product-list/${page}`,
      );
      setProducts(data.products || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [page]);

  const getTotal = useCallback(async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/product-count`,
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
        `${process.env.REACT_APP_API}/api/v1/product/product-list/${page}`,
      );
      setProducts((prev) => [...prev, ...(data.products || [])]);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [page, total, loading, products.length]);

  const filterProducts = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/product/product-filters`,
        { checked, radio },
      );
      setProducts(data?.products || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
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
  };

  const clearFilters = () => {
    setChecked([]);
    setRadio([]);
    setInStockOnly(false);
    getAllProducts();
  };

  // chip helpers (NEW)
  const removeCategory = (id) => setChecked(checked.filter((c) => c !== id));
  const catName = (id) => categories.find((c) => c._id === id)?.name || "Category";
  const priceLabel = () => {
    const match = Prices.find((p) => JSON.stringify(p.array) === JSON.stringify(radio));
    return match?.name;
  };

  const activeFilterCount =
    checked.length + (radio.length ? 1 : 0) + (inStockOnly ? 1 : 0);

  // sort + in-stock filter on loaded products
  let visible = [...(products || [])];
  if (inStockOnly) visible = visible.filter((p) => p.stockStatus !== "out_of_stock");
  visible.sort((a, b) => {
    if (sort === "price-low") return (a.price || 0) - (b.price || 0);
    if (sort === "price-high") return (b.price || 0) - (a.price || 0);
    if (sort === "name") return (a.name || "").localeCompare(b.name || "");
    return 0;
  });

  return (
    <Layout title={"All Products - Best Offers"}>
      <div className={`shop-page ${darkMode ? "dark-mode" : ""}`}>
        <header className="shop-header">
          <span className="section-kicker">Shop</span>
          <h1 className="shop-title">All Products</h1>
          <div className="shop-toolbar">
            <span className="shop-results">
              <b>{total}</b> item{total !== 1 ? "s" : ""} found
              {activeFilterCount > 0 && (
                <span className="shop-active-filters">
                  · {activeFilterCount} filter{activeFilterCount !== 1 ? "s" : ""} active
                </span>
              )}
            </span>
            <div className="shop-toolbar-right">
              {/* view toggle (NEW) */}
              <div className="shop-view-toggle">
                <button
                  className={view === "grid" ? "active" : ""}
                  onClick={() => setView("grid")}
                  aria-label="Grid view"
                ><FiGrid /></button>
                <button
                  className={view === "list" ? "active" : ""}
                  onClick={() => setView("list")}
                  aria-label="List view"
                ><FiList /></button>
              </div>

              <select
                className="shop-sort"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="featured">Sort: Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name: A–Z</option>
              </select>

              <button
                className="btn btn-outline btn-sm mobile-filter-btn"
                onClick={() => setFiltersOpen(true)}
              >
                <FiSliders /> Filters
                {activeFilterCount > 0 && (
                  <span className="filter-count-badge">{activeFilterCount}</span>
                )}
              </button>
            </div>
          </div>

          {/* active filter chips (NEW) */}
          {activeFilterCount > 0 && (
            <div className="shop-chips">
              {checked.map((id) => (
                <button className="shop-chip" key={id} onClick={() => removeCategory(id)}>
                  {catName(id)} <FiX />
                </button>
              ))}
              {radio.length > 0 && (
                <button className="shop-chip" onClick={() => setRadio([])}>
                  {priceLabel()} <FiX />
                </button>
              )}
              {inStockOnly && (
                <button className="shop-chip" onClick={() => setInStockOnly(false)}>
                  In stock only <FiX />
                </button>
              )}
              <button className="shop-chip-clear" onClick={clearFilters}>
                Clear all
              </button>
            </div>
          )}
        </header>

        <div className="shop-layout">
          <aside className={`filters ${filtersOpen ? "open" : ""}`}>
            <div className="filters-head">
              <h3>Filters</h3>
              <div className="filters-head-actions">
                <button className="filter-reset" onClick={clearFilters}>
                  <AiOutlineReload /> Reset
                </button>
                <button
                  className="filters-close"
                  onClick={() => setFiltersOpen(false)}
                  aria-label="Close filters"
                ><FiX /></button>
              </div>
            </div>

            {/* in-stock toggle (NEW) */}
            <label className="shop-instock">
              <Checkbox
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
              >
                In stock only
              </Checkbox>
            </label>

            <Collapse ghost activeKey={categoryOpen ? "category" : []}
              onChange={() => setCategoryOpen(!categoryOpen)}>
              <Panel header="Category" key="category" showArrow={false}>
                <div className="d-flex flex-column">
                  {categories?.map((c) => (
                    <Checkbox key={c._id}
                      checked={checked.includes(c._id)}
                      onChange={(e) => handleCategoryFilter(e.target.checked, c._id)}
                      className={checked.includes(c._id) ? "active-category" : ""}>
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
                  <Radio.Group value={radio} onChange={(e) => setRadio(e.target.value)}>
                    {Prices?.map((p) => (
                      <div key={p._id}><Radio value={p.array}>{p.name}</Radio></div>
                    ))}
                  </Radio.Group>
                </div>
              </Panel>
            </Collapse>

            <button
              className="btn btn-primary btn-block filters-apply"
              onClick={() => setFiltersOpen(false)}
            >
              Show {total} results
            </button>
          </aside>

          <div
            className={`filters-backdrop ${filtersOpen ? "show" : ""}`}
            onClick={() => setFiltersOpen(false)}
          />

          <main className="shop-main">
            {loading && products.length === 0 ? (
              <div className="product-grid">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div className="product-skeleton" key={i}>
                    <div className="sk-media" />
                    <div className="sk-line sk-line-sm" />
                    <div className="sk-line" />
                    <div className="sk-line sk-line-price" />
                  </div>
                ))}
              </div>
            ) : visible.length === 0 ? (
              <div className="shop-empty">
                <p>No products match your filters.</p>
                {activeFilterCount > 0 && (
                  <button className="btn btn-outline btn-sm" onClick={clearFilters}>
                    Clear filters
                  </button>
                )}
              </div>
            ) : (
              <div className={`product-grid ${view === "list" ? "list-view" : ""}`}>
                {visible.map((p) => <ProductCard key={p._id} p={p} />)}
              </div>
            )}

            <div className="shop-loadmore">
              {products && products.length < total && !checked.length && !radio.length && (
                <button className="btn btn-primary" onClick={() => setPage(page + 1)}>
                  {loading ? "Loading…" : "Load more"}
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