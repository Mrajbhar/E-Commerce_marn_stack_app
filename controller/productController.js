import slugify from "slugify";
import productModel from "../models/productModel.js";
import categoryModel from "../models/CategoryModel.js";
import orderModel from "../models/orderModel.js";
import fs from "fs";
import braintree from "braintree";
import dotenv from "dotenv";

dotenv.config();

var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREEE_MERCHANT_ID,
  publicKey: process.env.BRAINTREEE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREEE_PRIVATE_KEY,
});

// helper: read up to 5 photos from req.files (photo, photo2..photo5)
// and return an array of { data, contentType }.
const readPhotos = (files) => {
  const out = [];
  ["photo", "photo2", "photo3", "photo4", "photo5"].forEach((key) => {
    const p = files?.[key];
    if (p && p.path) {
      out.push({
        data: fs.readFileSync(p.path),
        contentType: p.type,
      });
    }
  });
  return out;
};

// helper: parse tags coming in as JSON string or comma-separated string
const parseTags = (raw) => {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed.map((t) => String(t).trim().toLowerCase()).filter(Boolean);
  } catch {}
  return String(raw)
    .split(",")
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);
};

// helper: pull specifications out of req.fields; returns undefined
// if the admin left them all blank so Mongoose doesn't store an empty subdoc.
const readSpecs = (fields = {}) => {
  const specs = {
    size: fields.size || undefined,
    color: fields.color || undefined,
    material: fields.material || undefined,
    weight: fields.weight || undefined,
  };
  const hasAny = Object.values(specs).some((v) => v);
  return hasAny ? specs : undefined;
};

export const createProductController = async (req, res) => {
  try {
    if (!req.fields) {
      return res.status(400).send({
        error: "Form data missing. Make sure the route uses ExpressFormidable() middleware.",
      });
    }

    const {
      name, description, price, category, quantity, shipping,
      originalPrice, sku, brand, stockStatus, tags,
    } = req.fields;

    if (!name) return res.status(500).send({ error: "Name is Required" });
    if (!description) return res.status(500).send({ error: "Description is Required" });
    if (!price) return res.status(500).send({ error: "Price is Required" });
    if (!category) return res.status(500).send({ error: "Category is Required" });
    if (!quantity) return res.status(500).send({ error: "Quantity is Required" });

    const photos = readPhotos(req.files);
    if (req.files?.photo?.size > 1_000_000) {
      return res.status(500).send({ error: "Photo should be less than 1mb" });
    }

    const product = new productModel({
      name,
      slug: slugify(name),
      description,
      price,
      originalPrice: originalPrice || undefined,
      category,
      quantity,
      shipping,
      sku: sku || undefined,
      brand: brand || undefined,
      stockStatus: stockStatus || "in_stock",
      specifications: readSpecs(req.fields),
      tags: parseTags(tags),
    });

    // keep .photo populated so the existing card endpoint still works
    if (photos.length > 0) {
      product.photo = photos[0];
      product.photos = photos;
    }

    await product.save();
    res.status(201).send({
      success: true,
      message: "Product Created Successfully",
      products: product,
    });
  } catch (error) {
    console.log("CREATE PRODUCT ERROR:", error);
    res.status(500).send({
      success: false,
      message: error?.message || "Error in creating product",
      error: error?.message || String(error),
    });
  }
};

export const getProductController = async (req, res) => {
  try {
    const products = await productModel
      .find({})
      .populate("category")
      .select("-photo -photos")
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      total_Products: products.length,
      message: "All Products",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Error in getting product", error: error.message });
  }
};

export const getSingleProductController = async (req, res) => {
  try {
    // Exclude BOTH photo and photos so we don't drag the binary buffers
    // (potentially many MB) through the response just to count them.
    const product = await productModel
      .findOne({ slug: req.params.slug })
      .select("-photo -photos")
      .populate("category")
      .lean();

    if (!product) {
      return res
        .status(404)
        .send({ success: false, message: "Product not found" });
    }

    // Count photos via aggregation — returns just the count, never loads
    // the binary buffers themselves. Falls back to 1 if only the legacy
    // single .photo field is set.
    const [countResult] = await productModel.aggregate([
      { $match: { _id: product._id } },
      {
        $project: {
          photosLen: { $size: { $ifNull: ["$photos", []] } },
          hasSinglePhoto: {
            $cond: [{ $ifNull: ["$photo.data", false] }, 1, 0],
          },
        },
      },
    ]);

    let photoCount = countResult?.photosLen || 0;
    if (photoCount === 0 && countResult?.hasSinglePhoto) photoCount = 1;
    product.photoCount = photoCount;

    res
      .status(200)
      .send({ success: true, message: "Single Product Fetched", product });
  } catch (error) {
    console.log("GET SINGLE PRODUCT ERROR:", error);
    res.status(500).send({
      success: false,
      message: "Error while getting single product",
      error: error?.message || String(error),
    });
  }
};

// existing endpoint: serves first photo (index 0). Kept unchanged for back-compat.
export const productPhotoController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.pid).select("photo photos");
    // try .photo first (back-compat), fall back to photos[0]
    const p = product?.photo?.data ? product.photo : product?.photos?.[0];
    if (p?.data) {
      res.set("Content-type", p.contentType);
      return res.status(200).send(p.data);
    }
    res.status(404).send({ success: false, message: "No photo" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Error while getting photo", error });
  }
};

