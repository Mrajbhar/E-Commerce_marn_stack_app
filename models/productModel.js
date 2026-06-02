import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true },
    description: { type: String, required: true },

    // Pricing
    price: { type: Number, required: true },          // current selling price
    originalPrice: { type: Number },                  // optional MRP; if > price, % off badge shows

    category: { type: mongoose.ObjectId, ref: "category", required: true },
    quantity: { type: Number, required: true },

    // Multiple photos (up to 5). Existing single `.photo` field kept for
    // backward compatibility so old products still render.
    photo: { data: Buffer, contentType: String },
    photos: [
      {
        data: Buffer,
        contentType: String,
      },
    ],

    // Identifiers / commerce metadata
    sku: { type: String, trim: true, uppercase: true },
    brand: { type: String, trim: true },

    // Stock status (admin-set; or derive from quantity later)
    stockStatus: {
      type: String,
      enum: ["in_stock", "low_stock", "out_of_stock"],
      default: "in_stock",
    },

    // Ratings (read-only, populated by a future reviews collection)
    ratings: {
      average: { type: Number, default: 0, min: 0, max: 5 },
      count: { type: Number, default: 0 },
    },

    // Free-form specs — any combination, all optional
    specifications: {
      size: { type: String, trim: true },
      color: { type: String, trim: true },
      material: { type: String, trim: true },
      weight: { type: String, trim: true }, // string so you can write "500g" or "1.2kg"
    },

    // Searchable tags
    tags: [{ type: String, trim: true, lowercase: true }],

    shipping: { type: Boolean },
  },
  { timestamps: true }
);

// Text search across name, description, brand
productSchema.index({ name: "text", description: "text", brand: "text" });
// Regular index for tag filtering
productSchema.index({ tags: 1 });

export default mongoose.model("Products", productSchema);