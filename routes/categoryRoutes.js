import express from "express";
import formidable from "express-formidable";
import { RequireSignin, isAdmin } from "./../middlewares/authoMiddlerware.js";
import {
  categoryController,
  categoryCountsController,
  categoryPhotoController,
  createCategoryController,
  deleteCategoryController,
  singleCategoryController,
  updateCategoryController,
} from "../controller/categoryController.js";

const router = express.Router();

router.post(
  "/create-category",
  RequireSignin,
  isAdmin,
  formidable(),
  createCategoryController
);

router.put(
  "/update-category/:id",
  RequireSignin,
  isAdmin,
  formidable(),
  updateCategoryController
);

router.get("/get-category", categoryController);
router.get("/single-category/:slug", singleCategoryController);
router.get("/category-photo/:id", categoryPhotoController);
router.get("/category-counts", categoryCountsController);

router.delete(
  "/delete-category/:id",
  RequireSignin,
  isAdmin,
  deleteCategoryController
);

export default router;