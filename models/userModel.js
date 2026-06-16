import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    
    password: {
      type: String,
    },
    phone: {
      type: String,
    },
    address: {
      type: {},
    },
    answer: {
      type: String,
    },
    role: {
      type: Number,
      default: 0,
    },
    // Google sign-in metadata
    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
    googleId: {
      type: String,
    },
    picture: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("users", userSchema);