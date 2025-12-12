import express from "express";
import * as userController from "../controllers/user.controller.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import authenticate from "../middlewares/authenticate.js";
import upload from "../config/multer.js";
import { auth } from "google-auth-library";

const router = express.Router();
// GET USER
router.get(
  "/get",
  asyncHandler(userController.getUserById)
);

// UPDATE BASIC DETAILS
router.put(
  "/update", authenticate,
  asyncHandler(userController.updateUserDetails)
);

// UPDATE PROFILE PICTURE
router.put(
  "/update-picture",
  authenticate,
  upload.fields([{ name: "profilePicture", maxCount: 1 }]),
  asyncHandler(userController.updateProfilePicture)
);

router.get("/all", authenticate, asyncHandler(userController.getAllUsers));

router.delete(
  "/delete/:id",
  authenticate,
  asyncHandler(userController.deleteUser)
);
export default router;
