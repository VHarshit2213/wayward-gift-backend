import express from "express";
import * as cartController from "../controllers/cart.controller.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import authenticate from "../middlewares/authenticate.js";

const router = express.Router();
router.use(authenticate);


router.post("/add", asyncHandler(cartController.addToCart));
router.get("/", asyncHandler(cartController.getCart));
router.put("/update", asyncHandler(cartController.updateCart));
router.delete("/remove", asyncHandler(cartController.removeFromCart));
router.delete("/clear", asyncHandler(cartController.clearCart));

export default router;
