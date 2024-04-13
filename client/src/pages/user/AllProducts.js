import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Checkbox, Radio, Collapse } from "antd"; // Import Collapse
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
import { FaCartArrowDown } from "react-icons/fa";
import { CgDetailsMore } from "react-icons/cg";
import { GrPowerReset } from "react-icons/gr";

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
  const [priceOpen, setPriceOpen] = useState(true); // State for Price Collapse
  const [categoryOpen, setCategoryOpen] = useState(true); // State for Category Collapse
  const { darkMode } = useTheme(); // Access darkMode state from ThemeContext
  const exchangeRate = 83.61;


  const handlecategoryFilter = (value, id) => {
    let all = [...checked];
    if (value) {
      all.push(id);
    } else {
      all = all.filter((c) => c !== id);
    }
    setChecked(all);
    setActiveCategory(id); // Set active category
  };

  const getAllCategory = async () => {
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
  };

  useEffect(() => {
    getAllCategory();
    getTotal();
  }, []);

  //get product getAllproducts
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

  //get Total Count
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

  //load more
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

  //filter by category
  const handleFilter = (value, id) => {
    let all = [...checked];
    if (value) {
      all.push(id);
    } else {
      all = all.filter((c) => c !== id);
    }
    setChecked(all);
  };

  useEffect(() => {
    if (!checked.length || !radio.length) getAllProducts();
  }, [checked.length, radio.length]);

  useEffect(() => {
    if (checked.length || radio.length) filterProducts();
  }, [checked, radio]);

  //get filtered products
  const filterProducts = async () => {
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
  };

  const settings = {
    autoplay: true,
    autoplaySpeed: 1000,
    infinite: true,
  };

  return (
    <Layout title={"All Products - Best offers"}>
      {/* banner image */}
      <div
        className={`container-fluid row mt-3 home-page ${
          darkMode ? "dark-mode" : ""
        }`}
      >
        <div className="col-md-3 filters">
          {/* <h4 className="filter-heading">Filter By Category</h4> */}
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
                      handlecategoryFilter(e.target.checked, c._id)
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
          {/* price filter */}
          {/* <h4 className="filter-heading">Filter By Price</h4> */}
          <Collapse
            activeKey={priceOpen ? "price" : []}
            onChange={() => setPriceOpen(!priceOpen)}
          >
            <Panel header="Select Price" key="price" showArrow={false}>
              <div className="d-flex flex-column">
                <Radio.Group onChange={(e) => setRadio(e.target.value)}>
                  {Prices?.map((p) => (
                    <div key={p._id}>
                      <Radio value={p.array}>{p.name}</Radio>
                    </div>
                  ))}
                </Radio.Group>
              </div>
            </Panel>
          </Collapse>

          <div className="d-flex flex-column">
            <button
              className="btn btn-danger"
              onClick={() => window.location.reload()}
            >
              <GrPowerReset /> RESET FILTERS
            </button>
          </div>
        </div>
        <div className="col-md-9">
          <h1 className="text-center">All Products</h1>
          <span>{total} items</span>
          <div className="d-flex flex-wrap">
            {products?.map((p) => (
              <div className="card m-2" key={p._id}>
                {/* Redirect to product details page when clicking on the image */}
                <img
                  src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`}
                  className="card-img-top"
                  alt={p.name}
                  onClick={() => navigate(`/product/${p.slug}`)}
                  style={{ cursor: "pointer" }}
                />
                <div className="card-body">
                  <div className="card-name-price">
                    <h5 className="card-title">{p.name}</h5>
                    <h5 className="card-title card-price">
                    {(p.price * exchangeRate).toLocaleString("en-IN", {
                      style: "currency",
                      currency: "INR",
                    })}
                    </h5>
                  </div>
                  <p className="card-text">
                    {p.description.substring(0, 60)}...
                  </p>
                  <div className="card-name-price">
                    <button
                      className="btn btn-info ms-1"
                      onClick={() => navigate(`/product/${p.slug}`)}
                    >
                      <CgDetailsMore /> More Details
                    </button>
                    <button
                      className="btn btn-dark ms-1"
                      onClick={() => {
                        const existingItem = cart.find(
                          (item) => item._id === p._id
                        );
                        if (existingItem) {
                          // If the item already exists in the cart, update its quantity
                          const updatedCart = cart.map((item) =>
                            item._id === existingItem._id
                              ? { ...item, quantity: item.quantity + 1 }
                              : item
                          );
                          setCart(updatedCart);
                          localStorage.setItem(
                            "cart",
                            JSON.stringify(updatedCart)
                          );
                          toast.success("Item Added to cart");
                        } else {
                          // If the item does not exist in the cart, add it with a quantity of 1
                          setCart([...cart, { ...p, quantity: 1 }]);
                          localStorage.setItem(
                            "cart",
                            JSON.stringify([...cart, { ...p, quantity: 1 }])
                          );
                          toast.success("Item Added to cart");
                        }
                      }}
                    >
                      <FaCartArrowDown /> ADD TO CART
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="m-2 p-3">
            {products && products.length < total && (
              <button
                className="btn loadmore"
                onClick={(e) => {
                  e.preventDefault();
                  setPage(page + 1);
                }}
              >
                {loading ? (
                  "Loading ..."
                ) : (
                  <>
                    {" "}
                    Loadmore <AiOutlineReload />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AllProducts;
