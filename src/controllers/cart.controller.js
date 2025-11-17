import * as cartService from "../services/cart.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const addToCart = async (req, res) => {
  try {
    const userId = req.user._id; // from JWT
    const result = await cartService.addToCart(userId, req.body);
    return ApiResponse.ok(res, result, "Product added to cart successfully");
  } catch (err) {
    return ApiResponse.error(res, err.message, err.status || 500);
  }
};

export const getCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const result = await cartService.getCart(userId, req);
    return ApiResponse.ok(res, result, "Cart fetched successfully");
  } catch (err) {
    return ApiResponse.error(res, err.message, err.status || 500);
  }
};

export const updateCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const result = await cartService.updateCart(userId, req.body);
    return ApiResponse.ok(res, result, "Cart updated successfully");
  } catch (err) {
    return ApiResponse.error(res, err.message, err.status || 500);
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { product_id } = req.body;
    const result = await cartService.removeFromCart(userId, product_id);
    return ApiResponse.ok(res, result, "Product removed from cart successfully");
  } catch (err) {
    return ApiResponse.error(res, err.message, err.status || 500);
  }
};

export const clearCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const result = await cartService.clearCart(userId);
    return ApiResponse.ok(res, result, "Cart cleared successfully");
  } catch (err) {
    return ApiResponse.error(res, err.message, err.status || 500);
  }
};
