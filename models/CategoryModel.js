import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: { type: String },
    slug: { type: String, lowercase: true },
    photo: {
      data: Buffer,
      contentType: String,
    },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("category", categorySchema);