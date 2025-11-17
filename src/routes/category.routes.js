import express from "express";
import * as categoryController from "../controllers/category.controller.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import authenticate from "../middlewares/authenticate.js";
import upload from "../config/multer.js";

const router = express.Router();
router.use(authenticate);

router.post(
  "/",
  upload.fields([{ name: "image", maxCount: 1 }]),
  asyncHandler(categoryController.createCategory)
);

router.get("/get", asyncHandler(categoryController.getCategory));

router.put(
  "/",
  upload.fields([{ name: "image", maxCount: 1 }]),
  asyncHandler(categoryController.updateCategory)
);

router.delete("/:categoryId", asyncHandler(categoryController.deleteCategory));

router.get("/all", categoryController.getAllCategoryDetails);

export default router;
