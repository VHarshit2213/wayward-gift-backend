import * as categoryService from "../services/category.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const createCategory = async (req, res) => {
  try {
    const result = await categoryService.createCategory(req.body, req.files, req);
    return ApiResponse.created(res, result, "Category created successfully");
  } catch (err) {
    return ApiResponse.error(res, err.message, err.status || 500);
  }
};

export const getCategory = async (req, res) => {
  try {
    const { categoryId } = req.query;
    const result = await categoryService.getCategory(categoryId, req);
    return ApiResponse.ok(res, result, "Category fetched successfully");
  } catch (err) {
    return ApiResponse.error(res, err.message, err.status || 500);
  }
};

export const updateCategory = async (req, res) => {
  try {
    const result = await categoryService.updateCategory(req, res);
    return ApiResponse.ok(res, result, "Category updated successfully");
  } catch (err) {
    return ApiResponse.error(res, err.message, err.status || 500);
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const result = await categoryService.deleteCategory(categoryId);
      return ApiResponse.ok(res, { deleted: true }, "Category deleted successfully");
  } catch (err) {
    return ApiResponse.error(res, err.message, err.status || 500);
  }
};

export const getAllCategoryDetails = async (req, res) => {
  try {
    const result = await categoryService.getAllCategoryDetails(req);    
    return ApiResponse.ok(res, result, "All categories fetched successfully");
  } catch (err) {
    return ApiResponse.error(res, err.message, err.status || 500);
  }
};


