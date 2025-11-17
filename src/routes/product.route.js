// routes/product.route.js
import express from "express";
import * as productController from "../controllers/product.controller.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import authenticate from "../middlewares/authenticate.js";
import upload from "../config/multer.js";

const router = express.Router();
router.use(authenticate);

router.post(
  "/",
  upload.fields([{ name: "images", maxCount: 5 }]),
  asyncHandler(productController.createProduct)
);

// READ
router.get("/get/:productId", asyncHandler(productController.getProducts));

router.get("/all", asyncHandler(productController.getAllProducts));

// UPDATE
router.put(
  "/:productId",
  upload.fields([{ name: "images", maxCount: 5 }]),
  asyncHandler(productController.updateProduct)
);

// DELETE
router.delete(
  "/:productId",
  asyncHandler(productController.deleteProduct)
);

export default router;
