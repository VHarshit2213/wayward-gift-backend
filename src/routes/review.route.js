// routes/review.route.js
import express from "express";
import * as reviewController from "../controllers/review.controller.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import authenticate from "../middlewares/authenticate.js";
import upload from "../config/multer.js";

const router = express.Router();

// CRUD
router.post("/", authenticate, upload.fields([{ name: "images", maxCount: 5 }]), asyncHandler(reviewController.createReview));
router.get("/summary", asyncHandler(reviewController.getGlobalReviewSummaryController));
router.get("/:reviewId", asyncHandler(reviewController.getReview));
router.put("/:reviewId", authenticate, asyncHandler(reviewController.updateReview));
router.delete("/:reviewId", authenticate, asyncHandler(reviewController.deleteReview));

// Extra
router.get("/product/:productId", asyncHandler(reviewController.getProductReviews));
router.get("/user/:userId", asyncHandler(reviewController.getUserReviews));

export default router;
