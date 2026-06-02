import express from "express";
import formidable from "express-formidable";
import { RequireSignin, isAdmin } from "../middlewares/authoMiddlerware.js";
import {
  createBannerController,
  updateBannerController,
  getAllBannersController,
  getActiveBannersController,
  bannerPhotoController,
  reorderBannersController,
  deleteBannerController,
} from "../controller/bannerController.js";

const router = express.Router();

// Admin-only mutations
router.post("/create", RequireSignin, isAdmin, formidable(), createBannerController);
router.put("/update/:id", RequireSignin, isAdmin, formidable(), updateBannerController);
router.put("/reorder", RequireSignin, isAdmin, reorderBannersController);
router.delete("/delete/:id", RequireSignin, isAdmin, deleteBannerController);

// Admin reads all (including inactive)
router.get("/all", RequireSignin, isAdmin, getAllBannersController);

// Public — used by the storefront hero
router.get("/active", getActiveBannersController);
router.get("/photo/:id", bannerPhotoController);

export default router;
