import User from "../models/User.js";
import mongoose from "mongoose";

export async function getUserById(userId, req) {
  if (!userId) throw new Error("User ID is required");
  if (!mongoose.Types.ObjectId.isValid(userId))
    throw new Error("Invalid User ID");

  const user = await User.findById(userId).select("-password");
  if (!user) throw new Error("User not found");

  // Attach profile picture URL
  if (user.profilePicture) {
    user.profilePicture = `${req.protocol}://${req.get("host")}/uploads/${user.profilePicture}`;
  }

  return user;
}

export async function updateUserDetails(userId, updates) {
  const allowed = ["name", "email", "mobile"];
  const updateData = {};

  for (let key of allowed) {
    if (updates[key] !== undefined) updateData[key] = updates[key];
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { $set: updateData },
    { new: true }
  ).select("-password");

  if (!user) throw new Error("User not found");

  return user;
}

export async function updateProfilePicture(userId, files, req) {
  const image = files?.profilePicture?.[0];
  if (!image) throw new Error("Profile picture is required");

  const user = await User.findByIdAndUpdate(
    userId,
    { profilePicture: image.filename },
    { new: true }
  ).select("-password");

  if (!user) throw new Error("User not found");

  // Attach URL
  user.profilePicture = `${req.protocol}://${req.get("host")}/uploads/${image.filename}`;

  return user;
}
