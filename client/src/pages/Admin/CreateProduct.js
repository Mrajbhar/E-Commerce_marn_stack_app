import React, { useState, useEffect } from "react";
import Layout from "./../../components/Layout/Layout";
import AdminMenu from "./../../components/Layout/AdminMenu";
import toast from "react-hot-toast";
import axios from "axios";
import { Select } from "antd";
import { MdCreateNewFolder } from "react-icons/md";
import { TbCloudUpload } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../Themes/ThemeContext";
import "../../styles/Dashboard.css";
const { Option } = Select;

const CreateProduct = () => {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [shipping, setShipping] = useState("");
  const [photo, setPhoto] = useState("");

  // get all category
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
  }, []);

  // create product function
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const productData = new FormData();
      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("quantity", quantity);
      productData.append("photo", photo);
      productData.append("category", category);
      productData.append("shipping", shipping);
      const { data } = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/product/create-product`,
        productData
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
          {/* Sidebar */}
          <aside className="dash-sidebar">
            <AdminMenu />
          </aside>

          {/* Main */}
          <main>
            <h1 className="dash-heading">
              <MdCreateNewFolder />
              Create Product
            </h1>

            <div className="dash-form-card" style={{ maxWidth: "100%" }}>
              <div className="dash-form-grid">
                {/* Category */}
                <div className="dash-field">
                  <label className="dash-label">Category</label>
                  <Select
                    bordered={false}
                    placeholder="Select a category"
                    size="large"
                    showSearch
                    className="dash-select"
                    popupClassName="dash-select-dropdown"
                    onChange={(value) => setCategory(value)}
                  >
                    {categories?.map((c) => (
                      <Option key={c._id} value={c._id}>
                        {c.name}
                      </Option>
                    ))}
                  </Select>
                </div>

                {/* Shipping */}
                <div className="dash-field">
                  <label className="dash-label">Shipping</label>
                  <Select
                    bordered={false}
                    placeholder="Select shipping"
                    size="large"
                    className="dash-select"
                    popupClassName="dash-select-dropdown"
                    onChange={(value) => setShipping(value)}
                  >
                    <Option value="0">No</Option>
                    <Option value="1">Yes</Option>
                  </Select>
                </div>

                {/* Upload */}
                <div className="dash-field full">
                  <label className="dash-label">Product photo</label>
                  <label className={`dash-upload ${photo ? "has-file" : ""}`}>
                    <TbCloudUpload />
                    <span className="dash-upload-title">
                      {photo ? photo.name : "Click to upload an image"}
                    </span>
                    <span className="dash-upload-hint">PNG or JPG, up to ~2MB</span>
                    <input
                      type="file"
                      name="photo"
                      accept="image/*"
                      onChange={(e) => setPhoto(e.target.files[0])}
                      hidden
                    />
                  </label>
                  {photo && (
                    <div className="dash-preview">
                      <img src={URL.createObjectURL(photo)} alt="product_photo" />
                    </div>
                  )}
                </div>

                {/* Name */}
                <div className="dash-field full">
                  <label className="dash-label">Name</label>
                  <input
                    type="text"
                    value={name}
                    placeholder="Product name"
                    className="dash-input"
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                {/* Description */}
                <div className="dash-field full">
                  <label className="dash-label">Description</label>
                  <textarea
                    value={description}
                    placeholder="Write a short description"
                    className="dash-input"
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                {/* Price */}
                <div className="dash-field">
                  <label className="dash-label">Price (₹)</label>
                  <input
                    type="number"
                    value={price}
                    placeholder="0"
                    className="dash-input"
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>

                {/* Quantity */}
                <div className="dash-field">
                  <label className="dash-label">Quantity</label>
                  <input
                    type="number"
                    value={quantity}
                    placeholder="0"
                    className="dash-input"
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                </div>

                {/* Submit */}
                <div className="dash-field full dash-submit-row">
                  <button className="dash-btn-create" onClick={handleCreate}>
                    <MdCreateNewFolder /> Create Product
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </Layout>
  );
};

export default CreateProduct;
