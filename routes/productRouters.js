import express from "express";
import { RequireSignin, isAdmin } from "../middlewares/authoMiddlerware.js";
import { brainTreePaymentController, braintreeTokenController, createProductController, deleteProductController, getProductController, getSingleProductController, productCategoryController, productCountController, productFiltersController, productListController, productPhotoController, realtedProductController, searchProductController, updateProductController } from "../controller/productController.js";
import ExpressFormidable from "express-formidable";

const router = express.Router();

//routers

router.post('/create-product',RequireSignin,isAdmin,ExpressFormidable(),createProductController);

//get product

router.get("/get-product",getProductController);

//Single get product

router.get("/get-product/:slug", getSingleProductController);

//get photo
router.get("/product-photo/:pid", productPhotoController);



//delete rproduct
router.delete("/delete-product/:pid",deleteProductController);


// update product
router.put(
    "/update-product/:pid",
    RequireSignin,
    isAdmin,
    ExpressFormidable(),
    updateProductController
  );


//filter product
router.post("/product-filters", productFiltersController);

//product count
router.get("/product-count", productCountController);

//product per page
router.get("/product-list/:page", productListController);



//search product
router.get("/search/:keyword", searchProductController);

//similar product
router.get("/related-product/:pid/:cid", realtedProductController);

//category wise product
router.get("/product-category/:slug", productCategoryController);

//payments routes
//token
router.get("/braintree/token", braintreeTokenController);

//payments
router.post("/braintree/payment", RequireSignin, brainTreePaymentController);

export default router