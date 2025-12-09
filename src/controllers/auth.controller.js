import { z } from "zod";
import { ApiResponse } from "../utils/ApiResponse.js";
import * as authService from "../services/auth.service.js";

//  Validation schemas
export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    mobile: z.string().min(10).max(10), 
    password: z.string().min(8),
  }),
});


export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8),
  }),
});
//  Register controller
export const register = async (req, res) => {
  try {
    console.log("Registering user:", req.body);
    const result = await authService.register(req.body);
    return ApiResponse.created(res, result, "User registered successfully");
  } catch (err) {
    console.error(err);
    return ApiResponse.error(res, err.message, err.status || 500);
  }
};

//  Login controller
export const login = async (req, res) => {
  try {
    const result = await authService.login(req.body);
    return ApiResponse.ok(res, result,"User logged in successfully");
  } catch (err) {
    return ApiResponse.error(res, err.message, err.status);
  }
};

// google login controller
export const googleAuth = async (req, res) => {
  try {
    const { idToken } = req.body; // token from frontend
    const result = await authService.googleLogin(idToken);
    return ApiResponse.ok(res, result, "User logged in with Google");
  } catch (err) {
    return ApiResponse.error(res, err.message, err.status || 500);
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const result = await authService.forgotPassword(req.body);
    return ApiResponse.ok(res, result);
  } catch (err) {
    console.error("Error in forgotPassword controller:", err);
    return ApiResponse.error(res, err.message || "Failed to send reset link");
  }
};

// Reset password
export const resetPassword = async (req, res) => {
  try {
    const result = await authService.resetPassword(req.body);
    return ApiResponse.ok(res, result);
  } catch (err) {
    console.error("Error in resetPassword controller:", err);
    return ApiResponse.error(res, err.message || "Failed to reset password");
  }
};

//  Exporting all controllers and schemas
export default {
  register,
  login,
  registerSchema,
  loginSchema
};