import express from "express";
import {registerController,loginController,testController, forgotPasswordController, updateProfileController, getAllOrdersController, getOrdersController, orderStatusController, getAllUsersController} from "../controller/authController.js";
import { RequireSignin, isAdmin } from "../middlewares/authoMiddlerware.js";

//route object

const router = express.Router();


router.post('/register',registerController);

//Login || POST
router.post('/login',loginController);


//Forgot Password || POST
router.post(`/forgot-password`, forgotPasswordController);

//test router

router.get('/test',RequireSignin,isAdmin, testController);


//User Authentication route (protected)
router.get('/user-auth', RequireSignin, (req, res) => {
    res.status(200).send({ ok: true });
});

// Admin Authentication route (protected)
router.get('/admin-auth', RequireSignin, isAdmin, (req, res) => {
    res.status(200).send({ ok: true });
});


//update profile
router.put("/profile", RequireSignin, updateProfileController);

//orders
router.get("/orders", RequireSignin, getOrdersController);

//all orders
router.get("/all-orders", RequireSignin, isAdmin, getAllOrdersController);

// order status update
router.put(
  "/order-status/:orderId",
  RequireSignin,
  isAdmin,
  orderStatusController
);

router.get("/all-users",RequireSignin, isAdmin, getAllUsersController)

export default router;