import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import axios from "axios";
import toast from "react-hot-toast";
import { Modal } from "antd";
import {
  TbPhotoEdit, TbCloudUpload, TbX, TbGripVertical, TbExternalLink,
} from "react-icons/tb";
import { FiEdit3, FiTrash2 } from "react-icons/fi";
import { useTheme } from "../Themes/ThemeContext";
import "../../styles/Dashboard.css";

const Banners = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false);
  const { darkMode } = useTheme();

  // create form state
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [linkUrl, setLinkUrl] = useState("/allproduct");
  const [photo, setPhoto] = useState(null);

  // edit modal
  const [editVisible, setEditVisible] = useState(false);
  const [editing, setEditing] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editSubtitle, setEditSubtitle] = useState("");
  const [editLink, setEditLink] = useState("");
  const [editActive, setEditActive] = useState(true);
  const [editPhoto, setEditPhoto] = useState(null);

  // drag and drop reorder
  const [draggedIdx, setDraggedIdx] = useState(null);

  const photoUrl = (id) =>
    `${process.env.REACT_APP_API}/api/v1/banner/photo/${id}?t=${Date.now()}`;

  const fetchBanners = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/banner/all`
      );
      if (data?.success) setBanners(data.banners || []);
    } catch (err) {
      console.log(err);
      toast.error("Could not load banners");
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!photo) {
      toast.error("Pick an image first");
      return;
    }
    setLoading(true);
    try {
      const fd = new FormData();
      if (title) fd.append("title", title);
      if (subtitle) fd.append("subtitle", subtitle);
      fd.append("linkUrl", linkUrl || "/allproduct");
      fd.append("order", banners.length);
      fd.append("isActive", "true");
      fd.append("photo", photo);

      const { data } = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/banner/create`,
        fd
      );
      if (data?.success) {
        toast.success("Banner created");
        setTitle(""); setSubtitle(""); setLinkUrl("/allproduct"); setPhoto(null);
        fetchBanners();
      } else {
        toast.error(data?.message || "Failed");
      }
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const openEdit = (b) => {
    setEditing(b);
    setEditTitle(b.title || "");
    setEditSubtitle(b.subtitle || "");
    setEditLink(b.linkUrl || "/allproduct");
    setEditActive(b.isActive);
    setEditPhoto(null);
    setEditVisible(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      fd.append("title", editTitle);
      fd.append("subtitle", editSubtitle);
      fd.append("linkUrl", editLink);
      fd.append("isActive", editActive);
      if (editPhoto) fd.append("photo", editPhoto);

      const { data } = await axios.put(
        `${process.env.REACT_APP_API}/api/v1/banner/update/${editing._id}`,
        fd
      );
      if (data?.success) {
        toast.success("Banner updated");
        setEditVisible(false);
        fetchBanners();
      } else {
        toast.error(data?.message || "Failed");
      }
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
    }
  };

  const toggleActive = async (b) => {
    try {
      const fd = new FormData();
      fd.append("isActive", !b.isActive);
      const { data } = await axios.put(
        `${process.env.REACT_APP_API}/api/v1/banner/update/${b._id}`,
        fd
      );
      if (data?.success) {
        toast.success(b.isActive ? "Banner hidden" : "Banner shown");
        fetchBanners();
      }
    } catch (err) {
      console.log(err);
      toast.error("Could not toggle");
    }
  };

  const handleDelete = async (b) => {
    const ok = window.confirm(`Delete banner ${b.title || "(untitled)"}?`);
    if (!ok) return;
    try {
      await axios.delete(
        `${process.env.REACT_APP_API}/api/v1/banner/delete/${b._id}`
      );
      toast.success("Banner deleted");
      fetchBanners();
    } catch (err) {
      console.log(err);
      toast.error("Could not delete");
    }
  };

  // ---- drag/drop reorder ----
  const handleDragStart = (idx) => setDraggedIdx(idx);
  const handleDragOver = (e, idx) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === idx) return;
    const next = [...banners];
    const [moved] = next.splice(draggedIdx, 1);
    next.splice(idx, 0, moved);
    setBanners(next);
    setDraggedIdx(idx);
  };
  const handleDragEnd = async () => {
    setDraggedIdx(null);
    try {
      await axios.put(`${process.env.REACT_APP_API}/api/v1/banner/reorder`, {
        order: banners.map((b, i) => ({ id: b._id, order: i })),
      });
      toast.success("Order saved");
    } catch (err) {
      console.log(err);
      toast.error("Could not save order");
      fetchBanners(); // resync
    }
  };

  return (
    <Layout title={"Dashboard - Manage Banners"}>
      <div className={`dashboard-page ${darkMode ? "dark-mode" : ""}`}>
        <div className="dash-layout">
          <aside className="dash-sidebar">
            <AdminMenu />
          </aside>

          <main>
            <h1 className="dash-heading">
              <TbPhotoEdit />
              Manage Banners
            </h1>

            {/* Create form */}
            <div className="dash-form-card" style={{ maxWidth: "100%" }}>
              <h3>Add a banner</h3>
              <form onSubmit={handleCreate}>
                <div className="dash-form-grid">
                  <div className="dash-field">
                    <label className="dash-label">Title (optional)</label>
                    <input type="text" className="dash-input"
                      placeholder="e.g. Summer Sale"
                      value={title} onChange={(e) => setTitle(e.target.value)} />
                  </div>

                  <div className="dash-field">
                    <label className="dash-label">Subtitle (optional)</label>
                    <input type="text" className="dash-input"
                      placeholder="e.g. Up to 50% off"
                      value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
                  </div>

                  <div className="dash-field full">
                    <label className="dash-label">Link URL</label>
                    <input type="text" className="dash-input"
                      placeholder="/allproduct or /category/footwear"
                      value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} />
                  </div>

                  <div className="dash-field full">
                    <label className="dash-label">Banner image</label>
                    <label className={`dash-upload ${photo ? "has-file" : ""}`}>
                      <TbCloudUpload />
                      <span className="dash-upload-title">
                        {photo ? photo.name : "Click to upload an image"}
                      </span>
                      <span className="dash-upload-hint">
                        Recommended 1920×600 (wide). JPG or PNG, up to ~2MB
                      </span>
                      <input type="file" accept="image/*" hidden
                        onChange={(e) => setPhoto(e.target.files[0])} />
                    </label>
                    {photo && (
                      <div className="dash-preview" style={{ maxWidth: 480 }}>
                        <img src={URL.createObjectURL(photo)} alt="banner preview" />
                      </div>
                    )}
                  </div>

                  <div className="dash-field full dash-submit-row">
                    <button type="submit" className="dash-btn-create" disabled={loading}>
                      <TbPhotoEdit /> {loading ? "Saving…" : "Add Banner"}
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* Banner list */}
            <div className="dash-head-row">
              <h2 className="dash-heading" style={{ fontSize: "1.4rem", margin: 0 }}>
                Current banners
              </h2>
              <span className="dash-count">
                <b>{banners.length}</b> banner{banners.length !== 1 ? "s" : ""}
                {" · drag "}<TbGripVertical style={{ verticalAlign: "middle" }} />{" to reorder"}
              </span>
            </div>

            {banners.length === 0 ? (
              <div className="dash-table-card">
                <p className="dash-empty-row">No banners yet — add one above.</p>
              </div>
            ) : (
              <div className="banner-list">
                {banners.map((b, i) => (
                  <div
                    key={b._id}
                    className={`banner-row ${draggedIdx === i ? "is-dragging" : ""} ${!b.isActive ? "is-inactive" : ""}`}
                    draggable
                    onDragStart={() => handleDragStart(i)}
                    onDragOver={(e) => handleDragOver(e, i)}
                    onDragEnd={handleDragEnd}
                  >
                    <div className="banner-handle" aria-label="Drag to reorder">
                      <TbGripVertical />
                    </div>

                    <div className="banner-thumb">
                      <img src={photoUrl(b._id)} alt={b.title || "banner"} />
                    </div>

                    <div className="banner-meta">
                      <div className="banner-title">
                        {b.title || <em className="banner-untitled">(untitled)</em>}
                      </div>
                      {b.subtitle && <div className="banner-sub">{b.subtitle}</div>}
                      <a className="banner-link" href={b.linkUrl} target="_blank" rel="noreferrer">
                        <TbExternalLink size={12} /> {b.linkUrl}
                      </a>
                    </div>

                    <div className="banner-actions">
                      {/* active toggle */}
                      <label className="banner-toggle" title={b.isActive ? "Active — click to hide" : "Hidden — click to show"}>
                        <input type="checkbox" checked={b.isActive} onChange={() => toggleActive(b)} />
                        <span className="banner-toggle-track">
                          <span className="banner-toggle-knob" />
                        </span>
                        <span className="banner-toggle-label">
                          {b.isActive ? "Active" : "Hidden"}
                        </span>
                      </label>

                      <button className="dash-btn-sm dash-btn-edit" onClick={() => openEdit(b)}>
                        <FiEdit3 /> Edit
                      </button>
                      <button className="dash-btn-sm dash-btn-delete" onClick={() => handleDelete(b)}>
                        <FiTrash2 /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Edit modal */}
            <Modal
              open={editVisible}
              onCancel={() => setEditVisible(false)}
              footer={null}
              width={620}
              wrapClassName="dash-modal"
            >
              <h3 style={{ fontFamily: "var(--fd)", marginTop: 0 }}>Edit banner</h3>
              {editing && (
                <form onSubmit={handleUpdate}>
                  <div className="dash-form-grid">
                    <div className="dash-field full">
                      <label className="dash-label">Title</label>
                      <input type="text" className="dash-input"
                        value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                    </div>
                    <div className="dash-field full">
                      <label className="dash-label">Subtitle</label>
                      <input type="text" className="dash-input"
                        value={editSubtitle} onChange={(e) => setEditSubtitle(e.target.value)} />
                    </div>
                    <div className="dash-field full">
                      <label className="dash-label">Link URL</label>
                      <input type="text" className="dash-input"
                        value={editLink} onChange={(e) => setEditLink(e.target.value)} />
                    </div>
                    <div className="dash-field full">
                      <label className="dash-label">Replace image (optional)</label>
                      <label className={`dash-upload ${editPhoto ? "has-file" : ""}`}>
                        <TbCloudUpload />
                        <span className="dash-upload-title">
                          {editPhoto ? editPhoto.name : "Click to upload a new image"}
                        </span>
                        <span className="dash-upload-hint">Leave empty to keep the current image</span>
                        <input type="file" accept="image/*" hidden
                          onChange={(e) => setEditPhoto(e.target.files[0])} />
                      </label>
                      <div className="dash-preview" style={{ maxWidth: 360 }}>
                        <img
                          src={editPhoto ? URL.createObjectURL(editPhoto) : photoUrl(editing._id)}
                          alt="banner"
                        />
                      </div>
                    </div>
                    <div className="dash-field full">
                      <label className="banner-toggle" style={{ display: "inline-flex" }}>
                        <input type="checkbox" checked={editActive}
                          onChange={(e) => setEditActive(e.target.checked)} />
                        <span className="banner-toggle-track">
                          <span className="banner-toggle-knob" />
                        </span>
                        <span className="banner-toggle-label">
                          {editActive ? "Active" : "Hidden"}
                        </span>
                      </label>
                    </div>
                    <div className="dash-field full dash-submit-row">
                      <button type="submit" className="dash-btn-create">
                        Save changes
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </Modal>
          </main>
        </div>
      </div>
    </Layout>
  );
};

export default Banners;
