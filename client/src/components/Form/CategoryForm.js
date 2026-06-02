import React, { useState } from "react";
import { TbCloudUpload, TbStarFilled } from "react-icons/tb";

const CategoryForm = ({ handleSubmit, value, setvalue, featured, setFeatured, photo, setPhoto, existingPhotoUrl }) => {
  const [preview, setPreview] = useState(null);

  const onPhotoChange = (e) => {
    const f = e.target.files[0];
    setPhoto && setPhoto(f);
    setPreview(f ? URL.createObjectURL(f) : null);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="dash-form-grid">
        {/* Name */}
        <div className="dash-field full">
          <label className="dash-label">Category name</label>
          <input
            type="text"
            className="dash-input"
            placeholder="e.g. Apparel"
            value={value}
            onChange={(e) => setvalue(e.target.value)}
          />
        </div>

        {/* Photo */}
        {setPhoto && (
          <div className="dash-field full">
            <label className="dash-label">Category image</label>
            <label className={`dash-upload ${photo || existingPhotoUrl ? "has-file" : ""}`}>
              <TbCloudUpload />
              <span className="dash-upload-title">
                {photo ? photo.name : existingPhotoUrl ? "Replace image" : "Click to upload an image"}
              </span>
              <span className="dash-upload-hint">PNG or JPG, up to ~1MB</span>
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={onPhotoChange}
              />
            </label>
            {(preview || existingPhotoUrl) && (
              <div className="dash-preview">
                <img src={preview || existingPhotoUrl} alt="category preview" />
              </div>
            )}
          </div>
        )}

        {/* Featured toggle */}
        {setFeatured && (
          <div className="dash-field full">
            <label className="cat-featured-toggle">
              <input
                type="checkbox"
                checked={!!featured}
                onChange={(e) => setFeatured(e.target.checked)}
              />
              <span className="cat-featured-box">
                <TbStarFilled />
              </span>
              <span>
                <span className="cat-featured-title">Featured category</span>
                <span className="cat-featured-hint">
                  Featured tiles span 2 columns and sort to the top.
                </span>
              </span>
            </label>
          </div>
        )}

        <div className="dash-field full dash-submit-row">
          <button type="submit" className="dash-btn-create">
            Submit
          </button>
        </div>
      </div>
    </form>
  );
};

export default CategoryForm;