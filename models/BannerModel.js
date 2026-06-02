import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true },        // Optional headline shown over the image
    subtitle: { type: String, trim: true },     // Optional smaller text
    linkUrl: { type: String, trim: true, default: "/allproduct" },  // Where clicking goes

    photo: {
      data: Buffer,
      contentType: String,
    },

    order: { type: Number, default: 0 },        // Lower numbers appear first
    isActive: { type: Boolean, default: true }, // Toggle without deleting

    startsAt: { type: Date },                   // Optional schedule window
    endsAt:   { type: Date },
  },
  { timestamps: true }
);

bannerSchema.index({ order: 1, createdAt: -1 });

export default mongoose.model("banner", bannerSchema);
