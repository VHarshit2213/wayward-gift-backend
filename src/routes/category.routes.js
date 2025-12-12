import express from "express";
import * as categoryController from "../controllers/category.controller.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import authenticate from "../middlewares/authenticate.js";
import upload from "../config/multer.js";

const router = express.Router();

router.get("/get", asyncHandler(categoryController.getCategory));

router.get("/all", categoryController.getAllCategoryDetails);

router.use(authenticate);

router.post(
  "/",
  upload.fields([{ name: "image", maxCount: 1 }]),
  asyncHandler(categoryController.createCategory)
);



router.put(
  "/",
  upload.fields([{ name: "image", maxCount: 1 }]),
  asyncHandler(categoryController.updateCategory)
);

router.delete("/:categoryId", asyncHandler(categoryController.deleteCategory));



export default router;
