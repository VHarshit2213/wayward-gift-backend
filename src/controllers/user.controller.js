import * as userService from "../services/user.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const getUserById = async (req, res) => {
  try {
    const result = await userService.getUserById(req.query.userId, req);
    return ApiResponse.ok(res, result, "User fetched successfully");
  } catch (err) {
    return ApiResponse.error(res, err.message, err.status || 500);
  }
};

export const updateUserDetails = async (req, res) => {
  try {
    const result = await userService.updateUserDetails(req.user._id, req.body);
    return ApiResponse.ok(res, result, "User updated successfully");
  } catch (err) {
    return ApiResponse.error(res, err.message, err.status || 500);
  }
};

export const updateProfilePicture = async (req, res) => {
  try {
    const result = await userService.updateProfilePicture(req.user._id, req.files, req);
    return ApiResponse.ok(res, result, "Profile picture updated successfully");
  } catch (err) {
    return ApiResponse.error(res, err.message, err.status || 500);
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const result = await userService.getAllUsers(req.user._id, req);
    return ApiResponse.ok(res, result, "Users fetched successfully");
  } catch (err) {
    return ApiResponse.error(res, err.message, err.status || 500);
  }
};

export const deleteUser = async (req, res) => {
  try {
    const result = await userService.deleteUser(req.params.id, req);
    return ApiResponse.ok(res, result, "User deleted successfully");
  } catch (err) {
    return ApiResponse.error(res, err.message, err.status || 500);
  }
};
