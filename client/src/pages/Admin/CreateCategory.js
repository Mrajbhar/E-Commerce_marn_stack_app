import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import toast from "react-hot-toast";
import axios from "axios";
import CategoryForm from "../../components/Form/CategoryForm";
import { TbCategoryFilled, TbStarFilled } from "react-icons/tb";
import { Modal } from "antd";
import { useTheme } from "../Themes/ThemeContext";
import "../../styles/Dashboard.css";

const CreateCategory = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState(null);
  const [featured, setFeatured] = useState(false);
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(null);
  const [updatedName, setUpdateName] = useState("");
  const [updatedPhoto, setUpdatedPhoto] = useState(null);
  const [updatedFeatured, setUpdatedFeatured] = useState(false);
  const { darkMode } = useTheme();

  const photoUrl = (id) =>
    `${process.env.REACT_APP_API}/api/v1/category/category-photo/${id}?t=${Date.now()}`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      fd.append("name", name);
      fd.append("featured", featured);
      if (photo) fd.append("photo", photo);

      const { data } = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/category/create-category`,
        fd
      );
      if (data?.success) {
        toast.success(`${name} is created`);
        setName("");
        setPhoto(null);
        setFeatured(false);
        getAllCategory();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong in input form");
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
      toast.error("Something went wrong in getting category");
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      fd.append("name", updatedName);
      fd.append("featured", updatedFeatured);
      if (updatedPhoto) fd.append("photo", updatedPhoto);

      const { data } = await axios.put(
        `${process.env.REACT_APP_API}/api/v1/category/update-category/${selected._id}`,
        fd
      );
      if (data.success) {
        toast.success(`${updatedName} is updated`);
        setSelected(null);
        setUpdateName("");
        setUpdatedPhoto(null);
        setUpdatedFeatured(false);
        setVisible(false);
        getAllCategory();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  const handleDelete = async (pid) => {
    try {
      const { data } = await axios.delete(
        `${process.env.REACT_APP_API}/api/v1/category/delete-category/${pid}`
      );
      if (data.success) {
        toast.success("Category deleted");
        getAllCategory();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <Layout title={"Dashboard - Create Category"}>
      <div className={`dashboard-page ${darkMode ? "dark-mode" : ""}`}>
        <div className="dash-layout">
          <aside className="dash-sidebar">
            <AdminMenu />
          </aside>

          <main>
            <h1 className="dash-heading">
              <TbCategoryFilled />
              Manage Categories
            </h1>

            <div className="dash-form-card">
              <h3>Add a new category</h3>
              <CategoryForm
                handleSubmit={handleSubmit}
                value={name}
                setvalue={setName}
                photo={photo}
                setPhoto={setPhoto}
                featured={featured}
                setFeatured={setFeatured}
              />
            </div>

            <div className="dash-table-card">
              <table className="dash-table">
                <thead>
                  <tr>
                    <th style={{ width: 80 }}>Image</th>
                    <th>Name</th>
                    <th>Featured</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories?.length ? (
                    categories.map((c) => (
                      <tr key={c._id}>
                        <td>
                          <div className="cat-row-thumb">
                            <img
                              src={photoUrl(c._id)}
                              alt={c.name}
                              onError={(e) => {
                                e.target.style.display = "none";
                              }}
                            />
                          </div>
                        </td>
                        <td className="dash-cell-name">{c.name}</td>
                        <td>
                          {c.featured ? (
                            <span className="dash-role-pill admin">
                              <TbStarFilled /> Featured
                            </span>
                          ) : (
                            <span style={{ color: "var(--ink-soft)", fontSize: ".88rem" }}>—</span>
                          )}
                        </td>
                        <td>
                          <div className="dash-actions-cell">
                            <button
                              className="dash-btn-sm dash-btn-edit"
                              onClick={() => {
                                setVisible(true);
                                setUpdateName(c.name);
                                setUpdatedFeatured(!!c.featured);
                                setUpdatedPhoto(null);
                                setSelected(c);
                              }}
                            >
                              Edit
                            </button>
                            <button
                              className="dash-btn-sm dash-btn-delete"
                              onClick={() => handleDelete(c._id)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="dash-empty-row" colSpan={4}>
                        No categories yet — add one above.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <Modal
              onCancel={() => setVisible(false)}
              footer={null}
              open={visible}
              wrapClassName="dash-modal"
            >
              <CategoryForm
                value={updatedName}
                setvalue={setUpdateName}
                handleSubmit={handleUpdate}
                photo={updatedPhoto}
                setPhoto={setUpdatedPhoto}
                featured={updatedFeatured}
                setFeatured={setUpdatedFeatured}
                existingPhotoUrl={selected ? photoUrl(selected._id) : null}
              />
            </Modal>
          </main>
        </div>
      </div>
    </Layout>
  );
};

export default CreateCategory;