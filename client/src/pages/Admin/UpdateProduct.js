import React, { useState, useEffect } from "react";
import Layout from "./../../components/Layout/Layout";
import AdminMenu from "./../../components/Layout/AdminMenu";
import toast from "react-hot-toast";
import axios from "axios";
import { Select } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { TbCloudUpload, TbX } from "react-icons/tb";
import { MdCreateNewFolder } from "react-icons/md";
import { FiTrash2 } from "react-icons/fi";
import { useTheme } from "../Themes/ThemeContext";
import "../../styles/Dashboard.css";
const { Option } = Select;

const UpdateProduct = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { darkMode } = useTheme();
  const [categories, setCategories] = useState([]);

  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [shipping, setShipping] = useState("");
  const [sku, setSku] = useState("");
  const [brand, setBrand] = useState("");
  const [stockStatus, setStockStatus] = useState("in_stock");
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [material, setMaterial] = useState("");
  const [weight, setWeight] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");

  // photos: replacement only — leaving slots empty keeps the existing photos
  const [photos, setPhotos] = useState([null, null, null, null, null]);
  const [existingCount, setExistingCount] = useState(0);

  const getSingleProduct = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/get-product/${params.slug}`
      );
      const p = data.product;
      setId(p._id);
      setName(p.name || "");
      setDescription(p.description || "");
      setPrice(p.price || "");
      setOriginalPrice(p.originalPrice || "");
      setQuantity(p.quantity || "");
      setShipping(p.shipping ? "1" : "0");
      setCategory(p.category?._id || "");
      setSku(p.sku || "");
      setBrand(p.brand || "");
      setStockStatus(p.stockStatus || "in_stock");
      setSize(p.specifications?.size || "");
      setColor(p.specifications?.color || "");
      setMaterial(p.specifications?.material || "");
      setWeight(p.specifications?.weight || "");
      setTags(p.tags || []);
      setExistingCount(p.photoCount || 1);
    } catch (error) {
      console.log(error);
    }
  };

  const getAllCategory = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/category/get-category`
      );
      if (data?.success) setCategories(data?.category);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => { getSingleProduct(); getAllCategory(); /* eslint-disable-next-line */ }, []);

  const setPhotoAt = (idx, file) => {
    setPhotos((prev) => { const next = [...prev]; next[idx] = file; return next; });
  };

  const addTag = () => {
    const t = tagInput.trim().toLowerCase();
    if (t && !tags.includes(t)) setTags([...tags, t]);
    setTagInput("");
  };
  const onTagKey = (e) => {
    if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addTag(); }
  };

  const handleUpdate = async (e) => {
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
      fd.append("tags", JSON.stringify(tags));

      // Only send photos if the user picked new ones; otherwise the backend
      // keeps the existing photos unchanged.
      photos.forEach((p, i) => {
        if (p) fd.append(i === 0 ? "photo" : `photo${i + 1}`, p);
      });

      const { data } = await axios.put(
        `${process.env.REACT_APP_API}/api/v1/product/update-product/${id}`,
        fd
      );
      if (data?.success) {
        toast.success("Product Updated Successfully");
        navigate("/dashboard/admin/products");
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("something went wrong");
    }
  };

  const handleDelete = async () => {
    try {
      const ok = window.confirm("Are you sure you want to delete this product?");
      if (!ok) return;
      await axios.delete(`${process.env.REACT_APP_API}/api/v1/product/delete-product/${id}`);
      toast.success("Product Deleted Successfully");
      navigate("/dashboard/admin/products");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  // existing photo preview URLs
  const existingPhoto = (i) =>
    `${process.env.REACT_APP_API}/api/v1/product/product-photo/${id}/${i}?t=${id}`;

  return (
    <Layout title={"Dashboard - Update Product"}>
      <div className={`dashboard-page ${darkMode ? "dark-mode" : ""}`}>
        <div className="dash-layout">
          <aside className="dash-sidebar"><AdminMenu /></aside>

          <main>
            <div className="dash-head-row">
              <h1 className="dash-heading" style={{ margin: 0 }}>
                <MdCreateNewFolder />
                Update Product
              </h1>
              <button className="dash-btn-sm dash-btn-delete" onClick={handleDelete}>
                <FiTrash2 /> Delete
              </button>
            </div>

            <div className="dash-form-card" style={{ maxWidth: "100%" }}>
              {/* Basics */}
              <h3 className="dash-section-title">Basics</h3>
              <div className="dash-form-grid">
                <div className="dash-field">
                  <label className="dash-label">Category</label>
                  <Select bordered={false} size="large" showSearch value={category || undefined}
                    placeholder="Select a category"
                    className="dash-select" popupClassName="dash-select-dropdown"
                    onChange={setCategory}>
                    {categories?.map((c) => <Option key={c._id} value={c._id}>{c.name}</Option>)}
                  </Select>
                </div>
                <div className="dash-field">
                  <label className="dash-label">Brand</label>
                  <input type="text" value={brand} className="dash-input"
                    onChange={(e) => setBrand(e.target.value)} />
                </div>
                <div className="dash-field full">
                  <label className="dash-label">Name</label>
                  <input type="text" value={name} className="dash-input"
                    onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="dash-field full">
                  <label className="dash-label">Description</label>
                  <textarea value={description} className="dash-input"
                    onChange={(e) => setDescription(e.target.value)} />
                </div>
              </div>

              {/* Photos */}
              <h3 className="dash-section-title">
                Photos
                <span className="dash-section-hint">
                  pick new files to replace; leave empty to keep existing
                </span>
              </h3>
              <div className="dash-photo-grid">
                {photos.map((p, i) => (
                  <label key={i} className={`dash-photo-slot ${p ? "has-file" : ""} ${i === 0 ? "main" : ""}`}>
                    {p ? (
                      <>
                        <img src={URL.createObjectURL(p)} alt={`new-${i}`} />
                        <button type="button" className="dash-photo-remove"
                          onClick={(e) => { e.preventDefault(); setPhotoAt(i, null); }}>
                          <TbX />
                        </button>
                      </>
                    ) : i < existingCount ? (
                      <>
                        <img src={existingPhoto(i)} alt={`existing-${i}`} onError={(e) => { e.target.style.display = "none"; }} />
                        <span className="dash-photo-label dash-photo-existing">
                          {i === 0 ? "Main (current)" : `Image ${i + 1} (current)`}
                        </span>
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

              {/* Pricing */}
              <h3 className="dash-section-title">Pricing & inventory</h3>
              <div className="dash-form-grid">
                <div className="dash-field">
                  <label className="dash-label">Price (₹)</label>
                  <input type="number" value={price} className="dash-input"
                    onChange={(e) => setPrice(e.target.value)} />
                </div>
                <div className="dash-field">
                  <label className="dash-label">Original price (₹)<span className="dash-tip"> — optional</span></label>
                  <input type="number" value={originalPrice} className="dash-input"
                    onChange={(e) => setOriginalPrice(e.target.value)} />
                </div>
                <div className="dash-field">
                  <label className="dash-label">Quantity</label>
                  <input type="number" value={quantity} className="dash-input"
                    onChange={(e) => setQuantity(e.target.value)} />
                </div>
                <div className="dash-field">
                  <label className="dash-label">SKU</label>
                  <input type="text" value={sku} className="dash-input"
                    onChange={(e) => setSku(e.target.value)} />
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
                  <Select bordered={false} size="large" value={shipping || undefined}
                    placeholder="Select shipping"
                    className="dash-select" popupClassName="dash-select-dropdown"
                    onChange={setShipping}>
                    <Option value="0">No</Option>
                    <Option value="1">Yes</Option>
                  </Select>
                </div>
              </div>

              {/* Specs */}
              <h3 className="dash-section-title">Specifications</h3>
              <div className="dash-form-grid">
                <div className="dash-field"><label className="dash-label">Size</label>
                  <input type="text" value={size} className="dash-input" onChange={(e) => setSize(e.target.value)} /></div>
                <div className="dash-field"><label className="dash-label">Color</label>
                  <input type="text" value={color} className="dash-input" onChange={(e) => setColor(e.target.value)} /></div>
                <div className="dash-field"><label className="dash-label">Material</label>
                  <input type="text" value={material} className="dash-input" onChange={(e) => setMaterial(e.target.value)} /></div>
                <div className="dash-field"><label className="dash-label">Weight</label>
                  <input type="text" value={weight} className="dash-input" onChange={(e) => setWeight(e.target.value)} /></div>
              </div>

              {/* Tags */}
              <h3 className="dash-section-title">Tags</h3>
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
                    placeholder={tags.length ? "Add another…" : "Add a tag"}
                    className="dash-tag-input"
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={onTagKey}
                    onBlur={addTag} />
                </div>
              </div>

              <div className="dash-submit-row" style={{ marginTop: 20 }}>
                <button className="dash-btn-create" onClick={handleUpdate}>
                  <MdCreateNewFolder /> Update Product
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </Layout>
  );
};

export default UpdateProduct;
