import express from "express";
import { RequireSignin, isAdmin } from "../middlewares/authoMiddlerware.js";
import {
  brainTreePaymentController,
  braintreeTokenController,
  createProductController,
  deleteProductController,
  getProductController,
  getSingleProductController,
  productCategoryController,
  productCountController,
  productFiltersController,
  productListController,
  productPhotoByIndexController,
  productPhotoController,
  realtedProductController,
  searchProductController,
  updateProductController,
} from "../controller/productController.js";
import ExpressFormidable from "express-formidable";

const router = express.Router();

router.post("/create-product", RequireSignin, isAdmin, ExpressFormidable(), createProductController);
router.get("/get-product", getProductController);
router.get("/get-product/:slug", getSingleProductController);

// photo endpoints — first one stays as-is for back-compat
router.get("/product-photo/:pid", productPhotoController);
router.get("/product-photo/:pid/:index", productPhotoByIndexController);

router.delete("/delete-product/:pid", RequireSignin, isAdmin, deleteProductController);
router.put("/update-product/:pid", RequireSignin, isAdmin, ExpressFormidable(), updateProductController);
router.post("/product-filters", productFiltersController);
router.get("/product-count", productCountController);
router.get("/product-list/:page", productListController);
router.get("/search/:keyword", searchProductController);
router.get("/related-product/:pid/:cid", realtedProductController);
router.get("/product-category/:slug", productCategoryController);
router.get("/braintree/token", braintreeTokenController);
router.post("/braintree/payment", RequireSignin, brainTreePaymentController);

export default router;
