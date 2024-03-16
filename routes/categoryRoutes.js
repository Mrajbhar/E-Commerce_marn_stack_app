import express from "express";
import { RequireSignin, isAdmin } from './../middlewares/authoMiddlerware.js';
import { categoryController, createCategoryController, deleteCategoryController, singleCategoryController, updateCategoryController } from "../controller/categoryController.js";


const router = express.Router();

//Routers
//create category
router.post("/create-category",RequireSignin,isAdmin,createCategoryController);

//update category

router.put("/update-category/:id",RequireSignin,isAdmin,updateCategoryController)


//getAll category

router.get("/get-category",categoryController);

//single category
router.get("/single-category/:slug",singleCategoryController);

//delete categorty
router.delete("/delete-category/:id",RequireSignin,isAdmin,deleteCategoryController);


export default router;