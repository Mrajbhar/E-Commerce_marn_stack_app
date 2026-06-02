import CategoryModel from "../models/CategoryModel.js";
import ProductModel from "../models/productModel.js";
import slugify from "slugify";
import fs from "fs";

// CREATE — accepts multipart/form-data with optional photo file + featured flag
export const createCategoryController = async (req, res) => {
  try {
    const { name, featured } = req.fields || req.body;
    const { photo } = req.files || {};

    if (!name) return res.status(401).send({ message: "Name is required" });
    if (photo && photo.size > 1_000_000) {
      return res.status(400).send({ message: "Photo should be less than 1MB" });
    }

    const existing = await CategoryModel.findOne({ name });
    if (existing) {
      return res.status(200).send({
        success: true,
        message: "Category Already Exists",
      });
    }

    const category = new CategoryModel({
      name,
      slug: slugify(name),
      featured: featured === "true" || featured === true,
    });
    if (photo) {
      category.photo.data = fs.readFileSync(photo.path);
      category.photo.contentType = photo.type;
    }
    await category.save();

    res.status(201).send({
      success: true,
      message: "New category created",
      category: { ...category.toObject(), photo: undefined }, // don't ship buffer
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in category",
    });
  }
};

// UPDATE — also accepts multipart so admins can change image / featured flag
export const updateCategoryController = async (req, res) => {
  try {
    const { name, featured } = req.fields || req.body;
    const { photo } = req.files || {};
    const { id } = req.params;

    const update = {};
    if (name) {
      update.name = name;
      update.slug = slugify(name);
    }
    if (featured !== undefined) {
      update.featured = featured === "true" || featured === true;
    }

    const category = await CategoryModel.findByIdAndUpdate(id, update, {
      new: true,
    });

    if (photo) {
      if (photo.size > 1_000_000) {
        return res.status(400).send({ message: "Photo should be less than 1MB" });
      }
      category.photo.data = fs.readFileSync(photo.path);
      category.photo.contentType = photo.type;
      await category.save();
    }

    res.status(200).send({
      success: true,
      message: "Category Updated Successfully",
      category: { ...category.toObject(), photo: undefined },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while updating category",
    });
  }
};

// LIST — exclude the photo buffer so the response stays small
export const categoryController = async (req, res) => {
  try {
    const category = await CategoryModel.find({}).select("-photo").sort({ featured: -1, name: 1 });
    res.status(200).send({
      success: true,
      message: "All Categories List",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, error, message: "Error while getting all category" });
  }
};

export const singleCategoryController = async (req, res) => {
  try {
    const category = await CategoryModel.findOne({ slug: req.params.slug }).select("-photo");
    res.status(200).send({
      success: true,
      message: "Get Single Category Successfully",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, error, message: "Error while getting single category" });
  }
};

// NEW — serve a category's photo (same pattern as productPhotoController)
export const categoryPhotoController = async (req, res) => {
  try {
    const category = await CategoryModel.findById(req.params.id).select("photo");
    if (category?.photo?.data) {
      res.set("Content-Type", category.photo.contentType);
      return res.status(200).send(category.photo.data);
    }
    res.status(404).send({ success: false, message: "No photo" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, error, message: "Error while getting category photo" });
  }
};

// NEW — product counts grouped by category (one call instead of N)
export const categoryCountsController = async (req, res) => {
  try {
    const counts = await ProductModel.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);
    // shape it as { categoryId: count } for easy frontend lookup
    const map = counts.reduce((acc, c) => {
      acc[c._id] = c.count;
      return acc;
    }, {});
    res.status(200).send({ success: true, counts: map });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, error, message: "Error while counting" });
  }
};

export const deleteCategoryController = async (req, res) => {
  try {
    const { id } = req.params;
    await CategoryModel.findByIdAndDelete(id);
    res.status(200).send({ success: true, message: "Category Deleted Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, error, message: "Error while deleting category" });
  }
};