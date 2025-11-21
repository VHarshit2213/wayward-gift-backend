import CustomOption from "../models/customOption.js";
import mongoose from "mongoose";
import User from "../models/User.js";


export async function createOption({ type, name, price }, req) {

    if (!name || !type) {
        const err = new Error("Missing required fields: name and type");
        err.status = 400;
        throw err;
    }
    const userId = req.user._id; // from JWT
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");
    if (user.role !== "admin") throw new Error("Only admin can create custom options");
    return CustomOption.create({ type, name, price });
}


export async function getOptions(reqQuery = {}) {
    const sort = reqQuery.sort || "-createdAt";

    const items = await CustomOption.find()
        .sort(sort)
        .lean();
    const grouped = {
        theme: [],
        size: [],
        coffee_roast: [],
        addon: []
    };

    items.forEach(item => {
        if (grouped[item.type]) {
            grouped[item.type].push(item);
        }
    });
    return { grouped };
}

export async function getOptionById(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        const err = new Error("Invalid ID");
        err.status = 400;
        throw err;
    }
    const item = await CustomOption.findById(id).lean();
    if (!item) {
        const err = new Error("Option not found");
        err.status = 404;
        throw err;
    }
    return item;
}

export async function updateOption(id, data, req) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        const err = new Error("Invalid ID");
        err.status = 400;
        throw err;
    }
    const userId = req.user._id; // from JWT
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");
    if (user.role !== "admin") throw new Error("Only admin can update custom options");
    const updated = await CustomOption.findByIdAndUpdate(id, data, { new: true }).lean();
    if (!updated) {
        const err = new Error("Option not found");
        err.status = 404;
        throw err;
    }
    return updated;
}


export async function deleteOption(id, req) {
    const userId = req.user._id; // from JWT
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");
    if (user.role !== "admin") throw new Error("Only admin can delete custom options");
    if (!mongoose.Types.ObjectId.isValid(id)) {
        const err = new Error("Invalid ID");
        err.status = 400;
        throw err;
    }
    const deleted = await CustomOption.findByIdAndDelete(id).lean();
    if (!deleted) {
        const err = new Error("Option not found");
        err.status = 404;
        throw err;
    }
    return deleted;
}
