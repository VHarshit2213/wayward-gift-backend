// controllers/product.controller.js
import * as productService from "../services/product.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const createProduct = async (req, res) => {
  try {
    const result = await productService.createProduct(req.body, req.files, req);
    return ApiResponse.created(res, result, "Product created successfully");
  } catch (err) {
    return ApiResponse.error(res, err.message, err.status || 500);
  }
};

export const getProducts = async (req, res) => {
  try {
    const { productId } = req.params;
    const result = await productService.getProducts(productId, req);
    return ApiResponse.ok(res, result, "Products fetched successfully");
  } catch (err) {
    return ApiResponse.error(res, err.message, err.status || 500);
  }
};


export const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const result = await productService.updateProduct(productId, req.body, req.files, req);
    return ApiResponse.ok(res, result, "Product updated successfully");
  } catch (err) {
    return ApiResponse.error(res, err.message, err.status || 500);
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user._id;
    await productService.deleteProduct(productId,userId);
    return ApiResponse.ok(res, { deleted: true }, "Product deleted successfully");
  } catch (err) {
    return ApiResponse.error(res, err.message, err.status || 500);
  }
};


export const getAllProducts = async (req, res) => {
  try {
    const { categoryId, search, page, limit,inStock } = req.query;
    const result = await productService.getAllProducts({ categoryId, search, page, limit,inStock }, req);
    return ApiResponse.ok(res, result, "Products fetched successfully");
  } catch (err) {
    return ApiResponse.error(res, err.message, err.status || 500);
  }
};


export const createUserCustomProduct = async (req, res) => {
  try {
    const result = await productService.createUserCustomProduct(req.body);
    return ApiResponse.ok(res, result, "Custom product created");
  } catch (err) {
    return ApiResponse.error(res, err.message);
  }
};
