import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import toast from "react-hot-toast";
import axios from "axios";
import CategoryForm from "../../components/Form/CategoryForm";
import { TbCategoryFilled } from "react-icons/tb";
import { Modal } from "antd";
import { useTheme } from "../Themes/ThemeContext";
import "../../styles/Dashboard.css";

const CreateCategory = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(null);
  const [updatedName, setUpdateName] = useState("");
  const { darkMode } = useTheme();

  // Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/category/create-category`,
        { name }
      );
      if (data?.success) {
        toast.success(`${name} is created`);
        getAllCategory();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong in input form");
    }
  };

  // Get All Categories
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

  // Update Category
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        `${process.env.REACT_APP_API}/api/v1/category/update-category/${selected._id}`,
        { name: updatedName }
      );
      if (data.success) {
        toast.success(`${updatedName} is updated`);
        setSelected(null);
        setUpdateName("");
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

  // Delete Category
  const handleDelete = async (pid) => {
    try {
      const { data } = await axios.delete(
        `${process.env.REACT_APP_API}/api/v1/category/delete-category/${pid}`
      );
      if (data.success) {
        toast.success(`Category is Deleted`);
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
          {/* Sidebar */}
          <aside className="dash-sidebar">
            <AdminMenu />
          </aside>

          {/* Main */}
          <main>
            <h1 className="dash-heading">
              <TbCategoryFilled />
              Manage Categories
            </h1>

            {/* Create form */}
            <div className="dash-form-card">
              <h3>Add a new category</h3>
              <CategoryForm
                handleSubmit={handleSubmit}
                value={name}
                setvalue={setName}
              />
            </div>

            {/* List */}
            <div className="dash-table-card">
              <table className="dash-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories?.length ? (
                    categories.map((c) => (
                      <tr key={c._id}>
                        <td className="dash-cell-name">{c.name}</td>
                        <td>
                          <div className="dash-actions-cell">
                            <button
                              className="dash-btn-sm dash-btn-edit"
                              onClick={() => {
                                setVisible(true);
                                setUpdateName(c.name);
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
                      <td className="dash-empty-row" colSpan={2}>
                        No categories yet — add one above.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Edit modal */}
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
              />
            </Modal>
          </main>
        </div>
      </div>
    </Layout>
  );
};

export default CreateCategory;