// NEW: serve a specific photo index (for galleries)
export const productPhotoByIndexController = async (req, res) => {
  try {
    const { pid, index } = req.params;
    const product = await productModel.findById(pid).select("photo photos");
    const idx = parseInt(index, 10) || 0;
    const photos = product?.photos?.length ? product.photos : (product?.photo?.data ? [product.photo] : []);
    const p = photos[idx];
    if (p?.data) {
      res.set("Content-type", p.contentType);
      return res.status(200).send(p.data);
    }
    res.status(404).send({ success: false, message: "No photo at index" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Error while getting photo", error });
  }
};

export const deleteProductController = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.params.pid).select("-photo");
    res.status(200).send({ success: true, message: "Product Deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Error while deleting product", error });
  }
};

export const updateProductController = async (req, res) => {
  try {
    if (!req.fields) {
      return res.status(400).send({
        error: "Form data missing. Make sure the route uses ExpressFormidable() middleware.",
      });
    }

    const {
      name, description, price, category, quantity, shipping,
      originalPrice, sku, brand, stockStatus, tags,
    } = req.fields;

    if (!name) return res.status(500).send({ error: "Name is Required" });
    if (!description) return res.status(500).send({ error: "Description is Required" });
    if (!price) return res.status(500).send({ error: "Price is Required" });
    if (!category) return res.status(500).send({ error: "Category is Required" });
    if (!quantity) return res.status(500).send({ error: "Quantity is Required" });

    const update = {
      name,
      description,
      price,
      originalPrice: originalPrice || undefined,
      category,
      quantity,
      shipping,
      sku: sku || undefined,
      brand: brand || undefined,
      stockStatus: stockStatus || "in_stock",
      specifications: readSpecs(req.fields),
      tags: parseTags(tags),
      slug: slugify(name),
    };

    const product = await productModel.findByIdAndUpdate(req.params.pid, update, { new: true });

    const photos = readPhotos(req.files);
    if (photos.length > 0) {
      product.photo = photos[0];
      product.photos = photos;
      await product.save();
    }

    res.status(201).send({ success: true, message: "Product Updated Successfully", products: product });
  } catch (error) {
    console.log("UPDATE PRODUCT ERROR:", error);
    res.status(500).send({
      success: false,
      message: error?.message || "Error in Update product",
      error: error?.message || String(error),
    });
  }
};

export const productFiltersController = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    let args = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
    const products = await productModel.find(args).select("-photo -photos");
    res.status(200).send({ success: true, products });
  } catch (error) {
    console.log(error);
    res.status(400).send({ success: false, message: "Error While Filtering Products", error });
  }
};

export const productCountController = async (req, res) => {
  try {
    const total = await productModel.find({}).estimatedDocumentCount();
    res.status(200).send({ success: true, total });
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: "Error in product count", error, success: false });
  }
};

export const productListController = async (req, res) => {
  try {
    const perPage = 8;
    const page = req.params.page ? req.params.page : 1;
    const products = await productModel
      .find({})
      .select("-photo -photos")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });
    res.status(200).send({ success: true, products });
  } catch (error) {
    console.log(error);
    res.status(400).send({ success: false, message: "error in per page ctrl", error });
  }
};

// Extended search: now matches name, description, brand, tags, sku
export const searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const rx = { $regex: keyword, $options: "i" };
    const results = await productModel
      .find({
        $or: [
          { name: rx },
          { description: rx },
          { brand: rx },
          { sku: rx },
          { tags: { $regex: keyword, $options: "i" } },
        ],
      })
      .select("-photo -photos");
    res.json(results);
  } catch (error) {
    console.log(error);
    res.status(400).send({ success: false, message: "Error In Search Product API", error });
  }
};

export const realtedProductController = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const products = await productModel
      .find({ category: cid, _id: { $ne: pid } })
      .select("-photo -photos")
      .limit(3)
      .populate("category");
    res.status(200).send({ success: true, products });
  } catch (error) {
    console.log(error);
    res.status(400).send({ success: false, message: "error while geting related product", error });
  }
};

export const productCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ slug: req.params.slug });
    const products = await productModel.find({ category }).populate("category").select("-photo -photos");
    res.status(200).send({ success: true, category, products });
  } catch (error) {
    console.log(error);
    res.status(400).send({ success: false, error, message: "Error While Getting products" });
  }
};

export const braintreeTokenController = async (req, res) => {
  try {
    gateway.clientToken.generate({}, function (err, response) {
      if (err) res.status(500).send(err);
      else res.send(response);
    });
  } catch (error) {
    console.log(error);
  }
};

export const brainTreePaymentController = async (req, res) => {
  try {
    const { nonce, cart } = req.body;
    let total = 0;
    cart.map((i) => { total += i.price; });
    gateway.transaction.sale(
      { amount: total, paymentMethodNonce: nonce, options: { submitForSettlement: true } },
      function (error, result) {
        if (result) {
          new orderModel({ products: cart, payment: result, buyer: req.user._id }).save();
          res.json({ ok: true });
        } else {
          res.status(500).send(error);
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};