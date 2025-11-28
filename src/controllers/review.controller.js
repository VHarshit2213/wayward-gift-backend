// controllers/review.controller.js
import * as reviewService from "../services/review.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const createReview = async (req, res) => {
  try {
    console.log("Request Body:", req.body); // Debugging line
    const result = await reviewService.createReview(req.body,req);
    return ApiResponse.created(res, result, "Review created successfully");
  } catch (err) {
    return ApiResponse.error(res, err.message, err.status || 500);
  }
};

export const getReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const result = await reviewService.getReview(reviewId,req);
    return ApiResponse.ok(res, result, "Review fetched successfully");
  } catch (err) {
    return ApiResponse.error(res, err.message, err.status || 500);
  }
};

export const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const result = await reviewService.updateReview(reviewId, req.body,req);
    return ApiResponse.ok(res, result, "Review updated successfully");
  } catch (err) {
    return ApiResponse.error(res, err.message, err.status || 500);
  }
};

export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const result = await reviewService.deleteReview(reviewId);
    return ApiResponse.ok(res, { deleted: true }, "Review deleted successfully");
  } catch (err) {
    return ApiResponse.error(res, err.message, err.status || 500);
  }
};

export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const result = await reviewService.getProductReviews(productId,req);
    return ApiResponse.ok(res, result, "Product reviews fetched successfully");
  } catch (err) {
    return ApiResponse.error(res, err.message, err.status || 500);
  }
};

export const getUserReviews = async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await reviewService.getUserReviews(userId,req);
    return ApiResponse.ok(res, result, "User reviews fetched successfully");
  } catch (err) {
    return ApiResponse.error(res, err.message, err.status || 500);
  }
};

export async function getGlobalReviewSummaryController(req, res) {
  try {
    const summary = await reviewService.getGlobalReviewSummary(req);
    return ApiResponse.ok(res, summary, "Global review summary fetched successfully");
  } catch (error) {
    return ApiResponse.error(res, error.message || "Failed to fetch global review summary");
  }
}
