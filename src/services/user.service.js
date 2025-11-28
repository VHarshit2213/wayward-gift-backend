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
  // Allowed basic fields
  const allowedBasic = ["name", "email", "mobile"];

  // Allowed address structure
  const allowedAddressFields = [
    "streetAddress",
    "city",
    "state",
    "ZIP",
    "country"
  ];

  const updateData = {};

  // Handle basic fields
  for (let key of allowedBasic) {
    if (updates[key] !== undefined) updateData[key] = updates[key];
  }

  // Handle Shipping Address
  if (updates.shippingAddress && Array.isArray(updates.shippingAddress)) {
    updateData.shippingAddress = updates.shippingAddress.map(addr => {
      let formatted = {};
      for (let key of allowedAddressFields) {
        if (addr[key] !== undefined) formatted[key] = addr[key];
      }
      return formatted;
    });
  }

  // Handle Billing Address
  if (updates.billingAddress && Array.isArray(updates.billingAddress)) {
    updateData.billingAddress = updates.billingAddress.map(addr => {
      let formatted = {};
      for (let key of allowedAddressFields) {
        if (addr[key] !== undefined) formatted[key] = addr[key];
      }
      return formatted;
    });
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

export async function getAllUsers(userId, req) {
  const admin = await User.findById(userId);
  if (!admin) {
    const err = new Error("User not found");
    err.status = 404;
    throw err;
  }
  if (admin.role !== "admin") {
    const err = new Error("Only admin can access all users");
    err.status = 403;
    throw err;
  }

  const page = Math.max(parseInt(req.query?.page || "1", 10), 1);
  const limit = Math.max(parseInt(req.query?.limit || "10", 10), 1);

  // Search params: generic `search` or specific `name`, `email`, `mobile`
  const search = req.query?.search?.trim();
  const nameQ = req.query?.name?.trim();
  const emailQ = req.query?.email?.trim();
  const mobileQ = req.query?.mobile?.trim();

  const filter = { isDeleted: false, role: "user" }; // ensure only non-admin users

  // simple regex-escape helper
  const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const or = [];
  if (search) {
    const r = new RegExp(escapeRegExp(search), "i");
    or.push({ name: r }, { email: r }, { mobile: r });
  }
  if (nameQ) or.push({ name: new RegExp(escapeRegExp(nameQ), "i") });
  if (emailQ) or.push({ email: new RegExp(escapeRegExp(emailQ), "i") });
  if (mobileQ) or.push({ mobile: new RegExp(escapeRegExp(mobileQ), "i") });

  if (or.length) filter.$or = or;

  const total = await User.countDocuments(filter);
  const totalPages = Math.max(Math.ceil(total / limit), 1);

  // count users created today (server local day) matching same filter
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const todayFilter = { ...filter, createdAt: { $gte: startOfDay, $lte: endOfDay } };
  const todayCount = await User.countDocuments(todayFilter);

  const users = await User.find(filter)
    .select("-password")
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();

  const hostPrefix = `${req.protocol}://${req.get("host")}/uploads/`;
  users.forEach((u) => {
    if (u.profilePicture) u.profilePicture = hostPrefix + u.profilePicture;
  });

  return { users, total, page, limit, totalPages, todayCount };
}