import React, { useState, useEffect } from "react";
import Layout from "./../../components/Layout/Layout";
import AdminMenu from "./../../components/Layout/AdminMenu";
import toast from "react-hot-toast";
import axios from "axios";
import { Select } from "antd";
import { MdCreateNewFolder } from "react-icons/md";
import { TbCloudUpload, TbX } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../Themes/ThemeContext";
import "../../styles/Dashboard.css";
const { Option } = Select;

const CreateProduct = () => {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const [categories, setCategories] = useState([]);

  // basics
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [shipping, setShipping] = useState("");

  // identifiers / metadata
  const [sku, setSku] = useState("");
  const [brand, setBrand] = useState("");
  const [stockStatus, setStockStatus] = useState("in_stock");

  // specifications
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [material, setMaterial] = useState("");
  const [weight, setWeight] = useState("");

  // tags (chips)
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");

  // up to 5 photos
  const [photos, setPhotos] = useState([null, null, null, null, null]);

  const getAllCategory = async () => {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/category/get-category`);
      if (data?.success) setCategories(data?.category);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong in getting category");
    }
  };
  useEffect(() => { getAllCategory(); }, []);

  const setPhotoAt = (idx, file) => {
    setPhotos((prev) => {
      const next = [...prev];
      next[idx] = file;
      return next;
    });
  };

  const addTag = () => {
    const t = tagInput.trim().toLowerCase();
    if (t && !tags.includes(t)) setTags([...tags, t]);
    setTagInput("");
  };
  const onTagKey = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      fd.append("name", name);
      fd.append("description", description);
      fd.append("price", price);
      if (originalPrice) fd.append("originalPrice", originalPrice);
      fd.append("quantity", quantity);
      fd.append("category", category);
      fd.append("shipping", shipping);
      if (sku) fd.append("sku", sku);
      if (brand) fd.append("brand", brand);
      fd.append("stockStatus", stockStatus);
      if (size) fd.append("size", size);
      if (color) fd.append("color", color);
      if (material) fd.append("material", material);
      if (weight) fd.append("weight", weight);
      if (tags.length) fd.append("tags", JSON.stringify(tags));

      photos.forEach((p, i) => {
        if (p) fd.append(i === 0 ? "photo" : `photo${i + 1}`, p);
      });

      const { data } = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/product/create-product`,
        fd
      );
      if (data?.success) {
        toast.success("Product Created Successfully");
        navigate("/dashboard/admin/products");
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("something went wrong");
    }
  };

  return (
    <Layout title={"Dashboard - Create Product"}>
      <div className={`dashboard-page ${darkMode ? "dark-mode" : ""}`}>
        <div className="dash-layout">
          <aside className="dash-sidebar"><AdminMenu /></aside>

          <main>
            <h1 className="dash-heading">
              <MdCreateNewFolder />
              Create Product
            </h1>

            <div className="dash-form-card" style={{ maxWidth: "100%" }}>
              {/* ---------- Section: Basics ---------- */}
              <h3 className="dash-section-title">Basics</h3>
              <div className="dash-form-grid">
                <div className="dash-field">
                  <label className="dash-label">Category</label>
                  <Select bordered={false} placeholder="Select a category" size="large" showSearch
                    className="dash-select" popupClassName="dash-select-dropdown"
                    onChange={setCategory}>
                    {categories?.map((c) => <Option key={c._id} value={c._id}>{c.name}</Option>)}
                  </Select>
                </div>

                <div className="dash-field">
                  <label className="dash-label">Brand</label>
                  <input type="text" value={brand} placeholder="e.g. Atelier"
                    className="dash-input" onChange={(e) => setBrand(e.target.value)} />
                </div>

                <div className="dash-field full">
                  <label className="dash-label">Name</label>
                  <input type="text" value={name} placeholder="Product name"
                    className="dash-input" onChange={(e) => setName(e.target.value)} />
                </div>

                <div className="dash-field full">
                  <label className="dash-label">Description</label>
                  <textarea value={description} placeholder="Write a short description"
                    className="dash-input" onChange={(e) => setDescription(e.target.value)} />
                </div>
              </div>

              {/* ---------- Section: Photos ---------- */}
              <h3 className="dash-section-title">Photos <span className="dash-section-hint">up to 5 — first is the main image</span></h3>
              <div className="dash-photo-grid">
                {photos.map((p, i) => (
                  <label key={i} className={`dash-photo-slot ${p ? "has-file" : ""} ${i === 0 ? "main" : ""}`}>
                    {p ? (
                      <>
                        <img src={URL.createObjectURL(p)} alt={`photo-${i}`} />
                        <button type="button" className="dash-photo-remove"
                          onClick={(e) => { e.preventDefault(); setPhotoAt(i, null); }}>
                          <TbX />
                        </button>
                      </>
                    ) : (
                      <>
                        <TbCloudUpload />
                        <span className="dash-photo-label">
                          {i === 0 ? "Main image" : `Image ${i + 1}`}
                        </span>
                      </>
                    )}
                    <input type="file" accept="image/*" hidden
                      onChange={(e) => setPhotoAt(i, e.target.files[0])} />
                  </label>
                ))}
              </div>

              {/* ---------- Section: Pricing & stock ---------- */}
              <h3 className="dash-section-title">Pricing & inventory</h3>
              <div className="dash-form-grid">
                <div className="dash-field">
                  <label className="dash-label">Price (₹)</label>
                  <input type="number" value={price} placeholder="0"
                    className="dash-input" onChange={(e) => setPrice(e.target.value)} />
                </div>

                <div className="dash-field">
                  <label className="dash-label">Original price (₹)<span className="dash-tip"> — optional, for discount badge</span></label>
                  <input type="number" value={originalPrice} placeholder="0"
                    className="dash-input" onChange={(e) => setOriginalPrice(e.target.value)} />
                </div>

                <div className="dash-field">
                  <label className="dash-label">Quantity</label>
                  <input type="number" value={quantity} placeholder="0"
                    className="dash-input" onChange={(e) => setQuantity(e.target.value)} />
                </div>

                <div className="dash-field">
                  <label className="dash-label">SKU</label>
                  <input type="text" value={sku} placeholder="e.g. ATL-SHIRT-001"
                    className="dash-input" onChange={(e) => setSku(e.target.value)} />
                </div>

                <div className="dash-field">
                  <label className="dash-label">Stock status</label>
                  <Select bordered={false} size="large" value={stockStatus}
                    className="dash-select" popupClassName="dash-select-dropdown"
                    onChange={setStockStatus}>
                    <Option value="in_stock">In stock</Option>
                    <Option value="low_stock">Low stock</Option>
                    <Option value="out_of_stock">Out of stock</Option>
                  </Select>
                </div>

                <div className="dash-field">
                  <label className="dash-label">Shipping</label>
                  <Select bordered={false} placeholder="Select shipping" size="large"
                    className="dash-select" popupClassName="dash-select-dropdown"
                    onChange={setShipping}>
                    <Option value="0">No</Option>
                    <Option value="1">Yes</Option>
                  </Select>
                </div>
              </div>

              {/* ---------- Section: Specs ---------- */}
              <h3 className="dash-section-title">Specifications <span className="dash-section-hint">all optional</span></h3>
              <div className="dash-form-grid">
                <div className="dash-field">
                  <label className="dash-label">Size</label>
                  <input type="text" value={size} placeholder="S / M / L / XL or 42"
                    className="dash-input" onChange={(e) => setSize(e.target.value)} />
                </div>
                <div className="dash-field">
                  <label className="dash-label">Color</label>
                  <input type="text" value={color} placeholder="e.g. Terracotta"
                    className="dash-input" onChange={(e) => setColor(e.target.value)} />
                </div>
                <div className="dash-field">
                  <label className="dash-label">Material</label>
                  <input type="text" value={material} placeholder="e.g. 100% cotton"
                    className="dash-input" onChange={(e) => setMaterial(e.target.value)} />
                </div>
                <div className="dash-field">
                  <label className="dash-label">Weight</label>
                  <input type="text" value={weight} placeholder="e.g. 500g"
                    className="dash-input" onChange={(e) => setWeight(e.target.value)} />
                </div>
              </div>

              {/* ---------- Section: Tags ---------- */}
              <h3 className="dash-section-title">Tags <span className="dash-section-hint">press Enter or comma to add</span></h3>
              <div className="dash-tag-input-wrap">
                <div className="dash-tag-chips">
                  {tags.map((t) => (
                    <span className="dash-tag-chip" key={t}>
                      {t}
                      <button type="button" onClick={() => setTags(tags.filter((x) => x !== t))}>
                        <TbX size={12} />
                      </button>
                    </span>
                  ))}
                  <input type="text" value={tagInput}
                    placeholder={tags.length ? "Add another…" : "summer, cotton, casual"}
                    className="dash-tag-input"
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={onTagKey}
                    onBlur={addTag} />
                </div>
              </div>

              {/* ---------- Submit ---------- */}
              <div className="dash-submit-row" style={{ marginTop: 20 }}>
                <button className="dash-btn-create" onClick={handleCreate}>
                  <MdCreateNewFolder /> Create Product
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </Layout>
  );
};

export default CreateProduct;
