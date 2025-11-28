import express from "express";
import authenticate from "../middlewares/authenticate.js";
import * as optionController from "../controllers/customOption.controller.js";
import asyncHandler from "../middlewares/asyncHandler.js";

const router = express.Router();

router.post("/", authenticate, asyncHandler(optionController.createOption));
router.get("/", asyncHandler(optionController.getAllOptions));
router.put("/:id", authenticate, asyncHandler(optionController.updateOption));
router.delete("/:id", authenticate, asyncHandler(optionController.deleteOption));

export default router;
