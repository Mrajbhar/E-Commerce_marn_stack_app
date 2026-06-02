import BannerModel from "../models/BannerModel.js";
import fs from "fs";

// ADMIN: create a banner. Accepts multipart/form-data via express-formidable.
export const createBannerController = async (req, res) => {
  try {
    if (!req.fields) {
      return res.status(400).send({
        error: "Form data missing. Make sure the route uses ExpressFormidable() middleware.",
      });
    }

    const { title, subtitle, linkUrl, order, isActive, startsAt, endsAt } = req.fields;
    const { photo } = req.files || {};

    if (!photo) return res.status(400).send({ error: "Banner image is required" });
    if (photo.size > 2_000_000) {
      return res.status(400).send({ error: "Image should be less than 2MB" });
    }

    const banner = new BannerModel({
      title: title || undefined,
      subtitle: subtitle || undefined,
      linkUrl: linkUrl || "/allproduct",
      order: Number(order) || 0,
      isActive: isActive === "true" || isActive === true || isActive === undefined,
      startsAt: startsAt ? new Date(startsAt) : undefined,
      endsAt: endsAt ? new Date(endsAt) : undefined,
    });
    banner.photo.data = fs.readFileSync(photo.path);
    banner.photo.contentType = photo.type;
    await banner.save();

    res.status(201).send({
      success: true,
      message: "Banner created",
      banner: { ...banner.toObject(), photo: undefined },
    });
  } catch (error) {
    console.log("CREATE BANNER ERROR:", error);
    res.status(500).send({
      success: false,
      message: error?.message || "Error creating banner",
      error: error?.message || String(error),
    });
  }
};

// ADMIN: update a banner (any subset of fields, photo optional)
export const updateBannerController = async (req, res) => {
  try {
    if (!req.fields) {
      return res.status(400).send({ error: "Form data missing." });
    }

    const { title, subtitle, linkUrl, order, isActive, startsAt, endsAt } = req.fields;
    const { photo } = req.files || {};
    const { id } = req.params;

    const update = {};
    if (title !== undefined) update.title = title;
    if (subtitle !== undefined) update.subtitle = subtitle;
    if (linkUrl !== undefined) update.linkUrl = linkUrl || "/allproduct";
    if (order !== undefined) update.order = Number(order) || 0;
    if (isActive !== undefined) {
      update.isActive = isActive === "true" || isActive === true;
    }
    if (startsAt !== undefined) update.startsAt = startsAt ? new Date(startsAt) : null;
    if (endsAt !== undefined) update.endsAt = endsAt ? new Date(endsAt) : null;

    const banner = await BannerModel.findByIdAndUpdate(id, update, { new: true });
    if (!banner) return res.status(404).send({ success: false, message: "Banner not found" });

    if (photo) {
      if (photo.size > 2_000_000) {
        return res.status(400).send({ error: "Image should be less than 2MB" });
      }
      banner.photo.data = fs.readFileSync(photo.path);
      banner.photo.contentType = photo.type;
      await banner.save();
    }

    res.status(200).send({
      success: true,
      message: "Banner updated",
      banner: { ...banner.toObject(), photo: undefined },
    });
  } catch (error) {
    console.log("UPDATE BANNER ERROR:", error);
    res.status(500).send({
      success: false,
      message: error?.message || "Error updating banner",
      error: error?.message || String(error),
    });
  }
};

// ADMIN: list all banners (active + inactive) for management
export const getAllBannersController = async (req, res) => {
  try {
    const banners = await BannerModel.find({})
      .select("-photo")
      .sort({ order: 1, createdAt: -1 });
    res.status(200).send({ success: true, banners });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Error fetching banners", error });
  }
};

// PUBLIC: list active banners only, respecting schedule window
export const getActiveBannersController = async (req, res) => {
  try {
    const now = new Date();
    const banners = await BannerModel.find({
      isActive: true,
      $and: [
        { $or: [{ startsAt: { $exists: false } }, { startsAt: null }, { startsAt: { $lte: now } }] },
        { $or: [{ endsAt:   { $exists: false } }, { endsAt:   null }, { endsAt:   { $gte: now } }] },
      ],
    })
      .select("-photo")
      .sort({ order: 1, createdAt: -1 });
    res.status(200).send({ success: true, banners });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Error fetching banners", error });
  }
};

// PUBLIC: serve a banner's photo
export const bannerPhotoController = async (req, res) => {
  try {
    const banner = await BannerModel.findById(req.params.id).select("photo");
    if (banner?.photo?.data) {
      res.set("Content-Type", banner.photo.contentType);
      return res.status(200).send(banner.photo.data);
    }
    res.status(404).send({ success: false, message: "No photo" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Error fetching banner photo", error });
  }
};

// ADMIN: reorder banners — accepts array of { id, order }
export const reorderBannersController = async (req, res) => {
  try {
    const { order } = req.body; // [{ id, order }, ...]
    if (!Array.isArray(order)) {
      return res.status(400).send({ error: "Body must contain an `order` array" });
    }
    await Promise.all(
      order.map(({ id, order: o }) =>
        BannerModel.findByIdAndUpdate(id, { order: Number(o) || 0 })
      )
    );
    res.status(200).send({ success: true, message: "Banners reordered" });
  } catch (error) {
    console.log("REORDER BANNERS ERROR:", error);
    res.status(500).send({
      success: false,
      message: error?.message || "Error reordering banners",
    });
  }
};

// ADMIN: delete a banner
export const deleteBannerController = async (req, res) => {
  try {
    const { id } = req.params;
    await BannerModel.findByIdAndDelete(id);
    res.status(200).send({ success: true, message: "Banner deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Error deleting banner", error });
  }
};
