import * as optionService from "../services/customOption.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const createOption = async (req, res) => {
  try {
    console.log("Request Body:", req.body); // Debugging line
    const result = await optionService.createOption(req.body,req);
    return ApiResponse.ok(res, result, "Custom option created");
  } catch (err) {
    return ApiResponse.error(res, err.message);
  }
};

export const getAllOptions = async (req, res) => {
  try {
    const result = await optionService.getOptions();
    return ApiResponse.ok(res, result, "Custom options fetched");
  } catch (err) {
    return ApiResponse.error(res, err.message);
  }
};

export const updateOption = async (req, res) => {
  try {
    const result = await optionService.updateOption(req.params.id, req.body, req);
    return ApiResponse.ok(res, result, "Custom option updated");
  } catch (err) {
    return ApiResponse.error(res, err.message);
  }
};

export const deleteOption = async (req, res) => {
  try {
    await optionService.deleteOption(req.params.id, req);
    return ApiResponse.ok(res, null, "Custom option deleted");
  } catch (err) {
    return ApiResponse.error(res, err.message);
  }
};
